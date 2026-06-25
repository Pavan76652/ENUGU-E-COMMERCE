import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const designRequestApi = {
  submit: (formData) =>
    api.post('/design-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrap),

  admin: {
    list: (params) => api.get('/admin/design-requests', { params }).then(unwrap),
    get: (id) => api.get(`/admin/design-requests/${id}`).then(unwrap),
    update: (id, payload) => api.patch(`/admin/design-requests/${id}`, payload).then(unwrap),
  },
};

export default designRequestApi;
