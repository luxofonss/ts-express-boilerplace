import { randomUUID } from 'crypto';
import EmailRepo from '../database/repository/email.repo';
import type { EmailRequestBody } from 'src/types/types';
import type { _DeepPartialObject } from 'utility-types/dist/mapped-types';
import config from '../config/config';
import transporter from '../config/nodemailer';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError
} from '../core/error.response';
import UserRepo from '../database/repository/user.repo';
import logger from '../middleware/logger';

class EmailService {
  /**
   * This function sends an email to the given email with the reset password link
   *
   * @param {string} email - The email of the user
   * @param {string} token - The reset password token
   */
  sendResetEmail = (email: string, token: string) => {
    const resetLink = `${config.server.url}/v1/api/reset-password/${token}`;
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Password reset',
      html: `Please click <a href="${resetLink}">here</a> to reset your password.`
    };
    console.log(resetLink);
    transporter?.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Reset password email sent: ' + info.response);
      }
    });
  };

  /**
   * This function sends an email to the given email with the email verification link
   *
   * @param {string} email - The email of the user
   * @param {string} token - The email verification token
   */
  sendVerifyEmail = (email: string, token: string) => {
    const verifyLink = `${config.server.url}/api/v1/email/verify-email/${token}`;
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Email verification',
      html: `Please click <a href="${verifyLink}">here</a> to verify your email.`
    };
    transporter?.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Verify email sent: ' + info.response);
      }
    });
  };

  /**
   * This function triggers to re-send an email to the given email with the email verification link
   *
   * @param {object} body = {email} - The email of the user who wants to verify his/her email
   */
  sendVerificationEmail = async (
    body: _DeepPartialObject<EmailRequestBody>
  ) => {
    const { email } = body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    // Check if the email is exists in the database
    const user = await UserRepo.findUserByEmail({
      email,
      select: { id: true, emailVerified: true }
    });

    if (!user) {
      throw new UnauthorizedError('Email is not exists');
    }

    // check if the use's email is verified
    if (user.emailVerified) {
      throw new ConflictError('Email is already verified');
    }

    // check if there is an existing verification token and delete it
    await EmailRepo.deleteManyEmailTokens(user.id);

    // generate a new verification token and save it to the database
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // token expires in 1 hour

    await EmailRepo.createEmailToken({
      token,
      expiresAt,
      userId: user.id
    });

    // send the verification email
    this.sendVerifyEmail(email, token);

    return { message: 'Verification email sent' };
  };

  /**
   * This function triggers to re-send an email to the given email with the email verification link
   *
   * @param {object} body = {email} - The email of the user who wants to verify his/her email
   */
  handleVerifyEmail = async (token: string | undefined) => {
    if (!token) throw new NotFoundError('Token is required');

    const verificationToken = await EmailRepo.findEmailTokenByToken(token);

    if (!verificationToken) {
      throw new NotFoundError('Token is not exists');
    }

    /** If token has expired */
    if (verificationToken.expiresAt < new Date()) {
      await EmailRepo.deleteEmailTokenByToken(token);
      throw new UnauthorizedError('Token is expired');
    }

    /** Update the user's email verification */
    await UserRepo.updateUserById(verificationToken.userId, {
      emailVerified: new Date()
    });

    /** Remove verify tokens that the user owns from the database */
    await EmailRepo.deleteManyEmailTokens(verificationToken.userId);

    return { message: 'Email verified' };
  };
}

export default new EmailService();
