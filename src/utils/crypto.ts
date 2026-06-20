import { EncryptedPayload } from '../types';

// Convert ArrayBuffer to Hex String
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArrays = new Uint8Array(buffer);
  return Array.prototype.map.call(byteArrays, (x: number) => ('0' + x.toString(16)).slice(-2)).join('');
}

// Convert Hex String to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const trimmed = hex.trim();
  const bytes = new Uint8Array(trimmed.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(trimmed.substring(i * 2, (i * 2) + 2), 16);
  }
  return bytes.buffer;
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-GCM Key using PBKDF2
async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(masterPassword);

  // Import original raw master password bits
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive the high-entropy AES key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 80000, // Adjusted for fast client response while retaining strong hardware attack resistance
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext string using our Master Password.
 * Returns an EncryptedPayload containing the Salt, IV, and CipherText.
 */
export async function encryptPassword(plainText: string, masterPassword: string): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);

  // 1. Generate clean salts and IV vectors
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 2. Derive crypto key
  const key = await deriveKey(masterPassword, salt);

  // 3. Encrypt via AES-GCM
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );

  return {
    cipherText: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToHex(iv.buffer),
    salt: arrayBufferToHex(salt.buffer)
  };
}

/**
 * Decrypts a secure password using the Master Password.
 */
export async function decryptPassword(payload: EncryptedPayload, masterPassword: string): Promise<string> {
  try {
    const saltBytes = new Uint8Array(hexToArrayBuffer(payload.salt));
    const ivBytes = new Uint8Array(hexToArrayBuffer(payload.iv));
    const cipherBuffer = base64ToArrayBuffer(payload.cipherText);

    // 1. Derive identical key from same master password and stored unique salt
    const key = await deriveKey(masterPassword, saltBytes);

    // 2. Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes
      },
      key,
      cipherBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Authentication / Master Password mismatch. Decryption aborted.');
  }
}

/**
 * Verify if master password is valid, by trying to decrypt a test token.
 * We can save our config state with a "test payload" derived from the password itself.
 */
export async function verifyMasterPassword(masterPassword: string, testPayloadHex: EncryptedPayload): Promise<boolean> {
  try {
    const decrypted = await decryptPassword(testPayloadHex, masterPassword);
    return decrypted === "cryptobox-vault-authenticated";
  } catch {
    return false;
  }
}

/**
 * Creates an authentication test block that will let us safely verify if a master password is correct later on.
 */
export async function createAuthVerificationPayload(masterPassword: string): Promise<EncryptedPayload> {
  return encryptPassword("cryptobox-vault-authenticated", masterPassword);
}
