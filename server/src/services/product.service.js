import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SizeGuide from '../models/SizeGuide.js';
import ApiError from '../utils/ApiError.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { logActivity } from './activityLog.service.js';
import {
  PRODUCT_STATUS,
  IMAGE_LIMITS,
} from '../constants/productStatus.js';
import {
  enrichProduct,
  normalizeSizeStock,
  syncProductStatusFromStock,
  sortImagesForStorefront,
} from '../utils/productHelpers.js';
import {
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
} from './cloudinary.service.js';
import { processRestockNotifications } from './stockNotification.service.js';

const assertCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(400, 'Invalid category');
  return category;
};

const assertSizeGuide = async (sizeGuideId) => {
  if (!sizeGuideId) return null;
  const sizeGuide = await SizeGuide.findOne({ _id: sizeGuideId, isActive: true });
  if (!sizeGuide) throw new ApiError(400, 'Invalid or inactive size guide');
  return sizeGuide;
};

const sizeGuidePopulate = {
  path: 'sizeGuideId',
  select: 'name slug sizes measurements image isDefault isActive',
};

const assertPublishable = (product) => {
  if (product.images.length < IMAGE_LIMITS.MIN) {
    throw new ApiError(400, `At least ${IMAGE_LIMITS.MIN} images required to publish`);
  }
};

const buildProductFilter = (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.categoryId) filter.categoryId = query.categoryId;
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === 'true';
  if (query.isNewArrival !== undefined) filter.isNewArrival = query.isNewArrival === 'true';
  if (query.search) filter.$text = { $search: query.search };

  return filter;
};

export const listProducts = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildProductFilter(query);
  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'name slug')
      .populate(sizeGuidePopulate)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map(enrichProduct),
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('categoryId', 'name slug')
    .populate(sizeGuidePopulate)
    .populate('createdBy', 'firstName lastName email');

  if (!product) throw new ApiError(404, 'Product not found');

  return enrichProduct(product);
};

export const createProduct = async (data, actor, req) => {
  await assertCategory(data.categoryId);
  await assertSizeGuide(data.sizeGuideId);

  const baseSlug = slugify(data.name);
  const slug = await uniqueSlug(Product, baseSlug);

  const existingSku = await Product.findOne({ sku: data.sku.toUpperCase() });
  if (existingSku) throw new ApiError(409, 'SKU already exists');

  const product = new Product({
    name: data.name,
    slug,
    sku: data.sku.toUpperCase(),
    description: data.description,
    categoryId: data.categoryId,
    mrp: data.mrp,
    sellingPrice: data.sellingPrice,
    sizeStock: normalizeSizeStock(data.sizeStock),
    images: data.images ?? [],
    status: data.status ?? PRODUCT_STATUS.DRAFT,
    brand: data.brand,
    tags: data.tags,
    isFeatured: data.isFeatured,
    isNewArrival: data.isNewArrival,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    sizeGuideId: data.sizeGuideId || null,
    createdBy: actor.id,
  });

  if (product.status === PRODUCT_STATUS.PUBLISHED) {
    assertPublishable(product);
  }

  syncProductStatusFromStock(product);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_CREATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { name: product.name, sku: product.sku },
    req,
  });

  return enrichProduct(product);
};

export const updateProduct = async (id, data, actor, req) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  if (data.categoryId) {
    await assertCategory(data.categoryId);
    product.categoryId = data.categoryId;
  }

  if (data.sizeGuideId !== undefined) {
    await assertSizeGuide(data.sizeGuideId);
    product.sizeGuideId = data.sizeGuideId || null;
  }

  if (data.name && data.name !== product.name) {
    product.name = data.name;
    product.slug = await uniqueSlug(Product, slugify(data.name), product._id);
  }

  if (data.sku && data.sku.toUpperCase() !== product.sku) {
    const existingSku = await Product.findOne({
      sku: data.sku.toUpperCase(),
      _id: { $ne: product._id },
    });
    if (existingSku) throw new ApiError(409, 'SKU already exists');
    product.sku = data.sku.toUpperCase();
  }

  const fields = [
    'description', 'mrp', 'sellingPrice', 'brand', 'tags', 'images',
    'isFeatured', 'isNewArrival', 'metaTitle', 'metaDescription',
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) product[field] = data[field];
  });

  const previousSizeStock = product.sizeStock.map((s) => ({
    size: s.size,
    stock: s.stock,
  }));

  if (data.sizeStock) {
    product.sizeStock = normalizeSizeStock(data.sizeStock);
  }

  if (data.status) {
    if (data.status === PRODUCT_STATUS.PUBLISHED) assertPublishable(product);
    product.status = data.status;
  }

  syncProductStatusFromStock(product);
  await product.save();

  if (data.sizeStock) {
    await processRestockNotifications(product._id, previousSizeStock);
  }

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { name: product.name },
    req,
  });

  return enrichProduct(product);
};

export const updateProductStatus = async (id, status, actor, req) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  if (status === PRODUCT_STATUS.PUBLISHED) {
    assertPublishable(product);
  }

  if (status === PRODUCT_STATUS.SOLD_OUT) {
    product.sizeStock.forEach((item) => {
      item.stock = 0;
    });
  }

  product.status = status;
  syncProductStatusFromStock(product);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_STATUS_CHANGED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { status: product.status },
    req,
  });

  return enrichProduct(product);
};

export const archiveProduct = async (id, actor, req) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  product.status = PRODUCT_STATUS.ARCHIVED;
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_STATUS_CHANGED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { status: PRODUCT_STATUS.ARCHIVED },
    req,
  });

  return enrichProduct(product);
};

export const deleteProduct = async (id, actor, req) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  const publicIds = product.images.map((img) => img.publicId).filter(Boolean);
  await deleteMultipleImages(publicIds);
  await product.deleteOne();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_DELETED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: id,
    metadata: { name: product.name, permanent: true },
    req,
  });

  return { deleted: true, id };
};

export const updateInventory = async (id, { sizeStock }, actor, req) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  const previousSizeStock = product.sizeStock.map((s) => ({
    size: s.size,
    stock: s.stock,
  }));

  product.sizeStock = normalizeSizeStock(sizeStock);
  syncProductStatusFromStock(product);
  await product.save();

  await processRestockNotifications(product._id, previousSizeStock);

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { sizeStock: product.sizeStock },
    req,
  });

  return enrichProduct(product);
};

export const uploadProductImages = async (productId, files, { type }, actor, req) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  if (product.images.length + files.length > IMAGE_LIMITS.MAX) {
    throw new ApiError(400, `Maximum ${IMAGE_LIMITS.MAX} images allowed per product`);
  }

  const uploaded = await uploadMultipleImages(files, { productId, type });

  const hasCover = product.images.some((img) => img.isCover);
  const startOrder = product.images.length;
  const newImages = uploaded.map((img, index) => ({
    url: img.url,
    publicId: img.publicId,
    type,
    sortOrder: startOrder + index,
    isCover:
      (!hasCover && type === 'front_view' && index === 0) ||
      (product.images.length === 0 && index === 0),
  }));

  product.images.push(...newImages);
  product.images = sortImagesForStorefront(product.images);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { action: 'images_uploaded', count: newImages.length },
    req,
  });

  return enrichProduct(product);
};

export const uploadStandaloneImages = async (files, { type, productId }, actor, req) => {
  const uploaded = await uploadMultipleImages(files, { productId, type });

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    metadata: { action: 'standalone_images_uploaded', count: uploaded.length },
    req,
  });

  return uploaded.map((img) => ({
    url: img.url,
    publicId: img.publicId,
    type,
  }));
};

export const deleteProductImage = async (productId, publicId, actor, req) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const imageIndex = product.images.findIndex((img) => img.publicId === publicId);
  if (imageIndex === -1) throw new ApiError(404, 'Image not found on this product');

  if (
    product.status !== PRODUCT_STATUS.DRAFT &&
    product.images.length - 1 < IMAGE_LIMITS.MIN
  ) {
    throw new ApiError(
      400,
      `Cannot delete image. Minimum ${IMAGE_LIMITS.MIN} images required for non-draft products`
    );
  }

  const [removed] = product.images.splice(imageIndex, 1);
  await deleteImage(removed.publicId);

  if (removed.isCover && product.images.length > 0) {
    product.images[0].isCover = true;
  }

  product.images = sortImagesForStorefront(product.images);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { action: 'image_deleted', publicId },
    req,
  });

  return enrichProduct(product);
};

export const reorderProductImages = async (productId, imageOrder, actor, req) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  if (imageOrder.length !== product.images.length) {
    throw new ApiError(400, 'imageOrder must include all product images');
  }

  const imageMap = new Map(product.images.map((img) => [img.publicId, img]));
  const reordered = imageOrder.map((publicId, index) => {
    const img = imageMap.get(publicId);
    if (!img) throw new ApiError(400, `Image not found: ${publicId}`);
    img.sortOrder = index;
    return img;
  });

  product.images = sortImagesForStorefront(reordered);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { action: 'images_reordered' },
    req,
  });

  return enrichProduct(product);
};

export const setCoverImage = async (productId, publicId, actor, req) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const target = product.images.find((img) => img.publicId === publicId);
  if (!target) throw new ApiError(404, 'Image not found on this product');

  product.images.forEach((img) => {
    img.isCover = img.publicId === publicId;
  });

  product.images = sortImagesForStorefront(product.images);
  await product.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.PRODUCT_UPDATED,
    resource: AUDIT_RESOURCES.PRODUCT,
    resourceId: product._id,
    metadata: { action: 'cover_image_set', publicId },
    req,
  });

  return enrichProduct(product);
};

export const listCategories = async () => {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
};

export default {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  archiveProduct,
  deleteProduct,
  updateInventory,
  uploadProductImages,
  uploadStandaloneImages,
  deleteProductImage,
  reorderProductImages,
  setCoverImage,
  listCategories,
};
