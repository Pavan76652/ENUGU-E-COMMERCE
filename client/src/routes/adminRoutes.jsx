import { lazy } from 'react';
import { RoleRoute, SuperAdminRoute } from './guards';
import { ADMIN_ROLES } from '../constants/roles';
import AdminLayout from '../layouts/AdminLayout';
import { withSuspense } from './lazyRoute';

const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminProductCreatePage = lazy(() => import('../pages/admin/AdminProductCreatePage'));
const AdminProductEditPage = lazy(() => import('../pages/admin/AdminProductEditPage'));
const AdminSizeGuidesPage = lazy(() => import('../pages/admin/AdminSizeGuidesPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/AdminOrderDetailPage'));
const AdminCustomersPage = lazy(() => import('../pages/admin/AdminCustomersPage'));
const AdminCustomerDetailPage = lazy(() => import('../pages/admin/AdminCustomerDetailPage'));
const AdminCouponsPage = lazy(() => import('../pages/admin/AdminCouponsPage'));
const AdminCampaignsPage = lazy(() => import('../pages/admin/AdminCampaignsPage'));
const AdminDesignRequestsPage = lazy(() => import('../pages/admin/AdminDesignRequestsPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminActivityLogsPage = lazy(() => import('../pages/admin/AdminActivityLogsPage'));
const AdminManagementPage = lazy(() => import('../pages/admin/AdminManagementPage'));

export const adminRoutes = {
  path: 'admin',
  element: (
    <RoleRoute allowedRoles={ADMIN_ROLES}>
      <AdminLayout />
    </RoleRoute>
  ),
  children: [
    { index: true, element: withSuspense(AdminDashboardPage) },
    { path: 'dashboard', element: withSuspense(AdminDashboardPage) },
    { path: 'products', element: withSuspense(AdminProductsPage) },
    { path: 'products/create', element: withSuspense(AdminProductCreatePage) },
    { path: 'products/:id/edit', element: withSuspense(AdminProductEditPage) },
    { path: 'size-guides', element: withSuspense(AdminSizeGuidesPage) },
    { path: 'orders', element: withSuspense(AdminOrdersPage) },
    { path: 'orders/:orderNumber', element: withSuspense(AdminOrderDetailPage) },
    { path: 'customers', element: withSuspense(AdminCustomersPage) },
    { path: 'customers/:id', element: withSuspense(AdminCustomerDetailPage) },
    { path: 'coupons', element: withSuspense(AdminCouponsPage) },
    { path: 'campaigns', element: withSuspense(AdminCampaignsPage) },
    { path: 'design-requests', element: withSuspense(AdminDesignRequestsPage) },
    { path: 'analytics', element: withSuspense(AdminAnalyticsPage) },
    { path: 'activity-logs', element: withSuspense(AdminActivityLogsPage) },
    {
      path: 'admins',
      element: (
        <SuperAdminRoute>
          {withSuspense(AdminManagementPage)}
        </SuperAdminRoute>
      ),
    },
  ],
};

export default adminRoutes;
