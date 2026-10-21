import type { TokenAsset } from '../types/wallet.ts';

export interface TokenAllocationTarget {
  symbol: string;
  targetPercent: number; // 0 to 100
}

export interface RebalanceSuggestion {
  symbol: string;
  name: string;
  icon: string;
  currentBalance: number;
  currentUsdPrice: number;
  currentValueUsd: number;
  currentPercent: number;
  targetPercent: number;
  targetValueUsd: number;
  deltaUsd: number; // targetValueUsd - currentValueUsd (positive: buy, negative: sell)
  deltaUnits: number; // deltaUsd / currentUsdPrice
  action: 'BUY' | 'SELL' | 'HOLD';
  urgency: 'high' | 'medium' | 'low';
}

export interface RebalancePlanSummary {
  totalPortfolioValueUsd: number;
  totalTargetPercent: number;
  isAllocationValid: boolean; // sum is 100% (or very close within 0.1%)
  allocationError?: string;
  suggestions: RebalanceSuggestion[];
  totalVolumeToTradeUsd: number;
  buyCount: number;
  sellCount: number;
  holdCount: number;
}

/**
 * Standard preset portfolio allocation models
 */
export const REBALANCE_PRESETS: {
  id: string;
  name: string;
  description: string;
  allocations: Record<string, number>;
}[] = [
  {
    id: 'sol-heavy',
    name: 'Solana Maximum Bull',
    description: '70% SOL, 15% JitoSOL, 10% USDC, 5% Ecosystem gems',
    allocations: {
      SOL: 70,
      JitoSOL: 15,
      USDC: 10,
      KPGM: 5,
    },
  },
  {
    id: 'balanced-defi',
    name: 'Balanced DeFi & Staking',
    description: '40% SOL, 25% JitoSOL, 20% USDC, 10% JUP, 5% RAY',
    allocations: {
      SOL: 40,
      JitoSOL: 25,
      USDC: 20,
      JUP: 10,
      RAY: 5,
    },
  },
  {
    id: 'capital-preservation',
    name: 'Stable Capital Shield',
    description: '50% USDC, 20% USDT, 20% SOL, 10% JitoSOL',
    allocations: {
      USDC: 50,
      USDT: 20,
      SOL: 20,
      JitoSOL: 10,
    },
  },
];

/**
 * Calculates current weights, deltas, and recommended trade orders
 */
export function calculateRebalancePlan(
  tokens: TokenAsset[],
  targetAllocations: Record<string, number>, // symbol -> target percentage (0-100)
  minTradeUsdThreshold: number = 1.0 // ignore trades smaller than $1 to prevent dust churn
): RebalancePlanSummary {
  // 1. Calculate total portfolio value across all tokens
  const tokenValues = tokens.map((token) => {
    const valueUsd = token.balance * token.usdPrice;
    return {
      token,
      valueUsd,
    };
  });

  const totalPortfolioValueUsd = tokenValues.reduce((sum, item) => sum + item.valueUsd, 0);

  // 2. Validate target allocation sum
  const targetSum = Object.values(targetAllocations).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const roundedTargetSum = Math.round(targetSum * 10) / 10;
  const isAllocationValid = Math.abs(roundedTargetSum - 100) <= 0.5;

  let allocationError: string | undefined;
  if (!isAllocationValid) {
    allocationError = `Total target allocation is ${roundedTargetSum}%. Targets must total 100% to generate exact rebalance orders.`;
  }

  // 3. Generate suggestions for each token
  const suggestions: RebalanceSuggestion[] = [];
  let totalVolumeToTradeUsd = 0;
  let buyCount = 0;
  let sellCount = 0;
  let holdCount = 0;

  tokens.forEach((token) => {
    const valueUsd = token.balance * token.usdPrice;
    const currentPercent =
      totalPortfolioValueUsd > 0 ? (valueUsd / totalPortfolioValueUsd) * 100 : 0;
    const targetPercent = targetAllocations[token.symbol] ?? 0;
    const targetValueUsd = (totalPortfolioValueUsd * targetPercent) / 100;
    const deltaUsd = targetValueUsd - valueUsd;
    const deltaUnits = token.usdPrice > 0 ? deltaUsd / token.usdPrice : 0;

    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let urgency: 'high' | 'medium' | 'low' = 'low';

    if (Math.abs(deltaUsd) >= minTradeUsdThreshold) {
      if (deltaUsd > 0) {
        action = 'BUY';
        buyCount++;
      } else {
        action = 'SELL';
        sellCount++;
      }
      totalVolumeToTradeUsd += Math.abs(deltaUsd);

      const percentDiff = Math.abs(targetPercent - currentPercent);
      if (percentDiff >= 15) urgency = 'high';
      else if (percentDiff >= 5) urgency = 'medium';
      else urgency = 'low';
    } else {
      holdCount++;
    }

    suggestions.push({
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      currentBalance: token.balance,
      currentUsdPrice: token.usdPrice,
      currentValueUsd: valueUsd,
      currentPercent: Math.round(currentPercent * 100) / 100,
      targetPercent,
      targetValueUsd: Math.round(targetValueUsd * 100) / 100,
      deltaUsd: Math.round(deltaUsd * 100) / 100,
      deltaUnits: Math.round(deltaUnits * 10000) / 10000,
      action,
      urgency,
    });
  });

  // Sort: Trades with largest absolute USD impact first
  suggestions.sort((a, b) => Math.abs(b.deltaUsd) - Math.abs(a.deltaUsd));

  return {
    totalPortfolioValueUsd: Math.round(totalPortfolioValueUsd * 100) / 100,
    totalTargetPercent: roundedTargetSum,
    isAllocationValid,
    allocationError,
    suggestions,
    totalVolumeToTradeUsd: Math.round(totalVolumeToTradeUsd * 100) / 100,
    buyCount,
    sellCount,
    holdCount,
  };
}
