import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPortfolioPerformanceTimeline,
} from './portfolioChartUtils.ts';
import type { ChartTimeframe } from './portfolioChartUtils.ts';
import type { TransactionRecord } from '../types/wallet.ts';

test('buildPortfolioPerformanceTimeline generates non-empty data points ending with current balance', () => {
  const currentBalance = 2550.75;
  const mockTxs: TransactionRecord[] = [
    {
      id: 'tx-1',
      type: 'receive',
      symbol: 'SOL',
      amount: 2.0,
      amountUsd: 368.4,
      fromAddress: 'AddrA',
      toAddress: 'AddrB',
      timestamp: Date.now() - 3600000 * 24 * 3,
      status: 'confirmed',
      signature: 'sig1',
      feeSol: 0.000005,
    },
    {
      id: 'tx-2',
      type: 'send',
      symbol: 'USDC',
      amount: 50,
      amountUsd: 50,
      fromAddress: 'AddrB',
      toAddress: 'AddrC',
      timestamp: Date.now() - 3600000 * 24 * 1,
      status: 'confirmed',
      signature: 'sig2',
      feeSol: 0.000005,
    },
  ];

  const timeframes: ChartTimeframe[] = ['24H', '7D', '30D', 'ALL'];

  for (const tf of timeframes) {
    const points = buildPortfolioPerformanceTimeline(currentBalance, mockTxs, tf);
    assert.ok(points.length > 5, `Points should be generated for ${tf}`);
    const lastPoint = points[points.length - 1];
    assert.strictEqual(
      lastPoint.balanceUsd,
      currentBalance,
      `Last point should match current balance for ${tf}`
    );
    assert.ok(lastPoint.timeLabel.length > 0);
  }
});

test('buildPortfolioPerformanceTimeline handles zero balance gracefully without crashing', () => {
  const points = buildPortfolioPerformanceTimeline(0, [], '7D');
  assert.ok(points.length > 0);
  assert.ok(points[points.length - 1].balanceUsd >= 0);
});
