import { Router } from 'express';
import * as sizeGuideController from '../../../controllers/admin/sizeGuide.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { productImageUpload, handleMulterError } from '../../../middleware/upload.middleware.js';
import {
  createSizeGuideSchema,
  updateSizeGuideSchema,
} from '../../../validators/sizeGuide.validator.js';

const router = Router();
const singleImageUpload = productImageUpload.single('image');

const canManage = authorizePermission(PERMISSIONS.SIZE_GUIDES_MANAGE);
const canReadForProducts = authorizePermission(
  PERMISSIONS.SIZE_GUIDES_MANAGE,
  PERMISSIONS.PRODUCTS_CREATE,
  PERMISSIONS.PRODUCTS_UPDATE
);

router.get('/options', canReadForProducts, sizeGuideController.listSizeGuideOptions);
router.get('/', canManage, sizeGuideController.listSizeGuides);
router.get('/:id', canManage, sizeGuideController.getSizeGuide);
router.post('/', canManage, validate(createSizeGuideSchema), sizeGuideController.createSizeGuide);
router.put('/:id', canManage, validate(updateSizeGuideSchema), sizeGuideController.updateSizeGuide);
router.post(
  '/:id/image',
  canManage,
  singleImageUpload,
  handleMulterError,
  sizeGuideController.uploadSizeGuideImage
);
router.delete('/:id/image', canManage, sizeGuideController.deleteSizeGuideImage);
router.delete('/:id', canManage, sizeGuideController.deleteSizeGuide);

export default router;
