import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as wishlistService from '../../services/wishlist.service.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.getUserWishlist(req.user.id);
  res.status(200).json(new ApiResponse(200, result, 'Wishlist fetched'));
});

export const addItem = asyncHandler(async (req, res) => {
  const result = await wishlistService.addToWishlist(req.user.id, req.body.productId);
  res.status(200).json(new ApiResponse(200, result, 'Added to wishlist'));
});

export const removeItem = asyncHandler(async (req, res) => {
  const result = await wishlistService.removeFromWishlist(
    req.user.id,
    req.params.productId
  );
  res.status(200).json(new ApiResponse(200, result, 'Removed from wishlist'));
});

export const syncWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.syncWishlist(req.user.id, req.body.items);
  res.status(200).json(new ApiResponse(200, result, 'Wishlist synced'));
});
