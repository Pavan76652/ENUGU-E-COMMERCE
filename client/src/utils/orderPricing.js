import { BRAND } from '../constants/brand';
import { SHIPPING_FLAT_RATE } from '../constants/checkout';
import { COUPON_TYPES } from '../constants/couponTypes';

export const calculateSubtotal = (items = []) =>
  items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

export const calculateShipping = (subtotal) => {
  if (subtotal >= BRAND.freeShippingThreshold) return 0;
  return SHIPPING_FLAT_RATE;
};

export const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon || coupon.type === COUPON_TYPES.FREE_SHIPPING) return 0;

  let discount = 0;

  if (coupon.type === COUPON_TYPES.PERCENTAGE) {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else if (coupon.type === COUPON_TYPES.FIXED) {
    discount = coupon.value;
  }

  return Math.min(discount, subtotal);
};

export const applyCouponToOrder = (coupon, subtotal) => {
  const baseShipping = calculateShipping(subtotal);

  if (!coupon) {
    return { discount: 0, shippingDiscount: 0, shipping: baseShipping };
  }

  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) {
    return { discount: 0, shippingDiscount: baseShipping, shipping: 0 };
  }

  return {
    discount: calculateCouponDiscount(coupon, subtotal),
    shippingDiscount: 0,
    shipping: baseShipping,
  };
};

export const calculateOrderPricing = ({ items, coupon = null }) => {
  const subtotal = calculateSubtotal(items);
  const { discount, shippingDiscount, shipping } = applyCouponToOrder(coupon, subtotal);
  const tax = 0;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  return {
    subtotal,
    discount,
    shippingDiscount,
    shipping,
    tax,
    total,
    totalSavings: discount + shippingDiscount,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    freeShippingThreshold: BRAND.freeShippingThreshold,
    qualifiesForFreeShipping: subtotal >= BRAND.freeShippingThreshold || shippingDiscount > 0,
    amountToFreeShipping: Math.max(0, BRAND.freeShippingThreshold - subtotal),
  };
};

export const getCouponSavingsLabel = (coupon) => {
  if (!coupon) return '';

  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) {
    return 'Free shipping applied';
  }

  const savings = coupon.totalSavings ?? coupon.discount ?? 0;
  return `You save ₹${savings}`;
};

export default {
  calculateSubtotal,
  calculateShipping,
  calculateCouponDiscount,
  applyCouponToOrder,
  calculateOrderPricing,
  getCouponSavingsLabel,
};
