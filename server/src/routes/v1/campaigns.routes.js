import { Router } from 'express';
import {
  getActiveCampaign,
  listCampaigns,
} from '../../controllers/storefront/campaign.controller.js';

const router = Router();

router.get('/active', getActiveCampaign);
router.get('/', listCampaigns);

export default router;
