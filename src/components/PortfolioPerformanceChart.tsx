import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  buildPortfolioPerformanceTimeline,
  ChartTimeframe,
  PerformanceDataPoint,
} from '../utils/portfolioChartUtils';
import { TransactionRecord } from '../types/wallet';
import { formatFiat } from '../utils/currencies';

interface PortfolioPerformanceChartProps {
  currentBalanceUsd: number;
  transactions: TransactionRecord[];
  currency: string;
  isLocked?: boolean;
}

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({
  currentBalanceUsd,
  transactions,
  currency,
  isLocked = false,
}) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<PerformanceDataPoint | null>(null);

  const data = useMemo(() => {
    return buildPortfolioPerformanceTimeline(currentBalanceUsd, transactions, timeframe);
  }, [currentBalanceUsd, transactions, timeframe]);

  const startVal = data[0]?.balanceUsd || currentBalanceUsd;
  const currentVal = hoveredPoint ? hoveredPoint.balanceUsd : (data[data.length - 1]?.balanceUsd || currentBalanceUsd);
  const netChangeUsd = currentVal - startVal;
  const netChangePercent = startVal > 0 ? (netChangeUsd / startVal) * 100 : 0;
  const isPositive = netChangeUsd >= 0;

  // Min and max for domain
  const values = data.map((d) => d.balanceUsd);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.12 || 10;
  const domainMin = Math.max(0, Math.floor(minVal - padding));
  const domainMax = Math.ceil(maxVal + padding);

  const timeframes: { id: ChartTimeframe; label: string }[] = [
    { id: '24H', label: '24H' },
    { id: '7D', label: '7D' },
    { id: '30D', label: '30D' },
    { id: 'ALL', label: 'ALL' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111728]/95 via-[#0d121f]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Background glow styling */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-700 ${
          isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`}
      />

      {/* Header bar: Titles, metrics, and timeframe selector */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              isPositive
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                <span>7-Day Performance History</span>
                <span className="rounded bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300">
                  RECHARTS
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Total portfolio balance tracked over time based on historical on-chain transactions
            </p>
          </div>
        </div>

        {/* Timeframe Chips */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => {
                setTimeframe(tf.id);
                setHoveredPoint(null);
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Numerical Headline */}
      <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {isLocked ? '••••••••' : formatFiat(currentVal, currency)}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
            <span className={`font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '▲ +' : '▼ '}
              {formatFiat(Math.abs(netChangeUsd), currency)} ({netChangePercent >= 0 ? '+' : ''}
              {netChangePercent.toFixed(2)}%)
            </span>
            <span className="text-slate-500">over {timeframe}</span>
          </div>
        </div>

        {hoveredPoint && (
          <div className="text-right text-[11px] font-mono text-slate-300 bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-1">
            <div className="text-cyan-300 font-semibold">{hoveredPoint.fullDate}</div>
            <div className="text-[10px] text-slate-400">{hoveredPoint.eventDescription}</div>
          </div>
        )}
      </div>

      {/* Interactive Recharts SVG Area */}
      <div className="relative z-10 h-48 sm:h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                setHoveredPoint(state.activePayload[0].payload as PerformanceDataPoint);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="balanceGlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? '#06b6d4' : '#f43f5e'}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? '#10b981' : '#e11d48'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155', strokeWidth: 1 }}
              tick={{ fill: '#94a3b8' }}
            />

            <YAxis
              domain={[domainMin, domainMax]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as PerformanceDataPoint;
                  return (
                    <div className="rounded-xl border border-cyan-500/40 bg-[#080d1a]/95 p-2.5 shadow-2xl backdrop-blur-md text-xs font-mono">
                      <p className="text-[10px] text-slate-400 mb-0.5">{pt.fullDate}</p>
                      <p className="font-heading font-black text-sm text-white">
                        {formatFiat(pt.balanceUsd, currency)}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-3 text-[10px] border-t border-white/10 pt-1">
                        <span className="text-cyan-400 font-semibold">{pt.eventType}</span>
                        <span className={pt.changeUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {pt.changeUsd >= 0 ? '+' : ''}${pt.changeUsd.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="balanceUsd"
              stroke={isPositive ? '#06b6d4' : '#f43f5e'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#balanceGlowGradient)"
              activeDot={{
                r: 6,
                fill: '#22d3ee',
                stroke: '#080d1a',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>SOL & SPL Valuation</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Staking Yields (JitoSOL)</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            <span>xStocks & Perps PnL</span>
          </span>
        </div>

        <span className="text-slate-500">Live On-Chain Feed · 400ms Sync</span>
      </div>
    </div>
  );
};
