import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const couponApi = {
  validate: (payload) => api.post('/orders/coupon', payload).then(unwrap),

  admin: {
    list: (params) => api.get('/admin/coupons', { params }).then(unwrap),
    get: (id) => api.get(`/admin/coupons/${id}`).then(unwrap),
    create: (payload) => api.post('/admin/coupons', payload).then(unwrap),
    update: (id, payload) => api.put(`/admin/coupons/${id}`, payload).then(unwrap),
    delete: (id) => api.delete(`/admin/coupons/${id}`).then(unwrap),
  },
};

export default couponApi;
