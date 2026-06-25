export const PRODUCT_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD_OUT: 'sold_out',
  ARCHIVED: 'archived',
};

export const PRODUCT_STATUS_OPTIONS = [
  { value: PRODUCT_STATUSES.DRAFT, label: 'Draft' },
  { value: PRODUCT_STATUSES.PUBLISHED, label: 'Published' },
  { value: PRODUCT_STATUSES.SOLD_OUT, label: 'Sold Out' },
  { value: PRODUCT_STATUSES.ARCHIVED, label: 'Archived' },
];

export const PRODUCT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  sold_out: 'Sold Out',
  archived: 'Archived',
};

export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const IMAGE_TYPE_OPTIONS = [
  { value: 'front_view', label: 'Front View' },
  { value: 'back_view', label: 'Back View' },
  { value: 'additional', label: 'Gallery Image' },
];

export const IMAGE_TYPE_LABELS = {
  front_view: 'Front View',
  back_view: 'Back View',
  model_front_view: 'Model Front',
  model_back_view: 'Model Back',
  lifestyle_1: 'Gallery',
  lifestyle_2: 'Gallery',
  additional: 'Gallery',
};

export const GALLERY_IMAGE_TYPES = ['additional', 'lifestyle_1', 'lifestyle_2'];

export const defaultSizeStock = () =>
  PRODUCT_SIZES.map((size) => ({
    size,
    stock: 0,
    lowStockThreshold: 5,
  }));

export const MIN_PRODUCT_IMAGES = 2;
