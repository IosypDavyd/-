import React, { useState } from 'react';
import { X, CreditCard, ExternalLink, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuyModalProps {
  currency: string;
  solPriceUsd: number;
  onClose: () => void;
  onSimulateTopUp: (solAmount: number) => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  currency,
  solPriceUsd,
  onClose,
  onSimulateTopUp,
}) => {
  const [amountUsd, setAmountUsd] = useState(100);
  const [provider, setProvider] = useState<'moonpay' | 'banxa' | 'stripe'>('moonpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const estimatedSol = Number((amountUsd / solPriceUsd).toFixed(4));

  const providers = [
    { id: 'moonpay', name: 'MoonPay', fee: '1.5%', tag: 'Fastest' },
    { id: 'banxa', name: 'Banxa', fee: '1.2%', tag: 'Lowest Fee' },
    { id: 'stripe', name: 'Stripe Crypto', fee: '1.8%', tag: 'Instant Card' },
  ];

  const handleTestPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onSimulateTopUp(estimatedSol);
      setIsProcessing(false);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      onClose();
    }, 1200);
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
          <div className="rounded-xl bg-emerald-950/80 p-2 border border-emerald-500/30 text-emerald-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Buy Solana (SOL)</h3>
            <p className="text-xs text-slate-400">Purchase SOL via verified fiat on-ramps</p>
          </div>
        </div>

        {/* Amount Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-2">Select Amount (USD)</label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountUsd(amt)}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  amountUsd === amt
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 text-center">
            <p className="text-[11px] text-slate-400 mb-1">You will receive approximately</p>
            <p className="font-heading text-2xl font-bold text-cyan-400 font-mono">
              ≈ {estimatedSol} SOL
            </p>
            <p className="text-[11px] text-slate-500 mt-1">1 SOL ≈ ${solPriceUsd.toFixed(2)} USD</p>
          </div>
        </div>

        {/* On-ramp Provider */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-300 mb-2">Payment Partner</label>
          <div className="space-y-2">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id as any)}
                className={`w-full flex items-center justify-between rounded-xl p-3 text-left transition-all border ${
                  provider === p.id
                    ? 'bg-slate-800/80 border-cyan-500/60 text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full border-2 ${provider === p.id ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`} />
                  <div>
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <span className="ml-2 text-[10px] text-emerald-400 font-mono">{p.fee} fee</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300">
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Sandbox Top-up Button */}
        <button
          onClick={handleTestPurchase}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <span>Processing Order...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Complete Order (${amountUsd})</span>
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] text-slate-500">
          Sandbox on-ramp enabled. Fulfills simulated funds directly to your wallet.
        </p>
      </div>
    </div>
  );
};
