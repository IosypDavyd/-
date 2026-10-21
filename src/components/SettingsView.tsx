import React, { useState } from 'react';
import {
  Settings,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  Globe,
  Coins,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  LifeBuoy,
  Fingerprint,
  Lock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { WalletAccount, NetworkId, LanguageCode } from '../types/wallet';
import { FIAT_CURRENCIES } from '../utils/currencies';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../utils/i18n';
import { AvatarArtwork } from './AvatarArtwork';
import { AvatarBackground } from './AvatarBackground';

interface SettingsViewProps {
  account: WalletAccount;
  network: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  currency: string;
  onCurrencyChange: (curr: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onResetWallet: () => void;
  onOpenSupport: () => void;
  onOpenGallery?: () => void;
  onTriggerLock?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  account,
  network,
  onNetworkChange,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  onResetWallet,
  onOpenSupport,
  onOpenGallery,
  onTriggerLock,
}) => {
  const [showSeed, setShowSeed] = useState(false);
  const [showPrivKey, setShowPrivKey] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pinLockEnabled, setPinLockEnabled] = useState(true);

  const t = TRANSLATIONS[language];

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(account.seedPhrase.join(' '));
    setCopiedPhrase(true);
    setTimeout(() => setCopiedPhrase(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(account.privateKeyHex);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-2xl space-y-6 pb-28 text-slate-200">
      {/* Ambient Avatar Background Watermark */}
      <AvatarBackground theme={account.avatarTheme || 'cyber-king'} opacity={0.06} position="top-right" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-950/80 p-2.5 border border-cyan-500/30 text-cyan-400">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Wallet Settings</h2>
          <p className="text-xs text-slate-400">Manage security, networks, currency, and local vault</p>
        </div>
      </div>

      {/* NFT Avatar & Virtual Card Identity Section */}
      <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0d1322] via-[#101b33] to-[#0a101d] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Avatar & Card Identity
            </h3>
          </div>
          <span className="rounded-full bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
            25¢ Solana NFT
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-black shadow-xl shrink-0">
            <AvatarArtwork theme={account.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <p className="text-sm font-bold text-white font-heading">
              Active Avatar: {account.avatarTheme ? account.avatarTheme.replace('-', ' ').toUpperCase() : 'CYBER KING'}
            </p>
            <p className="text-xs text-slate-400">
              Synced across your Solana account and 8 Ecosystem Virtual Cards
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                Verified On-Chain
              </span>
              <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                Fixed 25¢ Mint
              </span>
            </div>
          </div>

          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 px-4 py-2.5 text-xs font-extrabold text-black transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Avatar Gallery (25¢)</span>
            </button>
          )}
        </div>
      </section>

      {/* Security & Vault Section */}
      <section className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Security & Backup
          </h3>
        </div>

        {/* 12-Word Recovery Phrase */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">12-Word Secret Recovery Phrase</p>
              <p className="text-[11px] text-slate-400">
                Never share this with anyone. Ecosystem support will never ask for it.
              </p>
            </div>
            <button
              onClick={() => setShowSeed(!showSeed)}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
            >
              {showSeed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showSeed ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {showSeed && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="grid grid-cols-3 gap-2">
                {account.seedPhrase.map((word, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-2.5 py-1.5 text-xs font-mono"
                  >
                    <span className="text-[10px] text-slate-500 font-bold">{idx + 1}.</span>
                    <span className="text-cyan-300 font-semibold">{word}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopyPhrase}
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-200 cursor-pointer"
              >
                {copiedPhrase ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedPhrase ? 'Seed Phrase Copied!' : 'Copy Seed Phrase'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Private Key Export */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Solana Private Key</p>
              <p className="text-[11px] text-slate-400">
                Raw cryptographic key for importing into Phantom or Solflare
              </p>
            </div>
            <button
              onClick={() => setShowPrivKey(!showPrivKey)}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
            >
              {showPrivKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPrivKey ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {showPrivKey && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <code className="block rounded-xl bg-black/50 p-2.5 font-mono text-[11px] text-cyan-300 break-all select-all">
                {account.privateKeyHex}
              </code>
              <button
                onClick={handleCopyKey}
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-200 cursor-pointer"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey ? 'Private Key Copied!' : 'Copy Private Key'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Biometric & PIN Security */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4 text-cyan-400" />
                <span>Biometric & PIN Authentication</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Protect wallet balances with Face Scan, Touch ID & Secure Enclave
              </p>
            </div>
            <button
              onClick={() => setPinLockEnabled(!pinLockEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                pinLockEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  pinLockEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <span className="text-slate-400">Master Security Passcode:</span>
            <span className="font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
              4190
            </span>
          </div>

          {onTriggerLock && (
            <button
              type="button"
              onClick={onTriggerLock}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/80 py-2.5 text-xs font-bold text-cyan-300 transition-colors shadow-sm cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Lock Wallet Now (Test Biometric Screen)</span>
            </button>
          )}
        </div>
      </section>

      {/* Network & RPC Section */}
      <section className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-3">
        <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
          Network & Node Connection
        </h3>

        <div className="space-y-2">
          {[
            { id: 'mainnet-beta', name: 'Solana Mainnet-Beta', rpc: 'https://api.mainnet-beta.solana.com' },
            { id: 'devnet', name: 'Solana Devnet (Testnet Faucet)', rpc: 'https://api.devnet.solana.com' },
            { id: 'testnet', name: 'Solana Testnet', rpc: 'https://api.testnet.solana.com' },
          ].map((net) => (
            <button
              key={net.id}
              onClick={() => onNetworkChange(net.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                network === net.id
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{net.name}</span>
                  {network === net.id && (
                    <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 font-bold">
                      CONNECTED
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{net.rpc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Preferences Section */}
      <section className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-4">
        <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
          Display & Regional
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Fiat Currency</label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {FIAT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Store Publishing Support Portal Quick Link */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-cyan-400" />
          <div>
            <h4 className="font-heading text-sm font-bold text-white">App Store & Play Store Guide</h4>
            <p className="text-xs text-slate-400">Step-by-step mobile compilation & publishing instructions</p>
          </div>
        </div>
        <button
          onClick={onOpenSupport}
          className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
        >
          Open Guide
        </button>
      </div>

      {/* Danger Zone */}
      <section className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
            Reset Wallet Vault
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Resetting will permanently wipe your local encrypted vault from this browser. Ensure your 12-word recovery phrase is safely written down before proceeding.
        </p>

        {confirmReset ? (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setConfirmReset(false)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={onResetWallet}
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white"
            >
              Confirm Wipe Vault
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Local Wallet</span>
          </button>
        )}
      </section>

      <div className="text-center text-xs text-slate-500 pt-2">
        ECOSYSTEM WALLET SOLANA · Version 2.4.0 (Build 41907) · support@mysteryum.io
      </div>
    </div>
  );
};
