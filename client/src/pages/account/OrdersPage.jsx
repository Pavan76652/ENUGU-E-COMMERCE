import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../constants/orders';
import { ROUTES } from '../../config/routes';
import AccountPageHeader from '../../components/account/AccountPageHeader';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
  return_requested: 'bg-orange-100 text-orange-800',
  returned: 'bg-gray-200 text-gray-700',
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    orderApi
      .getMyOrders({ limit: 50 })
      .then((res) => {
        if (!active) return;
        const list = res.data ?? res.orders ?? [];
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => active && setError('Unable to load your orders. Please try again.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container max-w-4xl">
        <AccountPageHeader title="My Orders" subtitle="Track and review your past purchases." />

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-sm text-gray-500">You haven&apos;t placed any orders yet.</p>
            <Link
              to={ROUTES.SHOP}
              className="mt-6 inline-block bg-enugu-black px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-enugu-gold hover:text-enugu-black"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id ?? order.orderNumber}
                to={`/account/orders/${order.orderNumber}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-enugu-black hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-enugu-black">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                  <div className="flex -space-x-3">
                    {(order.items ?? []).slice(0, 4).map((item, index) =>
                      item.image ? (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-10 rounded border border-white bg-gray-100 object-cover"
                        />
                      ) : null
                    )}
                    {(order.items?.length ?? 0) > 4 && (
                      <span className="flex h-12 w-10 items-center justify-center rounded border border-white bg-gray-100 text-xs font-medium text-gray-600">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? '' : 's'}
                    </p>
                    <p className="text-base font-semibold text-enugu-black">
                      {formatCurrency(order.pricing?.total ?? order.total)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
