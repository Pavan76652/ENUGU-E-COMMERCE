export const AUDIT_ACTIONS = {
  ADMIN_CREATED: 'admin.created',
  ADMIN_UPDATED: 'admin.updated',
  ADMIN_DISABLED: 'admin.disabled',
  ADMIN_ENABLED: 'admin.enabled',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_STATUS_CHANGED: 'product.status_changed',
  ORDER_STATUS_UPDATED: 'order.status_updated',
  ORDER_TRACKING_UPDATED: 'order.tracking_updated',
  COUPON_CREATED: 'coupon.created',
  COUPON_UPDATED: 'coupon.updated',
  COUPON_DELETED: 'coupon.deleted',
  CAMPAIGN_CREATED: 'campaign.created',
  CAMPAIGN_UPDATED: 'campaign.updated',
  CAMPAIGN_DELETED: 'campaign.deleted',
  DESIGN_REQUEST_UPDATED: 'design_request.updated',
};

export const AUDIT_RESOURCES = {
  ADMIN: 'admin',
  PRODUCT: 'product',
  ORDER: 'order',
  COUPON: 'coupon',
  CAMPAIGN: 'campaign',
  DESIGN_REQUEST: 'design_request',
  CUSTOMER: 'customer',
};

export const ACTION_LABELS = {
  [AUDIT_ACTIONS.ADMIN_CREATED]: 'Admin created',
  [AUDIT_ACTIONS.ADMIN_UPDATED]: 'Admin updated',
  [AUDIT_ACTIONS.ADMIN_DISABLED]: 'Admin disabled',
  [AUDIT_ACTIONS.ADMIN_ENABLED]: 'Admin enabled',
  [AUDIT_ACTIONS.PRODUCT_CREATED]: 'Product created',
  [AUDIT_ACTIONS.PRODUCT_UPDATED]: 'Product updated',
  [AUDIT_ACTIONS.PRODUCT_DELETED]: 'Product deleted',
  [AUDIT_ACTIONS.PRODUCT_STATUS_CHANGED]: 'Product status changed',
  [AUDIT_ACTIONS.ORDER_STATUS_UPDATED]: 'Order status updated',
  [AUDIT_ACTIONS.ORDER_TRACKING_UPDATED]: 'Order tracking updated',
  [AUDIT_ACTIONS.COUPON_CREATED]: 'Coupon created',
  [AUDIT_ACTIONS.COUPON_UPDATED]: 'Coupon updated',
  [AUDIT_ACTIONS.COUPON_DELETED]: 'Coupon deleted',
  [AUDIT_ACTIONS.CAMPAIGN_CREATED]: 'Campaign created',
  [AUDIT_ACTIONS.CAMPAIGN_UPDATED]: 'Campaign updated',
  [AUDIT_ACTIONS.CAMPAIGN_DELETED]: 'Campaign deleted',
  [AUDIT_ACTIONS.DESIGN_REQUEST_UPDATED]: 'Design request updated',
};

export const RESOURCE_LABELS = {
  [AUDIT_RESOURCES.ADMIN]: 'Admin',
  [AUDIT_RESOURCES.PRODUCT]: 'Product',
  [AUDIT_RESOURCES.ORDER]: 'Order',
  [AUDIT_RESOURCES.COUPON]: 'Coupon',
  [AUDIT_RESOURCES.CAMPAIGN]: 'Campaign',
  [AUDIT_RESOURCES.DESIGN_REQUEST]: 'Design request',
  [AUDIT_RESOURCES.CUSTOMER]: 'Customer',
};

export const ACTION_FILTER_OPTIONS = [
  { value: '', label: 'All actions' },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export const RESOURCE_FILTER_OPTIONS = [
  { value: '', label: 'All resources' },
  ...Object.entries(RESOURCE_LABELS).map(([value, label]) => ({ value, label })),
];

const actionBadgeStyles = {
  'admin.created': 'bg-violet-50 text-violet-700',
  'admin.updated': 'bg-violet-50 text-violet-700',
  'admin.disabled': 'bg-red-50 text-red-700',
  'admin.enabled': 'bg-green-50 text-green-700',
  'product.created': 'bg-blue-50 text-blue-700',
  'product.updated': 'bg-blue-50 text-blue-700',
  'product.deleted': 'bg-red-50 text-red-700',
  'product.status_changed': 'bg-amber-50 text-amber-800',
  'order.status_updated': 'bg-cyan-50 text-cyan-800',
  'order.tracking_updated': 'bg-cyan-50 text-cyan-800',
  'coupon.created': 'bg-emerald-50 text-emerald-700',
  'coupon.updated': 'bg-emerald-50 text-emerald-700',
  'coupon.deleted': 'bg-red-50 text-red-700',
  'campaign.created': 'bg-pink-50 text-pink-700',
  'campaign.updated': 'bg-pink-50 text-pink-700',
  'campaign.deleted': 'bg-red-50 text-red-700',
  'design_request.updated': 'bg-orange-50 text-orange-800',
};

export const getActionBadgeClass = (action) =>
  actionBadgeStyles[action] ?? 'bg-gray-100 text-gray-700';

export const formatMetadataSummary = (log) => {
  const m = log?.metadata ?? {};
  const action = log?.action;

  switch (action) {
    case AUDIT_ACTIONS.ORDER_STATUS_UPDATED:
      return [m.orderNumber, m.status, m.note].filter(Boolean).join(' · ');
    case AUDIT_ACTIONS.ORDER_TRACKING_UPDATED:
      return [m.orderNumber, m.carrier, m.trackingNumber].filter(Boolean).join(' · ');
    case AUDIT_ACTIONS.PRODUCT_CREATED:
    case AUDIT_ACTIONS.PRODUCT_UPDATED:
    case AUDIT_ACTIONS.PRODUCT_DELETED:
      if (m.name && m.sku) return `${m.name} (${m.sku})`;
      return m.name ?? m.sku ?? m.action ?? '';
    case AUDIT_ACTIONS.PRODUCT_STATUS_CHANGED:
      return m.status ? `Status: ${m.status}` : '';
    case AUDIT_ACTIONS.COUPON_CREATED:
    case AUDIT_ACTIONS.COUPON_UPDATED:
    case AUDIT_ACTIONS.COUPON_DELETED:
      return m.code ? `Code: ${m.code}` : '';
    case AUDIT_ACTIONS.CAMPAIGN_CREATED:
    case AUDIT_ACTIONS.CAMPAIGN_UPDATED:
    case AUDIT_ACTIONS.CAMPAIGN_DELETED:
      return m.name ?? '';
    case AUDIT_ACTIONS.ADMIN_CREATED:
    case AUDIT_ACTIONS.ADMIN_DISABLED:
    case AUDIT_ACTIONS.ADMIN_ENABLED:
      return m.email ?? '';
    case AUDIT_ACTIONS.DESIGN_REQUEST_UPDATED:
      return m.status ? `Status: ${m.status}` : '';
    default:
      break;
  }

  const keys = Object.keys(m);
  if (!keys.length) return '';
  if (keys.length === 1) return String(m[keys[0]]);
  return keys.map((k) => `${k}: ${m[k]}`).join(', ');
};
