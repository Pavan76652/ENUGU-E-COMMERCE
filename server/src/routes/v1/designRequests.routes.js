import { Router } from 'express';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createDesignRequestSchema } from '../../validators/designRequest.validator.js';
import { productImageUpload, handleMulterError } from '../../middleware/upload.middleware.js';
import { createDesignRequest } from '../../controllers/storefront/designRequest.controller.js';

const router = Router();

const singleImageUpload = productImageUpload.single('referenceImage');

router.post(
  '/',
  optionalAuthenticate,
  (req, res, next) => {
    singleImageUpload(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  validate(createDesignRequestSchema),
  createDesignRequest
);

export default router;
