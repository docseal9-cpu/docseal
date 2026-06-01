// Web Crypto API for Zero-Knowledge Architecture

const ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const HASH_ALGO = 'SHA-256';
const CIPHER_ALGO = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Derives a cryptographic key from a password and salt using PBKDF2.
 */
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO
    },
    keyMaterial,
    { name: CIPHER_ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a File object using the provided password.
 * Returns a Blob containing [Salt (16 bytes)][IV (12 bytes)][Encrypted Data].
 */
export async function encryptFile(file, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const key = await deriveKey(password, salt);
  
  const fileBuffer = await file.arrayBuffer();
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: CIPHER_ALGO,
      iv: iv
    },
    key,
    fileBuffer
  );

  // Combine Salt, IV, and Encrypted Data into a single Uint8Array
  const combinedBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
  combinedBuffer.set(salt, 0);
  combinedBuffer.set(iv, salt.length);
  combinedBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

  return new Blob([combinedBuffer], { type: 'application/octet-stream' });
}

/**
 * Decrypts a Blob using the provided password.
 * Expects the Blob to start with [Salt (16 bytes)][IV (12 bytes)].
 */
export async function decryptFile(encryptedBlob, password) {
  const encryptedBuffer = await encryptedBlob.arrayBuffer();
  
  if (encryptedBuffer.byteLength < SALT_LENGTH + IV_LENGTH) {
    throw new Error('Invalid encrypted file format: file too small');
  }

  // Extract Salt, IV, and Encrypted Data
  const salt = new Uint8Array(encryptedBuffer.slice(0, SALT_LENGTH));
  const iv = new Uint8Array(encryptedBuffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH));
  const data = new Uint8Array(encryptedBuffer.slice(SALT_LENGTH + IV_LENGTH));

  const key = await deriveKey(password, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: CIPHER_ALGO,
        iv: iv
      },
      key,
      data
    );
    
    return new Blob([decryptedBuffer]);
  } catch (err) {
    throw new Error('Decryption failed: Incorrect password or corrupted file');
  }
}
