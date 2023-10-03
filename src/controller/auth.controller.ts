import type { Request, Response } from 'express';
import type {
  TypedRequest,
  UserLoginCredentials,
  UserSignUpCredentials
} from '../types/types';

import { OK } from '../core/success.response';
import asyncHandler from 'express-async-handler';
import authService from '../service/auth.service';

/**
 * This function handles the signup process for new users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserSignUpCredentials>} req - The request object that includes user's username, email, and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response
 */

class AuthController {
  signUp = asyncHandler(
    async (req: TypedRequest<UserSignUpCredentials>, res: Response) => {
      OK(res, 'Sign up successfully!', await authService.signUp(req.body));
    }
  );

  signIn = asyncHandler(
    async (req: TypedRequest<UserLoginCredentials>, res: Response) => {
      const cookies: string = req.cookies;
      OK(
        res,
        'Sign in successfully!',
        await authService.signIn(req.body, cookies)
      );
    }
  );

  decodePrivateKey = asyncHandler(async (req: Request, res: Response) => {
    OK(
      res,
      'Decode successfully!',
      await authService.decodePrivateKey({ body: req.body, user: req.user })
    );
  });
}

export default new AuthController();
