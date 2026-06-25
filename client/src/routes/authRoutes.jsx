import { lazy } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { GuestRoute } from './guards';
import { withSuspense } from './lazyRoute';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

export const authRoutes = {
  element: (
    <GuestRoute>
      <AuthLayout />
    </GuestRoute>
  ),
  children: [
    { path: 'login', element: withSuspense(LoginPage) },
    { path: 'register', element: withSuspense(RegisterPage) },
    { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
    { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
  ],
};

export default authRoutes;
