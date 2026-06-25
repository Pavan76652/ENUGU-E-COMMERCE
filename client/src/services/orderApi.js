import api from './api';

const unwrap = (response) => response.data;

export const orderApi = {
  // Customer (future)
  create: (payload) => api.post('/orders', payload).then(unwrap),
  getMyOrders: (params) => api.get('/orders', { params }).then(unwrap),
  getByOrderNumber: (orderNumber) => api.get(`/orders/${orderNumber}`).then(unwrap),

  // Admin
  admin: {
    list: (params) => api.get('/admin/orders', { params }).then(unwrap),
    getByOrderNumber: (orderNumber) => api.get(`/admin/orders/${orderNumber}`).then(unwrap),
    updateStatus: (orderNumber, payload) =>
      api.patch(`/admin/orders/${orderNumber}/status`, payload).then(unwrap),
    updateTracking: (orderNumber, payload) =>
      api.patch(`/admin/orders/${orderNumber}/tracking`, payload).then(unwrap),
    updateNotes: (orderNumber, payload) =>
      api.patch(`/admin/orders/${orderNumber}/notes`, payload).then(unwrap),
  },
};

export default orderApi;
