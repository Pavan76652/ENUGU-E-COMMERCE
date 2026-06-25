import { formatCurrency } from '../../utils/helpers';

const OrderSummary = ({ items, pricing, children }) => (
  <div>
    <div className="max-h-48 space-y-3 overflow-y-auto pr-1">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="h-14 w-12 shrink-0 bg-gray-100 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-enugu-black">{item.name}</p>
            <p className="text-xs text-gray-500">
              {item.size} × {item.quantity}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </div>

    <dl className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
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
      {pricing.shippingDiscount > 0 && (
        <div className="flex justify-between text-green-700">
          <dt>Shipping Discount</dt>
          <dd>-{formatCurrency(pricing.shippingDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-gray-600">Shipping</dt>
        <dd>{pricing.shipping === 0 ? 'Free' : formatCurrency(pricing.shipping)}</dd>
      </div>
      {pricing.totalSavings > 0 && (
        <div className="flex justify-between text-green-700">
          <dt>Total Savings</dt>
          <dd>{formatCurrency(pricing.totalSavings)}</dd>
        </div>
      )}
      <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatCurrency(pricing.total)}</dd>
      </div>
    </dl>

    {children}
  </div>
);

export default OrderSummary;
