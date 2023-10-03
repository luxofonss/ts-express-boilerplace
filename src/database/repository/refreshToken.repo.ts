import prismaClient from '../../config/prisma';
import type IRefreshTokenModel from '../models/refreshToken.model';

class RefreshTokenRepo {
  /** Create a new refresh token */
  createRefreshToken = async (refreshTokenData: {
    token: string;
    userId: string;
  }): Promise<IRefreshTokenModel | null> => {
    const refreshToken = await prismaClient.refreshToken.create({
      data: refreshTokenData
    });

    // Add the missing properties to the refreshToken object
    const refreshTokenWithProps: IRefreshTokenModel = {
      id: refreshToken.id,
      token: refreshToken.token,
      userId: refreshToken.userId,
      createdAt: refreshToken.createdAt
    };

    return refreshTokenWithProps;
  };

  /** Find one refresh token */
  findOneRefreshToken = async (
    token: string
  ): Promise<IRefreshTokenModel | null> => {
    return await prismaClient.refreshToken.findUnique({
      where: {
        token
      }
    });
  };

  /** Delete a refresh token */
  deleteOneRefreshToken = async (refreshTokenId: string): Promise<boolean> => {
    await prismaClient.refreshToken.delete({
      where: {
        id: refreshTokenId
      }
    });

    return true;
  };

  /** Delete multiple refresh token */
  deleteManyRefreshToken = async (userId: string): Promise<boolean> => {
    await prismaClient.refreshToken.deleteMany({
      where: {
        userId
      }
    });

    return true;
  };
}

export default new RefreshTokenRepo();
