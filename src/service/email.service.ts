import { randomUUID } from 'crypto';
import logger from '../middleware/logger';
import transporter from '../config/nodemailer';
import config from '../config/config';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError
} from '../core/error.response';
import prismaClient from '../config/prisma';
import type { EmailRequestBody } from 'src/types/types';
import type { _DeepPartialObject } from 'utility-types/dist/mapped-types';

class EmailService {
  /**
   * This function sends an email to the given email with the reset password link
   *
   * @param {string} email - The email of the user
   * @param {string} token - The reset password token
   */
  sendResetEmail = (email: string, token: string) => {
    const resetLink = `${config.server.url}/api/v1/reset-password/${token}`;
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
    const verifyLink = `${config.server.url}/api/v1/verify-email/${token}`;
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

  sendVerificationEmail = async (
    body: _DeepPartialObject<EmailRequestBody>
  ) => {
    const { email } = body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    // Check if the email is exists in the database
    const user = await prismaClient.user.findUnique({
      where: { email },
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
    await prismaClient.emailVerificationToken.deleteMany({
      where: {
        user: { id: user.id }
      }
    });

    // generate a new verification token and save it to the database
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // token expires in 1 hour
    await prismaClient.emailVerificationToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id
      }
    });

    // send the verification email
    this.sendVerifyEmail(email, token);

    return { message: 'Verification email sent' };
  };
}

export default new EmailService();
