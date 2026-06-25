export const PERMISSIONS = {
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
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.PRODUCTS_CREATE]: 'Create products',
  [PERMISSIONS.PRODUCTS_UPDATE]: 'Update products',
  [PERMISSIONS.PRODUCTS_DELETE]: 'Delete products',
  [PERMISSIONS.SIZE_GUIDES_MANAGE]: 'Manage size guides',
  [PERMISSIONS.ORDERS_READ]: 'View orders',
  [PERMISSIONS.ORDERS_UPDATE]: 'Update orders',
  [PERMISSIONS.ORDERS_CANCEL]: 'Cancel orders',
  [PERMISSIONS.ORDERS_REFUND]: 'Process refunds',
  [PERMISSIONS.CUSTOMERS_READ]: 'View customers',
  [PERMISSIONS.COUPONS_MANAGE]: 'Manage coupons',
  [PERMISSIONS.BANNERS_MANAGE]: 'Manage banners',
  [PERMISSIONS.COLLECTIONS_MANAGE]: 'Manage collections',
  [PERMISSIONS.REVIEWS_MODERATE]: 'Moderate reviews',
  [PERMISSIONS.CAMPAIGNS_MANAGE]: 'Manage campaigns',
  [PERMISSIONS.DESIGN_REQUESTS_MANAGE]: 'Manage design requests',
  [PERMISSIONS.ANALYTICS_READ]: 'View analytics',
  [PERMISSIONS.ADMINS_MANAGE]: 'Manage admins',
  [PERMISSIONS.SETTINGS_MANAGE]: 'Manage settings',
  [PERMISSIONS.AUDIT_READ]: 'View activity logs',
};

export const ADMIN_PERMISSION_GROUPS = {
  products: {
    label: 'Products',
    permissions: [
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.SIZE_GUIDES_MANAGE,
    ],
  },
  orders: {
    label: 'Orders',
    permissions: [
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.ORDERS_CANCEL,
    ],
  },
  customers: {
    label: 'Customers',
    permissions: [PERMISSIONS.CUSTOMERS_READ],
  },
  marketing: {
    label: 'Marketing',
    permissions: [
      PERMISSIONS.COUPONS_MANAGE,
      PERMISSIONS.BANNERS_MANAGE,
      PERMISSIONS.CAMPAIGNS_MANAGE,
    ],
  },
  content: {
    label: 'Content',
    permissions: [PERMISSIONS.COLLECTIONS_MANAGE, PERMISSIONS.REVIEWS_MODERATE],
  },
  design: {
    label: 'Custom design',
    permissions: [PERMISSIONS.DESIGN_REQUESTS_MANAGE],
  },
  analytics: {
    label: 'Analytics',
    permissions: [PERMISSIONS.ANALYTICS_READ],
  },
};

export const ALL_ASSIGNABLE_PERMISSIONS = Object.values(ADMIN_PERMISSION_GROUPS).flatMap(
  (g) => g.permissions
);

export const formatPermissionList = (permissions = []) => {
  if (!permissions.length) return 'No permissions';
  if (permissions.length <= 2) {
    return permissions.map((p) => PERMISSION_LABELS[p] ?? p).join(', ');
  }
  return `${permissions.length} permissions`;
};
