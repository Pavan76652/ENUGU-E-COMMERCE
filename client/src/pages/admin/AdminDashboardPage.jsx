import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';

const StatCard = ({ label, value, subtext }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5">
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-enugu-black">{value}</p>
    {subtext && <p className="mt-1 text-xs text-gray-400">{subtext}</p>}
  </div>
);

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getDashboard();
      setData(res.data ?? res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const overview = data?.overview ?? {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-enugu-black">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Store overview and quick links</p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Revenue" value={formatCurrency(overview.totalRevenue)} />
            <StatCard label="Monthly Revenue" value={formatCurrency(overview.monthlyRevenue)} />
            <StatCard label="Total Orders" value={overview.totalOrders ?? 0} />
            <StatCard label="Pending Orders" value={overview.pendingOrders ?? 0} />
            <StatCard label="Customers" value={overview.totalCustomers ?? 0} subtext={`+${overview.newCustomersThisMonth ?? 0} this month`} />
            <StatCard label="Products" value={overview.totalProducts ?? 0} subtext={`${overview.activeProducts ?? 0} active`} />
            <StatCard label="Design Requests" value={overview.pendingDesignRequests ?? 0} subtext="Pending" />
            <StatCard label="Free Shipping" value={`₹${overview.freeShippingThreshold ?? 999}+`} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">Quick Links</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  { to: ROUTES.ADMIN_COUPONS, label: 'Coupons' },
                  { to: ROUTES.ADMIN_CAMPAIGNS, label: 'Campaigns' },
                  { to: ROUTES.ADMIN_DESIGN_REQUESTS, label: 'Design Requests' },
                  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics' },
                  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
                  { to: ROUTES.ADMIN_ORDERS, label: 'Orders' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="rounded border border-gray-100 px-4 py-3 text-sm font-medium text-enugu-black transition hover:border-enugu-gold hover:text-enugu-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">Recent Orders</h2>
              {(data?.recentOrders ?? []).length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">No orders yet</p>
              ) : (
                <ul className="mt-4 divide-y divide-gray-100">
                  {data.recentOrders.slice(0, 5).map((order) => (
                    <li key={order._id ?? order.orderNumber} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium text-enugu-black">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.pricing?.total)}</p>
                        <p className="text-xs uppercase text-gray-400">{order.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {(data?.lowStockProducts ?? []).length > 0 && (
            <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-900">Low Stock Alert</h2>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {data.lowStockProducts.map((item) => (
                  <li key={`${item.slug}-${item.size}`}>
                    {item.name} — Size {item.size}: {item.stock} left
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
