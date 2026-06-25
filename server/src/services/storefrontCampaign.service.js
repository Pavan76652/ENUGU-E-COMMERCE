import FestivalCampaign from '../models/FestivalCampaign.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';

const formatCampaignForStorefront = (campaign) => {
  if (!campaign) return null;

  const bannerUrl =
    campaign.bannerImage?.url ||
    campaign.mobileBannerImage?.url ||
    null;

  return {
    id: campaign._id?.toString() ?? campaign.id,
    slug: campaign.slug,
    name: campaign.name,
    festivalType: campaign.festivalType,
    greetingMessage: campaign.greetingMessage,
    couponCode: campaign.couponCode,
    bannerImage: bannerUrl,
    mobileBannerImage: campaign.mobileBannerImage?.url ?? bannerUrl,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    isFeatured: campaign.isFeatured,
    isLive: true,
  };
};

export const getActiveCampaign = async () => {
  const now = new Date();

  const campaign = await FestivalCampaign.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .sort({ isFeatured: -1, startDate: -1 })
    .lean();

  return formatCampaignForStorefront(campaign);
};

export const listUpcomingCampaigns = async (limit = 5) => {
  const now = new Date();

  const campaigns = await FestivalCampaign.find({
    isActive: true,
    endDate: { $gte: now },
  })
    .sort({ startDate: 1 })
    .limit(limit)
    .lean();

  return campaigns.map((campaign) => ({
    ...formatCampaignForStorefront(campaign),
    isLive: campaign.startDate <= now && campaign.endDate >= now,
  }));
};

export default { getActiveCampaign, listUpcomingCampaigns };
