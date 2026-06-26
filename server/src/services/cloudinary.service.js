import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const buildFolder = (productId = null) => {
  const base = env.cloudinary.folder || 'enugu';
  return productId ? `${base}/products/${productId}` : `${base}/products/temp`;
};

export const assertCloudinaryConfigured = () => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, 'Cloudinary is not configured. Set CLOUDINARY_* environment variables.');
  }
};

export const uploadDesignReference = async (fileBuffer) => {
  assertCloudinaryConfigured();

  const base = env.cloudinary.folder || 'enugu';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${base}/design-requests`,
        resource_type: 'image',
        tags: ['enugu', 'design-request'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const uploadImage = async (fileBuffer, { productId = null, type = 'additional' } = {}) => {
  assertCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: buildFolder(productId),
        resource_type: 'image',
        tags: ['enugu', 'product', type],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const uploadMultipleImages = async (files, options = {}) => {
  return Promise.all(files.map((file) => uploadImage(file.buffer, options)));
};

export const uploadSizeGuideImage = async (fileBuffer, { sizeGuideId = null } = {}) => {
  assertCloudinaryConfigured();

  const base = env.cloudinary.folder || 'enugu';
  const folder = sizeGuideId ? `${base}/size-guides/${sizeGuideId}` : `${base}/size-guides/temp`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        tags: ['enugu', 'size-guide'],
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const uploadCampaignBanner = async (fileBuffer, { campaignId = null, variant = 'desktop' } = {}) => {
  assertCloudinaryConfigured();

  const base = env.cloudinary.folder || 'enugu';
  const folder = campaignId ? `${base}/campaigns/${campaignId}` : `${base}/campaigns/temp`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        tags: ['enugu', 'campaign', variant],
        // Preserve banner detail (baked-in text/logos) while still optimizing delivery.
        transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const getOptimizedImageUrl = (url, { width = 1200 } = {}) => {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
};

export const deleteImage = async (publicId) => {
  assertCloudinaryConfigured();

  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

export const deleteMultipleImages = async (publicIds = []) => {
  const ids = publicIds.filter(Boolean);
  if (!ids.length) return [];

  return Promise.all(ids.map((id) => deleteImage(id)));
};

export default {
  uploadImage,
  uploadDesignReference,
  uploadMultipleImages,
  uploadCampaignBanner,
  deleteImage,
  deleteMultipleImages,
  assertCloudinaryConfigured,
};
