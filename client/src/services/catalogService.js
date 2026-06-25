import { productApi } from './productApi';
import { normalizeProduct } from '../utils/productUtils';

const parseListResponse = (res) => ({
  products: (res.data ?? res.products ?? []).map(normalizeProduct),
  meta: res.meta ?? { total: (res.data ?? res.products ?? []).length },
});

const parseDetailResponse = (res) => {
  const payload = res.data ?? res;
  const product = payload.product ?? payload;
  const related = payload.related ?? [];
  return {
    product: normalizeProduct(product),
    related: related.map(normalizeProduct),
    reviews: product.reviews ?? [],
    seo: payload.product?.seo ?? product.seo ?? null,
  };
};

export const catalogService = {
  getCategories: async () => {
    const res = await productApi.getCategories();
    return res.data?.categories ?? res.categories ?? [];
  },

  getCollections: async () => {
    const res = await productApi.getCollections();
    return res.data?.collections ?? res.collections ?? [];
  },

  getCollectionBySlug: async (slug, params = {}) => {
    const res = await productApi.getCollectionBySlug(slug, params);
    const payload = res.data ?? res;
    return {
      category: payload.category,
      products: (payload.products ?? []).map(normalizeProduct),
      meta: res.meta ?? { total: (payload.products ?? []).length },
    };
  },

  getProducts: async (params = {}) => {
    const res = await productApi.getProducts(params);
    return parseListResponse(res);
  },

  getProductBySlug: async (slug) => {
    const res = await productApi.getProductBySlug(slug);
    return parseDetailResponse(res);
  },
};

export default catalogService;
