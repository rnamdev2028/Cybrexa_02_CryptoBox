import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Sliders, Settings, ShieldAlert, BadgeCheck, Compass } from 'lucide-react';
import { GeneratorSettings } from '../types';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [settings, setSettings] = useState<GeneratorSettings>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate safe password formula
  const generate = useCallback(() => {
    let charset = '';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let similarChars = /[il1Lo0O]/g;

    let possibleLower = settings.includeLowercase ? lowercase : '';
    let possibleUpper = settings.includeUppercase ? uppercase : '';
    let possibleNum = settings.includeNumbers ? numbers : '';
    let possibleSym = settings.includeSymbols ? symbols : '';

    if (settings.excludeSimilar) {
      possibleLower = possibleLower.replace(similarChars, '');
      possibleUpper = possibleUpper.replace(similarChars, '');
      possibleNum = possibleNum.replace(similarChars, '');
      possibleSym = possibleSym.replace(similarChars, '');
    }

    charset = possibleLower + possibleUpper + possibleNum + possibleSym;

    if (!charset) {
      setGeneratedPassword('');
      return;
    }

    let result = '';
    // Let's guarantee at least one char of each selected type for strong initial combinations
    const guaranteed: string[] = [];
    if (settings.includeLowercase && possibleLower) {
      guaranteed.push(possibleLower[Math.floor(Math.random() * possibleLower.length)]);
    }
    if (settings.includeUppercase && possibleUpper) {
      guaranteed.push(possibleUpper[Math.floor(Math.random() * possibleUpper.length)]);
    }
    if (settings.includeNumbers && possibleNum) {
      guaranteed.push(possibleNum[Math.floor(Math.random() * possibleNum.length)]);
    }
    if (settings.includeSymbols && possibleSym) {
      guaranteed.push(possibleSym[Math.floor(Math.random() * possibleSym.length)]);
    }

    // Fill remaining length
    const fillLength = settings.length - guaranteed.length;
    for (let i = 0; i < fillLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    // Insert guaranteed characters at random indices
    const resultArray = result.split('');
    guaranteed.forEach(char => {
      const randomIdx = Math.floor(Math.random() * (resultArray.length + 1));
      resultArray.splice(randomIdx, 0, char);
    });

    const finalPassword = resultArray.join('');
    setGeneratedPassword(finalPassword);
    onPasswordGenerated(finalPassword);
  }, [settings, onPasswordGenerated]);

  // Initial generation
  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = generatedPassword;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Recipe presets
  const applyPreset = (preset: 'maximum' | 'memorable' | 'alphanumeric' | 'pincode') => {
    switch (preset) {
      case 'maximum':
        setSettings({
          length: 22,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: true,
          excludeSimilar: true,
        });
        break;
      case 'memorable':
        // A mnemonic style of 12 letters, lowercase uppercase similar removed
        setSettings({
          length: 14,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: false,
          includeSymbols: false,
          excludeSimilar: true,
        });
        break;
      case 'alphanumeric':
        setSettings({
          length: 16,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: false,
          excludeSimilar: false,
        });
        break;
      case 'pincode':
        setSettings({
          length: 8,
          includeUppercase: false,
          includeLowercase: false,
          includeNumbers: true,
          includeSymbols: false,
          excludeSimilar: false,
        });
        break;
    }
  };

  // Regenerate when local settings change
  const handleSettingChange = <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div id="password-generator-card" className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-lg text-slate-100">Secure Password Generator</h2>
            <p className="text-xs text-slate-400">Generate high-entropy credentials locally</p>
          </div>
        </div>
      </div>

      {/* Screen Display for Generated Code */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 flex items-center justify-between gap-3 mb-5 hover:border-slate-700 transition-colors">
        <div className="overflow-x-auto w-full scrollbar-hidden">
          <span 
            id="generated-password-display" 
            className="font-mono text-lg font-bold tracking-wide text-slate-100 select-all whitespace-nowrap block text-indigo-300"
          >
            {generatedPassword || <span className="text-slate-600 font-sans text-sm font-normal">Select active character blocks...</span>}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="cycle-password-generator-btn"
            onClick={generate}
            className="p-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg border border-slate-850 hover:border-slate-700 transition-colors"
            title="Regenerate credentials combination"
          >
            <RefreshCw className="w-4 h-4 animate-hover" />
          </button>
          
          <button
            id="copy-generated-password-btn"
            onClick={handleCopy}
            disabled={!generatedPassword}
            className={`p-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-slate-50 border border-indigo-500'
            }`}
          >
            {copied ? <Check className="w-4 h-4 animate-scaleUp" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs pr-1">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Presets Row */}
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 font-mono">Preset Options:</span>
          <div className="grid grid-cols-4 gap-2">
            <button
              id="preset-max-btn"
              onClick={() => { applyPreset('maximum'); setTimeout(generate, 10); }}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-850 text-[10px] font-semibold text-indigo-400 rounded border border-slate-800 transition-colors uppercase tracking-wider hover:border-indigo-500/40"
            >
              Max Security
            </button>
            <button
              id="preset-memo-btn"
              onClick={() => { applyPreset('memorable'); setTimeout(generate, 10); }}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-850 text-[10px] font-semibold text-indigo-400 rounded border border-slate-800 transition-colors uppercase tracking-wider hover:border-indigo-500/40"
            >
              Mnemonic
            </button>
            <button
              id="preset-alphanum-btn"
              onClick={() => { applyPreset('alphanumeric'); setTimeout(generate, 10); }}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-850 text-[10px] font-semibold text-indigo-400 rounded border border-slate-800 transition-colors uppercase tracking-wider hover:border-indigo-500/40"
            >
              Alphanum
            </button>
            <button
              id="preset-pincode-btn"
              onClick={() => { applyPreset('pincode'); setTimeout(generate, 10); }}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-850 text-[10px] font-semibold text-indigo-400 rounded border border-slate-800 transition-colors uppercase tracking-wider hover:border-indigo-500/40"
            >
              Pin Only
            </button>
          </div>
        </div>

        {/* Outer Settings Panel Customizers */}
        <div className="space-y-4 pt-1 border-t border-slate-800/60">
          
          {/* Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Length:</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">{settings.length} Characters</span>
            </div>
            <input
              id="generator-length-slider"
              type="range"
              min="8"
              max="32"
              value={settings.length}
              onChange={(e) => {
                handleSettingChange('length', parseInt(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 my-2"
            />
          </div>

          {/* Character set checkboxes */}
          <div className="space-y-2.5">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Character Composition:</span>
            
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="checkbox-letters-upper"
                  type="checkbox"
                  checked={settings.includeUppercase}
                  onChange={(e) => {
                    handleSettingChange('includeUppercase', e.target.checked);
                    setTimeout(generate, 10);
                  }}
                  className="rounded border-slate-800 text-indigo-500 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="checkbox-letters-lower"
                  type="checkbox"
                  checked={settings.includeLowercase}
                  onChange={(e) => {
                    handleSettingChange('includeLowercase', e.target.checked);
                    setTimeout(generate, 10);
                  }}
                  className="rounded border-slate-800 text-indigo-500 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="checkbox-numbers"
                  type="checkbox"
                  checked={settings.includeNumbers}
                  onChange={(e) => {
                    handleSettingChange('includeNumbers', e.target.checked);
                    setTimeout(generate, 10);
                  }}
                  className="rounded border-slate-800 text-indigo-500 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="checkbox-symbols"
                  type="checkbox"
                  checked={settings.includeSymbols}
                  onChange={(e) => {
                    handleSettingChange('includeSymbols', e.target.checked);
                    setTimeout(generate, 10);
                  }}
                  className="rounded border-slate-800 text-indigo-500 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <span>Symbols (&_#$@)</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-800/40">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="checkbox-exclude-similar"
                  type="checkbox"
                  checked={settings.excludeSimilar}
                  onChange={(e) => {
                    handleSettingChange('excludeSimilar', e.target.checked);
                    setTimeout(generate, 10);
                  }}
                  className="rounded border-slate-800 text-indigo-500 bg-slate-950 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-indigo-500"
                />
                <span className="flex flex-col">
                  <span>Exclude ambiguous sets</span>
                  <span className="text-[10px] text-slate-500">Omits visually similar characters (i, L, 1, 0, O)</span>
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Generate Command Indicator */}
        <button
          id="manual-trigger-generate-btn"
          onClick={generate}
          className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-slate-50 rounded-lg font-sans text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-indigo-500 shadow-md shadow-indigo-950/20"
        >
          <Compass className="w-4 h-4" /> Regenerate Password Candidate
        </button>

      </div>
    </div>
  );
}
