import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';
import {
  StatCard,
  RevenueChart,
  OrderStatusChart,
  CouponUsageChart,
  BestSellingProducts,
  LowStockProducts,
} from '../../components/admin/analytics';

const PERIOD_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

const AdminAnalyticsPage = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getAnalyticsDashboard({ days });
      setData(result?.data ?? result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = data?.stats ?? {};
  const couponSummary = data?.couponUsage?.summary ?? {};

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revenue, orders, customers, inventory, and coupon performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDays(option.value)}
              className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                days === option.value
                  ? 'bg-enugu-black text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-enugu-gold'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              subtext={`${formatCurrency(stats.periodRevenue)} in last ${days} days`}
              accent="gold"
            />
            <StatCard
              label="Total Orders"
              value={stats.totalOrders?.toLocaleString('en-IN') ?? '0'}
              subtext={`${stats.periodOrders ?? 0} orders in last ${days} days`}
              accent="black"
            />
            <StatCard
              label="Total Customers"
              value={stats.totalCustomers?.toLocaleString('en-IN') ?? '0'}
              subtext={`${stats.newCustomers ?? 0} new in last ${days} days`}
              accent="blue"
            />
            <StatCard
              label="Avg. Order Value"
              value={formatCurrency(stats.averageOrderValue)}
              subtext={`Based on paid orders — last ${days} days`}
              accent="green"
            />
            <StatCard
              label="Coupon Redemptions"
              value={couponSummary.totalRedemptions?.toLocaleString('en-IN') ?? '0'}
              subtext={`Last ${days} days`}
              accent="black"
            />
            <StatCard
              label="Discount Given"
              value={formatCurrency(couponSummary.totalDiscountGiven)}
              subtext={`Via coupons — last ${days} days`}
              accent="gold"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Revenue Trend
              </h2>
              <p className="mt-1 text-xs text-gray-500">Daily paid revenue</p>
              <div className="mt-4">
                <RevenueChart data={data?.revenueByDay ?? []} />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Orders by Status
              </h2>
              <p className="mt-1 text-xs text-gray-500">Order volume breakdown</p>
              <div className="mt-4">
                <OrderStatusChart data={data?.orderStatusBreakdown ?? []} />
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Best Selling Products
              </h2>
              <p className="mt-1 text-xs text-gray-500">Top performers by units sold</p>
              <div className="mt-4">
                <BestSellingProducts products={data?.bestSellingProducts ?? []} />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Low Stock Alert
              </h2>
              <p className="mt-1 text-xs text-gray-500">Sizes at or below threshold</p>
              <div className="mt-4">
                <LowStockProducts products={data?.lowStockProducts ?? []} />
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                  Coupon Usage
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Redemptions by coupon code — last {days} days
                </p>
              </div>
            </div>
            <div className="mt-4">
              <CouponUsageChart data={data?.couponUsage?.usageByCode ?? []} />
            </div>

            {(data?.couponUsage?.coupons ?? []).length > 0 && (
              <div className="mt-6 overflow-x-auto border-t border-gray-100 pt-6">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-400">
                      <th className="pb-3 pr-4 font-medium">Code</th>
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">Used</th>
                      <th className="pb-3 pr-4 font-medium">Limit</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.couponUsage.coupons.map((coupon) => (
                      <tr key={coupon._id ?? coupon.code} className="border-t border-gray-50">
                        <td className="py-3 pr-4 font-medium text-enugu-black">{coupon.code}</td>
                        <td className="py-3 pr-4 capitalize text-gray-600">
                          {coupon.type?.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 pr-4 font-semibold">{coupon.usedCount ?? 0}</td>
                        <td className="py-3 pr-4 text-gray-500">
                          {coupon.usageLimit ?? '∞'}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              coupon.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
