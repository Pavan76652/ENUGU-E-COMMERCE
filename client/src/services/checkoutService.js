import { checkoutApi } from './checkoutApi';
import { addressApi } from './addressApi';
import { couponApi } from './couponApi';
import { validateMockCoupon } from '../constants/coupons';

export const checkoutService = {
  async validateCoupon(code, subtotal) {
    try {
      const result = await couponApi.validate({ code, subtotal });
      return result.coupon ?? result;
    } catch (err) {
      try {
        return validateMockCoupon(code, subtotal);
      } catch (mockErr) {
        throw new Error(
          err.response?.data?.message || mockErr.message || 'Invalid coupon code'
        );
      }
    }
  },

  async previewOrder(payload) {
    try {
      return await checkoutApi.preview(payload);
    } catch {
      return null;
    }
  },

  async placeOrder(payload) {
    return checkoutApi.placeOrder(payload);
  },

  async getAddresses() {
    try {
      const result = await addressApi.list();
      return result.addresses ?? [];
    } catch {
      return [];
    }
  },

  async saveAddress(payload) {
    const result = await addressApi.create(payload);
    return result.address ?? result;
  },

  async updateAddress(addressId, payload) {
    const result = await addressApi.update(addressId, payload);
    return result.address ?? result;
  },

  async deleteAddress(addressId) {
    return addressApi.remove(addressId);
  },
};

export default checkoutService;
