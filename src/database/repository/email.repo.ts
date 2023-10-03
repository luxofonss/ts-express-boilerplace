import prismaClient from '../../config/prisma';
import type IEmailVerificationToken from '../models/emailVerificationToken.model';

class EmailRepo {
  /**
   * create email token
   * @body { token: string, expiresAt: Date, userId: string }
   * @returns Promise<IEmailVerificationToken | null>
   */

  createEmailToken = async (emailTokenData: {
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<IEmailVerificationToken | null> => {
    return await prismaClient.emailVerificationToken.create({
      data: emailTokenData
    });
  };

  /**
   * Delete one email token by token
   * @params { token: string }
   */
  deleteEmailTokenByToken = async (token: string) => {
    return await prismaClient.emailVerificationToken.delete({
      where: { token }
    });
  };

  /**
   * Delete many email tokens
   * @params { userId: string }
   */
  deleteManyEmailTokens = async (userId: string) => {
    return await prismaClient.emailVerificationToken.deleteMany({
      where: {
        user: { id: userId }
      }
    });
  };

  /**
   * Find emailTokens by token
   * @params { token: string }
   */

  findEmailTokenByToken = async (
    token: string
  ): Promise<IEmailVerificationToken | null> => {
    return await prismaClient.emailVerificationToken.findFirst({
      where: { token }
    });
  };
}

export default new EmailRepo();
