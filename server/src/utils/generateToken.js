import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
};

export const generateTokenPair = (user) => {
  const payload = {
    sub: user._id?.toString() ?? user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions ?? [],
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ sub: payload.sub }),
  };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.accessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
