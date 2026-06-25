import { Router } from 'express';
import * as customerController from '../../../controllers/admin/customer.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { customerStatusSchema } from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', customerController.listCustomers);
router.get('/:id', customerController.getCustomer);
router.patch(
  '/:id/status',
  validate(customerStatusSchema),
  customerController.setCustomerStatus
);

export default router;
