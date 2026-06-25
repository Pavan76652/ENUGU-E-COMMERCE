import { Router } from 'express';
import * as analyticsController from '../../../controllers/admin/analytics.controller.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { ROLES } from '../../../constants/roles.js';

const router = Router();

const canViewAnalytics = (req, res, next) => {
  if (req.user.role === ROLES.SUPER_ADMIN) return next();
  return authorizePermission(PERMISSIONS.ANALYTICS_READ)(req, res, next);
};

router.get('/overview', canViewAnalytics, analyticsController.getOverview);
router.get('/dashboard', canViewAnalytics, analyticsController.getDashboard);
router.get('/sales', canViewAnalytics, analyticsController.getSales);
router.get('/products', canViewAnalytics, analyticsController.getProducts);
router.get('/customers', canViewAnalytics, analyticsController.getCustomers);

export default router;
