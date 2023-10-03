import prismaClient from '../../config/prisma';
import type IKeyPairModel from '../models/keyPair.model';

class KeyPairRepo {
  /**
   * Create key pair
   * @params {string} encryptedPrivateKey
   * @params {string} publicKey
   * @params {string} userId
   * */

  createKeyPair = async (data: {
    encryptedPrivateKey: string;
    publicKey: string;
    userId: string;
  }): Promise<IKeyPairModel> => {
    const keyPair = await prismaClient.keyPair.create({
      data
    });
    return keyPair;
  };

  /**
   * Get keyPair by user's id
   * @params {string} userId
   * @params {string} password
   */
  getKeyPairByUserId = async (
    userId: string
  ): Promise<IKeyPairModel | null> => {
    const keyPair = await prismaClient.keyPair.findFirst({
      where: {
        userId
      }
    });
    return keyPair;
  };
}

export default new KeyPairRepo();
