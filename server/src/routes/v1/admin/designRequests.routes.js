import { Router } from 'express';
import * as designRequestController from '../../../controllers/admin/designRequest.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { updateDesignRequestSchema } from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', authorizePermission(PERMISSIONS.DESIGN_REQUESTS_MANAGE), designRequestController.listDesignRequests);
router.get('/:id', authorizePermission(PERMISSIONS.DESIGN_REQUESTS_MANAGE), designRequestController.getDesignRequest);
router.patch(
  '/:id',
  authorizePermission(PERMISSIONS.DESIGN_REQUESTS_MANAGE),
  validate(updateDesignRequestSchema),
  designRequestController.updateDesignRequest
);

export default router;
