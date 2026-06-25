import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { savedAddressSchema } from '../../validators/checkout.validator.js';
import {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../controllers/storefront/address.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', listAddresses);
router.post('/', validate(savedAddressSchema), addAddress);
router.put('/:addressId', validate(savedAddressSchema.partial()), updateAddress);
router.delete('/:addressId', deleteAddress);
router.patch('/:addressId/default', setDefaultAddress);

export default router;
