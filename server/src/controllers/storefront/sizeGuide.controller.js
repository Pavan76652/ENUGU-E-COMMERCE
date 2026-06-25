import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as sizeGuideService from '../../services/sizeGuide.service.js';

export const getDefaultSizeGuide = asyncHandler(async (_req, res) => {
  const sizeGuide = await sizeGuideService.getDefaultSizeGuide();
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Default size guide fetched'));
});

export const getSizeGuide = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.getActiveSizeGuideById(req.params.id);
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide fetched'));
});
