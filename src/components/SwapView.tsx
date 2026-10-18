import React, { useState } from 'react';
import {
  ArrowDownUp,
  Settings2,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { TokenAsset } from '../types/wallet';
import { calculateSwapOutput } from '../utils/crypto';
import confetti from 'canvas-confetti';

interface SwapViewProps {
  tokens: TokenAsset[];
  onExecuteSwap: (fromSymbol: string, toSymbol: string, inAmount: number, outAmount: number) => void;
  defaultFrom?: string;
}

export const SwapView: React.FC<SwapViewProps> = ({
  tokens,
  onExecuteSwap,
  defaultFrom = 'SOL',
}) => {
  const [fromSymbol, setFromSymbol] = useState(defaultFrom);
  const [toSymbol, setToSymbol] = useState(defaultFrom === 'USDC' ? 'SOL' : 'USDC');
  const [amountInStr, setAmountInStr] = useState('1');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);

  const fromToken = tokens.find((t) => t.symbol === fromSymbol) || tokens[0];
  const toToken = tokens.find((t) => t.symbol === toSymbol) || tokens[1] || tokens[0];
  const amountIn = parseFloat(amountInStr) || 0;

  const { outputAmount, minimumReceived, feeSol, priceImpactPercent } =
    calculateSwapOutput(amountIn, fromToken.usdPrice, toToken.usdPrice, slippage);

  const hasBalance = amountIn > 0 && amountIn <= fromToken.balance;
  const canSwap = hasBalance && fromSymbol !== toSymbol && !isSwapping;

  const handleFlip = () => {
    const temp = fromSymbol;
    setFromSymbol(toSymbol);
    setToSymbol(temp);
  };

  const handleSetPercent = (pct: number) => {
    const val = (fromToken.balance * pct) / 100;
    setAmountInStr(val > 0 ? (fromToken.symbol === 'SOL' ? Math.max(0, val - 0.005).toFixed(4) : val.toFixed(4)) : '0');
  };

  const handleSwap = () => {
    if (!canSwap) return;
    setIsSwapping(true);

    setTimeout(() => {
      onExecuteSwap(fromSymbol, toSymbol, amountIn, outputAmount);
      setIsSwapping(false);
      setSwapSuccess(`Swapped ${amountIn} ${fromSymbol} for ${outputAmount} ${toSymbol}`);
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setTimeout(() => setSwapSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-24">
      {/* Swap Container Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1420]/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-cyan-950/80 p-2 border border-cyan-500/30 text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">Jupiter DEX Aggregator</h2>
              <p className="text-xs text-slate-400">Zero-gas optimized routing across Solana DEXes</p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-xl p-2 transition-colors ${
              showSettings ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Slippage settings"
          >
            <Settings2 className="h-5 w-5" />
          </button>
        </div>

        {/* Slippage Settings Panel */}
        {showSettings && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/90 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Max Slippage Tolerance</span>
              <span className="font-mono text-cyan-400 font-bold">{slippage}%</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0.1, 0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlippage(s)}
                  className={`rounded-lg py-1.5 text-xs font-mono font-semibold transition-all ${
                    slippage === s
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pay Box */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You Pay</span>
            <div className="flex items-center gap-1.5">
              <span>Balance: {fromToken.balance.toLocaleString()} {fromToken.symbol}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              step="any"
              value={amountInStr}
              onChange={(e) => setAmountInStr(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent font-heading text-2xl font-bold text-white placeholder-slate-600 focus:outline-none font-mono"
            />

            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>≈ ${(amountIn * fromToken.usdPrice).toFixed(2)} USD</span>
            <div className="flex gap-1">
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSetPercent(p)}
                  className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700"
                >
                  {p === 100 ? 'MAX' : `${p}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="relative my-2 flex justify-center">
          <button
            onClick={handleFlip}
            className="rounded-full border border-white/10 bg-slate-800 p-2 text-slate-300 hover:text-cyan-400 hover:scale-110 transition-transform shadow-md cursor-pointer"
            title="Switch tokens"
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        {/* Receive Box */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You Receive (Estimated)</span>
            <span>Balance: {toToken.balance.toLocaleString()} {toToken.symbol}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="font-heading text-2xl font-bold text-cyan-400 font-mono">
              {outputAmount > 0 ? outputAmount : '0.00'}
            </p>

            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.icon} {t.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 pt-1">
            <span>≈ ${(outputAmount * toToken.usdPrice).toFixed(2)} USD</span>
          </div>
        </div>

        {/* Swap Details Routing */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/40 p-3.5 space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Route</span>
            <span className="font-mono text-cyan-300 flex items-center gap-1 font-semibold">
              Raydium CLMM → Orca Whirlpool
            </span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Received</span>
            <span className="font-mono text-white">
              {minimumReceived} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Price Impact</span>
            <span
              className={`font-mono font-semibold ${
                priceImpactPercent > 1 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              &lt; {priceImpactPercent}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Solana Network Fee</span>
            <span className="font-mono text-slate-300">~{feeSol} SOL (&lt; $0.001)</span>
          </div>
        </div>

        {swapSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{swapSuccess}</span>
          </div>
        )}

        {/* Swap Action Button */}
        <button
          onClick={handleSwap}
          disabled={!canSwap}
          className={`mt-4 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all shadow-xl cursor-pointer ${
            canSwap
              ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:opacity-90 shadow-cyan-500/25'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {isSwapping ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Routing & Confirming via Jupiter...
            </span>
          ) : !hasBalance && amountIn > 0 ? (
            <span>Insufficient {fromToken.symbol} Balance</span>
          ) : fromSymbol === toSymbol ? (
            <span>Select Two Different Tokens</span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Swap {fromToken.symbol} → {toToken.symbol}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
