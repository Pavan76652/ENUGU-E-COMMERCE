import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

export const sizeGuideApi = {
  getById: (id) => api.get(`/size-guides/${id}`).then(unwrap),
  getDefault: () => api.get('/size-guides/default').then(unwrap),

  admin: {
    list: (params) => api.get('/admin/size-guides', { params }).then(unwrap),
    getOptions: () => api.get('/admin/size-guides/options').then(unwrap),
    get: (id) => api.get(`/admin/size-guides/${id}`).then(unwrap),
    create: (payload) => api.post('/admin/size-guides', payload).then(unwrap),
    update: (id, payload) => api.put(`/admin/size-guides/${id}`, payload).then(unwrap),
    delete: (id) => api.delete(`/admin/size-guides/${id}`).then(unwrap),
    uploadImage: (id, file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api
        .post(`/admin/size-guides/${id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(unwrap);
    },
    deleteImage: (id) => api.delete(`/admin/size-guides/${id}/image`).then(unwrap),
  },
};

export default sizeGuideApi;
