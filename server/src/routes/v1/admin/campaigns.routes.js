import { Router } from 'express';
import * as campaignController from '../../../controllers/admin/campaign.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authorizePermission } from '../../../middleware/role.middleware.js';
import { PERMISSIONS } from '../../../constants/permissions.js';
import { createCampaignSchema, updateCampaignSchema } from '../../../validators/admin.validator.js';

const router = Router();

router.get('/', authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE), campaignController.listCampaigns);
router.get('/:id', authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE), campaignController.getCampaign);
router.post('/', authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE), validate(createCampaignSchema), campaignController.createCampaign);
router.put('/:id', authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE), validate(updateCampaignSchema), campaignController.updateCampaign);
router.delete('/:id', authorizePermission(PERMISSIONS.CAMPAIGNS_MANAGE), campaignController.deleteCampaign);

export default router;
