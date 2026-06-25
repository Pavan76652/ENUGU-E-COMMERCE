import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as dashboardService from '../../services/dashboard.service.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, data, 'Dashboard data fetched'));
});
