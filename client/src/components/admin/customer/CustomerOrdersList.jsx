import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/helpers';
import { ROUTES } from '../../../config/routes';
import { OrderStatusBadge } from '../order';

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

const CustomerOrdersList = ({ orders = [] }) => {
  if (!orders.length) {
    return (
      <div className="rounded border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Order', 'Total', 'Status', 'Date', ''].map((head) => (
              <th
                key={head || 'actions'}
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order._id ?? order.orderNumber} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs font-medium">{order.orderNumber}</td>
              <td className="px-4 py-3 font-medium">{formatCurrency(order.pricing?.total)}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrdersList;
