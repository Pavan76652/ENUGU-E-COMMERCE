import mongoose from 'mongoose';
import {
  PRODUCT_STATUS,
  PRODUCT_SIZES,
  ALL_IMAGE_TYPES,
  IMAGE_LIMITS,
} from '../constants/productStatus.js';
import {
  calculateDiscountPercentage,
  syncProductStatusFromStock,
  sortImagesForStorefront,
  normalizeSizeStock,
  buildStorefrontInventory,
} from '../utils/productHelpers.js';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ALL_IMAGE_TYPES, default: 'additional' },
    alt: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isCover: { type: Boolean, default: false },
  },
  { _id: true }
);

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, enum: PRODUCT_SIZES, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    sizeStock: {
      type: [sizeStockSchema],
      validate: {
        validator(v) {
          return v.length === PRODUCT_SIZES.length;
        },
        message: `sizeStock must include all sizes: ${PRODUCT_SIZES.join(', ')}`,
      },
    },
    images: {
      type: [imageSchema],
      validate: {
        validator(v) {
          if (!v.length) return true;
          return v.length >= IMAGE_LIMITS.MIN && v.length <= IMAGE_LIMITS.MAX;
        },
        message: `Product must have between ${IMAGE_LIMITS.MIN} and ${IMAGE_LIMITS.MAX} images when provided`,
      },
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.DRAFT,
      index: true,
    },
    brand: { type: String, default: 'ENUGU' },
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false, index: true },
    metaTitle: String,
    metaDescription: String,
    sizeGuideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SizeGuide',
      default: null,
      index: true,
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    totalSold: { type: Number, default: 0, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ status: 1, createdAt: -1 });

productSchema.virtual('totalStock').get(function totalStock() {
  return this.sizeStock.reduce((sum, item) => sum + item.stock, 0);
});

productSchema.virtual('storefrontInventory').get(function storefrontInventory() {
  return buildStorefrontInventory(this.sizeStock);
});

productSchema.pre('validate', function preValidate(next) {
  if (this.mrp != null && this.sellingPrice != null) {
    if (this.sellingPrice > this.mrp) {
      return next(new Error('Selling price cannot exceed MRP'));
    }
    this.discountPercentage = calculateDiscountPercentage(this.mrp, this.sellingPrice);
  }

  if (this.sizeStock?.length) {
    this.sizeStock = normalizeSizeStock(this.sizeStock);
    syncProductStatusFromStock(this);
  }

  if (this.images?.length) {
    const coverCount = this.images.filter((img) => img.isCover).length;
    if (coverCount === 0 && this.images.length > 0) {
      this.images[0].isCover = true;
    }
    if (coverCount > 1) {
      let foundCover = false;
      this.images.forEach((img) => {
        if (img.isCover && !foundCover) foundCover = true;
        else img.isCover = false;
      });
    }
    this.images = sortImagesForStorefront(this.images);
    this.images.forEach((img, index) => {
      img.sortOrder = index;
    });
  }

  next();
});

productSchema.methods.getStorefrontImages = function getStorefrontImages() {
  return sortImagesForStorefront(this.images);
};

const Product = mongoose.model('Product', productSchema);
export default Product;
