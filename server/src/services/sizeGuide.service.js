import SizeGuide from '../models/SizeGuide.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { SIZE_GUIDE_SIZES } from '../constants/sizeGuide.js';
import { logActivity } from './activityLog.service.js';
import * as cloudinaryService from './cloudinary.service.js';

export const DEFAULT_SIZE_GUIDE_MEASUREMENTS = {
  chest: [42, 44, 46, 48, 50, 52],
  bodyLength: [28, 29, 30, 31, 32, 33],
  sleeveLength: [9, 9.5, 10, 10.5, 11, 11.5],
  shoulder: [20, 21, 22, 23, 24, 25],
};

export const sizeGuidePublicSelect = 'name slug sizes measurements image isDefault isActive';

const sizeGuideSelect = `${sizeGuidePublicSelect} createdAt updatedAt`;

const hasImage = (guide) => Boolean(guide?.image?.url);

export const hasCompleteMeasurements = (measurements = {}) =>
  ['chest', 'bodyLength', 'sleeveLength', 'shoulder'].every(
    (key) => Array.isArray(measurements[key]) && measurements[key].length === SIZE_GUIDE_SIZES.length
  );

const clearOtherDefaults = async (exceptId = null) => {
  const filter = { isDefault: true };
  if (exceptId) filter._id = { $ne: exceptId };
  await SizeGuide.updateMany(filter, { $set: { isDefault: false } });
};

export const getDefaultSizeGuide = async () => {
  const defaultGuide = await SizeGuide.findOne({ isDefault: true, isActive: true })
    .select(sizeGuidePublicSelect)
    .lean();

  if (defaultGuide) return defaultGuide;

  return SizeGuide.findOne({ isActive: true, 'image.url': { $exists: true, $ne: '' } })
    .select(sizeGuidePublicSelect)
    .sort({ createdAt: 1 })
    .lean();
};

export const resolveProductSizeGuide = async (product) => {
  const populated = product?.sizeGuideId;

  if (populated && typeof populated === 'object' && populated._id) {
    return populated;
  }

  if (populated) {
    const guide = await SizeGuide.findOne({ _id: populated, isActive: true })
      .select(sizeGuidePublicSelect)
      .lean();
    if (guide) return guide;
  }

  return getDefaultSizeGuide();
};

export const listSizeGuides = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.search) filter.$text = { $search: query.search };

  const sort = parseSort(query.sortBy || 'name', query.sortOrder || 'asc');

  const [sizeGuides, total] = await Promise.all([
    SizeGuide.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    SizeGuide.countDocuments(filter),
  ]);

  return { sizeGuides, meta: buildPaginationMeta(total, page, limit) };
};

export const listActiveSizeGuideOptions = async () => {
  return SizeGuide.find({ isActive: true })
    .select('_id name slug isDefault')
    .sort({ name: 1 })
    .lean();
};

export const getSizeGuideById = async (id) => {
  const sizeGuide = await SizeGuide.findById(id).populate('createdBy', 'firstName lastName email');

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  return sizeGuide;
};

export const getActiveSizeGuideById = async (id) => {
  const sizeGuide = await SizeGuide.findOne({ _id: id, isActive: true })
    .select(sizeGuidePublicSelect)
    .lean();

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  return sizeGuide;
};

export const createSizeGuide = async (data, actor, req) => {
  const baseSlug = slugify(data.name);
  const slug = await uniqueSlug(SizeGuide, baseSlug);

  if (data.isDefault) {
    await clearOtherDefaults();
  }

  const sizeGuide = await SizeGuide.create({
    name: data.name.trim(),
    slug,
    sizes: [...SIZE_GUIDE_SIZES],
    measurements: data.measurements ?? DEFAULT_SIZE_GUIDE_MEASUREMENTS,
    isActive: data.isActive ?? true,
    isDefault: data.isDefault ?? false,
    createdBy: actor.id,
  });

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.SIZE_GUIDE_CREATED,
    resource: AUDIT_RESOURCES.SIZE_GUIDE,
    resourceId: sizeGuide._id,
    metadata: { name: sizeGuide.name },
    req,
  });

  return sizeGuide;
};

export const updateSizeGuide = async (id, data, actor, req) => {
  const sizeGuide = await SizeGuide.findById(id);

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  if (data.name && data.name.trim() !== sizeGuide.name) {
    sizeGuide.name = data.name.trim();
    sizeGuide.slug = await uniqueSlug(SizeGuide, slugify(data.name), sizeGuide._id);
  }

  if (data.measurements) {
    sizeGuide.measurements = data.measurements;
  }

  if (data.isActive !== undefined) {
    sizeGuide.isActive = data.isActive;
  }

  if (data.isDefault !== undefined) {
    if (data.isDefault) {
      await clearOtherDefaults(sizeGuide._id);
      sizeGuide.isDefault = true;
    } else {
      sizeGuide.isDefault = false;
    }
  }

  await sizeGuide.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.SIZE_GUIDE_UPDATED,
    resource: AUDIT_RESOURCES.SIZE_GUIDE,
    resourceId: sizeGuide._id,
    metadata: { name: sizeGuide.name },
    req,
  });

  return sizeGuide;
};

export const uploadSizeGuideImage = async (id, file, actor, req) => {
  const sizeGuide = await SizeGuide.findById(id);

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  const uploaded = await cloudinaryService.uploadSizeGuideImage(file.buffer, {
    sizeGuideId: sizeGuide._id.toString(),
  });

  if (sizeGuide.image?.publicId) {
    await cloudinaryService.deleteImage(sizeGuide.image.publicId).catch(() => null);
  }

  sizeGuide.image = uploaded;
  await sizeGuide.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.SIZE_GUIDE_UPDATED,
    resource: AUDIT_RESOURCES.SIZE_GUIDE,
    resourceId: sizeGuide._id,
    metadata: { name: sizeGuide.name, imageUpdated: true },
    req,
  });

  return sizeGuide;
};

export const deleteSizeGuideImage = async (id, actor, req) => {
  const sizeGuide = await SizeGuide.findById(id);

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  if (!hasImage(sizeGuide)) {
    throw new ApiError(400, 'No size guide image to delete');
  }

  if (sizeGuide.image?.publicId) {
    await cloudinaryService.deleteImage(sizeGuide.image.publicId).catch(() => null);
  }

  sizeGuide.image = undefined;
  await sizeGuide.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.SIZE_GUIDE_UPDATED,
    resource: AUDIT_RESOURCES.SIZE_GUIDE,
    resourceId: sizeGuide._id,
    metadata: { name: sizeGuide.name, imageDeleted: true },
    req,
  });

  return sizeGuide;
};

export const deleteSizeGuide = async (id, actor, req) => {
  const sizeGuide = await SizeGuide.findById(id);

  if (!sizeGuide) {
    throw new ApiError(404, 'Size guide not found');
  }

  const linkedProducts = await Product.countDocuments({ sizeGuideId: sizeGuide._id });

  if (linkedProducts > 0) {
    throw new ApiError(
      400,
      `Cannot delete size guide. ${linkedProducts} product(s) are using it. Reassign them first.`
    );
  }

  if (sizeGuide.image?.publicId) {
    await cloudinaryService.deleteImage(sizeGuide.image.publicId).catch(() => null);
  }

  await sizeGuide.deleteOne();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.SIZE_GUIDE_DELETED,
    resource: AUDIT_RESOURCES.SIZE_GUIDE,
    resourceId: sizeGuide._id,
    metadata: { name: sizeGuide.name },
    req,
  });

  return sizeGuide;
};

export const getPublicSizeGuideFields = () => sizeGuidePublicSelect;
