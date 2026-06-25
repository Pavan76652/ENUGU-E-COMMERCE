import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/helpers';
import { ROUTES } from '../../../config/routes';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../../constants/orders';

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

const customerName = (order) => {
  const user = order.userId;
  if (user?.firstName) return `${user.firstName} ${user.lastName ?? ''}`.trim();
  return order.shippingAddress?.fullName ?? '—';
};

const OrderTable = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map((head) => (
              <th
                key={head || 'actions'}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const itemCount = order.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0) ?? 0;

            return (
              <tr key={order._id ?? order.orderNumber} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-mono text-xs font-medium text-enugu-black">{order.orderNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-enugu-black">{customerName(order)}</p>
                  <p className="text-xs text-gray-400">{order.userId?.email ?? ''}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{itemCount}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(order.pricing?.total)}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-gray-600">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                  </p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(order.placedAt ?? order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={ROUTES.ADMIN_ORDER.replace(':orderNumber', order.orderNumber)}
                    className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
