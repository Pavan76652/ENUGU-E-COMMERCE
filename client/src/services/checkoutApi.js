import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const checkoutApi = {
  preview: (payload) => api.post('/orders/preview', payload).then(unwrap),
  validateCoupon: (payload) => api.post('/orders/coupon', payload).then(unwrap),
  placeOrder: (payload) => api.post('/orders', payload).then(unwrap),
};

export default checkoutApi;
