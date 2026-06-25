import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as storefrontCampaignService from '../../services/storefrontCampaign.service.js';

export const getActiveCampaign = asyncHandler(async (_req, res) => {
  const campaign = await storefrontCampaignService.getActiveCampaign();
  res.status(200).json(new ApiResponse(200, { campaign }, 'Active campaign fetched'));
});

export const listCampaigns = asyncHandler(async (_req, res) => {
  const campaigns = await storefrontCampaignService.listUpcomingCampaigns();
  res.status(200).json(new ApiResponse(200, { campaigns }, 'Campaigns fetched'));
});
