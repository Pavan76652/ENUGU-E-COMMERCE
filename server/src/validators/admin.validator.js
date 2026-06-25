import { z } from 'zod';
import { ALL_ORDER_STATUSES } from '../constants/orderStatus.js';
import { ALL_FESTIVAL_TYPES } from '../constants/campaignPresets.js';
import { ALL_COUPON_TYPES, COUPON_TYPES } from '../constants/couponTypes.js';
import { ALL_DESIGN_REQUEST_STATUSES } from '../constants/designRequestStatus.js';
import { ADMIN_PERMISSION_GROUPS } from '../constants/permissions.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const paginationQuery = {
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
};

export const paginationSchema = z.object(paginationQuery);

export const orderStatusSchema = z.object({
  status: z.enum(ALL_ORDER_STATUSES),
  note: z.string().max(500).optional(),
});

export const orderTrackingSchema = z.object({
  trackingNumber: z.string().min(1),
  carrier: z.string().min(1),
});

export const orderNotesSchema = z.object({
  adminNotes: z.string().max(1000),
});

export const createAdminSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  password: z.string().min(8).max(128),
  permissions: z.array(z.string()).optional().default([]),
});

export const updateAdminSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().max(50).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  permissions: z.array(z.string()).optional(),
});

export const adminStatusSchema = z.object({
  isActive: z.boolean(),
});

const couponFieldsSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(ALL_COUPON_TYPES),
  value: z.number().min(0).optional().default(0),
  minOrderValue: z.number().min(0).optional().default(0),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional().default(1),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  applicableCategories: z.array(objectId).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

const couponRefinement = (data, ctx) => {
  if (data.type === COUPON_TYPES.PERCENTAGE) {
    if (!data.value || data.value <= 0) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: 'Percentage value is required' });
    } else if (data.value > 100) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: 'Percentage cannot exceed 100' });
    }
  }

  if (data.type === COUPON_TYPES.FIXED && (!data.value || data.value <= 0)) {
    ctx.addIssue({ code: 'custom', path: ['value'], message: 'Fixed discount amount is required' });
  }

  if (data.validUntil) {
    const validFrom = data.validFrom ?? new Date();
    if (new Date(data.validUntil) <= validFrom) {
      ctx.addIssue({ code: 'custom', path: ['validUntil'], message: 'Expiry must be after start date' });
    }
  }
};

export const createCouponSchema = couponFieldsSchema.superRefine(couponRefinement);

export const updateCouponSchema = couponFieldsSchema
  .omit({ code: true })
  .partial()
  .superRefine(couponRefinement);

const campaignFieldsSchema = z.object({
  name: z.string().min(2).max(200),
  festivalType: z.enum(ALL_FESTIVAL_TYPES).optional().default('custom'),
  greetingMessage: z.string().min(5).max(500),
  couponCode: z.string().min(3).max(20),
  description: z.string().optional().default(''),
  bannerImage: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
  mobileBannerImage: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
  discountType: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  discountValue: z.number().min(0).optional().default(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  linkedProducts: z.array(objectId).optional().default([]),
  linkedCoupons: z.array(objectId).optional().default([]),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

const campaignRefinement = (data, ctx) => {
  if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
    ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must be after start date' });
  }
};

export const createCampaignSchema = campaignFieldsSchema.superRefine(campaignRefinement);

export const updateCampaignSchema = campaignFieldsSchema.partial().superRefine(campaignRefinement);

export const updateDesignRequestSchema = z.object({
  status: z.enum(ALL_DESIGN_REQUEST_STATUSES).optional(),
  adminNotes: z.string().max(2000).optional(),
  assignedTo: objectId.optional().nullable(),
  quotedPrice: z.number().positive().optional(),
});

export const customerStatusSchema = z.object({
  isActive: z.boolean(),
});

export const permissionGroupsSchema = z.object({
  groups: z.record(z.array(z.string())),
});

// Export permission groups for reference
export { ADMIN_PERMISSION_GROUPS };
