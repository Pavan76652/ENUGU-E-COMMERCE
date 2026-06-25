import axios from 'axios';
import env from '../config/env';
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore';

const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

const resolveLoginPath = () => {
  const path = window.location.pathname;
  if (path.startsWith('/super-admin')) return '/super-admin/login';
  if (path.startsWith('/admin')) return '/admin/login';
  return '/login';
};

const isAuthEndpoint = (url = '') =>
  url.includes('/auth/login') ||
  url.includes('/auth/refresh-token') ||
  url.includes('/auth/register');

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        // De-duplicate concurrent refreshes so many parallel requests trigger
        // only a single refresh call (handles multiple concurrent users/tabs).
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${env.apiBaseUrl}/auth/refresh-token`, {}, { withCredentials: true })
            .then((res) => res.data?.data?.accessToken ?? null)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        // fall through to logout handling below
      }

      clearAccessToken();
      const loginPath = resolveLoginPath();
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = loginPath;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
