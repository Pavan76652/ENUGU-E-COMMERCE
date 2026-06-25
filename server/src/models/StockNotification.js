import mongoose from 'mongoose';

export const NOTIFICATION_STATUS = Object.freeze({
  PENDING: 'pending',
  NOTIFIED: 'notified',
});

const stockNotificationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    size: {
      type: String,
      default: null,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUS),
      default: NOTIFICATION_STATUS.PENDING,
      index: true,
    },
    notifiedAt: Date,
  },
  { timestamps: true }
);

stockNotificationSchema.index(
  { productId: 1, email: 1, size: 1 },
  { unique: true }
);

const StockNotification = mongoose.model('StockNotification', stockNotificationSchema);
export default StockNotification;
