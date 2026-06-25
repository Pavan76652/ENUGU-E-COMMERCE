import { COUPON_TYPES } from '../constants/couponTypes';
import { calculateShipping, calculateCouponDiscount } from '../utils/orderPricing';

export const MOCK_COUPONS = [
  {
    code: 'ENUGU10',
    type: COUPON_TYPES.PERCENTAGE,
    value: 10,
    minOrderValue: 500,
    maxDiscount: 300,
  },
  {
    code: 'FLAT100',
    type: COUPON_TYPES.FIXED,
    value: 100,
    minOrderValue: 999,
  },
  {
    code: 'FREESHIP',
    type: COUPON_TYPES.FREE_SHIPPING,
    value: 0,
    minOrderValue: 499,
  },
];

const buildMockCouponResult = (coupon, subtotal) => {
  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) {
    const shippingDiscount = calculateShipping(subtotal);
    return {
      ...coupon,
      discount: 0,
      shippingDiscount,
      totalSavings: shippingDiscount,
    };
  }

  const discount = calculateCouponDiscount(coupon, subtotal);
  return { ...coupon, discount, shippingDiscount: 0, totalSavings: discount };
};

export const validateMockCoupon = (code, subtotal) => {
  const coupon = MOCK_COUPONS.find((c) => c.code === code.toUpperCase());

  if (!coupon) {
    throw new Error('Invalid coupon code');
  }

  if (subtotal < coupon.minOrderValue) {
    throw new Error(`Minimum order value of ₹${coupon.minOrderValue} required`);
  }

  return buildMockCouponResult(coupon, subtotal);
};

export default MOCK_COUPONS;
