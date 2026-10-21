import React, { useState, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  Sliders,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Sparkles,
  Info,
  X,
  Zap,
} from 'lucide-react';
import { TokenAsset } from '../../types/wallet';
import { formatFiat } from '../../utils/currencies';
import {
  calculateRebalancePlan,
  REBALANCE_PRESETS,
  RebalancePlanSummary,
} from '../../utils/portfolioRebalancer';

interface PortfolioRebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenAsset[];
  currency: string;
  onExecuteTrade: (fromSymbol: string, toSymbol?: string) => void;
}

export const PortfolioRebalanceModal: React.FC<PortfolioRebalanceModalProps> = ({
  isOpen,
  onClose,
  tokens,
  currency,
  onExecuteTrade,
}) => {
  // Initialize target allocations with current portfolio weights (normalized)
  const initialTargets = useMemo(() => {
    const totalUsd = tokens.reduce((sum, t) => sum + t.balance * t.usdPrice, 0);
    const targets: Record<string, number> = {};

    if (totalUsd <= 0) {
      const equalShare = Math.floor(100 / (tokens.length || 1));
      tokens.forEach((t) => (targets[t.symbol] = equalShare));
      return targets;
    }

    let allocated = 0;
    tokens.forEach((t, index) => {
      if (index === tokens.length - 1) {
        targets[t.symbol] = Math.max(0, 100 - allocated);
      } else {
        const pct = Math.round(((t.balance * t.usdPrice) / totalUsd) * 100);
        targets[t.symbol] = pct;
        allocated += pct;
      }
    });

    return targets;
  }, [tokens]);

  const [targetAllocations, setTargetAllocations] = useState<Record<string, number>>(initialTargets);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Recalculate plan dynamically
  const plan: RebalancePlanSummary = useMemo(() => {
    return calculateRebalancePlan(tokens, targetAllocations);
  }, [tokens, targetAllocations]);

  // Handle single token target slider / input change
  const handleTargetChange = (symbol: string, newPercent: number) => {
    setSelectedPreset(null);
    setTargetAllocations((prev) => ({
      ...prev,
      [symbol]: Math.max(0, Math.min(100, newPercent)),
    }));
  };

  // Apply predefined strategy preset
  const handleApplyPreset = (presetId: string) => {
    const preset = REBALANCE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    const newTargets: Record<string, number> = {};
    tokens.forEach((t) => {
      newTargets[t.symbol] = preset.allocations[t.symbol] || 0;
    });
    setTargetAllocations(newTargets);
  };

  // Reset to current allocation
  const handleResetToCurrent = () => {
    setSelectedPreset(null);
    setTargetAllocations(initialTargets);
  };

  // Auto-equalize targets across all tokens
  const handleEqualize = () => {
    setSelectedPreset(null);
    const equalShare = Math.floor(100 / tokens.length);
    const remainder = 100 - equalShare * tokens.length;
    const newTargets: Record<string, number> = {};
    tokens.forEach((t, i) => {
      newTargets[t.symbol] = equalShare + (i === 0 ? remainder : 0);
    });
    setTargetAllocations(newTargets);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#070b14] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                  Portfolio Target Rebalancer
                </h3>
                <span className="rounded bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                  AI ASSISTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Define your ideal target allocations and generate optimal trade paths
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {/* Preset Allocation Strategies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Preset Allocation Models</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEqualize}
                  className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Equal Weights ({Math.floor(100 / tokens.length)}% each)
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={handleResetToCurrent}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Current</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {REBALANCE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`flex flex-col text-left rounded-2xl p-3 border transition-all cursor-pointer ${
                    selectedPreset === preset.id
                      ? 'bg-cyan-950/80 border-cyan-400/80 shadow-md shadow-cyan-950/60'
                      : 'bg-slate-900/50 border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/80'
                  }`}
                >
                  <span className="text-xs font-bold text-white mb-0.5">{preset.name}</span>
                  <span className="text-[11px] text-slate-400 leading-snug">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Sliders & Percent Allocation Target Status */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Asset Target Percentages</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Total Allocation:</span>
                <span
                  className={`font-mono text-xs font-bold rounded-lg px-2 py-0.5 border ${
                    plan.isAllocationValid
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {plan.totalTargetPercent}% / 100%
                </span>
              </div>
            </div>

            {/* Warning if total allocation != 100% */}
            {!plan.isAllocationValid && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/60 p-2.5 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{plan.allocationError} Adjust the sliders until the sum equals 100%.</span>
              </div>
            )}

            {/* Sliders Grid */}
            <div className="space-y-3 pt-2">
              {tokens.map((token) => {
                const targetPct = targetAllocations[token.symbol] ?? 0;
                const valueUsd = token.balance * token.usdPrice;
                const currentPct =
                  plan.totalPortfolioValueUsd > 0
                    ? Math.round(((valueUsd / plan.totalPortfolioValueUsd) * 100) * 10) / 10
                    : 0;

                return (
                  <div key={token.symbol} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 border border-white/10">
                          {token.icon}
                        </span>
                        <span className="font-heading font-bold text-white">{token.symbol}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          (Current: {currentPct}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={targetPct}
                          onChange={(e) => handleTargetChange(token.symbol, parseInt(e.target.value) || 0)}
                          className="w-14 rounded-lg border border-white/10 bg-black/60 px-2 py-0.5 text-right font-mono text-xs font-bold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetPct}
                      onChange={(e) => handleTargetChange(token.symbol, parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trade Execution Suggestions Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                  <span>Suggested Rebalancing Trades</span>
                  <span className="rounded-full bg-cyan-950 border border-cyan-500/40 px-2 py-0.2 text-[10px] font-mono text-cyan-300">
                    {plan.buyCount} Buys · {plan.sellCount} Sells
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Recommended order routing on Jupiter DEX to meet your target allocation
                </p>
              </div>

              {plan.totalVolumeToTradeUsd > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Total Volume: </span>
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {formatFiat(plan.totalVolumeToTradeUsd, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* List of Suggestions */}
            <div className="space-y-2">
              {plan.suggestions.map((sug) => {
                const isBuy = sug.action === 'BUY';
                const isSell = sug.action === 'SELL';
                const isHold = sug.action === 'HOLD';

                return (
                  <div
                    key={sug.symbol}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                      isBuy
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : isSell
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-slate-900/40 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold ${
                          isBuy
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : isSell
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                            : 'bg-slate-800 border-white/10 text-slate-400'
                        }`}
                      >
                        {isBuy ? <TrendingUp className="h-4 w-4" /> : isSell ? <TrendingDown className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-white text-sm">{sug.symbol}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-extrabold uppercase ${
                              isBuy
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : isSell
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sug.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                          <span>Current: {sug.currentPercent}%</span>
                          <span>→</span>
                          <span className="text-white font-bold">Target: {sug.targetPercent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-left sm:text-right">
                        <div className="font-mono text-xs font-bold text-white">
                          {isBuy ? '+' : ''}
                          {formatFiat(sug.deltaUsd, currency)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {isBuy ? '+' : ''}
                          {sug.deltaUnits.toLocaleString()} {sug.symbol}
                        </div>
                      </div>

                      {!isHold && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            // If buy, swap from USDC or SOL to this token. If sell, swap this token to USDC
                            if (isBuy) {
                              onExecuteTrade('USDC', sug.symbol);
                            } else {
                              onExecuteTrade(sug.symbol, 'USDC');
                            }
                          }}
                          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer shadow-sm ${
                            isBuy
                              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
                              : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
                          }`}
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                          <span>{isBuy ? `Buy ${sug.symbol}` : `Sell ${sug.symbol}`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-3 bg-[#0a0f1c] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>Trades route through Jupiter Aggregator with sub-penny network gas</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 font-semibold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
