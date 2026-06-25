import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  previewCheckoutSchema,
  createOrderSchema,
  validateCouponSchema,
} from '../../validators/checkout.validator.js';
import {
  previewCheckout,
  validateCoupon,
  createOrder,
  getMyOrders,
  getMyOrderByNumber,
} from '../../controllers/storefront/checkout.controller.js';

const router = Router();

router.post('/coupon', validate(validateCouponSchema), validateCoupon);
router.post('/preview', authenticate, validate(previewCheckoutSchema), previewCheckout);
router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:orderNumber', authenticate, getMyOrderByNumber);

export default router;
