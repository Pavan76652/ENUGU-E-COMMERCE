import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as analyticsService from '../../services/analytics.service.js';

export const getOverview = asyncHandler(async (_req, res) => {
  const data = await analyticsService.getOverviewAnalytics();
  res.status(200).json(new ApiResponse(200, data, 'Analytics overview fetched'));
});

export const getSales = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSalesAnalytics(req.query);
  res.status(200).json(new ApiResponse(200, data, 'Sales analytics fetched'));
});

export const getProducts = asyncHandler(async (req, res) => {
  const data = await analyticsService.getProductAnalytics(req.query);
  res.status(200).json(new ApiResponse(200, data, 'Product analytics fetched'));
});

export const getCustomers = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCustomerAnalytics(req.query);
  res.status(200).json(new ApiResponse(200, data, 'Customer analytics fetched'));
});

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardAnalytics(req.query);
  res.status(200).json(new ApiResponse(200, data, 'Analytics dashboard fetched'));
});
