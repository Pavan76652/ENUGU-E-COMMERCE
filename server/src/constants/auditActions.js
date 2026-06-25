export const AUDIT_ACTIONS = Object.freeze({
  ADMIN_CREATED: 'admin.created',
  ADMIN_UPDATED: 'admin.updated',
  ADMIN_DISABLED: 'admin.disabled',
  ADMIN_ENABLED: 'admin.enabled',

  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_STATUS_CHANGED: 'product.status_changed',

  SIZE_GUIDE_CREATED: 'size_guide.created',
  SIZE_GUIDE_UPDATED: 'size_guide.updated',
  SIZE_GUIDE_DELETED: 'size_guide.deleted',

  ORDER_STATUS_UPDATED: 'order.status_updated',
  ORDER_TRACKING_UPDATED: 'order.tracking_updated',

  COUPON_CREATED: 'coupon.created',
  COUPON_UPDATED: 'coupon.updated',
  COUPON_DELETED: 'coupon.deleted',

  CAMPAIGN_CREATED: 'campaign.created',
  CAMPAIGN_UPDATED: 'campaign.updated',
  CAMPAIGN_DELETED: 'campaign.deleted',

  DESIGN_REQUEST_UPDATED: 'design_request.updated',
});

export const AUDIT_RESOURCES = Object.freeze({
  ADMIN: 'admin',
  PRODUCT: 'product',
  SIZE_GUIDE: 'size_guide',
  ORDER: 'order',
  COUPON: 'coupon',
  CAMPAIGN: 'campaign',
  DESIGN_REQUEST: 'design_request',
  CUSTOMER: 'customer',
});
