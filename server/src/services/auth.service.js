import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { hashToken } from '../utils/hashToken.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/generateToken.js';
import { ROLES } from '../constants/roles.js';
import { sendPasswordResetEmail, sendEmailVerification } from './email.service.js';
import logger from '../config/logger.js';

const sanitizeUser = (user) => {
  const obj = user.toJSON ? user.toJSON() : user;
  return {
    id: obj._id ?? obj.id,
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
    phone: obj.phone,
    role: obj.role,
    permissions: obj.permissions ?? [],
    avatar: obj.avatar,
    isEmailVerified: obj.isEmailVerified,
    isActive: obj.isActive,
    lastLoginAt: obj.lastLoginAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const issueAuthResponse = async (user) => {
  const tokens = generateTokenPair(user);
  user.refreshToken = hashToken(tokens.refreshToken);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return {
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const assertAccountActive = (user) => {
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact support.');
  }
};

const assertRoleMatch = (user, expectedRole) => {
  if (
    expectedRole === ROLES.ADMIN &&
    (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN)
  ) {
    return;
  }

  if (user.role !== expectedRole) {
    const messages = {
      [ROLES.CUSTOMER]: 'Please use the customer login portal',
      [ROLES.ADMIN]: 'Please use the admin login portal',
      [ROLES.SUPER_ADMIN]: 'Please use the super admin login portal',
    };

    throw new ApiError(403, messages[expectedRole] ?? 'Invalid login portal for this account');
  }
};

export const registerCustomer = async ({ firstName, lastName, email, phone, password }) => {
  const existing = await User.findByEmail(email);

  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: ROLES.CUSTOMER,
  });

  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  sendEmailVerification({
    email: user.email,
    firstName: user.firstName,
    verifyToken,
  }).catch((error) => {
    logger.error({ err: error, email: user.email }, 'Verification email failed');
  });

  return issueAuthResponse(user);
};

export const verifyEmail = async (token) => {
  if (!token) {
    throw new ApiError(400, 'Verification token is required');
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new ApiError(400, 'Verification link is invalid or has expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { message: 'Email verified successfully' };
};

export const resendEmailVerification = async (userId) => {
  const user = await User.findById(userId).select(
    '+emailVerificationToken +emailVerificationExpires'
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isEmailVerified) {
    return { message: 'Email is already verified' };
  }

  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendEmailVerification({
    email: user.email,
    firstName: user.firstName,
    verifyToken,
  });

  return { message: 'Verification email sent' };
};

export const login = async ({ email, password, expectedRole }) => {
  const user = await User.findByEmailWithPassword(email).select('+refreshToken');

  assertAccountActive(user);

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  assertRoleMatch(user, expectedRole);

  return issueAuthResponse(user);
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshToken');

  assertAccountActive(user);

  const hashed = hashToken(refreshToken);

  if (!user.refreshToken || user.refreshToken !== hashed) {
    throw new ApiError(401, 'Refresh token revoked or invalid');
  }

  return issueAuthResponse(user);
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  assertAccountActive(user);

  return sanitizeUser(user);
};

export const verifyActiveUser = async (userId) => {
  const user = await User.findById(userId).select('email role permissions isActive');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Account inactive or not found');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    permissions: user.permissions ?? [],
  };
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  assertAccountActive(user);

  if (data.firstName !== undefined) user.firstName = data.firstName;
  if (data.lastName !== undefined) user.lastName = data.lastName;
  if (data.phone !== undefined) user.phone = data.phone;

  await user.save();

  return sanitizeUser(user);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();

  return sanitizeUser(user);
};

export const forgotPassword = async (email) => {
  const user = await User.findByEmailWithPassword(email).select(
    '+passwordResetToken +passwordResetExpires'
  );

  // Always return success to prevent email enumeration
  const genericMessage = 'If an account exists with this email, a reset link has been sent';

  if (!user || !user.isActive) {
    return { message: genericMessage };
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail({
    email: user.email,
    firstName: user.firstName,
    resetToken,
  });

  return { message: genericMessage };
};

export const resetPassword = async ({ token, password }) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null;
  await user.save();

  return issueAuthResponse(user);
};

export default {
  registerCustomer,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
  verifyActiveUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
};
