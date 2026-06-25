import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import {
  CustomerStatusBadge,
  CustomerOrdersList,
} from '../../components/admin/customer';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fullName = (customer) =>
  `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim() || '—';

const AdminCustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getCustomer(id);
      const data = result?.data ?? result;
      if (!data?.customer) throw new Error('Customer not found');
      setCustomer(data.customer);
      setStats(data.stats ?? { totalOrders: 0, totalSpent: 0 });
      setRecentOrders(data.recentOrders ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const handleToggleStatus = async () => {
    if (!customer) return;
    const nextActive = !customer.isActive;
    const action = nextActive ? 'enable' : 'disable';

    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this customer account?`)) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const result = await adminApi.setCustomerStatus(id, { isActive: nextActive });
      const updated = result?.data?.customer ?? result?.customer;
      setCustomer(updated);
      setSuccess(nextActive ? 'Customer account enabled' : 'Customer account disabled');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">{error || 'Customer not found'}</p>
        <Link
          to={ROUTES.ADMIN_CUSTOMERS}
          className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to={ROUTES.ADMIN_CUSTOMERS}
          className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
        >
          ← Back to customers
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-enugu-black">{fullName(customer)}</h1>
          <CustomerStatusBadge isActive={customer.isActive !== false} />
        </div>
        <p className="mt-1 text-sm text-gray-500">{customer.email}</p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                  Recent orders
                </h2>
                <p className="mt-1 text-xs text-gray-400">Last 20 orders for this customer</p>
              </div>
              {stats.totalOrders > 0 && (
                <Link
                  to={`${ROUTES.ADMIN_ORDERS}?userId=${id}`}
                  className="text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
                >
                  View all orders
                </Link>
              )}
            </div>
            <div className="mt-4">
              <CustomerOrdersList orders={recentOrders} />
            </div>
          </section>

          {customer.addresses?.length > 0 && (
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Saved addresses
              </h2>
              <div className="mt-4 space-y-4">
                {customer.addresses.map((addr, index) => (
                  <div
                    key={addr._id ?? index}
                    className="rounded border border-gray-100 p-4 text-sm text-gray-600"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-enugu-black">{addr.label ?? 'Address'}</p>
                      {addr.isDefault && (
                        <span className="rounded bg-enugu-gold/20 px-2 py-0.5 text-[10px] font-medium uppercase text-enugu-black">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-enugu-black">{addr.fullName}</p>
                    <p>
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                    </p>
                    <p>
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="mt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
              Order stats
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Total orders</dt>
                <dd className="font-semibold text-enugu-black">{stats.totalOrders}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Lifetime spend</dt>
                <dd className="font-semibold text-enugu-black">
                  {formatCurrency(stats.totalSpent)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
              Account details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Phone</dt>
                <dd className="text-right">{customer.phone || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Email verified</dt>
                <dd>{customer.isEmailVerified ? 'Yes' : 'No'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Member since</dt>
                <dd className="text-right text-xs">{formatDate(customer.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Last login</dt>
                <dd className="text-right text-xs">{formatDate(customer.lastLoginAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
              Account actions
            </h2>
            <p className="mt-2 text-xs text-gray-500">
              Disabling a customer prevents them from logging in. Existing orders are preserved.
            </p>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={saving}
              className={`mt-4 w-full rounded px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition disabled:opacity-50 ${
                customer.isActive !== false
                  ? 'border border-red-300 text-red-700 hover:bg-red-50'
                  : 'bg-enugu-black text-white hover:bg-enugu-gold hover:text-enugu-black'
              }`}
            >
              {saving
                ? 'Updating...'
                : customer.isActive !== false
                  ? 'Disable account'
                  : 'Enable account'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetailPage;
