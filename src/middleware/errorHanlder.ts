import type { ErrorRequestHandler } from 'express';
import logger from './logger';

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  logger.error(err);

  res.status(500).json({ message: err.message });
};
