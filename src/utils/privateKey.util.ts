import crypto from 'crypto';
// Generate an RSA private key

export const encryptKeyByPassword = (privateKey: string, password: string) => {
  // Generate a random 16-byte (128-bit) salt
  const salt = crypto.randomBytes(16);

  // Derive a key and IV from the password and salt using PBKDF2
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16); // Use a random IV for each privateKey

  // Create an AES-GCM cipher with the key and IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // Encrypt the privateKey
  const encryptedPrivateKey = Buffer.concat([
    cipher.update(privateKey, 'utf8'),
    cipher.final()
  ]);

  // Get the authentication tag (used for integrity checking)
  const tag = cipher.getAuthTag();

  // Return the salt, IV, ciphertext, and tag as a base64-encoded string
  return Buffer.concat([salt, iv, tag, encryptedPrivateKey]).toString('base64');
};

export const decryptKeyByPassword = (
  encryptedPrivateKey: string,
  password: string
) => {
  // Decode the base64-encoded input
  const buffer = Buffer.from(encryptedPrivateKey, 'base64');

  // Extract the salt, IV, tag, and ciphertext
  const salt = buffer.slice(0, 16);
  const iv = buffer.slice(16, 32);
  const tag = buffer.slice(32, 48);
  const ciphertext = buffer.slice(48);

  // Derive the key from the password and salt using PBKDF2
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  // Create an AES-GCM decipher with the key, IV, and tag
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  // Decrypt the ciphertext
  const decryptedMessage = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  // Return the decrypted message as a UTF-8 string
  return decryptedMessage.toString('utf8');
};
