import mongoose from 'mongoose';
import { SIZE_GUIDE_SIZES } from '../constants/sizeGuide.js';

const measurementLength = SIZE_GUIDE_SIZES.length;

const measurementArrayValidator = {
  validator(values) {
    return Array.isArray(values) && values.length === measurementLength;
  },
  message: `Must include exactly ${measurementLength} values (${SIZE_GUIDE_SIZES.join(', ')})`,
};

const measurementsSchema = new mongoose.Schema(
  {
    chest: { type: [Number], validate: measurementArrayValidator },
    bodyLength: { type: [Number], validate: measurementArrayValidator },
    sleeveLength: { type: [Number], validate: measurementArrayValidator },
    shoulder: { type: [Number], validate: measurementArrayValidator },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const sizeGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sizes: {
      type: [String],
      enum: SIZE_GUIDE_SIZES,
      default: () => [...SIZE_GUIDE_SIZES],
    },
    measurements: { type: measurementsSchema },
    image: { type: imageSchema, default: null },
    isDefault: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const hasCompleteMeasurements = (measurements = {}) =>
  ['chest', 'bodyLength', 'sleeveLength', 'shoulder'].every(
    (key) =>
      Array.isArray(measurements[key]) && measurements[key].length === measurementLength
  );

sizeGuideSchema.pre('validate', function validateContent(next) {
  const hasImage = Boolean(this.image?.url);
  const hasMeasurements = hasCompleteMeasurements(this.measurements);

  if (!hasImage && !hasMeasurements) {
    this.invalidate('measurements', 'Size guide must include an image or complete measurements');
  }

  next();
});

sizeGuideSchema.index({ name: 'text' });

const SizeGuide = mongoose.model('SizeGuide', sizeGuideSchema);

export default SizeGuide;
