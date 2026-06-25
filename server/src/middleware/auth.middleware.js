import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import { verifyActiveUser } from '../services/auth.service.js';

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await verifyActiveUser(decoded.sub);
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Access token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid access token');
    }

    throw error;
  }
});

export const optionalAuthenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await verifyActiveUser(decoded.sub);
  } catch {
    // Guest access continues without user context
  }

  next();
});

export default authenticate;
