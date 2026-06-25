import FestivalCampaign from '../models/FestivalCampaign.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import CustomDesignRequest from '../models/CustomDesignRequest.js';
import { ROLES } from '../constants/roles.js';
import { PAYMENT_STATUS } from '../constants/orderStatus.js';
import { DESIGN_REQUEST_STATUS } from '../constants/designRequestStatus.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';

const getDateRange = (days = 30) => {
  const from = new Date();
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);
  return from;
};

export const getSalesAnalytics = async (query = {}) => {
  const days = parseInt(query.days, 10) || 30;
  const from = getDateRange(days);

  const [revenueByDay, statusBreakdown, paymentBreakdown] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: { $gte: from },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueByDay.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenueByDay.reduce((sum, d) => sum + d.orders, 0);

  return {
    period: { days, from },
    summary: { totalRevenue, totalOrders, averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0 },
    revenueByDay,
    statusBreakdown,
    paymentBreakdown,
  };
};

export const getProductAnalytics = async (query = {}) => {
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);

  const [topSelling, lowStock, byStatus] = await Promise.all([
    Product.find({ totalSold: { $gt: 0 } })
      .sort({ totalSold: -1 })
      .limit(limit)
      .select('name slug sku totalSold averageRating images sizeStock mrp sellingPrice')
      .lean(),
    Product.find({ status: { $in: [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT] } })
      .select('name slug sizeStock')
      .lean()
      .then((products) =>
        products
          .flatMap((p) =>
            (p.sizeStock ?? [])
              .filter((s) => s.stock > 0 && s.stock <= (s.lowStockThreshold ?? 5))
              .map((s) => ({ product: p.name, slug: p.slug, size: s.size, stock: s.stock }))
          )
          .slice(0, limit)
      ),
    Product.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  return { topSelling, lowStock, byStatus };
};

export const getCustomerAnalytics = async (query = {}) => {
  const days = parseInt(query.days, 10) || 30;
  const from = getDateRange(days);

  const [totalCustomers, newCustomers, topCustomers] = await Promise.all([
    User.countDocuments({ role: ROLES.CUSTOMER }),
    User.countDocuments({ role: ROLES.CUSTOMER, createdAt: { $gte: from } }),
    Order.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.PAID } },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$pricing.total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerId: '$_id',
          totalSpent: 1,
          orderCount: 1,
          firstName: '$customer.firstName',
          lastName: '$customer.lastName',
          email: '$customer.email',
        },
      },
    ]),
  ]);

  return { totalCustomers, newCustomers, period: { days, from }, topCustomers };
};

export const getCouponAnalytics = async (query = {}) => {
  const days = parseInt(query.days, 10) || 30;
  const from = getDateRange(days);

  const couponMatch = {
    'pricing.couponCode': { $exists: true, $nin: [null, ''] },
    createdAt: { $gte: from },
  };

  const [usageByCode, coupons, redemptionSummary] = await Promise.all([
    Order.aggregate([
      { $match: couponMatch },
      {
        $group: {
          _id: '$pricing.couponCode',
          uses: { $sum: 1 },
          discountTotal: { $sum: '$pricing.discount' },
          revenue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { uses: -1 } },
      { $limit: 10 },
    ]),
    Coupon.find()
      .select('code type value usedCount usageLimit isActive validUntil')
      .sort({ usedCount: -1 })
      .limit(10)
      .lean(),
    Order.aggregate([
      {
        $match: {
          ...couponMatch,
          paymentStatus: PAYMENT_STATUS.PAID,
        },
      },
      {
        $group: {
          _id: null,
          totalRedemptions: { $sum: 1 },
          totalDiscountGiven: { $sum: '$pricing.discount' },
        },
      },
    ]),
  ]);

  return {
    period: { days, from },
    usageByCode: usageByCode.map((row) => ({
      code: row._id,
      uses: row.uses,
      discountTotal: row.discountTotal,
      revenue: row.revenue,
    })),
    coupons,
    summary: {
      totalRedemptions: redemptionSummary[0]?.totalRedemptions ?? 0,
      totalDiscountGiven: redemptionSummary[0]?.totalDiscountGiven ?? 0,
    },
  };
};

export const getDashboardAnalytics = async (query = {}) => {
  const days = parseInt(query.days, 10) || 30;

  const [
    sales,
    products,
    customers,
    coupons,
    lifetimeRevenue,
    lifetimeOrders,
  ] = await Promise.all([
    getSalesAnalytics({ days }),
    getProductAnalytics({ limit: 5 }),
    getCustomerAnalytics({ days }),
    getCouponAnalytics({ days }),
    Order.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Order.countDocuments(),
  ]);

  return {
    period: sales.period,
    stats: {
      totalRevenue: lifetimeRevenue[0]?.total ?? 0,
      totalOrders: lifetimeOrders,
      totalCustomers: customers.totalCustomers,
      periodRevenue: sales.summary.totalRevenue,
      periodOrders: sales.summary.totalOrders,
      newCustomers: customers.newCustomers,
      averageOrderValue: sales.summary.averageOrderValue,
    },
    revenueByDay: sales.revenueByDay.map((row) => ({
      date: row._id,
      revenue: row.revenue,
      orders: row.orders,
    })),
    orderStatusBreakdown: sales.statusBreakdown.map((row) => ({
      status: row._id,
      count: row.count,
    })),
    paymentBreakdown: sales.paymentBreakdown.map((row) => ({
      status: row._id,
      count: row.count,
    })),
    bestSellingProducts: products.topSelling.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      totalSold: p.totalSold,
      sellingPrice: p.sellingPrice,
      mrp: p.mrp,
      image: p.images?.find((img) => img.isCover)?.url ?? p.images?.[0]?.url ?? null,
    })),
    lowStockProducts: products.lowStock,
    couponUsage: coupons,
    topCustomers: customers.topCustomers,
  };
};

export const getOverviewAnalytics = async () => {
  const thirtyDaysAgo = getDateRange(30);

  const [
    revenueThisMonth,
    ordersThisMonth,
    designRequestStats,
    campaignCount,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    CustomDesignRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    FestivalCampaign.countDocuments({ isActive: true }),
  ]);

  return {
    revenueThisMonth: revenueThisMonth[0]?.total ?? 0,
    ordersThisMonth,
    designRequestStats,
    activeCampaigns: campaignCount,
  };
};

export default {
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getCouponAnalytics,
  getDashboardAnalytics,
  getOverviewAnalytics,
};
