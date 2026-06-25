export const SIZE_GUIDE_SIZES = Object.freeze(['S', 'M', 'L', 'XL', 'XXL', '3XL']);

export const MEASUREMENT_FIELDS = Object.freeze([
  { key: 'chest', label: 'Chest' },
  { key: 'bodyLength', label: 'Body Length' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'shoulder', label: 'Shoulder' },
]);

export const parseMeasurementValues = (input) => {
  if (Array.isArray(input)) {
    return input.map((value) => Number(value)).filter((value) => !Number.isNaN(value));
  }

  if (typeof input !== 'string') return [];

  return input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => Number(part))
    .filter((value) => !Number.isNaN(value));
};

export const validateMeasurements = (measurements = {}) => {
  const errors = [];

  MEASUREMENT_FIELDS.forEach(({ key, label }) => {
    const values = measurements[key];
    if (!Array.isArray(values) || values.length !== SIZE_GUIDE_SIZES.length) {
      errors.push(`${label} must have exactly ${SIZE_GUIDE_SIZES.length} values`);
    }
  });

  return errors;
};
