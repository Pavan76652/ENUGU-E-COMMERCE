import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export const globalRateLimiter = rateLimit({
  windowMs: env.security.rateLimitWindowMs,
  max: env.isProduction ? env.security.rateLimitMaxRequests : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !env.isProduction,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment requests, please try again later',
  },
});

export default globalRateLimiter;
