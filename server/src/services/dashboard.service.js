import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import CustomDesignRequest from '../models/CustomDesignRequest.js';
import { ROLES } from '../constants/roles.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants/orderStatus.js';
import { DESIGN_REQUEST_STATUS } from '../constants/designRequestStatus.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

export const getDashboardStats = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalCustomers,
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    revenueResult,
    recentOrders,
    lowStockProducts,
    pendingDesignRequests,
    newCustomersThisMonth,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.CUSTOMER }),
    Product.countDocuments(),
    Product.countDocuments({ status: PRODUCT_STATUS.PUBLISHED }),
    Order.countDocuments(),
    Order.countDocuments({
      status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PACKED] },
    }),
    Order.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'firstName lastName email')
      .lean(),
    Product.find({ status: { $in: [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT] } })
      .select('name slug sku sizeStock')
      .lean()
      .then((products) =>
        products
          .flatMap((p) =>
            (p.sizeStock ?? [])
              .filter((s) => s.stock <= (s.lowStockThreshold ?? 5))
              .map((s) => ({
                productId: p._id,
                name: p.name,
                slug: p.slug,
                size: s.size,
                stock: s.stock,
              }))
          )
          .slice(0, 10)
      ),
    CustomDesignRequest.countDocuments({
      status: { $in: [DESIGN_REQUEST_STATUS.NEW, DESIGN_REQUEST_STATUS.CONTACTED] },
    }),
    User.countDocuments({ role: ROLES.CUSTOMER, createdAt: { $gte: thirtyDaysAgo } }),
  ]);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: PAYMENT_STATUS.PAID,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    { $group: { _id: null, total: { $sum: '$pricing.total' } } },
  ]);

  return {
    overview: {
      totalCustomers,
      newCustomersThisMonth,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      pendingDesignRequests,
      totalRevenue: revenueResult[0]?.total ?? 0,
      monthlyRevenue: monthlyRevenue[0]?.total ?? 0,
      currency: env.store.currency,
      freeShippingThreshold: env.store.freeShippingThreshold,
    },
    recentOrders,
    lowStockProducts,
  };
};

export default { getDashboardStats };
