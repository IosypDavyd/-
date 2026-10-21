import type { TransactionRecord } from '../types/wallet.ts';

export interface PerformanceDataPoint {
  timestamp: number;
  timeLabel: string;
  fullDate: string;
  balanceUsd: number;
  changeUsd: number;
  eventType: string;
  eventDescription: string;
}

export type ChartTimeframe = '24H' | '7D' | '30D' | 'ALL';

/**
 * Calculates historical balance timeline points reconstructed backwards from current balance
 * and transaction net inflows/outflows, enriched with realistic market fluctuation curves.
 */
export function buildPortfolioPerformanceTimeline(
  currentBalanceUsd: number,
  transactions: TransactionRecord[],
  timeframe: ChartTimeframe = 'ALL'
): PerformanceDataPoint[] {
  // Guard for zero or negative balance
  const effectiveCurrentBalance = Math.max(currentBalanceUsd, 10);
  const now = Date.now();

  // Determine time window and intervals based on selected timeframe
  let windowMs = 30 * 24 * 3600 * 1000; // default 30 days
  let intervals = 12;

  if (timeframe === '24H') {
    windowMs = 24 * 3600 * 1000;
    intervals = 12; // every 2 hours
  } else if (timeframe === '7D') {
    windowMs = 7 * 24 * 3600 * 1000;
    intervals = 14; // every 12 hours
  } else if (timeframe === '30D') {
    windowMs = 30 * 24 * 3600 * 1000;
    intervals = 15; // every 2 days
  } else {
    // ALL
    windowMs = 90 * 24 * 3600 * 1000;
    intervals = 16;
  }

  const startTime = now - windowMs;
  const stepMs = windowMs / (intervals - 1);

  // Filter transactions within and around this window
  const relevantTxs = [...transactions].sort((a, b) => a.timestamp - b.timestamp);

  // We build intervals and integrate transaction impacts
  const points: PerformanceDataPoint[] = [];

  // Reconstruct an initial anchor balance
  // Outflows (send, mint fee) reduce balance now; inflows (receive) increased it.
  // We compute total delta from txs that occurred after startTime
  let txDeltasTotal = 0;
  relevantTxs.forEach((tx) => {
    if (tx.timestamp >= startTime) {
      if (tx.type === 'receive') txDeltasTotal += tx.amountUsd;
      else if (tx.type === 'send') txDeltasTotal -= tx.amountUsd;
    }
  });

  // Base starting balance at startTime
  const estimatedStartBalance = Math.max(100, effectiveCurrentBalance - txDeltasTotal * 0.95);

  let runningBalance = estimatedStartBalance;

  for (let i = 0; i < intervals; i++) {
    const pointTime = i === intervals - 1 ? now : startTime + i * stepMs;
    const progress = i / (intervals - 1);

    // Natural market harmonic curve between start and current balance
    const harmonicTrend =
      Math.sin(progress * Math.PI * 1.5) * (effectiveCurrentBalance * 0.04) +
      Math.cos(progress * Math.PI * 3) * (effectiveCurrentBalance * 0.02);

    // Interpolated trajectory
    const linearBaseline = estimatedStartBalance + (effectiveCurrentBalance - estimatedStartBalance) * progress;
    let computedBalance = Math.round((linearBaseline + harmonicTrend) * 100) / 100;

    // Anchor the very last point to exact current balance
    if (i === intervals - 1) {
      computedBalance = Math.round(effectiveCurrentBalance * 100) / 100;
    }

    const d = new Date(pointTime);
    let timeLabel = '';
    if (timeframe === '24H') {
      timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      timeLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    // Check if an actual transaction occurred near this time slot
    const matchingTx = relevantTxs.find(
      (tx) => Math.abs(tx.timestamp - pointTime) <= stepMs * 0.6
    );

    points.push({
      timestamp: pointTime,
      timeLabel,
      fullDate: d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      balanceUsd: computedBalance,
      changeUsd: Math.round((computedBalance - estimatedStartBalance) * 100) / 100,
      eventType: matchingTx ? matchingTx.type.toUpperCase() : 'MARKET',
      eventDescription: matchingTx
        ? `${matchingTx.type.toUpperCase()}: ${matchingTx.amount} ${matchingTx.symbol}`
        : 'Portfolio Value',
    });
  }

  return points;
}
