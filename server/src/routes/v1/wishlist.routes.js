import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  addWishlistItemSchema,
  syncWishlistSchema,
} from '../../validators/wishlist.validator.js';
import {
  getWishlist,
  addItem,
  removeItem,
  syncWishlist,
} from '../../controllers/storefront/wishlist.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/sync', validate(syncWishlistSchema), syncWishlist);
router.post('/', validate(addWishlistItemSchema), addItem);
router.delete('/:productId', removeItem);

export default router;
