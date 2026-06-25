import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as designRequestService from '../../services/designRequest.service.js';

export const createDesignRequest = asyncHandler(async (req, res) => {
  const request = await designRequestService.createDesignRequest(
    req.body,
    req.file,
    req.user?.id
  );

  res.status(201).json(
    new ApiResponse(201, { request }, 'Design request submitted successfully')
  );
});
