import env from '../config/env.js';
import { COUPON_TYPES } from '../constants/couponTypes.js';

const SHIPPING_FLAT_RATE = 99;

export const calculateShipping = (subtotal) => {
  if (subtotal >= env.store.freeShippingThreshold) {
    return 0;
  }
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
    return {
      discount: 0,
      shippingDiscount: 0,
      shipping: baseShipping,
    };
  }

  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) {
    return {
      discount: 0,
      shippingDiscount: baseShipping,
      shipping: 0,
    };
  }

  return {
    discount: calculateCouponDiscount(coupon, subtotal),
    shippingDiscount: 0,
    shipping: baseShipping,
  };
};

export const calculateOrderPricing = ({ subtotal, discount, shipping, coupon }) => {
  let resolvedDiscount = discount ?? 0;
  let resolvedShipping = shipping;
  let shippingDiscount = 0;

  if (coupon) {
    const applied = applyCouponToOrder(coupon, subtotal);
    resolvedDiscount = applied.discount;
    resolvedShipping = applied.shipping;
    shippingDiscount = applied.shippingDiscount;
  } else if (resolvedShipping === undefined) {
    resolvedShipping = calculateShipping(subtotal);
  }

  const tax = 0;
  const total = Math.max(0, subtotal - resolvedDiscount + resolvedShipping + tax);

  return {
    subtotal,
    discount: resolvedDiscount,
    shippingDiscount,
    shipping: resolvedShipping,
    tax,
    total,
    totalSavings: resolvedDiscount + shippingDiscount,
    freeShippingThreshold: env.store.freeShippingThreshold,
    qualifiesForFreeShipping: subtotal >= env.store.freeShippingThreshold || shippingDiscount > 0,
  };
};

export default {
  calculateShipping,
  calculateCouponDiscount,
  applyCouponToOrder,
  calculateOrderPricing,
};
