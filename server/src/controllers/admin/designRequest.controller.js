import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as designRequestService from '../../services/designRequest.service.js';

export const listDesignRequests = asyncHandler(async (req, res) => {
  const result = await designRequestService.listDesignRequests(req.query);
  res.status(200).json(
    new ApiResponse(200, result.requests, 'Design requests fetched', result.meta)
  );
});

export const getDesignRequest = asyncHandler(async (req, res) => {
  const request = await designRequestService.getDesignRequestById(req.params.id);
  res.status(200).json(new ApiResponse(200, { request }, 'Design request fetched'));
});

export const updateDesignRequest = asyncHandler(async (req, res) => {
  const request = await designRequestService.updateDesignRequest(
    req.params.id,
    req.body,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { request }, 'Design request updated'));
});
