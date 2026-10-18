import React, { useState } from 'react';
import { X, Send, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { TokenAsset } from '../../types/wallet';
import { isValidSolanaAddress } from '../../utils/crypto';
import { formatFiat } from '../../utils/currencies';

interface SendModalProps {
  tokens: TokenAsset[];
  currency: string;
  onClose: () => void;
  onSend: (tokenSymbol: string, recipient: string, amount: number) => void;
  defaultTokenSymbol?: string;
}

export const SendModal: React.FC<SendModalProps> = ({
  tokens,
  currency,
  onClose,
  onSend,
  defaultTokenSymbol = 'SOL',
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(defaultTokenSymbol);
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const activeToken = tokens.find((t) => t.symbol === selectedSymbol) || tokens[0];
  const amount = parseFloat(amountStr) || 0;
  const isValidAddress = isValidSolanaAddress(recipient);
  const hasEnoughBalance = amount > 0 && amount <= activeToken.balance;
  const canSend = isValidAddress && hasEnoughBalance && !isSubmitting;

  const handleMax = () => {
    // If SOL, keep 0.005 for network fees
    if (activeToken.symbol === 'SOL') {
      const maxVal = Math.max(0, activeToken.balance - 0.005);
      setAmountStr(maxVal.toFixed(4));
    } else {
      setAmountStr(activeToken.balance.toString());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setRecipient(text.trim());
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSend(selectedSymbol, recipient, amount);
      setIsSubmitting(false);
      setSuccessTx('5wKzq9R1xYv4NpM8Lt62AqBsDtFvGeKnHzQjXp7R3wEa');
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
          <div className="rounded-xl bg-cyan-950/80 p-2 border border-cyan-500/30">
            <Send className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Send Tokens</h3>
            <p className="text-xs text-slate-400">Transfer tokens on the Solana network</p>
          </div>
        </div>

        {successTx ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
            <h4 className="text-base font-bold text-white">Transaction Confirmed!</h4>
            <p className="text-xs text-slate-400">
              Successfully sent {amount} {selectedSymbol}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Token Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Asset</label>
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-white/5">
                {tokens.slice(0, 6).map((t) => (
                  <button
                    key={t.symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(t.symbol)}
                    className={`flex items-center gap-2 rounded-lg p-2 text-left transition-all ${
                      selectedSymbol === t.symbol
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                        : 'bg-slate-800/40 border border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-cyan-400">
                      {t.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-none truncate">{t.symbol}</p>
                      <p className="text-[10px] text-slate-400 truncate">{t.balance.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Recipient Solana Address</label>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Paste from clipboard
                </button>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Solana address (Base58, e.g. 7xKX...)"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {recipient && !isValidAddress && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="h-3 w-3" /> Invalid Solana public address
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Amount</label>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Balance: {activeToken.balance.toLocaleString()} {activeToken.symbol}</span>
                  <button
                    type="button"
                    onClick={handleMax}
                    className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-cyan-400 font-bold hover:bg-cyan-900"
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
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-base font-semibold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none pr-16"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {activeToken.symbol}
                </span>
              </div>
              {amount > 0 && (
                <p className="mt-1 text-right text-[11px] text-slate-400">
                  ≈ {formatFiat(amount * activeToken.usdPrice, currency)}
                </p>
              )}
            </div>

            {/* Fee summary */}
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Estimated Network Fee</span>
                <span className="font-mono text-slate-200">~0.000005 SOL (&lt; $0.001)</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Speed</span>
                <span className="text-emerald-400">~400 ms (Fast)</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!canSend}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-lg ${
                canSend
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 shadow-cyan-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSubmitting ? (
                <span>Confirming on Solana...</span>
              ) : (
                <>
                  <span>Send {amount > 0 ? `${amount} ${activeToken.symbol}` : ''}</span>
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
