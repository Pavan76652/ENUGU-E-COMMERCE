import { lazy } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import { withSuspense } from './lazyRoute';

const HomePage = lazy(() => import('../pages/storefront/HomePage'));
const ShopPage = lazy(() => import('../pages/storefront/ShopPage'));
const ProductDetailPage = lazy(() => import('../pages/storefront/ProductDetailPage'));
const CollectionsPage = lazy(() => import('../pages/storefront/CollectionsPage'));
const CollectionPage = lazy(() => import('../pages/storefront/CollectionPage'));
const AboutPage = lazy(() => import('../pages/storefront/AboutPage'));
const ContactPage = lazy(() => import('../pages/storefront/ContactPage'));
const CustomDesignPage = lazy(() => import('../pages/storefront/CustomDesignPage'));
const LegalPage = lazy(() => import('../pages/storefront/LegalPage'));
const CartPage = lazy(() => import('../pages/storefront/CartPage'));
const CheckoutPage = lazy(() => import('../pages/storefront/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/storefront/OrderConfirmationPage'));
const WishlistPage = lazy(() => import('../pages/account/WishlistPage'));

export const customerRoutes = {
  element: <CustomerLayout />,
  children: [
    { index: true, element: withSuspense(HomePage) },
    { path: 'shop', element: withSuspense(ShopPage) },
    { path: 'product/:slug', element: withSuspense(ProductDetailPage) },
    { path: 'collections', element: withSuspense(CollectionsPage) },
    { path: 'collections/:slug', element: withSuspense(CollectionPage) },
    { path: 'about', element: withSuspense(AboutPage) },
    { path: 'contact', element: withSuspense(ContactPage) },
    { path: 'custom-design', element: withSuspense(CustomDesignPage) },
    { path: 'privacy-policy', element: withSuspense(LegalPage) },
    { path: 'terms-and-conditions', element: withSuspense(LegalPage) },
    { path: 'refund-policy', element: withSuspense(LegalPage) },
    { path: 'shipping-policy', element: withSuspense(LegalPage) },
    { path: 'return-policy', element: withSuspense(LegalPage) },
    { path: 'cart', element: withSuspense(CartPage) },
    { path: 'wishlist', element: withSuspense(WishlistPage) },
    { path: 'checkout', element: withSuspense(CheckoutPage) },
    { path: 'order-confirmation/:orderNumber', element: withSuspense(OrderConfirmationPage) },
  ],
};

export default customerRoutes;
