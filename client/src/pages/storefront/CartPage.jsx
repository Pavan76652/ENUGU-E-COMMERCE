import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCart, useCheckout } from '../../hooks';
import { checkoutService } from '../../services/checkoutService';
import { calculateOrderPricing } from '../../utils/orderPricing';
import { CartItem, CartSummary, SavedForLater, EmptyCart } from '../../components/cart';
import { CouponInput } from '../../components/checkout';
import { setCouponCode } from '../../store/slices/cartSlice';
import { ROUTES } from '../../config/routes';

const CartPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    items,
    savedForLater,
    updateQuantity,
    removeItem,
    saveItemForLater,
    moveItemToCart,
    removeSaved,
  } = useCart();
  const { appliedCoupon, setAppliedCoupon } = useCheckout();

  const pricing = useMemo(
    () => calculateOrderPricing({ items, coupon: appliedCoupon }),
    [items, appliedCoupon]
  );

  const handleApplyCoupon = async (code) => {
    const coupon = await checkoutService.validateCoupon(code, pricing.subtotal);
    setAppliedCoupon(coupon);
    dispatch(setCouponCode(coupon.code));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    dispatch(setCouponCode(null));
  };

  useEffect(() => {
    const code = searchParams.get('coupon');
    if (code && items.length > 0 && !appliedCoupon) {
      handleApplyCoupon(code).catch(() => {});
    }
  }, [searchParams, items.length, appliedCoupon]);

  if (!items.length && !savedForLater.length) {
    return (
      <div className="enugu-container py-8 sm:py-12">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Cart</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
            Shopping Bag
          </h1>
          {items.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">{pricing.itemCount} items in your cart</p>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {items.length > 0 ? (
              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    onSaveForLater={saveItemForLater}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items in your cart right now.</p>
            )}

            <SavedForLater
              items={savedForLater}
              onMoveToCart={moveItemToCart}
              onRemove={removeSaved}
            />

            <Link
              to={ROUTES.SHOP}
              className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-enugu-gold"
            >
              ← Continue Shopping
            </Link>
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <CartSummary pricing={pricing}>
                  <CouponInput
                    subtotal={pricing.subtotal}
                    appliedCoupon={appliedCoupon}
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                  />
                </CartSummary>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
