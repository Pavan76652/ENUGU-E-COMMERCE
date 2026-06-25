import { describe, it, expect } from 'vitest';
import Coupon from '../src/models/Coupon.js';
import {
  validateCouponForCheckout,
  incrementCouponUsage,
} from '../src/services/storefrontCoupon.service.js';
import { COUPON_TYPES } from '../src/constants/couponTypes.js';

const hour = 60 * 60 * 1000;

const createCoupon = (overrides = {}) =>
  Coupon.create({
    code: overrides.code ?? 'SAVE10',
    type: overrides.type ?? COUPON_TYPES.PERCENTAGE,
    value: overrides.value ?? 10,
    minOrderValue: overrides.minOrderValue ?? 0,
    validFrom: overrides.validFrom ?? new Date(Date.now() - hour),
    validUntil: overrides.validUntil ?? new Date(Date.now() + hour),
    ...overrides,
  });

describe('Coupon validation', () => {
  it('applies a percentage discount for a valid coupon', async () => {
    await createCoupon({ code: 'SAVE10', value: 10 });

    const result = await validateCouponForCheckout({ code: 'save10', subtotal: 1000 });

    expect(result.code).toBe('SAVE10');
    expect(result.discount).toBe(100);
  });

  it('rejects an expired coupon', async () => {
    await createCoupon({
      code: 'EXPIRED',
      validUntil: new Date(Date.now() - hour),
    });

    await expect(
      validateCouponForCheckout({ code: 'EXPIRED', subtotal: 1000 })
    ).rejects.toThrow(/expired/i);
  });

  it('enforces the minimum order value', async () => {
    await createCoupon({ code: 'MIN500', minOrderValue: 500 });

    await expect(
      validateCouponForCheckout({ code: 'MIN500', subtotal: 200 })
    ).rejects.toThrow(/minimum order value/i);
  });

  it('rejects when the usage limit is reached', async () => {
    await createCoupon({ code: 'LIMITED', usageLimit: 1, usedCount: 1 });

    await expect(
      validateCouponForCheckout({ code: 'LIMITED', subtotal: 1000 })
    ).rejects.toThrow(/usage limit/i);
  });

  it('increments usage count', async () => {
    await createCoupon({ code: 'COUNTME', usedCount: 0 });

    await incrementCouponUsage('COUNTME');

    const updated = await Coupon.findOne({ code: 'COUNTME' });
    expect(updated.usedCount).toBe(1);
  });
});
