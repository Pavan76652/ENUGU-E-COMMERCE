import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../../constants/orders';

const orderStatusStyles = {
  pending: 'bg-amber-50 text-amber-800',
  confirmed: 'bg-blue-50 text-blue-700',
  packed: 'bg-violet-50 text-violet-700',
  shipped: 'bg-cyan-50 text-cyan-800',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  return_requested: 'bg-orange-50 text-orange-800',
  returned: 'bg-gray-100 text-gray-700',
};

const paymentStatusStyles = {
  pending: 'bg-amber-50 text-amber-800',
  paid: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export const OrderStatusBadge = ({ status }) => (
  <span
    className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wide ${
      orderStatusStyles[status] ?? 'bg-gray-100 text-gray-600'
    }`}
  >
    {ORDER_STATUS_LABELS[status] ?? status}
  </span>
);

export const PaymentStatusBadge = ({ status }) => (
  <span
    className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wide ${
      paymentStatusStyles[status] ?? 'bg-gray-100 text-gray-600'
    }`}
  >
    {PAYMENT_STATUS_LABELS[status] ?? status}
  </span>
);

export default OrderStatusBadge;
