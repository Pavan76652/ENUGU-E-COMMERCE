import env from '../config/env.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../constants/roles.js';
import * as authService from '../services/auth.service.js';

const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: 0 });
};

const sendAuthResponse = (res, result, message, statusCode = 200) => {
  setRefreshCookie(res, result.refreshToken);

  res.status(statusCode).json(
    new ApiResponse(statusCode, {
      user: result.user,
      accessToken: result.accessToken,
    }, message)
  );
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerCustomer(req.body);
  sendAuthResponse(res, result, 'Registration successful', 201);
});

export const loginCustomer = asyncHandler(async (req, res) => {
  const result = await authService.login({
    ...req.body,
    expectedRole: ROLES.CUSTOMER,
  });
  sendAuthResponse(res, result, 'Login successful');
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const result = await authService.login({
    ...req.body,
    expectedRole: ROLES.ADMIN,
  });
  sendAuthResponse(res, result, 'Admin login successful');
});

export const loginSuperAdmin = asyncHandler(async (req, res) => {
  const result = await authService.login({
    ...req.body,
    expectedRole: ROLES.SUPER_ADMIN,
  });
  sendAuthResponse(res, result, 'Super admin login successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies[REFRESH_COOKIE] || req.body.refreshToken;
  const result = await authService.refreshAccessToken(token);
  sendAuthResponse(res, result, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  clearRefreshCookie(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile fetched'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await authService.changePassword(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Password changed successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword({ token, password });
  sendAuthResponse(res, result, 'Password reset successful');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body.token);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const resendVerification = asyncHandler(async (req, res) => {
  const result = await authService.resendEmailVerification(req.user.id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// Protected route examples for role-based authorization
export const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, 'Admin profile fetched'));
});

export const getSuperAdminProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, 'Super admin profile fetched'));
});
