import { createClient } from '@supabase/supabase-js';
import { Keypair } from '@solana/web3.js';
import CryptoJS from 'crypto-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const encryptionSecret = process.env.ENCRYPTION_SECRET!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Encrypts a private key using AES
 */
export const encryptPrivateKey = (privateKey: string): string => {
  return CryptoJS.AES.encrypt(privateKey, encryptionSecret).toString();
};

/**
 * Decrypts a private key using AES
 */
export const decryptPrivateKey = (encryptedKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, encryptionSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Generates a new Solana wallet
 */
export const generateSolanaWallet = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const secretKey = Buffer.from(keypair.secretKey).toString('hex');
  
  return {
    publicKey,
    secretKey,
  };
};
