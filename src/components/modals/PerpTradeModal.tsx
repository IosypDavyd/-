import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { PerpMarket, PerpPosition } from '../../types/wallet';
import { calculatePerpPnL } from '../../utils/crypto';

interface PerpTradeModalProps {
  markets: PerpMarket[];
  usdcBalance: number;
  onClose: () => void;
  onOpenPosition: (position: Omit<PerpPosition, 'id' | 'timestamp'>) => void;
  defaultSymbol?: string;
}

export const PerpTradeModal: React.FC<PerpTradeModalProps> = ({
  markets,
  usdcBalance,
  onClose,
  onOpenPosition,
  defaultSymbol = 'SOL-PERP',
}) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [collateralStr, setCollateralStr] = useState('50');
  const [leverage, setLeverage] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMarket = markets.find((m) => m.symbol === symbol) || markets[0];
  const collateral = parseFloat(collateralStr) || 0;
  const sizeUsd = collateral * leverage;

  const { liquidationPrice } = calculatePerpPnL(
    side,
    activeMarket.markPrice,
    activeMarket.markPrice,
    sizeUsd,
    leverage
  );

  const canOpen = collateral > 0 && collateral <= usdcBalance && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canOpen) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onOpenPosition({
        symbol: activeMarket.symbol,
        side,
        sizeUsd,
        collateralUsd: collateral,
        entryPrice: activeMarket.markPrice,
        currentPrice: activeMarket.markPrice,
        leverage,
        liquidationPrice,
        pnlUsd: 0,
        pnlPercent: 0,
      });
      setIsSubmitting(false);
      onClose();
    }, 800);
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
            {side === 'long' ? <TrendingUp className="h-5 w-5 text-emerald-400" /> : <TrendingDown className="h-5 w-5 text-rose-400" />}
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Solana Perpetual Futures</h3>
            <p className="text-xs text-slate-400">Decentralized margin trading with Drift / Jupiter route</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Market Selector */}
          <div className="grid grid-cols-3 gap-2">
            {markets.map((m) => (
              <button
                key={m.symbol}
                type="button"
                onClick={() => setSymbol(m.symbol)}
                className={`rounded-xl p-2.5 text-left border transition-all ${
                  symbol === m.symbol
                    ? 'bg-slate-800 border-cyan-500/60 text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-bold font-mono">{m.symbol}</p>
                <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                  ${m.markPrice.toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          {/* Long / Short Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setSide('long')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                side === 'long'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Long</span>
            </button>
            <button
              type="button"
              onClick={() => setSide('short')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                side === 'short'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Short</span>
            </button>
          </div>

          {/* Collateral Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Collateral (USDC)</label>
              <span className="text-[11px] text-slate-400">
                Available: ${usdcBalance.toFixed(2)} USDC
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={collateralStr}
                onChange={(e) => setCollateralStr(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-base font-semibold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none pr-16"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                USDC
              </span>
            </div>
          </div>

          {/* Leverage Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Leverage: {leverage}x</label>
              <span className="text-[11px] text-amber-400">Max: {activeMarket.maxLeverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max={activeMarket.maxLeverage}
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1x</span>
              <span>10x</span>
              <span>25x</span>
              <span>50x</span>
            </div>
          </div>

          {/* Trade Info Box */}
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-3 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Position Size</span>
              <span className="font-mono text-white font-semibold">${sizeUsd.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Entry Price</span>
              <span className="font-mono text-slate-200">${activeMarket.markPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Est. Liquidation Price</span>
              <span className="font-mono text-rose-400 font-bold">${liquidationPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>High Risk: If price hits ${liquidationPrice.toLocaleString()}, full collateral will be liquidated.</span>
          </div>

          <button
            type="submit"
            disabled={!canOpen}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-lg ${
              side === 'long'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 cursor-pointer'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25 cursor-pointer'
            } disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>Open {side.toUpperCase()} ({leverage}x)</span>
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
