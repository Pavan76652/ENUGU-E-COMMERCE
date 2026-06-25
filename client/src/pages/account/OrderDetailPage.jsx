import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/helpers';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '../../constants/orders';
import { ROUTES } from '../../config/routes';
import AccountPageHeader from '../../components/account/AccountPageHeader';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    orderApi
      .getByOrderNumber(orderNumber)
      .then((res) => {
        if (!active) return;
        setOrder(res.data?.order ?? res.order ?? res.data ?? res);
      })
      .catch(() => active && setError('Unable to load this order.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="enugu-container py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order?.orderNumber) {
    return (
      <div className="enugu-container py-24 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-enugu-black">Order Not Found</h1>
        <p className="mt-2 text-sm text-gray-500">{error || 'This order could not be found.'}</p>
        <Link
          to={ROUTES.ACCOUNT_ORDERS}
          className="mt-8 inline-block bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const pricing = order.pricing ?? order;
  const address = order.shippingAddress;
  const timeline = order.statusHistory ?? [];

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container max-w-3xl">
        <AccountPageHeader
          title={order.orderNumber}
          subtitle={`Placed on ${formatDate(order.createdAt)}`}
        />

        <div className="space-y-6 rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Order Status</p>
              <p className="mt-1 font-medium text-enugu-black">
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500">Payment</p>
              <p className="mt-1 font-medium text-enugu-black">
                {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod} ·{' '}
                {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
              </p>
            </div>
          </div>

          {order.tracking?.trackingNumber && (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Tracking: </span>
              <span className="font-medium text-enugu-black">{order.tracking.trackingNumber}</span>
              {order.tracking.carrier && (
                <span className="text-gray-500"> ({order.tracking.carrier})</span>
              )}
            </div>
          )}

          {address && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Delivery Address</p>
              <p className="mt-2 font-medium text-enugu-black">{address.fullName}</p>
              <p className="text-sm text-gray-600">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Items</p>
            <div className="mt-3 space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-16 w-14 bg-gray-100 object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-enugu-black">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Size {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          <dl className="space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd>{formatCurrency(pricing.subtotal)}</dd>
            </div>
            {pricing.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Discount</dt>
                <dd>-{formatCurrency(pricing.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd>{pricing.shipping === 0 ? 'Free' : formatCurrency(pricing.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(pricing.total)}</dd>
            </div>
          </dl>

          {timeline.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">Order Timeline</p>
              <ol className="mt-3 space-y-3">
                {timeline.map((entry, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-enugu-gold" />
                    <div>
                      <p className="text-sm font-medium capitalize text-enugu-black">
                        {ORDER_STATUS_LABELS[entry.status] ?? entry.status}
                      </p>
                      {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                      <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
