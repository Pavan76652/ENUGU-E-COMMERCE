import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';
import { buildStorefrontInventory } from '../utils/productHelpers.js';

const getCoverImage = (product) => {
  const cover = product.images?.find((img) => img.isCover) ?? product.images?.[0];
  return cover?.url ?? '';
};

const formatWishlistItem = (product, addedAt) => {
  const inventory = buildStorefrontInventory(product.sizeStock ?? []);

  return {
    id: product._id.toString(),
    productId: product._id.toString(),
    slug: product.slug,
    name: product.name,
    image: getCoverImage(product),
    price: product.sellingPrice,
    mrp: product.mrp,
    discountPercentage: product.discountPercentage,
    status: product.status,
    inventory,
    addedAt,
  };
};

const enrichWishlist = async (wishlist) => {
  if (!wishlist?.items?.length) return [];

  const productIds = wishlist.items.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    status: { $in: [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT] },
  }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const addedMap = new Map(
    wishlist.items.map((item) => [item.productId.toString(), item.addedAt])
  );

  const items = [];
  for (const [productId, addedAt] of addedMap) {
    const product = productMap.get(productId);
    if (product) {
      items.push(formatWishlistItem(product, addedAt));
    }
  }

  return items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }

  return wishlist;
};

export const getUserWishlist = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const items = await enrichWishlist(wishlist);
  return { items };
};

export const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (![PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT].includes(product.status)) {
    throw new ApiError(400, 'Product is not available');
  }

  const wishlist = await getOrCreateWishlist(userId);
  const exists = wishlist.items.some((item) => item.productId.toString() === productId);

  if (!exists) {
    wishlist.items.push({ productId, addedAt: new Date() });
    await wishlist.save();
  }

  const items = await enrichWishlist(wishlist);
  return { items };
};

export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await getOrCreateWishlist(userId);
  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await wishlist.save();

  const items = await enrichWishlist(wishlist);
  return { items };
};

export const syncWishlist = async (userId, localItems = []) => {
  const wishlist = await getOrCreateWishlist(userId);
  const existingIds = new Set(wishlist.items.map((item) => item.productId.toString()));

  for (const item of localItems) {
    const productId = item.productId ?? item.id;
    if (!productId || existingIds.has(productId.toString())) continue;

    const product = await Product.findById(productId);
    if (
      product &&
      [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT].includes(product.status)
    ) {
      wishlist.items.push({ productId: product._id, addedAt: new Date() });
      existingIds.add(product._id.toString());
    }
  }

  await wishlist.save();
  const items = await enrichWishlist(wishlist);
  return { items };
};

export default {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  syncWishlist,
};
