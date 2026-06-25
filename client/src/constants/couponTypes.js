export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping',
};

export const COUPON_TYPE_OPTIONS = [
  { value: COUPON_TYPES.PERCENTAGE, label: 'Percentage Discount' },
  { value: COUPON_TYPES.FIXED, label: 'Fixed Discount' },
  { value: COUPON_TYPES.FREE_SHIPPING, label: 'Free Shipping' },
];

export const COUPON_TYPE_LABELS = {
  [COUPON_TYPES.PERCENTAGE]: 'Percentage',
  [COUPON_TYPES.FIXED]: 'Fixed',
  [COUPON_TYPES.FREE_SHIPPING]: 'Free Shipping',
};

export default COUPON_TYPES;
