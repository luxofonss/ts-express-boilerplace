import type { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
      cookies: {
        refreshToken?: string;
      };
    }
  }
}
