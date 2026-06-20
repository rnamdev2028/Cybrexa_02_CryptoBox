import { COMMON_PASSWORDS } from '../data/commonPasswords';
import { PasswordStrength, StrengthAnalysis } from '../types';

export function calculateEntropyAndAnalyze(password: string): StrengthAnalysis {
  const analysis: StrengthAnalysis = {
    score: 0,
    strength: 'very_weak',
    label: 'Very Weak',
    entropy: 0,
    timeToCrack: 'Instant',
    crackTimeSeconds: 0,
    checks: {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      noCommonMatch: !COMMON_PASSWORDS.includes(password.toLowerCase().trim()),
    },
    warnings: [],
    suggestions: [],
  };

  if (!password) {
    return analysis;
  }

  // 1. Calculate Pool Size for Entropy
  let poolSize = 0;
  if (analysis.checks.hasLowercase) poolSize += 26;
  if (analysis.checks.hasUppercase) poolSize += 26;
  if (analysis.checks.hasNumbers) poolSize += 10;
  if (analysis.checks.hasSymbols) poolSize += 33; // Usually ~32 symbols in ASCII

  if (poolSize === 0) {
    poolSize = 1; // Fallback
  }

  // Shannon entropy formula: E = L * Log2(PoolSize)
  analysis.entropy = Math.round(password.length * Math.log2(poolSize) * 10) / 10;

  // 2. Assess time to crack
  // Let us assume a rate of 100,000,000,000 (100 billion) guesses/sec, typical of an offline GPU crack setup
  const guessesPerSec = 100_000_000_000;
  const totalGuesses = Math.pow(2, analysis.entropy);
  const seconds = totalGuesses / guessesPerSec;
  analysis.crackTimeSeconds = seconds;
  analysis.timeToCrack = formatCrackTime(seconds);

  // 3. Formulate Score (0-100) and Label
  let score = 0;

  // Length points
  if (password.length >= 16) score += 35;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else score += password.length * 1.5;

  // Variety points
  let varietyCount = 0;
  if (analysis.checks.hasLowercase) varietyCount++;
  if (analysis.checks.hasUppercase) varietyCount++;
  if (analysis.checks.hasNumbers) varietyCount++;
  if (analysis.checks.hasSymbols) varietyCount++;

  score += varietyCount * 12; // Max 48

  // Entropy bonus/malus
  if (analysis.entropy > 80) score += 17;
  else if (analysis.entropy > 60) score += 10;
  else if (analysis.entropy > 40) score += 5;

  // Deduction if matched against Breach list
  if (!analysis.checks.noCommonMatch) {
    score = Math.min(score, 15); // Heavily restrict score if in worst 100 passwords list
  }

  // Ensure bounded
  analysis.score = Math.max(0, Math.min(100, Math.round(score)));

  // Derive strength categories
  if (analysis.score < 25) {
    analysis.strength = 'very_weak';
    analysis.label = 'Critically Weak';
  } else if (analysis.score < 50) {
    analysis.strength = 'weak';
    analysis.label = 'Weak';
  } else if (analysis.score < 70) {
    analysis.strength = 'medium';
    analysis.label = 'Moderate';
  } else if (analysis.score < 88) {
    analysis.strength = 'strong';
    analysis.label = 'Strong';
  } else {
    analysis.strength = 'very_strong';
    analysis.label = 'Military Grade';
  }

  // 4. Generate automated suggestions & warnings
  if (!analysis.checks.noCommonMatch) {
    analysis.warnings.push("Identified in Database Breach! This is one of the top 100 most commonly used passwords globally.");
    analysis.suggestions.push("URGENT: Change this password immediately. Avoid dictionary words, sequential symbols, or names.");
  }

  if (password.length < 8) {
    analysis.warnings.push("Length is too short. Critically insecure against modern brute force algorithms.");
    analysis.suggestions.push("Increase password length to at least 12–16 characters. Length contributes exponentially to safety.");
  } else if (password.length < 12) {
    analysis.warnings.push("Password length is acceptable but can be easily optimized.");
    analysis.suggestions.push("Aim for 12 or more characters to form an unbreakable barrier against dictionary attacks.");
  }

  if (varietyCount < 3) {
    analysis.warnings.push("Low character diversity. Predictable pattern profile.");
  }

  if (!analysis.checks.hasUppercase) {
    analysis.suggestions.push("Inject Uppercase letters (A-Z) to increase pool diversity of the entropy profile.");
  }
  if (!analysis.checks.hasNumbers) {
    analysis.suggestions.push("Incorporate Numbers (0-9) to disrupt pattern-matching heuristics.");
  }
  if (!analysis.checks.hasSymbols) {
    analysis.suggestions.push("Insert Special characters ($&@#) to dramatically inflate structural entropy.");
  }

  // Add passive security architecture notice
  if (analysis.score >= 88 && analysis.checks.noCommonMatch) {
    analysis.suggestions.push("Excellent configuration. This password exceeds standard regulatory requirements (NIST SP 800-63B).");
  }

  return analysis;
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instantaneously';
  if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? 's' : ''}`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} day${Math.round(days) !== 1 ? 's' : ''}`;
  
  const months = days / 30.42;
  if (months < 12) return `${Math.round(months)} month${Math.round(months) !== 1 ? 's' : ''}`;
  
  const years = months / 12;
  if (years < 1000) return `${Math.round(years)} year${Math.round(years) !== 1 ? 's' : ''}`;
  
  const millennia = years / 1000;
  if (millennia < 1000) return `${Math.round(millennia)} millennia`;

  const millionsOfYears = millennia / 1000;
  if (millionsOfYears < 1000) return `${Math.round(millionsOfYears)} million years`;

  const billionsOfYears = millionsOfYears / 1000;
  return `${Math.round(billionsOfYears)} billion years`;
}

// Generate highly robust automated suggestions for stronger character combinations
export function generateStrongSuggestions(password: string): string[] {
  const suggestions: string[] = [];
  if (!password) return suggestions;

  // Check if some letters could be swapped, or standard secure modifications applied
  const leetList: Record<string, string> = {
    'a': '@', 'A': '4',
    'e': '3', 'E': '3',
    'i': '!', 'I': '1',
    'o': '0', 'O': '0',
    's': '$', 'S': '5',
    't': '7', 'T': '7'
  };

  // 1. Rule of Leetspeak (often guessed but increases entropy slightly compared to pure letters, but better is to suggest a real passphrase)
  let leetVersion = '';
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    leetVersion += leetList[char] || char;
  }
  if (leetVersion !== password) {
    suggestions.push(`Apply l33t-speak variety: Change some characters (e.g. "${leetVersion}")`);
  }

  // 2. Passphrase suggestion
  suggestions.push("Utilize a 'Passphrase' instead: Combine 4-5 random words (e.g., 'correct-horse-battery-staple') for high entropy and recall.");

  // 3. Salt suffix
  suggestions.push(`Append static salt suffix: e.g. appending a distinct sequence like "#CpB!" elevates resistance against rainbow tables.`);

  return suggestions;
}
