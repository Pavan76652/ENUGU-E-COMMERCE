import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const campaignApi = {
  getActive: () => api.get('/campaigns/active').then(unwrap),
  list: () => api.get('/campaigns').then(unwrap),

  admin: {
    list: (params) => api.get('/admin/campaigns', { params }).then(unwrap),
    get: (id) => api.get(`/admin/campaigns/${id}`).then(unwrap),
    create: (payload) => api.post('/admin/campaigns', payload).then(unwrap),
    update: (id, payload) => api.put(`/admin/campaigns/${id}`, payload).then(unwrap),
    delete: (id) => api.delete(`/admin/campaigns/${id}`).then(unwrap),
    uploadBanner: (id, file, variant = 'desktop') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('variant', variant);
      return api
        .post(`/admin/campaigns/${id}/banner`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(unwrap);
    },
    deleteBanner: (id, variant = 'desktop') =>
      api.delete(`/admin/campaigns/${id}/banner`, { params: { variant } }).then(unwrap),
  },
};

export default campaignApi;
