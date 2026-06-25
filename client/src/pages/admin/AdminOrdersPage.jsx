import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { OrderTable } from '../../components/admin/order';
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../../constants/orders';
import { ROUTES } from '../../config/routes';

const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFilter = searchParams.get('userId') ?? '';
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await orderApi.admin.list({
        page,
        limit: 20,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
        userId: userIdFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const list = Array.isArray(result) ? result : result?.data ?? [];
      setOrders(list);
      setMeta(result?.meta ?? { page: 1, totalPages: 1, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, paymentFilter, userIdFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-enugu-black">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customer orders, fulfillment, and tracking.
        </p>
        {userIdFilter && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Filtered by customer</span>
            <button
              type="button"
              onClick={() => {
                searchParams.delete('userId');
                setSearchParams(searchParams);
                setPage(1);
              }}
              className="text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
            >
              Clear filter
            </button>
            <Link
              to={ROUTES.ADMIN_CUSTOMER.replace(':id', userIdFilter)}
              className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
            >
              View customer
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number..."
            className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          />
          <button
            type="submit"
            className="rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 hover:border-enugu-gold"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            <option value="">All order statuses</option>
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <OrderTable orders={orders} loading={loading} />

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <p>
            Page {meta.page} of {meta.totalPages} ({meta.total} orders)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
