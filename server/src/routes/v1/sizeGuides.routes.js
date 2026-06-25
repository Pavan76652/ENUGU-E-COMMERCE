import { Router } from 'express';
import * as sizeGuideController from '../../controllers/storefront/sizeGuide.controller.js';

const router = Router();

router.get('/default', sizeGuideController.getDefaultSizeGuide);
router.get('/:id', sizeGuideController.getSizeGuide);

export default router;
