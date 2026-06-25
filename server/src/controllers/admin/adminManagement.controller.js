import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as adminService from '../../services/adminManagement.service.js';

export const listAdmins = asyncHandler(async (req, res) => {
  const result = await adminService.listAdmins(req.query);
  res.status(200).json(new ApiResponse(200, result.admins, 'Admins fetched', result.meta));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.createAdmin(req.body, req.user, req);
  res.status(201).json(new ApiResponse(201, { admin }, 'Admin created'));
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { admin }, 'Admin updated'));
});

export const setAdminStatus = asyncHandler(async (req, res) => {
  const admin = await adminService.setAdminStatus(
    req.params.id,
    req.body.isActive,
    req.user,
    req
  );
  res.status(200).json(
    new ApiResponse(200, { admin }, req.body.isActive ? 'Admin enabled' : 'Admin disabled')
  );
});
