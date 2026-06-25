import api from './api';

const unwrap = (response) => response.data;

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard').then(unwrap),
  getCustomers: (params) => api.get('/admin/customers', { params }).then(unwrap),
  getCustomer: (id) => api.get(`/admin/customers/${id}`).then(unwrap),
  setCustomerStatus: (id, payload) => api.patch(`/admin/customers/${id}/status`, payload).then(unwrap),
  getCoupons: (params) => api.get('/admin/coupons', { params }).then(unwrap),
  getCoupon: (id) => api.get(`/admin/coupons/${id}`).then(unwrap),
  createCoupon: (payload) => api.post('/admin/coupons', payload).then(unwrap),
  updateCoupon: (id, payload) => api.put(`/admin/coupons/${id}`, payload).then(unwrap),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`).then(unwrap),
  getCampaigns: (params) => api.get('/admin/campaigns', { params }).then(unwrap),
  getCampaign: (id) => api.get(`/admin/campaigns/${id}`).then(unwrap),
  createCampaign: (payload) => api.post('/admin/campaigns', payload).then(unwrap),
  updateCampaign: (id, payload) => api.put(`/admin/campaigns/${id}`, payload).then(unwrap),
  deleteCampaign: (id) => api.delete(`/admin/campaigns/${id}`).then(unwrap),
  getDesignRequests: (params) => api.get('/admin/design-requests', { params }).then(unwrap),
  getDesignRequest: (id) => api.get(`/admin/design-requests/${id}`).then(unwrap),
  updateDesignRequest: (id, payload) =>
    api.patch(`/admin/design-requests/${id}`, payload).then(unwrap),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }).then(unwrap),
  getAnalyticsOverview: () => api.get('/admin/analytics/overview').then(unwrap),
  getAnalyticsDashboard: (params) => api.get('/admin/analytics/dashboard', { params }).then(unwrap),
  getAnalyticsSales: (params) => api.get('/admin/analytics/sales', { params }).then(unwrap),
  getAnalyticsProducts: (params) => api.get('/admin/analytics/products', { params }).then(unwrap),
  getAnalyticsCustomers: (params) => api.get('/admin/analytics/customers', { params }).then(unwrap),
  admins: {
    list: (params) => api.get('/admin/admins', { params }).then(unwrap),
    create: (payload) => api.post('/admin/admins', payload).then(unwrap),
    update: (id, payload) => api.put(`/admin/admins/${id}`, payload).then(unwrap),
    setStatus: (id, payload) => api.patch(`/admin/admins/${id}/status`, payload).then(unwrap),
  },
};

export default adminApi;
