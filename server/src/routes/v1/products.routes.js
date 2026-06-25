import { Router } from 'express';
import * as productController from '../../controllers/storefront/product.controller.js';

const router = Router();

router.get('/categories', productController.listCategories);
router.get('/collections', productController.listCollections);
router.get('/collections/:slug', productController.getCollectionBySlug);
router.get('/', productController.listProducts);
router.get('/:slug', productController.getProductBySlug);
export default router;
