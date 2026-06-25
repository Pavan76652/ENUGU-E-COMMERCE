import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import * as productService from '../../services/product.service.js';

export const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.status(200).json(new ApiResponse(200, result.products, 'Products fetched', result.meta));
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json(new ApiResponse(200, { product }, 'Product fetched'));
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user, req);
  res.status(201).json(new ApiResponse(201, { product }, 'Product created'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { product }, 'Product updated'));
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const product = await productService.updateProductStatus(
    req.params.id,
    req.body.status,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { product }, 'Product status updated'));
});

export const archiveProduct = asyncHandler(async (req, res) => {
  const product = await productService.archiveProduct(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, { product }, 'Product archived'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, result, 'Product permanently deleted'));
});

export const updateInventory = asyncHandler(async (req, res) => {
  const product = await productService.updateInventory(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { product }, 'Inventory updated'));
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    throw new ApiError(400, 'At least one image file is required');
  }

  const product = await productService.uploadProductImages(
    req.params.id,
    req.files,
    { type: req.body.type || 'additional' },
    req.user,
    req
  );

  res.status(200).json(new ApiResponse(200, { product }, 'Images uploaded'));
});

export const uploadStandaloneImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    throw new ApiError(400, 'At least one image file is required');
  }

  const images = await productService.uploadStandaloneImages(
    req.files,
    { type: req.body.type || 'additional', productId: req.query.productId },
    req.user,
    req
  );

  res.status(201).json(new ApiResponse(201, { images }, 'Images uploaded to Cloudinary'));
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await productService.deleteProductImage(
    req.params.id,
    req.body.publicId,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { product }, 'Image deleted'));
});

export const reorderProductImages = asyncHandler(async (req, res) => {
  const product = await productService.reorderProductImages(
    req.params.id,
    req.body.imageOrder,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { product }, 'Images reordered'));
});

export const setCoverImage = asyncHandler(async (req, res) => {
  const product = await productService.setCoverImage(
    req.params.id,
    req.body.publicId,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { product }, 'Cover image updated'));
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await productService.listCategories();
  res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched'));
});
