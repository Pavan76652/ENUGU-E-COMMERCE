import mongoose from 'mongoose';
import { DESIGN_REQUEST_STATUS } from '../constants/designRequestStatus.js';

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const customDesignRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    designBrief: { type: String, required: true },
    referenceImages: [imageSchema],
    preferredColors: [{ type: String }],
    quantity: { type: Number, required: true, min: 1 },
    budget: { type: Number, min: 0 },
    status: {
      type: String,
      enum: Object.values(DESIGN_REQUEST_STATUS),
      default: DESIGN_REQUEST_STATUS.NEW,
      index: true,
    },
    adminNotes: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quotedPrice: { type: Number, min: 0 },
    quotedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

customDesignRequestSchema.index({ status: 1, createdAt: -1 });

const CustomDesignRequest = mongoose.model('CustomDesignRequest', customDesignRequestSchema);
export default CustomDesignRequest;
