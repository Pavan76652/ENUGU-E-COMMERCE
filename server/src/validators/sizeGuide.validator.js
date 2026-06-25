import { z } from 'zod';
import {
  SIZE_GUIDE_SIZES,
  MEASUREMENT_FIELDS,
  parseMeasurementValues,
} from '../constants/sizeGuide.js';

const measurementInput = z.union([z.string(), z.array(z.coerce.number())]);

const buildMeasurementSchema = () => {
  const shape = {};

  MEASUREMENT_FIELDS.forEach(({ key }) => {
    shape[key] = measurementInput;
  });

  return z.object(shape).transform((data) => {
    const measurements = {};

    MEASUREMENT_FIELDS.forEach(({ key }) => {
      measurements[key] = parseMeasurementValues(data[key]);
    });

    return measurements;
  });
};

const measurementsSchema = buildMeasurementSchema().superRefine((measurements, ctx) => {
  MEASUREMENT_FIELDS.forEach(({ key, label }) => {
    if (measurements[key].length !== SIZE_GUIDE_SIZES.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${label} must have ${SIZE_GUIDE_SIZES.length} comma-separated values`,
        path: [key],
      });
    }
  });
});

const optionalMeasurementsSchema = z
  .object(
    MEASUREMENT_FIELDS.reduce((shape, { key }) => {
      shape[key] = measurementInput.optional();
      return shape;
    }, {})
  )
  .optional()
  .transform((data) => {
    if (!data) return undefined;

    const measurements = {};
    let hasAny = false;

    MEASUREMENT_FIELDS.forEach(({ key }) => {
      if (data[key] !== undefined) {
        hasAny = true;
        measurements[key] = parseMeasurementValues(data[key]);
      }
    });

    return hasAny ? measurements : undefined;
  });

const hasCompleteMeasurements = (measurements = {}) =>
  MEASUREMENT_FIELDS.every(
    ({ key }) =>
      Array.isArray(measurements[key]) && measurements[key].length === SIZE_GUIDE_SIZES.length
  );

export const createSizeGuideSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  measurements: measurementsSchema.optional(),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
});

export const updateSizeGuideSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  measurements: optionalMeasurementsSchema,
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});
