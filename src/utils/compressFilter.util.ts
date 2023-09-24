import compression from 'compression';
import type { Request, Response } from 'express';

/**
 * Filter Function for the compression middleware
 * @params req HTTPs Request
 * @params res HTTPs Response
 * @returns Return false if request header contain x-no-compression
 */

const compressFilter = (req: Request, res: Response): boolean => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

export default compressFilter;
