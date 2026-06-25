export const SIZE_GUIDE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest' },
  { key: 'bodyLength', label: 'Body Length' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'shoulder', label: 'Shoulder' },
];

export const SIZE_GUIDE_CUSTOM_VALUE = 'custom';

export const parseMeasurementInput = (input) => {
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

export const formatMeasurementInput = (values = []) => values.join(',');

export const measurementsToForm = (measurements = {}) => {
  const form = {};

  MEASUREMENT_FIELDS.forEach(({ key }) => {
    form[key] = Array.isArray(measurements[key])
      ? formatMeasurementInput(measurements[key])
      : '';
  });

  return form;
};

export const emptyMeasurementForm = () => measurementsToForm({});
