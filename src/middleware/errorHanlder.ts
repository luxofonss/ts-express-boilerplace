import type { ErrorRequestHandler } from 'express';
import logger from './logger';

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  logger.error(err);
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'Internal server error',
    errors: err.errors
  });
};
