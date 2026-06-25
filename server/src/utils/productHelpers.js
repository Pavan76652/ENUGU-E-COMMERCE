import {
  PRODUCT_STATUS,
  DEFAULT_LOW_STOCK_THRESHOLD,
} from '../constants/productStatus.js';

export const calculateDiscountPercentage = (mrp, sellingPrice) => {
  if (!mrp || mrp <= 0 || sellingPrice >= mrp) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

export const getTotalStock = (sizeStock = []) => {
  return sizeStock.reduce((sum, item) => sum + (item.stock ?? 0), 0);
};

export const isFullySoldOut = (sizeStock = []) => {
  if (!sizeStock.length) return true;
  return sizeStock.every((item) => (item.stock ?? 0) <= 0);
};

export const getLowStockSizes = (sizeStock = [], threshold = DEFAULT_LOW_STOCK_THRESHOLD) => {
  return sizeStock
    .filter((item) => item.stock > 0 && item.stock <= (item.lowStockThreshold ?? threshold))
    .map((item) => ({ size: item.size, stock: item.stock }));
};

export const buildStorefrontInventory = (sizeStock = []) => {
  const totalStock = getTotalStock(sizeStock);
  const soldOut = isFullySoldOut(sizeStock);
  const lowStockSizes = getLowStockSizes(sizeStock);

  return {
    totalStock,
    isSoldOut: soldOut,
    isAddToCartDisabled: soldOut,
    soldOutLabel: soldOut ? 'SOLD OUT' : null,
    lowStockSizes: lowStockSizes.map((item) => ({
      size: item.size,
      message: `Only ${item.stock} Left`,
    })),
    sizeStock: sizeStock.map((item) => ({
      size: item.size,
      stock: item.stock,
      inStock: item.stock > 0,
      lowStock: item.stock > 0 && item.stock <= (item.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD),
      lowStockMessage:
        item.stock > 0 && item.stock <= (item.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD)
          ? `Only ${item.stock} Left`
          : null,
    })),
  };
};

export const syncProductStatusFromStock = (product) => {
  if (product.status === PRODUCT_STATUS.ARCHIVED || product.status === PRODUCT_STATUS.DRAFT) {
    return product.status;
  }

  if (isFullySoldOut(product.sizeStock)) {
    product.status = PRODUCT_STATUS.SOLD_OUT;
  } else if (product.status === PRODUCT_STATUS.SOLD_OUT) {
    product.status = PRODUCT_STATUS.PUBLISHED;
  }

  return product.status;
};

export const sortImagesForStorefront = (images = []) => {
  const typeOrder = {
    front_view: 0,
    back_view: 1,
    model_front_view: 2,
    model_back_view: 3,
    lifestyle_1: 4,
    lifestyle_2: 5,
    additional: 6,
  };

  const sorted = [...images].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    const typeDiff = (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
    if (typeDiff !== 0) return typeDiff;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  return sorted.map((img, index) => ({
    ...img.toObject?.() ?? img,
    sortOrder: index,
  }));
};

export const normalizeSizeStock = (sizeStock = []) => {
  const map = new Map(sizeStock.map((item) => [item.size, item]));

  return ['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
    const existing = map.get(size);
    return {
      size,
      stock: existing?.stock ?? 0,
      lowStockThreshold: existing?.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
    };
  });
};

export const enrichProduct = (product) => {
  const doc = product.toObject ? product.toObject() : { ...product };
  const inventory = buildStorefrontInventory(doc.sizeStock ?? []);
  const discountPercentage = calculateDiscountPercentage(doc.mrp, doc.sellingPrice);

  return {
    ...doc,
    discountPercentage,
    images: sortImagesForStorefront(doc.images ?? []),
    inventory,
  };
};
