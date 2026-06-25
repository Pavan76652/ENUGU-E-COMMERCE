import { Router } from 'express';
import * as productController from '../../../controllers/admin/product.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { productImageUpload, handleMulterError } from '../../../middleware/upload.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productStatusSchema,
  inventoryUpdateSchema,
  reorderImagesSchema,
  setCoverImageSchema,
  deleteImageSchema,
  uploadImagesBodySchema,
} from '../../../validators/product.validator.js';

const router = Router();

const canCreate = authorizePermission(PERMISSIONS.PRODUCTS_CREATE);
const canUpdate = authorizePermission(PERMISSIONS.PRODUCTS_UPDATE);
const canDelete = authorizePermission(PERMISSIONS.PRODUCTS_DELETE);

// ─── Categories & list ───────────────────────────────────────────
router.get('/categories', productController.listCategories);
router.get('/', productController.listProducts);

// ─── Standalone Cloudinary upload (before product create) ────────
router.post(
  '/images/upload',
  canCreate,
  productImageUpload.array('images', 10),
  handleMulterError,
  validate(uploadImagesBodySchema),
  productController.uploadStandaloneImages
);

// ─── CRUD ────────────────────────────────────────────────────────
router.post('/', canCreate, validate(createProductSchema), productController.createProduct);
router.get('/:id', productController.getProduct);
router.put('/:id', canUpdate, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', canDelete, productController.deleteProduct);

// ─── Status & inventory ──────────────────────────────────────────
router.patch('/:id/status', canUpdate, validate(productStatusSchema), productController.updateProductStatus);
router.patch('/:id/archive', canUpdate, productController.archiveProduct);
router.patch('/:id/inventory', canUpdate, validate(inventoryUpdateSchema), productController.updateInventory);

// ─── Image management ────────────────────────────────────────────
router.post(
  '/:id/images',
  canUpdate,
  productImageUpload.array('images', 10),
  handleMulterError,
  validate(uploadImagesBodySchema),
  productController.uploadProductImages
);

router.delete(
  '/:id/images',
  canUpdate,
  validate(deleteImageSchema),
  productController.deleteProductImage
);

router.put(
  '/:id/images/reorder',
  canUpdate,
  validate(reorderImagesSchema),
  productController.reorderProductImages
);

router.patch(
  '/:id/images/cover',
  canUpdate,
  validate(setCoverImageSchema),
  productController.setCoverImage
);

export default router;
