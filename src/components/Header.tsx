import React from 'react';
import {
  ShieldCheck,
  ChevronDown,
  Copy,
  Check,
  Globe,
  LifeBuoy,
  Lock,
  Coins,
  QrCode,
} from 'lucide-react';
import { WalletAccount, NetworkId, LanguageCode } from '../types/wallet';
import { shortenAddress } from '../utils/crypto';
import { FIAT_CURRENCIES } from '../utils/currencies';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../utils/i18n';

interface HeaderProps {
  account: WalletAccount;
  network: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  currency: string;
  onCurrencyChange: (curr: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenSupport: () => void;
  onOpenReceive: () => void;
  onOpenAccountModal: () => void;
  totalBalanceUsd: number;
  isLocked: boolean;
  onToggleLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  network,
  onNetworkChange,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  onOpenSupport,
  onOpenReceive,
  onOpenAccountModal,
  isLocked,
  onToggleLock,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = TRANSLATIONS[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-[#0a0d14]/90 backdrop-blur-xl px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-md shadow-cyan-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0a0d14]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                MYSTERYUM
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                  SOLANA
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.slogan}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Address pill */}
          <div className="flex items-center rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
            <button
              onClick={onOpenAccountModal}
              className="flex items-center gap-1.5 font-mono hover:text-cyan-400 transition-colors"
              title="Switch account"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{shortenAddress(account.address, 4)}</span>
            </button>
            <div className="mx-2 h-3.5 w-[1px] bg-white/10" />
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy Solana Address"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onOpenReceive}
              className="ml-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Network selector */}
          <div className="relative hidden md:block">
            <select
              value={network}
              aria-label="Select Solana Network"
              onChange={(e) => onNetworkChange(e.target.value as NetworkId)}
              className="appearance-none rounded-lg border border-white/10 bg-slate-900/80 pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="mainnet-beta">Solana Mainnet</option>
              <option value="devnet">Solana Devnet</option>
              <option value="testnet">Solana Testnet</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Currency selector */}
          <div className="relative hidden lg:block">
            <select
              value={currency}
              aria-label="Select Currency"
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="appearance-none rounded-lg border border-white/10 bg-slate-900/80 pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {FIAT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
            <Coins className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              aria-label="Select Language"
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="appearance-none rounded-lg border border-white/10 bg-slate-900/80 pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <Globe className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
          </div>

          {/* Biometric Security Lock Status Button */}
          <button
            onClick={onToggleLock}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              isLocked
                ? 'border border-amber-500/40 bg-amber-950/50 text-amber-300 hover:bg-amber-900/60 shadow-sm shadow-amber-950 animate-pulse'
                : 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400'
            }`}
            title={isLocked ? 'Vault Locked. Click to unlock with biometrics' : 'Vault Secure. Click to lock wallet'}
          >
            {isLocked ? (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Locked</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Secure</span>
              </>
            )}
          </button>

          {/* Direct Support & Publishing Link Button */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-950"
            title="App Publishing & Support Guide"
          >
            <LifeBuoy className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </div>
    </header>
  );
};
