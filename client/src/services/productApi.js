import api from './api';

const unwrap = (response) => response.data;

export const productApi = {
  // Storefront (future public routes)
  getProducts: (params) => api.get('/products', { params }).then(unwrap),
  getProductBySlug: (slug) => api.get(`/products/${slug}`).then(unwrap),
  getCategories: () => api.get('/products/categories').then(unwrap),
  getCollections: () => api.get('/products/collections').then(unwrap),
  getCollectionBySlug: (slug, params) =>
    api.get(`/products/collections/${slug}`, { params }).then(unwrap),

  // Admin
  admin: {
    list: (params) => api.get('/admin/products', { params }).then(unwrap),
    getById: (id) => api.get(`/admin/products/${id}`).then(unwrap),
    create: (payload) => api.post('/admin/products', payload).then(unwrap),
    update: (id, payload) => api.put(`/admin/products/${id}`, payload).then(unwrap),
    delete: (id) => api.delete(`/admin/products/${id}`).then(unwrap),
    archive: (id) => api.patch(`/admin/products/${id}/archive`).then(unwrap),
    updateStatus: (id, payload) => api.patch(`/admin/products/${id}/status`, payload).then(unwrap),
    updateInventory: (id, payload) => api.patch(`/admin/products/${id}/inventory`, payload).then(unwrap),
    getCategories: () => api.get('/admin/products/categories').then(unwrap),
    uploadImages: (id, formData) =>
      api.post(`/admin/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(unwrap),
    uploadStandaloneImages: (formData) =>
      api.post('/admin/products/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(unwrap),
    deleteImage: (id, payload) => api.delete(`/admin/products/${id}/images`, { data: payload }).then(unwrap),
    reorderImages: (id, payload) => api.put(`/admin/products/${id}/images/reorder`, payload).then(unwrap),
    setCoverImage: (id, payload) => api.patch(`/admin/products/${id}/images/cover`, payload).then(unwrap),
  },
};

export default productApi;
