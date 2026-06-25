export const PRODUCT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD_OUT: 'sold_out',
  ARCHIVED: 'archived',
});

export const PRODUCT_SIZES = Object.freeze(['S', 'M', 'L', 'XL', 'XXL']);

export const ALL_PRODUCT_STATUSES = Object.freeze(Object.values(PRODUCT_STATUS));

export const IMAGE_TYPES = Object.freeze({
  FRONT_VIEW: 'front_view',
  BACK_VIEW: 'back_view',
  MODEL_FRONT_VIEW: 'model_front_view',
  MODEL_BACK_VIEW: 'model_back_view',
  LIFESTYLE_1: 'lifestyle_1',
  LIFESTYLE_2: 'lifestyle_2',
  ADDITIONAL: 'additional',
});

export const ALL_IMAGE_TYPES = Object.freeze(Object.values(IMAGE_TYPES));

export const IMAGE_LIMITS = Object.freeze({
  MIN: 2,
  MAX: 10,
});

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;
