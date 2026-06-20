import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Eye, EyeOff, AlertTriangle, Lightbulb, RefreshCw, Key, Info, CheckCircle2 } from 'lucide-react';
import { calculateEntropyAndAnalyze, generateStrongSuggestions } from '../utils/strength';
import { StrengthAnalysis } from '../types';

interface PasswordCheckerProps {
  onSuggestSelect: (password: string) => void;
  onSendToVault?: (password: string) => void;
  externalPassword?: string;
}

export default function PasswordChecker({ onSuggestSelect, onSendToVault, externalPassword }: PasswordCheckerProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<StrengthAnalysis | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  // Update when password changes
  useEffect(() => {
    const res = calculateEntropyAndAnalyze(password);
    setAnalysis(res);
    setSmartSuggestions(generateStrongSuggestions(password));
  }, [password]);

  // Handle external password injected from Generator or other parts
  useEffect(() => {
    if (externalPassword !== undefined) {
      setPassword(externalPassword);
    }
  }, [externalPassword]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very_weak': return 'bg-red-500';
      case 'weak': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-emerald-500';
      case 'very_strong': return 'bg-cyan-500';
      default: return 'bg-gray-700';
    }
  };

  const getStrengthTextColor = (strength: string) => {
    switch (strength) {
      case 'very_weak': return 'text-red-400';
      case 'weak': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'strong': return 'text-emerald-400';
      case 'very_strong': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div id="password-checker-card" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Visual background glow decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-sans font-semibold text-lg text-slate-100">Live Strength Analytics</h2>
          <p className="text-xs text-slate-400">Dynamic entropy analysis & real-time credential auditing</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Core Input Panel */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 tracking-wider uppercase">Analyze Password</label>
          <div className="relative">
            <input
              id="analyze-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a credentials candidate..."
              className="w-full bg-slate-950 text-slate-100 px-4 py-3 pr-24 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm transition-colors"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {password && (
                <button
                  id="clear-password-btn"
                  onClick={() => setPassword('')}
                  className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 px-1.5 py-1 bg-slate-900 rounded border border-slate-800"
                >
                  Clear
                </button>
              )}
              <button
                id="toggle-visible-checker-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {password ? (
          <div className="space-y-5 animate-fadeIn">
            {/* Real-time Indicator Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Security Score: <span className="font-mono text-slate-200">{analysis?.score}%</span></span>
                <span className={`font-mono font-bold tracking-wider uppercase ${getStrengthTextColor(analysis?.strength || '')}`}>
                  {analysis?.label}
                </span>
              </div>
              
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex p-[1px] border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(analysis?.strength || '')}`}
                  style={{ width: `${analysis?.score || 0}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Shannon Entropy</span>
                <span className="block font-mono text-base font-bold text-slate-100 mt-1">
                  {analysis?.entropy || 0} <span className="text-xs font-normal text-slate-500">bits</span>
                </span>
                <span className="text-[9px] text-slate-600 block leading-tight mt-0.5">Complexity rate</span>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Time to Crack</span>
                <span className="block font-sans text-sm font-semibold truncate text-slate-100 mt-1.5" title={analysis?.timeToCrack}>
                  {analysis?.timeToCrack}
                </span>
                <span className="text-[9px] text-slate-600 block leading-tight mt-0.5">at 100B guesses/sec</span>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60 col-span-2 md:col-span-1">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Breach Check</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {analysis?.checks.noCommonMatch ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      <ShieldAlert className="w-3.5 h-3.5" /> BREACHED
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-600 block leading-tight mt-1">Checked offline</span>
              </div>
            </div>

            {/* Warning Message Box if Breached or Short */}
            {analysis && analysis.warnings.length > 0 && (
              <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3 flex gap-3 text-xs text-red-300">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-red-200">Security Exceptions Identified:</p>
                  <ul className="list-disc pl-4 space-y-1 text-red-300/90 font-mono text-[11px]">
                    {analysis.warnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Character Metrics Checklist */}
            <div className="bg-slate-950/20 border border-slate-800/40 rounded-lg p-3.5">
              <span className="block text-xs font-medium text-slate-400 mb-2.5">Structure Requirements Checklist</span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.length ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.length ? 'text-emerald-400' : 'text-slate-500'}>8+ Characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.hasUppercase ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}>Uppercase Sub-block</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.hasLowercase ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.hasLowercase ? 'text-emerald-400' : 'text-slate-500'}>Lowercase Sub-block</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.hasNumbers ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.hasNumbers ? 'text-emerald-400' : 'text-slate-500'}>Numerical Symbols</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.hasSymbols ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.hasSymbols ? 'text-emerald-400' : 'text-slate-500'}>Special Marks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${analysis?.checks.noCommonMatch ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <span className={analysis?.checks.noCommonMatch ? 'text-emerald-400' : 'text-slate-500'}>Not Plain Common</span>
                </div>
              </div>
            </div>

            {/* Smart Automated Security Remodellings */}
            {smartSuggestions.length > 0 && (
              <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span>Actionable Hardening Suggestions:</span>
                </div>
                <div className="space-y-1.5">
                  {smartSuggestions.map((sug, i) => (
                    <div key={i} className="flex justify-between items-start gap-2 text-[11px] text-slate-300 font-mono bg-slate-950 py-1.5 px-2.5 rounded border border-slate-800/50">
                      <span className="leading-snug">{sug}</span>
                      {sug.includes('e.g.') && (
                        <button
                          id={`apply-mutation-${i}`}
                          onClick={() => {
                            const match = sug.match(/"([^"]+)"/);
                            if (match && match[1]) {
                              setPassword(match[1]);
                            }
                          }}
                          className="shrink-0 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline font-sans"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send to Secure Vault Bridge Trigger */}
            {onSendToVault && (
              <button
                id="checker-vault-bridge-btn"
                onClick={() => onSendToVault(password)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-slate-50 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 border border-indigo-500 shadow-md shadow-indigo-950/20"
              >
                <Key className="w-4 h-4" /> Save Password to Encrypted Vault
              </button>
            )}

          </div>
        ) : (
          <div className="h-64 flex flex-col justify-center items-center border border-dashed border-slate-800 rounded-lg bg-slate-950/30 text-center px-4 py-8">
            <Info className="w-8 h-8 text-slate-600 mb-2.5" />
            <p className="font-medium text-slate-400 text-sm">Awaiting Input Signal</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Supply a custom credential candidate or invoke generative formulas to view full cryptographic, vulnerability metrics, and breach reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
