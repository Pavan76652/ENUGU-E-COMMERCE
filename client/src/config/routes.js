export const ROUTES = {
  // Storefront
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product/:slug',
  COLLECTIONS: '/collections',
  COLLECTION: '/collections/:slug',
  ABOUT: '/about',
  CONTACT: '/contact',
  CUSTOM_DESIGN: '/custom-design',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation/:orderNumber',

  // Legal
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms-and-conditions',
  REFUND_POLICY: '/refund-policy',
  SHIPPING_POLICY: '/shipping-policy',
  RETURN_POLICY: '/return-policy',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Customer account
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ORDER: '/account/orders/:orderNumber',
  ACCOUNT_WISHLIST: '/account/wishlist',
  ACCOUNT_ADDRESSES: '/account/addresses',

  // Admin auth
  ADMIN_LOGIN: '/admin/login',
  SUPER_ADMIN_LOGIN: '/super-admin/login',

  // Admin panel
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_SIZE_GUIDES: '/admin/size-guides',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER: '/admin/orders/:orderNumber',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER: '/admin/customers/:id',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_CAMPAIGNS: '/admin/campaigns',
  ADMIN_DESIGN_REQUESTS: '/admin/design-requests',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_ACTIVITY_LOGS: '/admin/activity-logs',
  ADMIN_ADMINS: '/admin/admins',

  // Errors
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
};

export default ROUTES;
