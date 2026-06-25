export const PERMISSIONS = Object.freeze({
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_DELETE: 'products.delete',
  SIZE_GUIDES_MANAGE: 'size_guides.manage',

  ORDERS_READ: 'orders.read',
  ORDERS_UPDATE: 'orders.update',
  ORDERS_CANCEL: 'orders.cancel',
  ORDERS_REFUND: 'orders.refund',

  CUSTOMERS_READ: 'customers.read',

  COUPONS_MANAGE: 'coupons.manage',
  BANNERS_MANAGE: 'banners.manage',
  COLLECTIONS_MANAGE: 'collections.manage',
  REVIEWS_MODERATE: 'reviews.moderate',

  CAMPAIGNS_MANAGE: 'campaigns.manage',
  DESIGN_REQUESTS_MANAGE: 'design_requests.manage',
  ANALYTICS_READ: 'analytics.read',

  ADMINS_MANAGE: 'admins.manage',
  SETTINGS_MANAGE: 'settings.manage',
  AUDIT_READ: 'audit.read',
});

export const ADMIN_PERMISSION_GROUPS = Object.freeze({
  products: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.SIZE_GUIDES_MANAGE,
  ],
  orders: [
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_CANCEL,
  ],
  customers: [PERMISSIONS.CUSTOMERS_READ],
  marketing: [PERMISSIONS.COUPONS_MANAGE, PERMISSIONS.BANNERS_MANAGE, PERMISSIONS.CAMPAIGNS_MANAGE],
  content: [PERMISSIONS.COLLECTIONS_MANAGE, PERMISSIONS.REVIEWS_MODERATE],
  design: [PERMISSIONS.DESIGN_REQUESTS_MANAGE],
  analytics: [PERMISSIONS.ANALYTICS_READ],
});

export const SUPER_ADMIN_ONLY_PERMISSIONS = Object.freeze([
  PERMISSIONS.ORDERS_REFUND,
  PERMISSIONS.ADMINS_MANAGE,
  PERMISSIONS.SETTINGS_MANAGE,
  PERMISSIONS.AUDIT_READ,
]);

export const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions?.includes(requiredPermission) ?? false;
};

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  return requiredPermissions.some((permission) =>
    hasPermission(userPermissions, permission)
  );
};
