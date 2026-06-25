import { Router } from 'express';
import * as authController from '../../controllers/auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { isAdmin, isSuperAdmin } from '../../middleware/role.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../../validators/auth.validator.js';

const router = Router();

// ─── Public ──────────────────────────────────────────────────────
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login/customer',
  authRateLimiter,
  validate(loginSchema),
  authController.loginCustomer
);

router.post(
  '/login/admin',
  authRateLimiter,
  validate(loginSchema),
  authController.loginAdmin
);

router.post(
  '/login/super-admin',
  authRateLimiter,
  validate(loginSchema),
  authController.loginSuperAdmin
);

router.post('/refresh-token', authController.refreshToken);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/verify-email',
  authRateLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail
);

// ─── Protected (any authenticated user) ────────────────────────
router.post('/logout', authenticate, authController.logout);

router.post('/resend-verification', authenticate, authController.resendVerification);

router.get('/me', authenticate, authController.getMe);

router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
);

router.put(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// ─── Protected (role-based) ──────────────────────────────────────
router.get('/admin/me', authenticate, isAdmin, authController.getAdminProfile);

router.get(
  '/super-admin/me',
  authenticate,
  isSuperAdmin,
  authController.getSuperAdminProfile
);

export default router;
