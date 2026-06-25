import { Router } from 'express';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { submitContactSchema } from '../../validators/contact.validator.js';
import { submitContact } from '../../controllers/storefront/contact.controller.js';

const router = Router();

router.post('/', optionalAuthenticate, validate(submitContactSchema), submitContact);

export default router;
