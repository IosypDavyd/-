import React, { useState } from 'react';
import { X, Plus, KeyRound, Check, Wallet, Shield } from 'lucide-react';
import { WalletAccount } from '../../types/wallet';
import { shortenAddress, generateSeedPhrase, deriveSolanaAddressFromSeed } from '../../utils/crypto';

interface AccountModalProps {
  accounts: WalletAccount[];
  activeAccount: WalletAccount;
  onSelectAccount: (acc: WalletAccount) => void;
  onCreateNewAccount: () => void;
  onRestoreFromPhrase: (phrase: string[]) => void;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  accounts,
  activeAccount,
  onSelectAccount,
  onCreateNewAccount,
  onRestoreFromPhrase,
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
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">{acc.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {shortenAddress(acc.address, 6)}
                        </p>
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

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
