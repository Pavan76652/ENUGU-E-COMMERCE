import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';
import { enrichProduct } from '../utils/productHelpers.js';
import { buildProductSeo } from '../utils/seoHelpers.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { resolveProductSizeGuide, sizeGuidePublicSelect } from './sizeGuide.service.js';
import { cacheWrap } from '../utils/cache.js';

const STOREFRONT_STATUSES = [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT];
const CATEGORIES_CACHE_TTL_MS = 60_000;
const COLLECTIONS_CACHE_TTL_MS = 60_000;

const buildStorefrontFilter = (query) => {
  const filter = { status: { $in: STOREFRONT_STATUSES } };

  if (query.category) {
    filter.categoryId = query.category;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.minPrice || query.maxPrice) {
    filter.sellingPrice = {};
    if (query.minPrice) filter.sellingPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.sellingPrice.$lte = Number(query.maxPrice);
  }

  if (query.availability === 'in_stock') {
    filter.status = PRODUCT_STATUS.PUBLISHED;
  }

  if (query.availability === 'sold_out') {
    filter.status = PRODUCT_STATUS.SOLD_OUT;
  }

  if (query.isNewArrival === 'true') {
    filter.isNewArrival = true;
  }

  if (query.isFeatured === 'true') {
    filter.isFeatured = true;
  }

  return filter;
};

const parseStorefrontSort = (sort) => {
  const map = {
    newest: { sortBy: 'createdAt', sortOrder: 'desc' },
    'best-selling': { sortBy: 'totalSold', sortOrder: 'desc' },
    'price-low': { sortBy: 'sellingPrice', sortOrder: 'asc' },
    'price-high': { sortBy: 'sellingPrice', sortOrder: 'desc' },
  };

  return map[sort] ?? map.newest;
};

const filterBySize = (products, size) => {
  if (!size) return products;
  return products.filter((p) => {
    const stock = p.sizeStock?.find((s) => s.size === size);
    return stock && stock.stock > 0;
  });
};

export const listStorefrontProducts = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const resolvedQuery = { ...query };

  if (query.categorySlug && !query.category) {
    const category = await Category.findOne({ slug: query.categorySlug, isActive: true }).lean();
    if (!category) {
      return { products: [], meta: buildPaginationMeta(0, page, limit) };
    }
    resolvedQuery.category = category._id.toString();
  }

  const filter = buildStorefrontFilter(resolvedQuery);
  const { sortBy, sortOrder } = parseStorefrontSort(query.sort);
  const sort = parseSort(sortBy, sortOrder);

  let [products, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  if (query.size) {
    products = filterBySize(products, query.size);
    total = products.length;
  }

  return {
    products: products.map(enrichProduct),
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getStorefrontProductBySlug = async (slug) => {
  const product = await Product.findOne({
    slug,
    status: { $in: STOREFRONT_STATUSES },
  })
    .populate('categoryId', 'name slug')
    .populate({ path: 'sizeGuideId', select: sizeGuidePublicSelect });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const enriched = enrichProduct(product);
  const sizeGuide = await resolveProductSizeGuide(product);

  return {
    ...enriched,
    sizeGuide,
    seo: buildProductSeo(enriched),
  };
};

export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
  const products = await Product.find({
    _id: { $ne: productId },
    categoryId,
    status: { $in: STOREFRONT_STATUSES },
  })
    .populate('categoryId', 'name slug')
    .sort({ totalSold: -1 })
    .limit(limit)
    .lean();

  return products.map(enrichProduct);
};

export const listStorefrontCategories = async () => {
  return cacheWrap('storefront:categories', CATEGORIES_CACHE_TTL_MS, () =>
    Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
  );
};

export const listStorefrontCollections = async () =>
  cacheWrap('storefront:collections', COLLECTIONS_CACHE_TTL_MS, async () => {
  const [categories, counts] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Product.aggregate([
      { $match: { status: { $in: STOREFRONT_STATUSES } } },
      { $group: { _id: '$categoryId', productCount: { $sum: 1 } } },
    ]),
  ]);

  const countMap = Object.fromEntries(
    counts.map((row) => [row._id.toString(), row.productCount])
  );

  const withProducts = categories.filter((cat) => (countMap[cat._id.toString()] ?? 0) > 0);

  const collections = await Promise.all(
    withProducts.map(async (category) => {
      const sample = await Product.findOne({
        categoryId: category._id,
        status: { $in: STOREFRONT_STATUSES },
      })
        .select('images')
        .sort({ createdAt: -1 })
        .lean();

      const cover =
        sample?.images?.find((img) => img.isCover)?.url ??
        sample?.images?.[0]?.url ??
        category.image?.url ??
        null;

      return {
        ...category,
        productCount: countMap[category._id.toString()],
        coverImage: cover,
      };
    })
  );

    return collections;
  });

export const getStorefrontCollectionBySlug = async (slug, query = {}) => {
  const category = await Category.findOne({ slug, isActive: true }).lean();

  if (!category) {
    throw new ApiError(404, 'Collection not found');
  }

  const productCount = await Product.countDocuments({
    categoryId: category._id,
    status: { $in: STOREFRONT_STATUSES },
  });

  if (productCount === 0) {
    throw new ApiError(404, 'Collection not found');
  }

  const result = await listStorefrontProducts({
    ...query,
    category: category._id.toString(),
  });

  return { category, ...result };
};

export default {
  listStorefrontProducts,
  getStorefrontProductBySlug,
  getRelatedProducts,
  listStorefrontCategories,
  listStorefrontCollections,
  getStorefrontCollectionBySlug,
};
