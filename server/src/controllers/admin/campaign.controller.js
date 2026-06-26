import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as campaignService from '../../services/campaign.service.js';

export const listCampaigns = asyncHandler(async (req, res) => {
  const result = await campaignService.listCampaigns(req.query);
  res.status(200).json(new ApiResponse(200, result.campaigns, 'Campaigns fetched', result.meta));
});

export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.id);
  res.status(200).json(new ApiResponse(200, { campaign }, 'Campaign fetched'));
});

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body, req.user, req);
  res.status(201).json(new ApiResponse(201, { campaign }, 'Campaign created'));
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { campaign }, 'Campaign updated'));
});

export const uploadCampaignBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, 'Banner image file is required'));
  }

  const variant = req.body.variant || req.query.variant || 'desktop';
  const campaign = await campaignService.uploadCampaignBanner(
    req.params.id,
    req.file,
    variant,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { campaign }, 'Campaign banner uploaded'));
});

export const deleteCampaignBanner = asyncHandler(async (req, res) => {
  const variant = req.body.variant || req.query.variant || 'desktop';
  const campaign = await campaignService.deleteCampaignBanner(
    req.params.id,
    variant,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { campaign }, 'Campaign banner removed'));
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.deleteCampaign(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, { campaign }, 'Campaign deactivated'));
});
