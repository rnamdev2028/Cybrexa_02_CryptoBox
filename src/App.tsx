import React, { useState, useCallback } from 'react';
import { 
  Shield, Fingerprint, Lock, Server, BookOpen, Terminal, Cpu, 
  ExternalLink, ChevronDown, ChevronUp, CheckCircle, Info 
} from 'lucide-react';
import PasswordChecker from './components/PasswordChecker';
import PasswordGenerator from './components/PasswordGenerator';
import Vault from './components/Vault';

export default function App() {
  // Shared state: when a password is generated, we can pipe it into the active checker field.
  const [activeCandidate, setActiveCandidate] = useState('');
  
  // Bridge state: when sending a password from strength checker to the local vault register
  const [pipelinePassword, setPipelinePassword] = useState('');

  // Expandable documentation sections for professional GitHub / LinkedIn audits
  const [isDocExpanded, setIsDocExpanded] = useState(true);

  // Transfer generated password to Checker input
  const handlePasswordGenerated = useCallback((pass: string) => {
    setActiveCandidate(pass);
  }, []);

  // Bridge analyzer candidate to Vault form
  const handleSendToVault = (pass: string) => {
    setPipelinePassword(pass);
    // Clear pipeline after a brief moment so Vault can re-detect trigger if needed
    setTimeout(() => {
      setPipelinePassword('');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* PROFESSIONAL LOGO HEADER */}
      <header className="border-b border-slate-800 bg-[#090D1A]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-md">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-lg tracking-wider text-slate-50">CryptoBox</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE APPLICATION CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 flex-grow w-full space-y-8 animate-fadeIn">
        
        {/* TOP INTRO CARD HERO */}
        <div id="hero-alert-banner" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm">
          <div className="space-y-1.5 max-w-4xl">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans tracking-tight">
              Secure Password Strength & Local Credentials Auditor
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              CryptoBox is an offline-first cryptographic utility designed to guarantee maximum privacy. Analyze candidates with local dictionary matches, generate strong passwords dynamically, and encrypt your keys in an isolated offline vault using PBKDF2 with SHA-256 and AES-256-GCM.
            </p>
          </div>
        </div>

        {/* WORKSPACE BENTO GRID - CHECKER & GENERATOR */}
        <div id="interactive-tools-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* SECURE DYNAMIC KEY GENERATOR (LEFT INPUT PANEL) */}
          <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />

          {/* DYNAMIC METRICS STREAM (RIGHT OUTPUT PANEL) */}
          <PasswordChecker 
            onSuggestSelect={setActiveCandidate} 
            onSendToVault={handleSendToVault}
            externalPassword={activeCandidate}
          />

        </div>

        {/* VAULT STORAGE DEEP SECTORS */}
        <Vault incomingPassword={pipelinePassword} onClearIncoming={() => setPipelinePassword('')} />

        {/* ARCHITECTURE BLUEPRINTS SECTION (PROFESSIONAL-GRADE DOCUMENTATION) */}
        <div id="blueprints-documentation-panel" className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative transition-all duration-300">
          <button 
            id="toggle-docs-visibility-btn"
            onClick={() => setIsDocExpanded(!isDocExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-base text-slate-100 flex items-center gap-2">
                  Technical Architecture & Cryptography Rules Draft
                  <span className="text-[10px] font-mono select-none px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-400/20 font-medium">
                    Whitepaper
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Read the zero-knowledge local storage specifications and math models</p>
              </div>
            </div>
            {isDocExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>

          {isDocExpanded && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-6 text-xs text-slate-400 leading-relaxed font-sans max-w-none animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Math & Entropy section */}
                <div id="math-specifications-doc" className="space-y-3 bg-slate-950 border border-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 font-mono font-extrabold text-[11px] text-slate-200">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>01 // SHANNON ENTROPY MODEL</span>
                  </div>
                  <p>
                    CryptoBox measures structural password strength using the standardized <b>Shannon Entropy Equation</b> based on character pools size ($P$) and length ($L$):
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded font-mono text-center text-indigo-400 select-all border border-slate-800/80 text-[11px]">
                    Entropy (E) = L * log₂ ( Pool Size )
                  </div>
                  <p>
                    Pool sizes are computed dynamically based on character variety. E.g. Lowercase (26), Uppercase (+26), Numbers (+10), Symbols (+33) which scales the mathematical complexity exponentially.
                  </p>
                </div>

                {/* Key Derivation PBKDF2 GCM section */}
                <div id="key-derivation-doc" className="space-y-3 bg-slate-950 border border-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 font-mono font-extrabold text-[11px] text-slate-200">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>02 // ZERO KNOWLEDGE HANDSHAKE</span>
                  </div>
                  <p>
                    To lock credential assets, the user's master credentials undergo <b>PBKDF2 Key Derivation</b> using SHA-256 with 80,000 salt-infused iterations.
                  </p>
                  <p>
                    This is coupled to <b>AES-GCM (Galois/Counter Mode 256-bit)</b> symmetric loops. The plaintext is encrypted completely client-side in secure browser volatile memories:
                  </p>
                  <div className="bg-slate-900 p-2 text-center text-[10px] font-mono text-emerald-400 border border-slate-800/80">
                    Symmetric Key = PBKDF2(Master, Salt, 80k)
                  </div>
                </div>

                {/* Breach Database Audits */}
                <div id="audit-system-doc" className="space-y-3 bg-slate-950 border border-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 font-mono font-extrabold text-[11px] text-slate-200">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span>03 // BRUTE-FORCE RATE ESTIMATES</span>
                  </div>
                  <p>
                    Time-to-crack values are projected from dictionary tables against a brute-force cluster executing <b>100 Billion guesses per second</b> (offline high-end multi-GPU cracking setups).
                  </p>
                  <p>
                    The <b>Breach DB check</b> runs an instant local, zero-network comparative scan vs the top 100 most common passwords globally. Passwords under these rulesets are labeled immediately as <code>VULNERABLE</code>.
                  </p>
                </div>

              </div>

              {/* Developer Guidelines for Portfolios/Interviews/LinkedIn */}
              <div id="developer-portfolio-instructions" className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-sans font-bold text-slate-200 text-xs text-purple-300">
                  <CheckCircle className="w-4.5 h-4.5 text-purple-400" />
                  <span>HOW TO HIGHLIGHT THIS ON GITHUB & LINKEDIN PORTFOLIOS:</span>
                </div>
                <p>
                  This project demonstrates architectural separation of concerns and browser-level cryptography compliance. You can use the copy-paste bullet points below for your professional resume or case study profiles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] select-all font-mono text-slate-300">
                  <div className="space-y-1.5 bg-slate-950 p-3 rounded border border-slate-800/60 leading-normal">
                    <p className="font-bold text-white text-xs mb-1">💼 LinkedIn Post Draft:</p>
                    "🚀 Just launched CryptoBox! Built a professional, client-side zero-knowledge password vault and real-time entropy checker using React, TypeScript, and Tailwind. Leveraged the browser Web Crypto API (SubtleCrypto) to implement secure client-side PBKDF2 key derivation and AES-GCM 256-bit symmetric encryption loops for local-encrypted state storage. No central server intercepts keys!"
                  </div>

                  <div className="space-y-1.5 bg-slate-950 p-3 rounded border border-slate-800/60 leading-normal">
                    <p className="font-bold text-white text-xs mb-1">🛠️ GitHub Readme highlights:</p>
                    "- **Local-First Zero Knowledge Architectures**: High-performance local encryption using PBKDF2 (80,000 rounds, HMAC-SHA256) and AES-GCM 256.<br />
                    - **Shannon Entropy Metrics Engine**: Live calculation of entropy based on variable set combinations.<br />
                    - **Breach Database Filter**: Instant client-side check matching Candidates vs top 100 leaky weak words.<br />
                    - **Biometric Bypass Authentication**: High-fidelity visual simulated WebAuthn authorization routines."
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* COMPLIANCE FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-[10px] text-slate-500 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} CRYPTOBOX AUDIT SUITE // LOCAL CLIENT EXECUTION ONLY.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-emerald-400">●</span> ZERO CLOUD NETWORK ACCESS FOR KEY STORAGE DIRECTIVES.
          </div>
          <p className="text-slate-600">
            COMPACT NIST SP 800-63B COMPLIANT SECURITY PROTOCOLS
          </p>
        </div>
      </footer>

    </div>
  );
}
