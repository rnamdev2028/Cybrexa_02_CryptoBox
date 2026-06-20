export type PasswordStrength = 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';

export interface StrengthAnalysis {
  score: number; // 0 to 4 or 0 to 100
  strength: PasswordStrength;
  label: string;
  entropy: number; // bits of entropy
  timeToCrack: string; // human-readable time-to-crack
  crackTimeSeconds: number;
  checks: {
    length: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    noCommonMatch: boolean;
  };
  warnings: string[];
  suggestions: string[];
}

export interface GeneratorSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g. i, l, 1, o, 0, O
}

export interface EncryptedPayload {
  cipherText: string; // Base64 or Hex
  iv: string; // Initialization vector in Hex
  salt: string; // Salt in Hex used for PBKDF2 derivation
}

export interface SavedPassword {
  id: string;
  title: string;
  username: string;
  websiteUrl?: string;
  category: 'Login' | 'Credit Card' | 'Identity' | 'Secure Note' | 'Server';
  encryptedPayload: EncryptedPayload;
  strengthScore: number;
  strengthLabel: PasswordStrength;
  entropy: number;
  createdAt: number;
  updatedAt: number;
}

export interface SecurityAuditResult {
  totalCount: number;
  overallScore: number; // 0 to 100
  weakCount: number; // weak / very_weak
  mediumCount: number;
  strongCount: number;
  breachedCount: number;
  reusedCount: number;
  items: SecurityAuditItem[];
}

export interface SecurityAuditItem {
  id: string;
  title: string;
  username: string;
  strengthLabel: PasswordStrength;
  entropy: number;
  isBreached: boolean;
  isReused: boolean;
  recommendations: string[];
}

export interface VaultState {
  isLocked: boolean;
  isConfigured: boolean; // Has master password been set up
  passwords: SavedPassword[];
  isBiometricSimulated: boolean; // If simulated biometric login is enabled
}
