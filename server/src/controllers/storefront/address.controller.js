import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as addressService from '../../services/address.service.js';

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.listAddresses(req.user.id);
  res.status(200).json(new ApiResponse(200, { addresses }, 'Addresses fetched'));
});

export const addAddress = asyncHandler(async (req, res) => {
  const address = await addressService.addAddress(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { address }, 'Address added'));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(
    req.user.id,
    req.params.addressId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, { address }, 'Address updated'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await addressService.deleteAddress(req.user.id, req.params.addressId);
  res.status(200).json(new ApiResponse(200, null, 'Address deleted'));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressService.setDefaultAddress(
    req.user.id,
    req.params.addressId
  );
  res.status(200).json(new ApiResponse(200, { address }, 'Default address set'));
});
