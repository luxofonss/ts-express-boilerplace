import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { omit } from 'lodash';
import type { UserSignUpCredentials } from 'src/types/types';
import type { _DeepPartialObject } from 'utility-types/dist/mapped-types';
import config from '../config/config';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from '../core/error.response';
import UserRepo from '../database/repository/user.repo';
import RefreshTokenRepo from '../database/repository/refreshToken.repo';
import {
  createAccessToken,
  createRefreshToken
} from '../utils/generateTokens.utils';
import emailService from './email.service';
import emailRepo from '../database/repository/email.repo';
import generateRSAKeyPair from '../utils/generateKeyPair.util';
import {
  decryptKeyByPassword,
  encryptKeyByPassword
} from '../utils/privateKey.util';
import KeyPairRepo from '../database/repository/keyPair.repo';
import type { JwtPayload } from 'jsonwebtoken';

class AuthService {
  signUp = async (
    userSignUpCredentials: _DeepPartialObject<UserSignUpCredentials>
  ) => {
    const { username, email, password } = userSignUpCredentials;

    // check req.body values
    if (!username || !email || !password) {
      throw new NotFoundError('Username, email and password are required');
    }

    const checkUserEmail = await UserRepo.findUserByEmail({ email });

    if (checkUserEmail) throw new ConflictError('Email has alreadly used'); // email is already in db

    const hashedPassword = await argon2.hash(password);

    const newUser = await UserRepo.createUser({
      name: username,
      email,
      password: hashedPassword
    });

    if (!newUser) {
      throw new InternalServerError('User not created');
    }
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    /** Generate RSA key pair */
    const keyPair: { privateKey: string; publicKey: string } =
      generateRSAKeyPair();

    /** Encrypt private key */
    const encryptedPrivateKey = encryptKeyByPassword(
      keyPair.privateKey,
      password
    );

    await KeyPairRepo.createKeyPair({
      encryptedPrivateKey,
      publicKey: keyPair.publicKey,
      userId: newUser.id
    });
    /** Save verify token in database */
    await emailRepo.createEmailToken({
      token,
      expiresAt,
      userId: newUser.id
    });

    /** Send an email with the verification link */
    emailService.sendVerifyEmail(email, token);

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

    const user = await UserRepo.findUserByEmail({
      email,
      select: {
        id: true,
        emailVerified: true,
        password: true
      }
    });

    if (!user) throw new NotFoundError('User not found');

    // check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedError('Email is not verified');
    }

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
        const checkRefreshToken = await RefreshTokenRepo.findOneRefreshToken(
          cookies[config.jwt.refresh_token.cookie_name]
        );

        // if this token does not exists int the database or belongs to another user,
        // then we clear all refresh tokens from the user in the db

        if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
          await RefreshTokenRepo.deleteManyRefreshToken(user.id);
        } else {
          await RefreshTokenRepo.deleteOneRefreshToken(
            cookies[config.jwt.refresh_token.cookie_name]
          );
        }

        // store new refresh token in db
        await RefreshTokenRepo.createRefreshToken({
          token: newRefreshToken,
          userId: user.id
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

  decodePrivateKey = async ({
    body,
    user
  }: {
    body: { password: string | undefined };
    user: JwtPayload | undefined;
  }) => {
    const { password } = body;

    if (!password) throw new BadRequestError('Password is required');
    if (!user) throw new InternalServerError('User not found');

    const keyPair = await KeyPairRepo.getKeyPairByUserId(user.id);
    if (!keyPair) throw new NotFoundError('Key pair not found');
    const privateKey = decryptKeyByPassword(
      keyPair.encryptedPrivateKey,
      password
    );
    return { privateKey };
  };
}

export default new AuthService();
