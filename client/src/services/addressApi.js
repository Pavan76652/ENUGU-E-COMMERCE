import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const addressApi = {
  list: () => api.get('/addresses').then(unwrap),
  create: (payload) => api.post('/addresses', payload).then(unwrap),
  update: (addressId, payload) => api.put(`/addresses/${addressId}`, payload).then(unwrap),
  remove: (addressId) => api.delete(`/addresses/${addressId}`).then(unwrap),
  setDefault: (addressId) => api.patch(`/addresses/${addressId}/default`).then(unwrap),
};

export default addressApi;
