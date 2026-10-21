import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRebalancePlan } from './portfolioRebalancer.ts';
import type { TokenAsset } from '../types/wallet.ts';

const mockTokens: TokenAsset[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 5.0, // 5 * $200 = $1,000 (50%)
    usdPrice: 200,
    change24h: 3.5,
    decimals: 9,
    mintAddress: 'So11111111111111111111111111111111111111112',
    icon: '◎',
    isVerified: true,
    category: 'native',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 1000, // 1000 * $1 = $1,000 (50%)
    usdPrice: 1.0,
    change24h: 0.0,
    decimals: 6,
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    icon: 'U',
    isVerified: true,
    category: 'spl',
  },
];

test('calculateRebalancePlan returns valid summary for balanced 50/50 targets', () => {
  const targets = { SOL: 50, USDC: 50 };
  const plan = calculateRebalancePlan(mockTokens, targets);

  assert.strictEqual(plan.totalPortfolioValueUsd, 2000);
  assert.strictEqual(plan.isAllocationValid, true);
  assert.strictEqual(plan.totalTargetPercent, 100);
  assert.strictEqual(plan.buyCount, 0);
  assert.strictEqual(plan.sellCount, 0);
  assert.strictEqual(plan.holdCount, 2);
});

test('calculateRebalancePlan suggests BUY and SELL when target shifts to 70/30', () => {
  const targets = { SOL: 70, USDC: 30 };
  const plan = calculateRebalancePlan(mockTokens, targets);

  assert.strictEqual(plan.isAllocationValid, true);
  // Total is $2000. Target SOL is $1400 (currently $1000 => BUY $400)
  // Target USDC is $600 (currently $1000 => SELL $400)
  assert.strictEqual(plan.buyCount, 1);
  assert.strictEqual(plan.sellCount, 1);
  assert.strictEqual(plan.totalVolumeToTradeUsd, 800);

  const solSuggestion = plan.suggestions.find((s) => s.symbol === 'SOL');
  assert.ok(solSuggestion);
  assert.strictEqual(solSuggestion.action, 'BUY');
  assert.strictEqual(solSuggestion.deltaUsd, 400);
  assert.strictEqual(solSuggestion.deltaUnits, 2); // 400 / 200

  const usdcSuggestion = plan.suggestions.find((s) => s.symbol === 'USDC');
  assert.ok(usdcSuggestion);
  assert.strictEqual(usdcSuggestion.action, 'SELL');
  assert.strictEqual(usdcSuggestion.deltaUsd, -400);
});

test('calculateRebalancePlan detects invalid target sums not equaling 100%', () => {
  const targets = { SOL: 60, USDC: 20 }; // sum 80%
  const plan = calculateRebalancePlan(mockTokens, targets);

  assert.strictEqual(plan.isAllocationValid, false);
  assert(plan.allocationError?.includes('80%'));
});
