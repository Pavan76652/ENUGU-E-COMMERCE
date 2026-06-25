import SizeGuide from '../models/SizeGuide.js';

const DEFAULT_SIZE_GUIDE = {
  name: 'Oversized T-Shirt',
  slug: 'oversized-t-shirt',
  isDefault: true,
  isActive: true,
  image: {
    url: '/assets/size-guides/enugu-default-size-guide.png',
  },
  measurements: {
    chest: [42, 44, 46, 48, 50, 52],
    bodyLength: [28, 29, 30, 31, 32, 33],
    sleeveLength: [9, 9.5, 10, 10.5, 11, 11.5],
    shoulder: [20, 21, 22, 23, 24, 25],
  },
};

export const ensureDefaultSizeGuide = async () => {
  const existing = await SizeGuide.findOne({ isDefault: true });
  if (existing) return existing;

  const bySlug = await SizeGuide.findOne({ slug: DEFAULT_SIZE_GUIDE.slug });
  if (bySlug) {
    if (!bySlug.isDefault) {
      await SizeGuide.updateMany({ isDefault: true }, { $set: { isDefault: false } });
      bySlug.isDefault = true;
      if (!bySlug.image?.url) {
        bySlug.image = DEFAULT_SIZE_GUIDE.image;
      }
      await bySlug.save();
    }
    return bySlug;
  }

  return SizeGuide.create(DEFAULT_SIZE_GUIDE);
};

export default { ensureDefaultSizeGuide };
