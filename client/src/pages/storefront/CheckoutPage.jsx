import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart, useCheckout } from '../../hooks';
import { checkoutService } from '../../services/checkoutService';
import { calculateOrderPricing } from '../../utils/orderPricing';
import { PAYMENT_METHODS } from '../../constants/checkout';
import { ROUTES } from '../../config/routes';
import {
  AddressForm,
  AddressSelector,
  CouponInput,
  OrderSummary,
  PaymentMethodSelector,
} from '../../components/checkout';
import { clearCart, setCouponCode } from '../../store/slices/cartSlice';
import { useDispatch } from 'react-redux';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { items } = useCart();
  const {
    shippingAddress,
    selectedAddressId,
    paymentMethod,
    appliedCoupon,
    isPlacingOrder,
    setShippingAddress,
    setSelectedAddressId,
    setPaymentMethod,
    setAppliedCoupon,
    setPlacingOrder,
    reset,
  } = useCheckout();

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState('');

  const pricing = useMemo(
    () => calculateOrderPricing({ items, coupon: appliedCoupon }),
    [items, appliedCoupon]
  );

  useEffect(() => {
    if (!items.length) {
      navigate(ROUTES.CART);
    }
  }, [items.length, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      checkoutService.getAddresses().then((list) => {
        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
        if (defaultAddr && !shippingAddress) {
          setSelectedAddressId(defaultAddr._id ?? defaultAddr.id);
          setShippingAddress(defaultAddr);
        }
      });
    }
  }, [isAuthenticated, setSelectedAddressId, setShippingAddress, shippingAddress]);

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      // pre-fill from profile not needed for guests
    }
  }, [isAuthenticated, user]);

  const handleSelectAddress = (address) => {
    const id = address._id ?? address.id;
    setSelectedAddressId(id);
    setShippingAddress(address);
    setShowAddressForm(false);
  };

  const handleSaveAddress = async (formData) => {
    if (isAuthenticated) {
      const saved = await checkoutService.saveAddress(formData);
      setAddresses((prev) => [...prev, saved]);
      handleSelectAddress(saved);
    } else {
      handleSelectAddress(formData);
    }
    setShowAddressForm(false);
  };

  const handleApplyCoupon = async (code) => {
    const coupon = await checkoutService.validateCoupon(code, pricing.subtotal);
    setAppliedCoupon(coupon);
    dispatch(setCouponCode(coupon.code));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    dispatch(setCouponCode(null));
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.CHECKOUT } } });
      return;
    }

    if (!shippingAddress) {
      setError('Please select or add a shipping address');
      return;
    }

    if (paymentMethod !== PAYMENT_METHODS.COD) {
      setError('Only Cash on Delivery is available right now');
      return;
    }

    setError('');
    setPlacingOrder(true);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 ?? '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country ?? 'India',
        },
        couponCode: appliedCoupon?.code,
        paymentMethod,
      };

      const result = await checkoutService.placeOrder(payload);
      const order = result.order ?? result;

      dispatch(clearCart());
      reset();
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        'Failed to place order. Please try again.';
      setError(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!items.length) return null;

  if (!isAuthenticated) {
    return (
      <div className="enugu-container py-16 text-center sm:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Checkout</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Please log in to complete your purchase and manage addresses.
        </p>
        <Link
          to={ROUTES.LOGIN}
          state={{ from: { pathname: ROUTES.CHECKOUT } }}
          className="mt-8 inline-block bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
        >
          Sign In
        </Link>
        <Link
          to={ROUTES.CART}
          className="mt-4 block text-xs uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
        >
          ← Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Checkout</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
            Complete Your Order
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 sm:space-y-10 lg:col-span-7">
            <section>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-black">
                Shipping Address
              </h2>

              <div className="mt-5">
                {showAddressForm ? (
                  <AddressForm
                    onSubmit={handleSaveAddress}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : (
                  <>
                    {addresses.length > 0 && (
                      <AddressSelector
                        addresses={addresses}
                        selectedId={selectedAddressId}
                        onSelect={handleSelectAddress}
                        onAddNew={() => setShowAddressForm(true)}
                        showAddNew={false}
                      />
                    )}
                    {addresses.length === 0 && !shippingAddress && (
                      <AddressForm onSubmit={handleSaveAddress} submitLabel="Continue" />
                    )}
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="mt-3 text-xs uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
                      >
                        + Add New Address
                      </button>
                    )}
                  </>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-black">
                Payment Method
              </h2>
              <div className="mt-5">
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-gray-200 bg-gray-50 p-4 sm:p-6 lg:sticky lg:top-28 lg:p-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-black">
                Order Summary
              </h2>

              <div className="mt-6">
                <OrderSummary items={items} pricing={pricing}>
                  <CouponInput
                    subtotal={pricing.subtotal}
                    appliedCoupon={appliedCoupon}
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                  />
                </OrderSummary>
              </div>

              {error && (
                <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !shippingAddress}
                className="mt-6 w-full bg-enugu-black py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link
                to={ROUTES.CART}
                className="mt-4 block text-center text-xs uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
