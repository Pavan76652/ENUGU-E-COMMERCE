import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(new ApiError(400, 'Validation failed', errors));
      }

      next(error);
    }
  };

export default validate;
