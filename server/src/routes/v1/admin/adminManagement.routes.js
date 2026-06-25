import { Router } from 'express';
import * as adminController from '../../../controllers/admin/adminManagement.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import {
  createAdminSchema,
  updateAdminSchema,
  adminStatusSchema,
} from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', adminController.listAdmins);
router.post('/', validate(createAdminSchema), adminController.createAdmin);
router.put('/:id', validate(updateAdminSchema), adminController.updateAdmin);
router.patch('/:id/status', validate(adminStatusSchema), adminController.setAdminStatus);

export default router;
