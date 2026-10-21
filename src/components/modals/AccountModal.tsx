import React, { useState } from 'react';
import { X, Plus, KeyRound, Check, Wallet, Shield, Sparkles } from 'lucide-react';
import { WalletAccount } from '../../types/wallet';
import { shortenAddress, generateSeedPhrase, deriveSolanaAddressFromSeed } from '../../utils/crypto';
import { AvatarArtwork } from '../AvatarArtwork';

interface AccountModalProps {
  accounts: WalletAccount[];
  activeAccount: WalletAccount;
  onSelectAccount: (acc: WalletAccount) => void;
  onCreateNewAccount: () => void;
  onRestoreFromPhrase: (phrase: string[]) => void;
  onOpenGallery?: () => void;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  accounts,
  activeAccount,
  onSelectAccount,
  onCreateNewAccount,
  onRestoreFromPhrase,
  onOpenGallery,
  onClose,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [phraseInput, setPhraseInput] = useState('');
  const [restoreError, setRestoreError] = useState('');

  const handleRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const words = phraseInput
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase());
    if (words.length !== 12 && words.length !== 24) {
      setRestoreError('Seed phrase must contain 12 or 24 words');
      return;
    }
    onRestoreFromPhrase(words);
    setIsRestoring(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1420] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-xl bg-cyan-950/80 p-2 border border-cyan-500/30 text-cyan-400">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Solana Accounts</h3>
            <p className="text-xs text-slate-400">Switch or manage your non-custodial accounts</p>
          </div>
        </div>

        {isRestoring ? (
          <form onSubmit={handleRestoreSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Enter 12-Word Secret Recovery Phrase
              </label>
              <textarea
                value={phraseInput}
                onChange={(e) => {
                  setPhraseInput(e.target.value);
                  setRestoreError('');
                }}
                rows={3}
                placeholder="abandon ability able about above absent absorb abstract absurd abuse access accident"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs font-mono text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
              {restoreError && (
                <p className="mt-1 text-xs text-rose-400">{restoreError}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsRestoring(false)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-white hover:bg-cyan-400"
              >
                Restore Account
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isActive = acc.id === activeAccount.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/50 border-cyan-500/60 text-white shadow-md'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-cyan-400/40 bg-black shrink-0 shadow">
                        <AvatarArtwork theme={acc.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white">{acc.name}</p>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          {shortenAddress(acc.address, 6)}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded-md border border-cyan-500/30">
                        <Check className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Select</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Avatar Gallery 25¢ Shortcut Banner */}
            {onOpenGallery && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGallery();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 hover:from-cyan-900/70 hover:to-indigo-900/70 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-cyan-500/20 p-1 text-cyan-400">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      NFT Avatar Mint Gallery
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Mint official Solana avatars for 25¢ ($0.25 USD)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  25¢ MINT
                </span>
              </button>
            )}

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  onCreateNewAccount();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-cyan-400" />
                <span>Create New</span>
              </button>
              <button
                onClick={() => setIsRestoring(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50 py-2.5 text-xs font-bold text-cyan-300 transition-all cursor-pointer"
              >
                <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                <span>Import Seed</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
