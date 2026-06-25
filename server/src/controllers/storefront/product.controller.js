import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as storefrontService from '../../services/storefront.service.js';

export const listProducts = asyncHandler(async (req, res) => {
  const result = await storefrontService.listStorefrontProducts(req.query);
  res.status(200).json(new ApiResponse(200, result.products, 'Products fetched', result.meta));
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await storefrontService.getStorefrontProductBySlug(req.params.slug);

  const related = await storefrontService.getRelatedProducts(
    product._id,
    product.categoryId?._id ?? product.categoryId,
    4
  );

  res.status(200).json(
    new ApiResponse(200, { product, related }, 'Product fetched')
  );
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await storefrontService.listStorefrontCategories();
  res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched'));
});

export const listCollections = asyncHandler(async (_req, res) => {
  const collections = await storefrontService.listStorefrontCollections();
  res.status(200).json(new ApiResponse(200, { collections }, 'Collections fetched'));
});

export const getCollectionBySlug = asyncHandler(async (req, res) => {
  const result = await storefrontService.getStorefrontCollectionBySlug(
    req.params.slug,
    req.query
  );
  res.status(200).json(
    new ApiResponse(
      200,
      { category: result.category, products: result.products },
      'Collection fetched',
      result.meta
    )
  );
});
