import { Router } from 'express';
import * as couponController from '../../../controllers/admin/coupon.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { createCouponSchema, updateCouponSchema } from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', authorizePermission(PERMISSIONS.COUPONS_MANAGE), couponController.listCoupons);
router.get('/:id', authorizePermission(PERMISSIONS.COUPONS_MANAGE), couponController.getCoupon);
router.post('/', authorizePermission(PERMISSIONS.COUPONS_MANAGE), validate(createCouponSchema), couponController.createCoupon);
router.put('/:id', authorizePermission(PERMISSIONS.COUPONS_MANAGE), validate(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', authorizePermission(PERMISSIONS.COUPONS_MANAGE), couponController.deleteCoupon);

export default router;
