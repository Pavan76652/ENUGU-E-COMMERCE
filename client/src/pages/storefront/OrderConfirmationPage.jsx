import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../constants/checkout';
import { ROUTES } from '../../config/routes';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getByOrderNumber(orderNumber)
      .then((result) => {
        setOrder(result.order ?? result);
      })
      .catch(() => {
        setError('Unable to load order details');
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="enugu-container py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="enugu-container py-24 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-enugu-black">
          Order Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">{error || 'This order could not be found.'}</p>
        <Link
          to={ROUTES.SHOP}
          className="mt-8 inline-block bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const pricing = order.pricing ?? order;
  const address = order.shippingAddress;

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container max-w-3xl">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Order Confirmed</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black">
            Thank You!
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Your order <span className="font-medium text-enugu-black">{order.orderNumber}</span> has
            been placed successfully.
          </p>
        </div>

        <div className="mt-10 space-y-6 border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Order Status</p>
              <p className="mt-1 font-medium capitalize text-enugu-black">
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500">Payment</p>
              <p className="mt-1 font-medium capitalize text-enugu-black">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
              </p>
            </div>
          </div>

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
                    <img src={item.image} alt={item.name} className="h-14 w-12 object-cover bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.size} × {item.quantity}
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
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to={ROUTES.ACCOUNT_ORDERS}
            className="bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            View Orders
          </Link>
          <Link
            to={ROUTES.SHOP}
            className="border border-gray-300 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-600 transition hover:border-enugu-black hover:text-enugu-black"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
