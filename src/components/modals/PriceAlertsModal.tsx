import React, { useState } from 'react';
import {
  Bell,
  X,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { PriceAlert, TokenAsset, PriceAlertDirection } from '../../types/wallet';
import { calculatePriceDeviation } from '../../utils/priceAlerts';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  tokens: TokenAsset[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  onSimulatePriceShock: (symbol: string, percentChange: number) => void;
  isLiveTickerEnabled: boolean;
  onToggleLiveTicker: () => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  tokens,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  onSimulatePriceShock,
  isLiveTickerEnabled,
  onToggleLiveTicker,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('SOL');
  const [deviationPercent, setDeviationPercent] = useState(5.0);
  const [direction, setDirection] = useState<PriceAlertDirection>('any');

  if (!isOpen) return null;

  const activeToken = tokens.find((t) => t.symbol === selectedSymbol) || tokens[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviationPercent <= 0) return;

    onAddAlert({
      tokenSymbol: selectedSymbol,
      basePriceUsd: activeToken.usdPrice,
      targetDeviationPercent: Number(deviationPercent),
      direction,
      enabled: true,
    });

    setIsCreating(false);
    setDeviationPercent(5.0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-alerts-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0c101a] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="price-alerts-title" className="font-heading text-lg font-bold text-white">
                Real-Time Price Alerts
              </h2>
              <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                {alerts.filter((a) => a.enabled).length} Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Get notified immediately when Solana tokens deviate by your threshold
            </p>
          </div>
        </div>

        {/* Live Market Volatility Engine Bar */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Simulated Volatility Engine</span>
            </div>
            <button
              onClick={onToggleLiveTicker}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-mono transition-all cursor-pointer ${
                isLiveTickerEnabled
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isLiveTickerEnabled ? '● Live Ticks: ON' : '○ Live Ticks: OFF'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Click any instant shock to test alert firing and notification banner:
          </p>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onSimulatePriceShock('SOL', 5.2)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/40 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 transition-colors"
            >
              <TrendingUp className="h-3 w-3" />
              <span>SOL +5.2%</span>
            </button>

            <button
              onClick={() => onSimulatePriceShock('SOL', -4.8)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-rose-500/40 hover:bg-rose-950/40 px-2.5 py-1 text-[11px] font-mono font-bold text-rose-400 transition-colors"
            >
              <TrendingDown className="h-3 w-3" />
              <span>SOL -4.8%</span>
            </button>

            <button
              onClick={() => onSimulatePriceShock('KPGM', 12.0)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/40 px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-300 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>KPGM +12.0%</span>
            </button>

            <button
              onClick={() => onSimulatePriceShock('JUP', 6.5)}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-purple-500/40 hover:bg-purple-950/40 px-2.5 py-1 text-[11px] font-mono font-bold text-purple-300 transition-colors"
            >
              <Zap className="h-3 w-3" />
              <span>JUP +6.5%</span>
            </button>
          </div>
        </div>

        {/* Create Alert Form or Toggle Button */}
        {isCreating ? (
          <form
            onSubmit={handleCreateSubmit}
            className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 space-y-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                Create New Price Alert
              </span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {/* Token Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Asset</label>
              <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pr-1">
                {tokens.slice(0, 8).map((t) => (
                  <button
                    key={t.symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(t.symbol)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedSymbol === t.symbol
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.symbol}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Current reference price: <strong className="text-white font-mono">${activeToken.usdPrice.toFixed(activeToken.usdPrice < 0.01 ? 6 : 2)} USD</strong>
              </p>
            </div>

            {/* Deviation Target Percentage */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-300">Trigger Deviation Threshold</span>
                <span className="font-mono text-amber-400 font-bold">{deviationPercent}%</span>
              </div>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {[2, 3, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDeviationPercent(pct)}
                    className={`rounded-lg py-1 text-xs font-mono font-semibold transition-all ${
                      deviationPercent === pct
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ±{pct}%
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={deviationPercent}
                onChange={(e) => setDeviationPercent(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Direction Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Trigger Condition</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'any', label: 'Any (±)', icon: ArrowUpDown },
                  { id: 'up', label: 'Spike (+)', icon: TrendingUp },
                  { id: 'down', label: 'Dip (-)', icon: TrendingDown },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDirection(item.id as PriceAlertDirection)}
                      className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all border ${
                        direction === item.id
                          ? 'bg-slate-800 border-amber-400 text-white'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-amber-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-bold text-black transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Set Price Alert ({selectedSymbol} ±{deviationPercent}%)
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 py-3 text-xs font-bold text-amber-300 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Price Alert</span>
          </button>
        )}

        {/* Existing Alerts List */}
        <div className="space-y-2">
          <h3 className="font-heading text-xs font-bold text-slate-400 uppercase tracking-wider">
            Configured Alerts ({alerts.length})
          </h3>

          {alerts.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-center text-xs text-slate-500">
              No price alerts configured yet. Tap "Create New Price Alert" above.
            </div>
          ) : (
            alerts.map((alert) => {
              const liveToken = tokens.find((t) => t.symbol === alert.tokenSymbol);
              const currentPrice = liveToken?.usdPrice || alert.basePriceUsd;
              const liveDeviation = calculatePriceDeviation(currentPrice, alert.basePriceUsd);

              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    alert.enabled
                      ? 'bg-slate-900/80 border-white/10 text-white'
                      : 'bg-slate-900/30 border-white/5 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-amber-400 border border-white/10">
                      {liveToken?.icon || '◎'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{alert.tokenSymbol}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-amber-300 font-semibold border border-amber-500/20">
                          {alert.direction === 'up' ? '▲ +' : alert.direction === 'down' ? '▼ -' : '± '}
                          {alert.targetDeviationPercent}%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Base: ${alert.basePriceUsd < 0.01 ? alert.basePriceUsd.toFixed(6) : alert.basePriceUsd.toFixed(2)} · Live:{' '}
                        <span className={liveDeviation >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          ${currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(2)} ({liveDeviation >= 0 ? '+' : ''}{liveDeviation}%)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => onToggleAlert(alert.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        alert.enabled ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle alert active state"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-black transition-transform absolute top-0.5 ${
                          alert.enabled ? 'left-5' : 'left-1'
                        }`}
                      />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
