import mongoose from 'mongoose';
import { ALL_FESTIVAL_TYPES } from '../constants/campaignPresets.js';

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const festivalCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    festivalType: {
      type: String,
      enum: ALL_FESTIVAL_TYPES,
      default: 'custom',
      index: true,
    },
    greetingMessage: { type: String, required: true, trim: true, maxlength: 500 },
    couponCode: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    bannerImage: imageSchema,
    mobileBannerImage: imageSchema,
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    linkedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    linkedCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

festivalCampaignSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

festivalCampaignSchema.virtual('isLive').get(function isLive() {
  if (!this.isActive) return false;
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

festivalCampaignSchema.set('toJSON', { virtuals: true });
festivalCampaignSchema.set('toObject', { virtuals: true });

const FestivalCampaign = mongoose.model('FestivalCampaign', festivalCampaignSchema);
export default FestivalCampaign;
