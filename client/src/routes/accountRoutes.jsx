import { lazy } from 'react';
import { ProtectedRoute } from './guards';
import CustomerLayout from '../layouts/CustomerLayout';
import { withSuspense } from './lazyRoute';

const AccountPage = lazy(() => import('../pages/account/AccountPage'));
const ProfilePage = lazy(() => import('../pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('../pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/account/OrderDetailPage'));
const WishlistPage = lazy(() => import('../pages/account/WishlistPage'));
const AddressesPage = lazy(() => import('../pages/account/AddressesPage'));

export const accountRoutes = {
  element: (
    <ProtectedRoute>
      <CustomerLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: 'account', element: withSuspense(AccountPage) },
    { path: 'account/profile', element: withSuspense(ProfilePage) },
    { path: 'account/orders', element: withSuspense(OrdersPage) },
    { path: 'account/orders/:orderNumber', element: withSuspense(OrderDetailPage) },
    { path: 'account/wishlist', element: withSuspense(WishlistPage) },
    { path: 'account/addresses', element: withSuspense(AddressesPage) },
  ],
};

export default accountRoutes;
