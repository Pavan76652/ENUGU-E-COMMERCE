export const COUPON_TYPES = Object.freeze({
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping',
});

export const ALL_COUPON_TYPES = Object.freeze(Object.values(COUPON_TYPES));

export const COUPON_TYPE_LABELS = Object.freeze({
  [COUPON_TYPES.PERCENTAGE]: 'Percentage Discount',
  [COUPON_TYPES.FIXED]: 'Fixed Discount',
  [COUPON_TYPES.FREE_SHIPPING]: 'Free Shipping',
});

export default COUPON_TYPES;
