import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as activityLogService from '../../services/activityLog.service.js';

export const listActivityLogs = asyncHandler(async (req, res) => {
  const result = await activityLogService.getActivityLogs(req.query);
  res.status(200).json(new ApiResponse(200, result.logs, 'Activity logs fetched', result.meta));
});
