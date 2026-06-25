export const getOptimizedSizeGuideImageUrl = (url, { width = 1200 } = {}) => {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
};

export const hasSizeGuideImage = (sizeGuide) => Boolean(sizeGuide?.image?.url);

export const hasSizeGuideMeasurements = (sizeGuide) => {
  const measurements = sizeGuide?.measurements ?? {};
  const keys = ['chest', 'bodyLength', 'sleeveLength', 'shoulder'];
  return keys.every((key) => Array.isArray(measurements[key]) && measurements[key].length > 0);
};
