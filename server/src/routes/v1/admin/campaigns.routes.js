import { Router } from 'express';
import * as campaignController from '../../../controllers/admin/campaign.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { productImageUpload, handleMulterError } from '../../../middleware/upload.middleware.js';
import { createCampaignSchema, updateCampaignSchema } from '../../../validators/admin.validator.js';

const router = Router();
const canManage = authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE);
const singleImageUpload = productImageUpload.single('image');

router.get('/', canManage, campaignController.listCampaigns);
router.get('/:id', canManage, campaignController.getCampaign);
router.post('/', canManage, validate(createCampaignSchema), campaignController.createCampaign);
router.put('/:id', canManage, validate(updateCampaignSchema), campaignController.updateCampaign);
router.post(
  '/:id/banner',
  canManage,
  singleImageUpload,
  handleMulterError,
  campaignController.uploadCampaignBanner
);
router.delete('/:id/banner', canManage, campaignController.deleteCampaignBanner);
router.delete('/:id', canManage, campaignController.deleteCampaign);

export default router;
