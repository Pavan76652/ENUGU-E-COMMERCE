import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { applyCouponToOrder } from '../utils/pricing.js';

export const validateCouponForCheckout = async ({ code, subtotal, userId, categoryIds = [] }) => {
  if (!code?.trim()) {
    throw new ApiError(400, 'Coupon code is required');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

  if (!coupon) {
    throw new ApiError(404, 'Invalid coupon code');
  }

  const now = new Date();

  if (now < coupon.validFrom) {
    throw new ApiError(400, 'Coupon is not yet active');
  }

  if (now > coupon.validUntil) {
    throw new ApiError(400, 'Coupon has expired');
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }

  if (subtotal < coupon.minOrderValue) {
    throw new ApiError(
      400,
      `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
    );
  }

  if (coupon.applicableCategories?.length && categoryIds.length) {
    const applicable = coupon.applicableCategories.map((id) => id.toString());
    const hasMatch = categoryIds.some((id) => applicable.includes(id.toString()));

    if (!hasMatch) {
      throw new ApiError(400, 'Coupon not applicable to items in your cart');
    }
  }

  if (userId && coupon.perUserLimit) {
    const userUsage = await Order.countDocuments({
      userId,
      'pricing.couponCode': coupon.code,
      status: { $ne: 'cancelled' },
    });

    if (userUsage >= coupon.perUserLimit) {
      throw new ApiError(400, 'You have already used this coupon');
    }
  }

  const { discount, shippingDiscount } = applyCouponToOrder(coupon, subtotal);

  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
    shippingDiscount,
    totalSavings: discount + shippingDiscount,
    minOrderValue: coupon.minOrderValue,
    maxDiscount: coupon.maxDiscount,
  };
};

export const incrementCouponUsage = async (code, session = null) => {
  if (!code) return;

  await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } },
    { session }
  );
};

export default { validateCouponForCheckout, incrementCouponUsage };
