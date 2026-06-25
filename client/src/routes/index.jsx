import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import customerRoutes from './customerRoutes';
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import adminRoutes from './adminRoutes';
import { withSuspense } from './lazyRoute';
import { NotFoundPage, ForbiddenPage } from '../pages/errors';
import AuthLayout from '../layouts/AuthLayout';

const AdminLoginPage = lazy(() => import('../pages/auth/AdminLoginPage'));
const SuperAdminLoginPage = lazy(() => import('../pages/auth/SuperAdminLoginPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));

export const router = createBrowserRouter([
  customerRoutes,
  authRoutes,
  // Verify-email is reachable regardless of auth state (no GuestRoute guard).
  {
    element: <AuthLayout />,
    children: [{ path: 'verify-email', element: withSuspense(VerifyEmailPage) }],
  },
  { path: 'admin/login', element: withSuspense(AdminLoginPage) },
  { path: 'super-admin/login', element: withSuspense(SuperAdminLoginPage) },
  accountRoutes,
  adminRoutes,
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
