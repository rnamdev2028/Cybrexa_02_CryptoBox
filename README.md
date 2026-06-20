# 🔐 CryptoBox — Enterprise-Grade Password Strength Checker & Encrypted Vault

**CryptoBox** is a high-performance, client-side, zero-knowledge cryptographic utility. It combines a real-time mathematical entropy computation engine, a secure candidate generator, an offline database leak filter, and a military-grade encrypted password vault using browser-native cryptography.

This project is engineered to showcase **advanced security best practices**, **zero-knowledge local persistence**, and **separation of concerns** in modern web architecture. It is ready for deployment and perfectly optimized for presentation on professional platforms like **GitHub** and **LinkedIn**.

---

## 🎨 Visual Preview & Core Architectural Pillars

CryptoBox provides a visually immersive dark-mode workspace styled with deep slate backgrounds, custom color indicators, and micro-interactions powered by `motion`:

1. **Calculated Cryptographical Rigor**: Real-time evaluation of password complexity based on information theory.
2. **True Zero-Knowledge Local Storage**: All secrets are encrypted client-side in the browser *before* writing to storage. Keys are never sent over any network.
3. **Enterprise Defense Analysis**: In-vault security auditer profiling weak passwords, breach database checks, and credential reuse vulnerability warnings.

---

## 🛠️ Cryptographic Implementation Details

### 1. Key Derivation via PBKDF2
To lock and unlock the credentials vault, CryptoBox takes the user's master password and derives a custom 256-bit key using the Web Crypto API:
* **Algorithm**: `PBKDF2` (Password-Based Key Derivation Function 2)
* **Hash Function**: `SHA-256`
* **Iterations**: `80,000` rounds
* **Salts**: A cryptographically secure random sequence unique to the user's setup, stored locally in configuration headers.

### 2. Symmetric Encryption via AES-GCM
Each password entry added to the vault undergoes separate encryption:
* **Algorithm**: `AES-GCM` (Advanced Encryption Standard in Galois/Counter Mode) with 256-bit strength.
* **Initialization Vectors (IV)**: A unique, randomized 12-byte initialization vector (`window.crypto.getRandomValues`) is generated for every credential line. This guarantees that encrypting the same password twice yields completely different outputs.
* **Data Persistence**: Base64-encoded encrypted ciphertexts are paired with their hex-encoded Salts and IVs, and committed to `localStorage`.

### 3. Shannon Entropy Model
The analysis engine calculates theoretical complexity in bits of entropy using the classical formula:

$$\text{Entropy } (E) = L \times \log_2(P)$$

Where:
* $L$ is the length of the candidate password.
* $P$ is the dynamic character pool size based on active sets:
  * Lowercase characters ($a$-$z$): $P += 26$
  * Uppercase characters ($A$-$Z$): $P += 26$
  * Numeric digits ($0$-$9$): $P += 10$
  * ASCII symbol characters: $P += 33$

---

## 🚀 Core Functional Modules

* **Password Generator (Secure Mutation-Key Generator)**: High-entropy string builder allowing user-defined controls for character sets, custom length sliders (8–32), uppercase/symbol excludes, similar-character omission triggers, and one-tap clipboard piping.
* **Real-Time Strength Meter**: Visual, active evaluation of inputs measuring entropy bits, estimated multi-GPU cracking durations, set coverage checklists, and real-time warnings.
* **Breach DB Filter (Offline Checker)**: Compares inputs against a compiled dictionary of the top 100 most common passwords list instantly without issuing external network telemetry.
* **Biometric Bypass Authentication**: High-fidelity simulator mimicking browser-level WebAuthn biometric queries, enabling instant unlock sequences if enabled by keys.
* **Security Audit Dashboard**: Aggregates all credentials stored, scoring overall health percentage, flagging password reuses, identifying breached combinations, and providing customized remediation recommendations.
* **Audit Manifest Export**: One-tap local generation of a comprehensive `.txt` file containing parsed security audits, helping users perform physical compliance checks.

---

## 💻 Tech Stack & Design System

* **Framework**: React 19 + TypeScript
* **Compiler**: Vite
* **Styling**: Tailwind CSS
* **Icons**: `lucide-react`
* **Animations**: `motion` for physics-based gestures and smooth interface transitions.

---

## 📂 Project Structure & Modularity

```bash
├── .env.example            # Environment variables placeholder
├── metadata.json           # Application properties and permissions manifest
├── tsconfig.json           # Strict TypeScript compiler definitions
├── vite.config.ts          # Vite build compilation options
├── src/
│   ├── main.tsx            # Main application bootstrap handler
│   ├── index.css            # Global CSS styling utilizing Tailwind
│   ├── App.tsx             # Main application orchestrator & layouts
│   ├── types.ts            # Type definitions, interfaces, and domains
│   ├── components/
│   │   ├── PasswordGenerator.tsx  # Secure candidate generator interface
│   │   ├── PasswordChecker.tsx    # Math metrics stream & leak check panel
│   │   └── Vault.tsx              # Encrypted zero-knowledge database & audit dashboard
│   ├── utils/
│   │   ├── crypto.ts       # SubtleCrypto GCM-symmetric loop functions
│   │   └── strength.ts     # Shannon model mathematical analyzers
│   └── data/
│       └── commonPasswords.ts     # Offline directory of frequent breach leaks
```

---

## 🚀 How to Run & Build

### Development Mode
Boot the application locally with hot-load:
```bash
npm install
npm run dev
```

### Production Build
Compile and bundle the static release:
```bash
npm run build
```

---

## 💼 Portfolio Copy-Paste Templates

Use these pre-formatted highlights to share this project with your network:

### LinkedIn Action Post 🚀
> I have just designed and engineered **CryptoBox**, an enterprise-grade password security application and zero-knowledge credentials vault built with **React**, **TypeScript**, and **Tailwind CSS**! 
> 
> To safeguard absolute state privacy, I bypassed cloud servers and leveraged browser-native Web Cryptography (`window.crypto.subtle`) to execute client-side key derivation (`PBKDF2`, HMAC-SHA256, 80k iterations) and authenticated encryption (`AES-GCM 256-bit`).
> 
> Key Achievements:
> * 🧠 **Shannon Entropy Calculator**: Built a real-time information density formula matching candidate character variety pools.
> * 🔒 **Zero-Knowledge Encryption GCM**: Configured isolated salts and 12-byte IV parameters per entry, preventing dictionary attacks.
> * ⚠️ **Breach Filter & Audit Suite**: Programmed client-side dictionary lookups and custom scoring metrics to review and export local credential safety reports.

### Resume Bullets 🛠️
* **Engineered CryptoBox**, a high-fidelity React/TypeScript password security application, implementing client-side zero-knowledge storage.
* **Integrated Web Cryptography Subtle API** to derive secure user keys via 80,000-round PBKDF2 hashes and encrypt vault states using AES-GCM-256.
* **Formulated custom Shannon-entropy calculations** to provide users with direct mathematical insights on password complexity and brute-force cracking resistance.
* **Designed an interactive data security dashboard** with live credential audit logs, breach indicators, duplicate detection, and full-text document exports.
