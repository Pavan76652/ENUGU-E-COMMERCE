import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin/index.js';
import productRoutes from './products.routes.js';
import orderRoutes from './orders.routes.js';
import addressRoutes from './addresses.routes.js';
import campaignRoutes from './campaigns.routes.js';
import designRequestRoutes from './designRequests.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import stockNotificationRoutes from './stockNotifications.routes.js';
import contactRoutes from './contact.routes.js';
import seoRoutes from './seo.routes.js';
import sizeGuideRoutes from './sizeGuides.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/design-requests', designRequestRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/stock-notifications', stockNotificationRoutes);
router.use('/contact', contactRoutes);
router.use('/seo', seoRoutes);
router.use('/size-guides', sizeGuideRoutes);
router.use('/admin', adminRoutes);

export default router;
