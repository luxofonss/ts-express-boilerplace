import type { Prisma } from '@prisma/client';
import type IUserModel from '../models/user.model';
import prismaClient from '../../config/prisma';

class UserRepo {
  /**
   * Create a new user
   * @param userData = { name: string, email: string, password: string}
   * @returns Promise<ICreateUserPayload>
   */
  createUser = async (
    userData: Prisma.UserCreateInput
  ): Promise<IUserModel | null> => {
    return await prismaClient.user.create({ data: userData });
  };

  /**
   * Find a user by email
   * @param email
   * @returns Promise<IUserModel | null>
   */
  findUserByEmail = async ({
    email,
    select = {
      id: true,
      name: true,
      email: true,
      emailVerified: true
    }
  }: {
    email: string;
    select?: Prisma.UserSelect;
  }): Promise<IUserModel | null> => {
    return await prismaClient.user.findUnique({
      where: {
        email
      },
      select
    });
  };

  /**
   * Update user by id
   * @param userId
   * @param userData: Prisma.UserUpdateInput
   */

  updateUserById = async (
    userId: string,
    userData: Prisma.UserUpdateInput
  ): Promise<IUserModel | null> => {
    return await prismaClient.user.update({
      where: { id: userId },
      data: userData
    });
  };
}

export default new UserRepo();
