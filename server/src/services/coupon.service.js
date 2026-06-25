import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { logActivity } from './activityLog.service.js';

export const listCoupons = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.search) filter.code = { $regex: query.search, $options: 'i' };

  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [coupons, total] = await Promise.all([
    Coupon.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Coupon.countDocuments(filter),
  ]);

  return { coupons, meta: buildPaginationMeta(total, page, limit) };
};

export const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id).populate('createdBy', 'firstName lastName email');

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  return coupon;
};

export const createCoupon = async (data, actor, req) => {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });

  if (existing) {
    throw new ApiError(409, 'Coupon code already exists');
  }

  if (new Date(data.validUntil) <= new Date(data.validFrom ?? coupon.validFrom)) {
    throw new ApiError(400, 'validUntil must be after validFrom');
  }

  const coupon = await Coupon.create({
    ...data,
    code: data.code.toUpperCase(),
    value: data.type === 'free_shipping' ? 0 : data.value,
    validFrom: data.validFrom ?? new Date(),
    createdBy: actor.id,
  });

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.COUPON_CREATED,
    resource: AUDIT_RESOURCES.COUPON,
    resourceId: coupon._id,
    metadata: { code: coupon.code },
    req,
  });

  return coupon;
};

export const updateCoupon = async (id, data, actor, req) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  const fields = [
    'type', 'value', 'minOrderValue', 'maxDiscount', 'usageLimit',
    'perUserLimit', 'validFrom', 'validUntil', 'applicableCategories', 'isActive',
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) coupon[field] = data[field];
  });

  if (data.type === 'free_shipping' || coupon.type === 'free_shipping') {
    coupon.value = 0;
  }

  if (data.validFrom && data.validUntil && new Date(data.validUntil) <= new Date(data.validFrom)) {
    throw new ApiError(400, 'validUntil must be after validFrom');
  }

  await coupon.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.COUPON_UPDATED,
    resource: AUDIT_RESOURCES.COUPON,
    resourceId: coupon._id,
    metadata: { code: coupon.code },
    req,
  });

  return coupon;
};

export const deleteCoupon = async (id, actor, req) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  coupon.isActive = false;
  await coupon.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.COUPON_DELETED,
    resource: AUDIT_RESOURCES.COUPON,
    resourceId: coupon._id,
    metadata: { code: coupon.code },
    req,
  });

  return coupon;
};

export default { listCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon };
