import api from './api';

const unwrap = (response) => response.data;

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then(unwrap),
  loginCustomer: (payload) => api.post('/auth/login/customer', payload).then(unwrap),
  loginAdmin: (payload) => api.post('/auth/login/admin', payload).then(unwrap),
  loginSuperAdmin: (payload) => api.post('/auth/login/super-admin', payload).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
  refreshToken: () => api.post('/auth/refresh-token').then(unwrap),
  getMe: () => api.get('/auth/me').then(unwrap),
  updateProfile: (payload) => api.put('/auth/profile', payload).then(unwrap),
  changePassword: (payload) => api.put('/auth/change-password', payload).then(unwrap),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload).then(unwrap),
  resetPassword: (payload) => api.post('/auth/reset-password', payload).then(unwrap),
  verifyEmail: (payload) => api.post('/auth/verify-email', payload).then(unwrap),
  resendVerification: () => api.post('/auth/resend-verification').then(unwrap),
};

export default authApi;
