import { wishlistApi, normalizeWishlistProduct } from './wishlistApi';

const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

const filterSyncable = (items = []) =>
  items.filter((item) => isValidObjectId(item.productId ?? item.id));

export const wishlistService = {
  async fetch() {
    try {
      const result = await wishlistApi.get();
      return (result.items ?? []).map(normalizeWishlistProduct);
    } catch {
      return null;
    }
  },

  async syncLocalItems(localItems) {
    try {
      const items = filterSyncable(localItems);
      const result = await wishlistApi.sync(items);
      return (result.items ?? []).map(normalizeWishlistProduct);
    } catch {
      return null;
    }
  },

  async add(product) {
    const productId = product.productId ?? product.id ?? product._id;
    if (!isValidObjectId(productId)) {
      return null;
    }
    const result = await wishlistApi.add(productId);
    return (result.items ?? []).map(normalizeWishlistProduct);
  },

  async remove(productId) {
    const result = await wishlistApi.remove(productId);
    return (result.items ?? []).map(normalizeWishlistProduct);
  },
};

export default wishlistService;
