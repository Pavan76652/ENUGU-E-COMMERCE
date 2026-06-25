import { IMAGE_TYPE_LABELS, GALLERY_IMAGE_TYPES } from '../constants/products';

const TYPE_SORT_ORDER = {
  front_view: 0,
  back_view: 1,
  model_front_view: 2,
  model_back_view: 3,
  lifestyle_1: 4,
  lifestyle_2: 5,
  additional: 6,
};

export const getImageTypeLabel = (type) => IMAGE_TYPE_LABELS[type] ?? 'Gallery';

export const isGalleryImageType = (type) =>
  GALLERY_IMAGE_TYPES.includes(type) || !type || type === 'additional';

export const sortProductImages = (images = []) =>
  [...images].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    const typeDiff = (TYPE_SORT_ORDER[a.type] ?? 99) - (TYPE_SORT_ORDER[b.type] ?? 99);
    if (typeDiff !== 0) return typeDiff;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

export const groupImagesByRole = (images = []) => {
  const sorted = sortProductImages(images);
  return {
    front: sorted.find((img) => img.type === 'front_view') ?? null,
    back: sorted.find((img) => img.type === 'back_view') ?? null,
    gallery: sorted.filter((img) => isGalleryImageType(img.type) && img.type !== 'front_view' && img.type !== 'back_view'),
    all: sorted,
  };
};
