import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import logger from '../config/logger.js';

const handleZodError = (error) => {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return new ApiError(400, 'Validation failed', errors);
};

const handleMongooseValidationError = (error) => {
  const errors = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));

  return new ApiError(400, 'Validation failed', errors);
};

const handleMongooseDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  return new ApiError(409, `${field} already exists`);
};

const handleJWTError = () => new ApiError(401, 'Invalid token');
const handleJWTExpiredError = () => new ApiError(401, 'Token expired');

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (error instanceof ZodError) {
    error = handleZodError(error);
  } else if (error.name === 'ValidationError') {
    error = handleMongooseValidationError(error);
  } else if (error.code === 11000) {
    error = handleMongooseDuplicateKeyError(error);
  } else if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else if (error.name === 'CastError') {
    error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message =
      env.isProduction && statusCode === 500
        ? 'Internal server error'
        : error.message || 'Internal server error';

    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(env.isDevelopment && { stack: error.stack }),
    ...(req.id && { requestId: req.id }),
  };

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(
      { err, requestId: req.id, method: req.method, url: req.originalUrl },
      'Request failed'
    );
  } else if (!env.isProduction) {
    logger.warn(
      { requestId: req.id, method: req.method, url: req.originalUrl, message: error.message },
      'Request error'
    );
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
