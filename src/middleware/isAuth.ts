/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { ForbiddenError, UnauthorizedError } from 'src/core/error.response';

// Why does 'jsonwebtoken' not support es6 module support ?????
// Maybe in future this will be added.....
// GitHub Issue for this problem: https://github.com/auth0/node-jsonwebtoken/issues/655
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

const { verify } = jwt;

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'

  const authHeader = req.headers?.authorization;

  if (!authHeader || authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token, authorization denied');
  }

  const token: string | undefined = authHeader.split(' ')[1];

  if (!token) throw new UnauthorizedError('No token, authorization denied');

  verify(
    token,
    config.jwt.access_token.secret,
    (err: unknown, payload: JwtPayload) => {
      if (err) throw new ForbiddenError('Invalid token'); // invalid token
      req.payload = payload;
      next();
    }
  );
};
