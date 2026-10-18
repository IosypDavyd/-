import React, { useState } from 'react';
import { X, Flame, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { StakingOption } from '../../types/wallet';

interface StakeModalProps {
  stakingOptions: StakingOption[];
  solBalance: number;
  onClose: () => void;
  onStake: (providerId: string, amount: number) => void;
  defaultProviderId?: string;
}

export const StakeModal: React.FC<StakeModalProps> = ({
  stakingOptions,
  solBalance,
  onClose,
  onStake,
  defaultProviderId = 'jito',
}) => {
  const [selectedId, setSelectedId] = useState(defaultProviderId);
  const [amountStr, setAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeOption = stakingOptions.find((o) => o.id === selectedId) || stakingOptions[0];
  const amount = parseFloat(amountStr) || 0;
  const maxAvailable = Math.max(0, solBalance - 0.01); // leave for rent/fees
  const canStake = amount > 0 && amount <= maxAvailable && !isSubmitting;

  const estimatedYearlySol = Number(((amount * activeOption.apy) / 100).toFixed(4));

  const handleMax = () => {
    setAmountStr(maxAvailable.toFixed(4));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStake) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onStake(selectedId, amount);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
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
          <div className="rounded-xl bg-purple-950/80 p-2 border border-purple-500/30 text-purple-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Solana Staking</h3>
            <p className="text-xs text-slate-400">Stake SOL and earn decentralized network yields</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
            <h4 className="text-base font-bold text-white">Stake Delegated!</h4>
            <p className="text-xs text-slate-400">
              Successfully staked {amount} SOL with {activeOption.name}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Provider Options */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Staking Protocol</label>
              <div className="space-y-2">
                {stakingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedId(opt.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      selectedId === opt.id
                        ? 'bg-purple-950/40 border-purple-500/60 text-white'
                        : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{opt.name}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">
                          {opt.token}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{opt.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono">+{opt.apy}%</span>
                      <span className="block text-[10px] text-slate-400">APY</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stake Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Amount to Stake</label>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Available: {solBalance.toFixed(4)} SOL</span>
                  <button
                    type="button"
                    onClick={handleMax}
                    className="rounded bg-purple-950/80 px-1.5 py-0.5 text-purple-300 font-bold hover:bg-purple-900"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-base font-semibold text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none pr-16"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  SOL
                </span>
              </div>
            </div>

            {/* Yield projection */}
            <div className="rounded-xl border border-white/5 bg-slate-900/50 p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Protocol APY</span>
                <span className="font-mono text-emerald-400 font-semibold">{activeOption.apy}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Annual Yield</span>
                <span className="font-mono text-white">~{estimatedYearlySol} SOL / yr</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Withdrawal Delay</span>
                <span className="text-slate-300 font-mono">
                  {activeOption.type === 'liquid' ? 'Instant swap via DEX' : '1 Epoch (~2 days)'}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canStake}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-lg ${
                canStake
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSubmitting ? (
                <span>Delegating Stake...</span>
              ) : (
                <>
                  <span>Stake {amount > 0 ? `${amount} SOL` : ''}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
