import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from '../../constants/orders';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  OrderStatusUpdater,
  OrderTrackingForm,
  OrderNotesForm,
  OrderTimeline,
} from '../../components/admin/order';

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

const AdminOrderDetailPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await orderApi.admin.getByOrderNumber(orderNumber);
      const o = result?.data?.order ?? result?.order;
      if (!o) throw new Error('Order not found');
      setOrder(o);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const flashSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleStatusUpdate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const result = await orderApi.admin.updateStatus(orderNumber, payload);
      const updated = result?.data?.order ?? result?.order;
      setOrder(updated);
      flashSuccess(`Order marked as ${ORDER_STATUS_LABELS[payload.status]}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleTrackingUpdate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const result = await orderApi.admin.updateTracking(orderNumber, payload);
      const updated = result?.data?.order ?? result?.order;
      setOrder(updated);
      flashSuccess('Tracking information saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tracking');
    } finally {
      setSaving(false);
    }
  };

  const handleNotesUpdate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const result = await orderApi.admin.updateNotes(orderNumber, payload);
      const updated = result?.data?.order ?? result?.order;
      setOrder(updated);
      flashSuccess('Admin notes saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notes');
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

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">{error || 'Order not found'}</p>
        <Link
          to={ROUTES.ADMIN_ORDERS}
          className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const user = order.userId;
  const address = order.shippingAddress;
  const pricing = order.pricing ?? {};

  return (
    <div>
      <div className="mb-6">
        <Link
          to={ROUTES.ADMIN_ORDERS}
          className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
        >
          ← Back to orders
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-enugu-black">{order.orderNumber}</h1>
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Placed {formatDate(order.placedAt ?? order.createdAt)}
        </p>
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">Items</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-16 w-14 rounded object-cover bg-gray-100" />
                  ) : (
                    <div className="flex h-16 w-14 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                      —
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-enugu-black">{item.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Size: {item.size}
                      {item.variantSku ? ` · SKU: ${item.variantSku}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>{formatCurrency(pricing.subtotal)}</dd>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <dt>
                    Discount
                    {pricing.couponCode ? ` (${pricing.couponCode})` : ''}
                  </dt>
                  <dd>-{formatCurrency(pricing.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>{pricing.shipping === 0 ? 'Free' : formatCurrency(pricing.shipping)}</dd>
              </div>
              {pricing.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Tax</dt>
                  <dd>{formatCurrency(pricing.tax)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrency(pricing.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
              Status history
            </h2>
            <div className="mt-4">
              <OrderTimeline history={order.statusHistory} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">Customer</h2>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium text-enugu-black">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName ?? ''}`.trim()
                  : address?.fullName ?? '—'}
              </p>
              {user?.email && <p className="text-gray-600">{user.email}</p>}
              {(user?.phone || address?.phone) && (
                <p className="text-gray-600">{user?.phone ?? address?.phone}</p>
              )}
            </div>
          </section>

          {address && (
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Shipping address
              </h2>
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium text-enugu-black">{address.fullName}</p>
                <p className="mt-1">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                </p>
                <p>
                  {address.city}, {address.state} — {address.pincode}
                </p>
                <p>{address.country ?? 'India'}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">Payment</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Method</dt>
                <dd>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Status</dt>
                <dd>{PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}</dd>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Paid at</dt>
                  <dd>{formatDate(order.paidAt)}</dd>
                </div>
              )}
            </dl>
          </section>

          {(order.trackingNumber || order.carrier) && (
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
                Current tracking
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Carrier</dt>
                  <dd className="text-right">{order.carrier ?? '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Tracking #</dt>
                  <dd className="font-mono text-right text-xs">{order.trackingNumber ?? '—'}</dd>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Shipped</dt>
                    <dd>{formatDate(order.shippedAt)}</dd>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Delivered</dt>
                    <dd>{formatDate(order.deliveredAt)}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <OrderStatusUpdater
            currentStatus={order.status}
            loading={saving}
            onUpdate={handleStatusUpdate}
          />

          <OrderTrackingForm
            trackingNumber={order.trackingNumber}
            carrier={order.carrier}
            loading={saving}
            onSubmit={handleTrackingUpdate}
          />

          <OrderNotesForm
            adminNotes={order.adminNotes}
            loading={saving}
            onSubmit={handleNotesUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
