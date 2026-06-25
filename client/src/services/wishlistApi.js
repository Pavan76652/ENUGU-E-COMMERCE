import api from './api';

const unwrap = (response) => response.data?.data ?? response.data;

const getProductId = (product) =>
  product.productId ?? product.id ?? product._id;

export const wishlistApi = {
  get: () => api.get('/wishlist').then(unwrap),
  add: (productId) => api.post('/wishlist', { productId }).then(unwrap),
  remove: (productId) => api.delete(`/wishlist/${productId}`).then(unwrap),
  sync: (items) => api.post('/wishlist/sync', { items }).then(unwrap),
};

export const normalizeWishlistProduct = (product) => ({
  id: getProductId(product)?.toString(),
  productId: getProductId(product)?.toString(),
  slug: product.slug,
  name: product.name,
  image: product.image ?? product.images?.[0]?.url,
  price: product.price ?? product.sellingPrice,
  mrp: product.mrp,
  discountPercentage: product.discountPercentage,
  status: product.status,
  inventory: product.inventory,
});

export default wishlistApi;
