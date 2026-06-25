import { Router } from 'express';
import * as activityLogController from '../../../controllers/admin/activityLog.controller.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { ROLES } from '../../../constants/roles.js';

const router = Router();

const canViewLogs = (req, res, next) => {
  if (req.user.role === ROLES.SUPER_ADMIN) return next();
  return authorizePermission(PERMISSIONS.AUDIT_READ)(req, res, next);
};

router.get('/', canViewLogs, activityLogController.listActivityLogs);

export default router;
