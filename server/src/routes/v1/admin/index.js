import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { isAdmin, isSuperAdmin } from '../../../middleware/role.middleware.js';

import dashboardRoutes from './dashboard.routes.js';
import adminManagementRoutes from './adminManagement.routes.js';
import activityLogRoutes from './activityLog.routes.js';
import productRoutes from './products.routes.js';
import orderRoutes from './orders.routes.js';
import customerRoutes from './customers.routes.js';
import couponRoutes from './coupons.routes.js';
import campaignRoutes from './campaigns.routes.js';
import designRequestRoutes from './designRequests.routes.js';
import sizeGuideRoutes from './sizeGuides.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use(authenticate, isAdmin);

router.use('/dashboard', dashboardRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/products', productRoutes);
router.use('/size-guides', sizeGuideRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/coupons', couponRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/design-requests', designRequestRoutes);
router.use('/analytics', analyticsRoutes);

// Super Admin only — admin management
router.use('/admins', isSuperAdmin, adminManagementRoutes);

export default router;
