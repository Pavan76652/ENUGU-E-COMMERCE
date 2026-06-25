import { z } from 'zod';
import {
  ALL_PRODUCT_STATUSES,
  PRODUCT_SIZES,
  ALL_IMAGE_TYPES,
  IMAGE_LIMITS,
} from '../constants/productStatus.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const sizeStockItemSchema = z.object({
  size: z.enum(PRODUCT_SIZES),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
});

const sizeStockSchema = z
  .array(sizeStockItemSchema)
  .length(PRODUCT_SIZES.length, `Must include stock for: ${PRODUCT_SIZES.join(', ')}`)
  .refine(
    (items) => new Set(items.map((i) => i.size)).size === PRODUCT_SIZES.length,
    'Each size must appear exactly once'
  );

const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  type: z.enum(ALL_IMAGE_TYPES).optional().default('additional'),
  alt: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isCover: z.boolean().optional().default(false),
});

const baseProductFields = {
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  sku: z.string().min(2).max(50),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: objectId,
  mrp: z.number().positive('MRP must be greater than 0'),
  sellingPrice: z.number().positive('Selling price must be greater than 0'),
  sizeStock: sizeStockSchema,
  images: z
    .array(productImageSchema)
    .min(IMAGE_LIMITS.MIN, `Minimum ${IMAGE_LIMITS.MIN} images required`)
    .max(IMAGE_LIMITS.MAX, `Maximum ${IMAGE_LIMITS.MAX} images allowed`)
    .optional(),
  status: z.enum(ALL_PRODUCT_STATUSES).optional().default('draft'),
  brand: z.string().optional().default('ENUGU'),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  sizeGuideId: z
    .union([objectId, z.literal(''), z.null()])
    .optional()
    .transform((value) => value || null),
};

export const createProductSchema = z
  .object(baseProductFields)
  .refine((data) => data.sellingPrice <= data.mrp, {
    message: 'Selling price cannot exceed MRP',
    path: ['sellingPrice'],
  })
  .refine(
    (data) => {
      if (data.status === 'published' || data.status === 'sold_out') {
        return data.images && data.images.length >= IMAGE_LIMITS.MIN;
      }
      return true;
    },
    {
      message: `Published products require at least ${IMAGE_LIMITS.MIN} images`,
      path: ['images'],
    }
  );

export const updateProductSchema = z
  .object({
    name: baseProductFields.name.optional(),
    sku: baseProductFields.sku.optional(),
    description: baseProductFields.description.optional(),
    categoryId: baseProductFields.categoryId.optional(),
    mrp: baseProductFields.mrp.optional(),
    sellingPrice: baseProductFields.sellingPrice.optional(),
    sizeStock: sizeStockSchema.optional(),
    images: z
      .array(productImageSchema)
      .min(IMAGE_LIMITS.MIN)
      .max(IMAGE_LIMITS.MAX)
      .optional(),
    status: baseProductFields.status.optional(),
    brand: baseProductFields.brand.optional(),
    tags: baseProductFields.tags.optional(),
    isFeatured: baseProductFields.isFeatured.optional(),
    isNewArrival: baseProductFields.isNewArrival.optional(),
    metaTitle: baseProductFields.metaTitle.optional(),
    metaDescription: baseProductFields.metaDescription.optional(),
    sizeGuideId: baseProductFields.sizeGuideId.optional(),
  })
  .refine(
    (data) => {
      if (data.mrp != null && data.sellingPrice != null) {
        return data.sellingPrice <= data.mrp;
      }
      return true;
    },
    { message: 'Selling price cannot exceed MRP', path: ['sellingPrice'] }
  );

export const productStatusSchema = z.object({
  status: z.enum(ALL_PRODUCT_STATUSES),
});

export const inventoryUpdateSchema = z.object({
  sizeStock: sizeStockSchema,
});

export const reorderImagesSchema = z.object({
  imageOrder: z
    .array(z.string().min(1))
    .min(IMAGE_LIMITS.MIN)
    .max(IMAGE_LIMITS.MAX),
});

export const setCoverImageSchema = z.object({
  publicId: z.string().min(1, 'publicId is required'),
});

export const deleteImageSchema = z.object({
  publicId: z.string().min(1, 'publicId is required'),
});

export const uploadImagesBodySchema = z.object({
  type: z.enum(ALL_IMAGE_TYPES).optional().default('additional'),
});

export const uploadImagesQuerySchema = z.object({
  productId: objectId.optional(),
});
