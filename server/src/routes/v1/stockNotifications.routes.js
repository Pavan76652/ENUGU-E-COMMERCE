import { Router } from 'express';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { subscribeStockNotificationSchema } from '../../validators/stockNotification.validator.js';
import { subscribe } from '../../controllers/storefront/stockNotification.controller.js';

const router = Router();

router.post(
  '/',
  optionalAuthenticate,
  validate(subscribeStockNotificationSchema),
  subscribe
);

export default router;
