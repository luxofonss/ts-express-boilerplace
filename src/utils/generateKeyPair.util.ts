/* eslint-disable @typescript-eslint/space-before-function-paren */
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import { generateKeyPairSync } from 'crypto';

export default function generateRSAKeyPair(): {
  privateKey: string;
  publicKey: string;
} {
  // Generate a new RSA key pair
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // You can adjust the key size as needed
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem' // PKCS1 PEM format for public key
    },
    privateKeyEncoding: {
      type: 'pkcs1', // PKCS1 PEM format for private key
      format: 'pem'
    }
  });

  return { privateKey, publicKey };
}
