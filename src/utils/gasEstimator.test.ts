import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateGasFee, CONGESTION_CONFIGS, PRIORITY_MULTIPLIERS } from './gasEstimator.ts';

test('estimateGasFee calculates correct standard fees under normal congestion', () => {
  const result = estimateGasFee({
    congestionLevel: 'normal',
    priority: 'standard',
    solPriceUsd: 184.2,
  });

  assert.strictEqual(result.baseFeeSol, 0.000005);
  assert(result.totalFeeSol > 0.000005);
  assert(result.totalFeeUsd > 0);
  assert.strictEqual(result.congestionLabel, 'Normal Traffic');
});

test('estimateGasFee increases fees proportionally under heavy congestion', () => {
  const normalFee = estimateGasFee({
    congestionLevel: 'normal',
    priority: 'fast',
    solPriceUsd: 200,
  });

  const congestedFee = estimateGasFee({
    congestionLevel: 'congested',
    priority: 'fast',
    solPriceUsd: 200,
  });

  assert(congestedFee.totalFeeSol > normalFee.totalFeeSol);
  assert(congestedFee.totalFeeUsd > normalFee.totalFeeUsd);
});

test('estimateGasFee scales with different priority speeds', () => {
  const standard = estimateGasFee({ priority: 'standard' });
  const fast = estimateGasFee({ priority: 'fast' });
  const turbo = estimateGasFee({ priority: 'turbo' });

  assert(turbo.totalFeeSol > fast.totalFeeSol);
  assert(fast.totalFeeSol > standard.totalFeeSol);
});
