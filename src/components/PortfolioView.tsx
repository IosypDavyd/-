import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  QrCode,
  Fingerprint,
  Lock,
  Bell,
  Zap,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  TokenAsset,
  XStockAsset,
  PerpMarket,
  PerpPosition,
  StakingOption,
  NFTItem,
  MysteryumCard,
  TransactionRecord,
  LanguageCode,
  PriceAlert,
  TriggeredPriceAlert,
} from '../types/wallet';
import { formatFiat } from '../utils/currencies';
import { TRANSLATIONS } from '../utils/i18n';
import { shortenAddress } from '../utils/crypto';

export type PortfolioSubTab = 'tokens' | 'xstocks' | 'perps' | 'earn' | 'nft' | 'activity';

interface PortfolioViewProps {
  tokens: TokenAsset[];
  xStocks: XStockAsset[];
  perpMarkets: PerpMarket[];
  perpPositions: PerpPosition[];
  stakingOptions: StakingOption[];
  nfts: NFTItem[];
  cards: MysteryumCard[];
  transactions: TransactionRecord[];
  currency: string;
  language: LanguageCode;
  onOpenSend: (symbol?: string) => void;
  onOpenReceive: () => void;
  onOpenBuy: () => void;
  onOpenSwap: (fromSymbol?: string) => void;
  onOpenStake: (providerId?: string) => void;
  onOpenPerp: (symbol?: string) => void;
  onClosePosition: (posId: string) => void;
  isLocked?: boolean;
  onTriggerUnlock?: () => void;
  priceAlerts: PriceAlert[];
  triggeredAlerts: TriggeredPriceAlert[];
  onOpenPriceAlertsModal: () => void;
  onDismissTriggeredAlert: (alertId: string) => void;
  onSimulatePriceShock: (symbol: string, percentChange: number) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  tokens,
  xStocks,
  perpMarkets,
  perpPositions,
  stakingOptions,
  nfts,
  cards,
  transactions,
  currency,
  language,
  onOpenSend,
  onOpenReceive,
  onOpenBuy,
  onOpenSwap,
  onOpenStake,
  onOpenPerp,
  onClosePosition,
  isLocked = false,
  onTriggerUnlock,
  priceAlerts,
  triggeredAlerts,
  onOpenPriceAlertsModal,
  onDismissTriggeredAlert,
  onSimulatePriceShock,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<PortfolioSubTab>('tokens');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const t = TRANSLATIONS[language];

  // Calculate total portfolio valuation in USD
  const tokensValuation = tokens.reduce((acc, t) => acc + t.balance * t.usdPrice, 0);
  const stakedValuation = stakingOptions.reduce((acc, s) => {
    const solPrice = tokens.find((t) => t.symbol === 'SOL')?.usdPrice || 184.2;
    return acc + s.stakedAmount * solPrice;
  }, 0);
  const perpsValuation = perpPositions.reduce((acc, p) => acc + p.collateralUsd + p.pnlUsd, 0);
  const totalValuationUsd = tokensValuation + stakedValuation + perpsValuation;

  const solToken = tokens.find((t) => t.symbol === 'SOL') || tokens[0];
  const activeCard = cards[activeCardIndex] || cards[0];
  const enabledAlertsCount = priceAlerts.filter((a) => a.enabled).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Real-Time Triggered Price Alert Banner */}
      {triggeredAlerts.length > 0 && (
        <div className="space-y-2">
          {triggeredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/60 p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-top-3 duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-md shadow-amber-500/30 animate-pulse shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xs font-bold uppercase tracking-wider text-amber-400">
                        PRICE DEVIATION ALERT
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                          alert.direction === 'up'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {alert.direction === 'up' ? '▲ +' : '▼ '}{alert.deviationPercent}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5">
                      <strong className="text-white font-bold">{alert.tokenSymbol}</strong> has deviated by{' '}
                      <strong className={alert.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                        {alert.deviationPercent >= 0 ? '+' : ''}{alert.deviationPercent}%
                      </strong>{' '}
                      (${alert.basePriceUsd < 0.01 ? alert.basePriceUsd.toFixed(6) : alert.basePriceUsd.toFixed(2)} →{' '}
                      ${alert.currentPriceUsd < 0.01 ? alert.currentPriceUsd.toFixed(6) : alert.currentPriceUsd.toFixed(2)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onOpenSwap(alert.tokenSymbol)}
                    className="flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-black transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Swap {alert.tokenSymbol}</span>
                  </button>
                  <button
                    onClick={() => onDismissTriggeredAlert(alert.id)}
                    className="rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-700 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vault Balance Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#131b2e] to-[#0c101a] p-6 shadow-2xl">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.vault} · Solana Vault
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="h-3 w-3" />
                +4.25% (24h)
              </span>

              {/* Price Alerts Trigger Button */}
              <button
                type="button"
                onClick={onOpenPriceAlertsModal}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30 transition-colors cursor-pointer shadow-sm"
                title="Manage Real-Time Price Alerts"
              >
                <Bell className="h-3 w-3 text-amber-400" />
                <span>Price Alerts ({enabledAlertsCount})</span>
              </button>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              {isLocked ? (
                <button
                  onClick={onTriggerUnlock}
                  className="flex items-center gap-3 group cursor-pointer text-left"
                  title="Biometric scan required. Tap to unlock"
                >
                  <span className="font-heading text-4xl sm:text-5xl font-extrabold tracking-wider text-slate-400 font-mono select-none">
                    ••••••••
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 group-hover:bg-cyan-900 group-hover:border-cyan-400 transition-all shadow-md shadow-cyan-950">
                    <Fingerprint className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span>Scan to Unlock</span>
                  </span>
                </button>
              ) : (
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
                  {formatFiat(totalValuationUsd, currency)}
                </h1>
              )}
            </div>

            <p className="mt-1 font-mono text-sm text-cyan-300 font-semibold">
              ≈ {isLocked ? '•••••••• SOL' : `${solToken.balance.toFixed(4)} SOL`}{' '}
              <span className="text-xs text-slate-400 font-normal">
                (${solToken.usdPrice.toFixed(2)} / SOL)
              </span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={onOpenBuy}
              className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-950/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-300">{t.buy}</span>
            </button>

            <button
              onClick={() => onOpenSend()}
              className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-3 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-950/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-cyan-300">{t.send}</span>
            </button>

            <button
              onClick={onOpenReceive}
              className="flex flex-col items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/40 p-3 hover:bg-purple-900/50 hover:border-purple-400 transition-all cursor-pointer shadow-lg shadow-purple-950/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-purple-300">{t.receive}</span>
            </button>

            <button
              onClick={() => onOpenSwap()}
              className="flex flex-col items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-3 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all cursor-pointer shadow-lg shadow-indigo-950/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-indigo-300">{t.swap}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mysteryum Virtual Cards Showcase (1 / 8 Series) */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              My Cards · {activeCardIndex + 1} / {cards.length}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCardIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeCardIndex ? 'w-5 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Select card ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Active Card Preview */}
        <div
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${activeCard.color} p-5 shadow-xl transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                {activeCard.series}
              </span>
              <p className="font-heading text-sm font-extrabold text-white tracking-wide">
                {activeCard.title}
              </p>
            </div>
            <span className="rounded-lg bg-black/40 px-2 py-1 text-[10px] font-mono font-bold text-cyan-300 border border-white/10">
              {activeCard.tier}
            </span>
          </div>

          <div className="my-6">
            <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-white select-all">
              {activeCard.cardNumber}
            </p>
          </div>

          <div className="flex items-end justify-between text-xs">
            <div>
              <p className="text-[10px] text-white/60 uppercase">Card Holder</p>
              <p className="font-mono font-bold text-white">{activeCard.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 uppercase">Balance</p>
              <p className="font-mono font-bold text-emerald-300">
                {isLocked ? '••••••••' : `$${activeCard.balanceUsd.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Sub-Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 no-scrollbar">
          {[
            { id: 'tokens', label: t.tokens, count: tokens.length },
            { id: 'xstocks', label: t.xStocks, count: xStocks.length },
            { id: 'perps', label: t.perps, count: perpMarkets.length },
            { id: 'earn', label: t.earn, count: stakingOptions.length },
            { id: 'nft', label: t.nft, count: nfts.length },
            { id: 'activity', label: t.activity, count: transactions.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as PortfolioSubTab)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-slate-800/80 px-1.5 py-0.2 text-[10px] font-mono text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sub-tab 1: Tokens */}
        {activeSubTab === 'tokens' && (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/50 p-3.5 hover:bg-slate-900/80 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 font-bold text-cyan-400 border border-white/10 shadow-sm">
                    {token.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-white text-sm">
                        {token.symbol}
                      </span>
                      {token.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      )}
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                        {token.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[120px] sm:max-w-none">
                      {token.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-white">
                    {isLocked ? '••••••' : `${token.balance.toLocaleString()} ${token.symbol}`}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="font-mono text-slate-400">
                      {isLocked ? '••••••' : formatFiat(token.balance * token.usdPrice, currency)}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        token.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {token.change24h >= 0 ? '+' : ''}
                      {token.change24h}%
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 ml-3">
                  <button
                    onClick={() => onOpenSend(token.symbol)}
                    className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => onOpenSwap(token.symbol)}
                    className="rounded-lg bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-900 transition-colors"
                  >
                    Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sub-tab 2: xStocks (Tokenized Equities on Solana) */}
        {activeSubTab === 'xstocks' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-300">
              <p className="font-semibold mb-0.5">xStocks · Solana Tokenized Shares</p>
              <p className="text-[11px] text-slate-400">{t.disclaimerXstocks}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {xStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/50 p-3.5 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stock.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{stock.symbol}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                          {stock.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{stock.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{stock.underlying}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-white">
                      ${stock.price.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        stock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stock.change24h >= 0 ? '+' : ''}
                      {stock.change24h}%
                    </span>
                    <button
                      onClick={() => onOpenSwap('USDC')}
                      className="mt-1.5 block w-full rounded-lg bg-slate-800/80 px-2 py-0.5 text-[11px] font-bold text-cyan-300 hover:bg-slate-700"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 3: Perps (Perpetual Futures) */}
        {activeSubTab === 'perps' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
              <p className="font-semibold">Jupiter & Drift Solana Perpetuals</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.perpsWarning}</p>
            </div>

            {/* Markets List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {perpMarkets.map((m) => (
                <div
                  key={m.symbol}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-white">{m.symbol}</h4>
                      <p className="text-xs text-slate-400">{m.name}</p>
                    </div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                      Up to {m.maxLeverage}x
                    </span>
                  </div>

                  <div>
                    <p className="font-heading text-xl font-bold text-white font-mono">
                      ${m.markPrice.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1h Funding</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {m.fundingRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Open Interest</span>
                      <span className="font-mono text-slate-300">{m.openInterestUsd}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenPerp(m.symbol)}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    Open Position
                  </button>
                </div>
              ))}
            </div>

            {/* Active Open Positions */}
            <div className="space-y-2 pt-2">
              <h4 className="font-heading text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Positions ({perpPositions.length})
              </h4>
              {perpPositions.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 text-center text-xs text-slate-500">
                  No active perpetual positions. Click "Open Position" above to trade.
                </div>
              ) : (
                perpPositions.map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-bold uppercase font-mono ${
                            pos.side === 'long'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {pos.side} {pos.leverage}x
                        </span>
                        <span className="font-bold text-white text-sm">{pos.symbol}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Size: ${pos.sizeUsd.toFixed(2)} · Entry: ${pos.entryPrice.toLocaleString()} · Liq: ${pos.liquidationPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`font-mono text-sm font-bold ${
                            pos.pnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {pos.pnlUsd >= 0 ? '+' : ''}${pos.pnlUsd.toFixed(2)}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent}%
                        </p>
                      </div>

                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sub-tab 4: Earn / Staking */}
        {activeSubTab === 'earn' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 text-xs text-purple-300 flex items-center justify-between">
              <div>
                <p className="font-semibold">Solana Liquid & Native Staking</p>
                <p className="text-[11px] text-slate-400">
                  Earn validator rewards while retaining liquidity or full delegation control.
                </p>
              </div>
              <Flame className="h-6 w-6 text-purple-400 shrink-0" />
            </div>

            <div className="space-y-3">
              {stakingOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-white text-base">
                          {opt.name}
                        </h4>
                        <span className="rounded bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 text-xs font-mono font-bold text-purple-300">
                          {opt.token}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xl font-bold text-emerald-400">
                        +{opt.apy}%
                      </span>
                      <p className="text-[11px] text-slate-400">Yield APY</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-slate-400">
                      Currently Staked:{' '}
                      <strong className="text-white font-mono">{opt.stakedAmount} SOL</strong>
                    </span>
                    <button
                      onClick={() => onOpenStake(opt.id)}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-1.5 font-bold text-white transition-colors cursor-pointer"
                    >
                      Stake SOL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 5: NFTs */}
        {activeSubTab === 'nft' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 group hover:border-cyan-500/40 transition-all"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-800">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-cyan-400 font-semibold truncate">
                    {nft.collection}
                  </p>
                  <p className="font-heading text-xs font-bold text-white truncate mt-0.5">
                    {nft.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs border-t border-white/5 pt-2">
                    <span className="text-[11px] text-slate-400">Floor</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {nft.floorPriceSol} SOL
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sub-tab 6: Activity */}
        {activeSubTab === 'activity' && (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/50 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      tx.type === 'receive'
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                        : tx.type === 'send'
                        ? 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                        : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {tx.type === 'receive' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : tx.type === 'send' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowLeftRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-white text-xs capitalize">
                      {tx.type} {tx.symbol}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Sig: {shortenAddress(tx.signature, 5)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono text-xs font-bold ${
                      tx.type === 'receive' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.symbol.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Mysteryum Wallet Link Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center space-y-2">
        <a
          href="https://mysteryum-wallet.lovable.app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
        >
          <span>mysteryum-wallet.lovable.app</span>
          <ExternalLink className="h-3 w-3" />
        </a>
        <p className="text-[11px] text-slate-500">
          Solana Full Control · Non-Custodial Vault · Your keys stay yours
        </p>
      </div>
    </div>
  );
};
