import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as customerService from '../../services/customer.service.js';

export const listCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.query);
  res.status(200).json(new ApiResponse(200, result.customers, 'Customers fetched', result.meta));
});

export const getCustomer = asyncHandler(async (req, res) => {
  const data = await customerService.getCustomerById(req.params.id);
  res.status(200).json(new ApiResponse(200, data, 'Customer fetched'));
});

export const setCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await customerService.setCustomerStatus(req.params.id, req.body.isActive);
  res.status(200).json(
    new ApiResponse(200, { customer }, req.body.isActive ? 'Customer enabled' : 'Customer disabled')
  );
});
