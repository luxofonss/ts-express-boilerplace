import type { Response } from 'express';
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
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 409 CONFLICT status code if the user email already exists in the database.
 *   - A 201 CREATED status code and a success message if the new user is successfully created and a verification email is sent.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */

class AuthController {
  signup = asyncHandler(
    async (req: TypedRequest<UserSignUpCredentials>, res: Response) => {
      OK(res, 'Sign up successfully!', await authService.signUp(req.body));
    }
  );

  signin = asyncHandler(
    async (req: TypedRequest<UserLoginCredentials>, res: Response) => {
      const cookies = req.cookies;
      OK(
        res,
        'Sign in successfully!',
        await authService.signIn(req.body, cookies)
      );
    }
  );
}

export default new AuthController();
