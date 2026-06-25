import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { canTransitionOrderStatus, ORDER_STATUS } from '../constants/orderStatus.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { logActivity } from './activityLog.service.js';
import { restoreStock } from './inventory.service.js';
import { withTransaction } from '../utils/withTransaction.js';

const STOCK_RESTORING_STATUSES = new Set([ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED]);

const buildOrderFilter = (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.userId) filter.userId = query.userId;

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  if (query.search) {
    filter.$or = [
      { orderNumber: { $regex: query.search, $options: 'i' } },
    ];
  }

  return filter;
};

export const listOrders = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildOrderFilter(query);
  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, meta: buildPaginationMeta(total, page, limit) };
};

export const getOrderByNumber = async (orderNumber) => {
  const order = await Order.findOne({ orderNumber })
    .populate('userId', 'firstName lastName email phone')
    .populate('statusHistory.changedBy', 'firstName lastName email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return order;
};

export const updateOrderStatus = async (orderNumber, { status, note }, actor, req) => {
  const order = await Order.findOne({ orderNumber });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (!canTransitionOrderStatus(order.status, status)) {
    throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
  }

  order.status = status;
  order.statusHistory.push({
    status,
    changedBy: actor.id,
    note: note ?? '',
    timestamp: new Date(),
  });

  if (status === 'packed') order.packedAt = new Date();
  if (status === 'shipped') order.shippedAt = new Date();
  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'cancelled') order.cancelledAt = new Date();

  // Restoring stock and persisting the status change must be atomic so we never
  // restore inventory without recording the matching status (or vice versa).
  if (STOCK_RESTORING_STATUSES.has(status)) {
    await withTransaction(async (session) => {
      await restoreStock(order.items, session);
      await order.save({ session });
    });
  } else {
    await order.save();
  }

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.ORDER_STATUS_UPDATED,
    resource: AUDIT_RESOURCES.ORDER,
    resourceId: order._id,
    metadata: { orderNumber, status, note },
    req,
  });

  return order;
};

export const updateOrderTracking = async (
  orderNumber,
  { trackingNumber, carrier },
  actor,
  req
) => {
  const order = await Order.findOne({ orderNumber });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.trackingNumber = trackingNumber;
  order.carrier = carrier;
  await order.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.ORDER_TRACKING_UPDATED,
    resource: AUDIT_RESOURCES.ORDER,
    resourceId: order._id,
    metadata: { orderNumber, trackingNumber, carrier },
    req,
  });

  return order;
};

export const updateOrderNotes = async (orderNumber, { adminNotes }, actor, req) => {
  const order = await Order.findOne({ orderNumber });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.adminNotes = adminNotes;
  await order.save();

  return order;
};

export default {
  listOrders, getOrderByNumber, updateOrderStatus,
  updateOrderTracking, updateOrderNotes,
};
