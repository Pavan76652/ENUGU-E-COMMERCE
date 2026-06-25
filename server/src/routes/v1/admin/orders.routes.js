import { Router } from 'express';
import * as orderController from '../../../controllers/admin/order.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import {
  orderStatusSchema,
  orderTrackingSchema,
  orderNotesSchema,
} from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', orderController.listOrders);
router.get('/:orderNumber', orderController.getOrder);
router.patch(
  '/:orderNumber/status',
  authorizePermission(PERMISSIONS.ORDERS_UPDATE),
  validate(orderStatusSchema),
  orderController.updateOrderStatus
);
router.patch(
  '/:orderNumber/tracking',
  authorizePermission(PERMISSIONS.ORDERS_UPDATE),
  validate(orderTrackingSchema),
  orderController.updateOrderTracking
);
router.patch(
  '/:orderNumber/notes',
  authorizePermission(PERMISSIONS.ORDERS_UPDATE),
  validate(orderNotesSchema),
  orderController.updateOrderNotes
);

export default router;
