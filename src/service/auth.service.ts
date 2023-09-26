import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { omit } from 'lodash';
import prismaClient from '../config/prisma';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError
} from '../core/error.response';
import type { UserSignUpCredentials } from 'src/types/types';
import type { _DeepPartialObject } from 'utility-types/dist/mapped-types';
import config from '../config/config';
import {
  createAccessToken,
  createRefreshToken
} from '../utils/generateTokens.utils';
import { sendVerifyEmail } from './email.service';

class AuthService {
  signUp = async (
    userSignUpCredentials: _DeepPartialObject<UserSignUpCredentials>
  ) => {
    const { username, email, password } = userSignUpCredentials;

    // check req.body values
    if (!username || !email || !password) {
      throw new NotFoundError('Username, email and password are required');
    }

    const checkUserEmail = await prismaClient.user.findUnique({
      where: {
        email
      }
    });

    if (checkUserEmail) throw new ConflictError('Email has alreadly used'); // email is already in db

    const hashedPassword = await argon2.hash(password);

    const newUser = await prismaClient.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword
      }
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prismaClient.emailVerificationToken.create({
      data: {
        token,
        expiresAt,
        userId: newUser.id
      }
    });

    console.log('token::', token);

    // Send an email with the verification link
    sendVerifyEmail(email, token);

    return omit(newUser, 'password');
  };

  signIn = async (
    userSignUpCredentials: _DeepPartialObject<UserSignUpCredentials>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cookies: any
  ) => {
    const { email, password } = userSignUpCredentials;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email
      }
    });

    if (!user) throw new NotFoundError('User not found');

    // check if email is verified
    // if (!user.emailVerified) {
    //   throw new UnauthorizedError('Email is not verified');
    // }

    // check password
    if (await argon2.verify(user.password, password)) {
      // if there is a refresh token in the req.cookie, then we need to check if this
      // refresh token exists in the database and belongs to the current user than we need to delete it
      // if the token does not belong to the current user, then we delete all refresh tokens
      // of the user stored in the db to be on the safe site
      // we also clear the cookie in both cases

      const accessToken = createAccessToken(user.id);
      const newRefreshToken = createRefreshToken(user.id);

      if (cookies?.[config.jwt.refresh_token.cookie_name]) {
        // check if given refresh token is from the curent user
        const checkRefreshToken = await prismaClient.refreshToken.findUnique({
          where: { token: cookies[config.jwt.refresh_token.cookie_name] }
        });

        // if this token does not exists int the database or belongs to another user,
        // then we clear all refresh tokens from the user in the db

        if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
          await prismaClient.refreshToken.deleteMany({
            where: {
              userId: user.id
            }
          });
        } else {
          // else everything is fine and we just need to delete the one token
          await prismaClient.refreshToken.delete({
            where: {
              token: cookies[config.jwt.refresh_token.cookie_name]
            }
          });
        }

        // store new refresh token in db
        await prismaClient.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: user.id
          }
        });
      }
      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } else {
      throw new UnauthorizedError('Password is incorrect');
    }
  };

  /**
   * This function handles the logout process for users. It expects a request object with the following properties:
   *
   * @param {TypedRequest} req - The request object that includes a cookie with a valid refresh token
   * @param {Response} res - The response object that will be used to send the HTTP response.
   *
   * @returns {Response} Returns an HTTP response that includes one of the following:
   *   - A 204 NO CONTENT status code if the refresh token cookie is undefined
   *   - A 204 NO CONTENT status code if the refresh token does not exists in the database
   *   - A 204 NO CONTENT status code if the refresh token cookie is successfully cleared
   */
}

export default new AuthService();
