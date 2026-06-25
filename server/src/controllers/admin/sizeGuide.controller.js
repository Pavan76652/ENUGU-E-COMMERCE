import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as sizeGuideService from '../../services/sizeGuide.service.js';

export const listSizeGuides = asyncHandler(async (req, res) => {
  const result = await sizeGuideService.listSizeGuides(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result.sizeGuides, 'Size guides fetched', result.meta));
});

export const listSizeGuideOptions = asyncHandler(async (_req, res) => {
  const sizeGuides = await sizeGuideService.listActiveSizeGuideOptions();
  res.status(200).json(new ApiResponse(200, { sizeGuides }, 'Size guide options fetched'));
});

export const getSizeGuide = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.getSizeGuideById(req.params.id);
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide fetched'));
});

export const createSizeGuide = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.createSizeGuide(req.body, req.user, req);
  res.status(201).json(new ApiResponse(201, { sizeGuide }, 'Size guide created'));
});

export const updateSizeGuide = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.updateSizeGuide(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide updated'));
});

export const uploadSizeGuideImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'Size guide image file is required'));
  }

  const sizeGuide = await sizeGuideService.uploadSizeGuideImage(
    req.params.id,
    req.file,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide image uploaded'));
});

export const deleteSizeGuideImage = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.deleteSizeGuideImage(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide image deleted'));
});

export const deleteSizeGuide = asyncHandler(async (req, res) => {
  const sizeGuide = await sizeGuideService.deleteSizeGuide(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, { sizeGuide }, 'Size guide deleted'));
});
