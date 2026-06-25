import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import { BRAND } from '../../constants/brand';

const CartSummary = ({
  pricing,
  showCheckoutButton = true,
  checkoutLabel = 'Proceed to Checkout',
  onCheckout,
  children,
}) => (
  <div className="border border-gray-200 bg-gray-50 p-6 sm:p-8">
    <h2 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-black">
      Order Summary
    </h2>

    <dl className="mt-6 space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-gray-600">Subtotal ({pricing.itemCount} items)</dt>
        <dd className="font-medium text-enugu-black">{formatCurrency(pricing.subtotal)}</dd>
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
        <dd className="font-medium text-enugu-black">
          {pricing.shipping === 0 ? (
            <span className="text-green-700">Free</span>
          ) : (
            formatCurrency(pricing.shipping)
          )}
        </dd>
      </div>

      {!pricing.qualifiesForFreeShipping && pricing.amountToFreeShipping > 0 && !pricing.shippingDiscount && (
        <p className="text-xs text-enugu-gold">
          Add {formatCurrency(pricing.amountToFreeShipping)} more for free shipping
        </p>
      )}

      {pricing.totalSavings > 0 && (
        <p className="text-xs font-medium text-green-700">
          Total savings: {formatCurrency(pricing.totalSavings)}
        </p>
      )}

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd className="text-enugu-black">{formatCurrency(pricing.total)}</dd>
        </div>
        <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
      </div>
    </dl>

    {children}

    {showCheckoutButton && (
      <Link
        to={ROUTES.CHECKOUT}
        onClick={onCheckout}
        className="mt-6 block w-full bg-enugu-black py-3.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
      >
        {checkoutLabel}
      </Link>
    )}

    <p className="mt-4 text-center text-xs text-gray-500">
      Free shipping on orders above {BRAND.currencySymbol}{BRAND.freeShippingThreshold}
    </p>
  </div>
);

export default CartSummary;
