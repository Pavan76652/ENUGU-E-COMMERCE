import FestivalCampaign from '../models/FestivalCampaign.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { logActivity } from './activityLog.service.js';
import * as cloudinaryService from './cloudinary.service.js';

const BANNER_FIELD_BY_VARIANT = {
  desktop: 'bannerImage',
  mobile: 'mobileBannerImage',
  shop: 'shopBannerImage',
};

const resolveCouponLink = async (couponCode) => {
  if (!couponCode?.trim()) return [];

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
  return coupon ? [coupon._id] : [];
};

const withLiveStatus = (campaign) => {
  const doc = campaign.toObject?.() ?? campaign;
  const now = new Date();
  return {
    ...doc,
    isLive: doc.isActive && doc.startDate <= now && doc.endDate >= now,
  };
};

export const listCampaigns = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === 'true';
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { slug: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = parseSort(query.sortBy || 'startDate', query.sortOrder || 'desc');

  const [campaigns, total] = await Promise.all([
    FestivalCampaign.find(filter)
      .populate('linkedProducts', 'name slug sku')
      .populate('linkedCoupons', 'code type value')
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    FestivalCampaign.countDocuments(filter),
  ]);

  return { campaigns: campaigns.map(withLiveStatus), meta: buildPaginationMeta(total, page, limit) };
};

export const getCampaignById = async (id) => {
  const campaign = await FestivalCampaign.findById(id)
    .populate('linkedProducts', 'name slug sku images')
    .populate('linkedCoupons', 'code type value isActive')
    .populate('createdBy', 'firstName lastName email');

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  return withLiveStatus(campaign);
};

export const createCampaign = async (data, actor, req) => {
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    throw new ApiError(400, 'endDate must be after startDate');
  }

  const baseSlug = slugify(data.name);
  const slug = await uniqueSlug(FestivalCampaign, baseSlug);
  const linkedCoupons = await resolveCouponLink(data.couponCode);

  const campaign = await FestivalCampaign.create({
    ...data,
    slug,
    couponCode: data.couponCode.toUpperCase().trim(),
    linkedCoupons,
    createdBy: actor.id,
  });

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.CAMPAIGN_CREATED,
    resource: AUDIT_RESOURCES.CAMPAIGN,
    resourceId: campaign._id,
    metadata: { name: campaign.name },
    req,
  });

  return withLiveStatus(campaign);
};

export const updateCampaign = async (id, data, actor, req) => {
  const campaign = await FestivalCampaign.findById(id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  if (data.name && data.name !== campaign.name) {
    campaign.name = data.name;
    campaign.slug = await uniqueSlug(FestivalCampaign, slugify(data.name), campaign._id);
  }

  const fields = [
    'festivalType', 'greetingMessage', 'description', 'bannerImage', 'mobileBannerImage',
    'shopBannerImage', 'discountType', 'discountValue', 'startDate', 'endDate', 'linkedProducts',
    'linkedCoupons', 'isActive', 'isFeatured',
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) campaign[field] = data[field];
  });

  if (data.couponCode) {
    campaign.couponCode = data.couponCode.toUpperCase().trim();
    campaign.linkedCoupons = await resolveCouponLink(data.couponCode);
  }

  if (data.endDate && data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
    throw new ApiError(400, 'endDate must be after startDate');
  }

  await campaign.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.CAMPAIGN_UPDATED,
    resource: AUDIT_RESOURCES.CAMPAIGN,
    resourceId: campaign._id,
    metadata: { name: campaign.name },
    req,
  });

  return withLiveStatus(campaign);
};

export const uploadCampaignBanner = async (id, file, variant, actor, req) => {
  const field = BANNER_FIELD_BY_VARIANT[variant];
  if (!field) {
    throw new ApiError(400, "Banner variant must be 'desktop' or 'mobile'");
  }

  const campaign = await FestivalCampaign.findById(id);
  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  const uploaded = await cloudinaryService.uploadCampaignBanner(file.buffer, {
    campaignId: campaign._id.toString(),
    variant,
  });

  if (campaign[field]?.publicId) {
    await cloudinaryService.deleteImage(campaign[field].publicId).catch(() => null);
  }

  campaign[field] = { url: uploaded.url, publicId: uploaded.publicId };
  await campaign.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.CAMPAIGN_UPDATED,
    resource: AUDIT_RESOURCES.CAMPAIGN,
    resourceId: campaign._id,
    metadata: { name: campaign.name, bannerVariant: variant },
    req,
  });

  return withLiveStatus(campaign);
};

export const deleteCampaignBanner = async (id, variant, actor, req) => {
  const field = BANNER_FIELD_BY_VARIANT[variant];
  if (!field) {
    throw new ApiError(400, "Banner variant must be 'desktop' or 'mobile'");
  }

  const campaign = await FestivalCampaign.findById(id);
  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  if (!campaign[field]?.url) {
    throw new ApiError(400, 'No banner image to delete');
  }

  if (campaign[field]?.publicId) {
    await cloudinaryService.deleteImage(campaign[field].publicId).catch(() => null);
  }

  campaign[field] = undefined;
  await campaign.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.CAMPAIGN_UPDATED,
    resource: AUDIT_RESOURCES.CAMPAIGN,
    resourceId: campaign._id,
    metadata: { name: campaign.name, bannerVariant: variant, removed: true },
    req,
  });

  return withLiveStatus(campaign);
};

export const deleteCampaign = async (id, actor, req) => {
  const campaign = await FestivalCampaign.findById(id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  campaign.isActive = false;
  await campaign.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.CAMPAIGN_DELETED,
    resource: AUDIT_RESOURCES.CAMPAIGN,
    resourceId: campaign._id,
    metadata: { name: campaign.name },
    req,
  });

  return withLiveStatus(campaign);
};

export default {
  listCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  uploadCampaignBanner,
  deleteCampaignBanner,
  deleteCampaign,
};
