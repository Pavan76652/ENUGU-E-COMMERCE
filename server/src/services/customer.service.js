import User from '../models/User.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';

export const listCustomers = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { role: ROLES.CUSTOMER };

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.isEmailVerified !== undefined) {
    filter.isEmailVerified = query.isEmailVerified === 'true';
  }

  if (query.search) {
    filter.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [customers, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const customerIds = customers.map((c) => c._id);
  const statsRows =
    customerIds.length > 0
      ? await Order.aggregate([
          { $match: { userId: { $in: customerIds } } },
          {
            $group: {
              _id: '$userId',
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$pricing.total' },
            },
          },
        ])
      : [];

  const statsByUser = Object.fromEntries(
    statsRows.map((row) => [row._id.toString(), row])
  );

  const enrichedCustomers = customers.map((customer) => {
    const stats = statsByUser[customer._id.toString()];
    return {
      ...customer,
      totalOrders: stats?.totalOrders ?? 0,
      totalSpent: stats?.totalSpent ?? 0,
    };
  });

  return { customers: enrichedCustomers, meta: buildPaginationMeta(total, page, limit) };
};

export const getCustomerById = async (customerId) => {
  const customer = await User.findOne({
    _id: customerId,
    role: ROLES.CUSTOMER,
  }).select('-password -refreshToken');

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const [orders, orderStats] = await Promise.all([
    Order.find({ userId: customerId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Order.aggregate([
      { $match: { userId: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
        },
      },
    ]),
  ]);

  return {
    customer,
    stats: {
      totalOrders: orderStats[0]?.totalOrders ?? 0,
      totalSpent: orderStats[0]?.totalSpent ?? 0,
    },
    recentOrders: orders,
  };
};

export const setCustomerStatus = async (customerId, isActive) => {
  const customer = await User.findOne({ _id: customerId, role: ROLES.CUSTOMER });

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  customer.isActive = isActive;
  if (!isActive) customer.refreshToken = undefined;

  await customer.save({ validateBeforeSave: false });

  const safe = customer.toObject();
  delete safe.password;
  delete safe.refreshToken;
  return safe;
};

export default { listCustomers, getCustomerById, setCustomerStatus };
