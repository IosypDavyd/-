import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processAutoCompound, updateAutoStakeSettings } from './autoStakingUtils.ts';
import type { StakingOption } from '../types/wallet.ts';

const baseOption: StakingOption = {
  id: 'jito',
  name: 'Jito Liquid Staking',
  token: 'JitoSOL',
  apy: 7.82,
  type: 'liquid',
  provider: 'Jito Foundation',
  stakedAmount: 1.5,
  description: 'Test staking pool',
  autoStakeEnabled: true,
  autoStakeThreshold: 0.05,
  accruedRewardsSol: 0.06,
  totalCompoundCount: 2,
};

test('processAutoCompound re-stakes accrued rewards when threshold is reached', () => {
  const result = processAutoCompound(baseOption);

  assert.strictEqual(result.didCompound, true);
  assert.strictEqual(result.compoundedAmountSol, 0.06);
  assert.strictEqual(result.updatedOption.stakedAmount, 1.56);
  assert.strictEqual(result.updatedOption.accruedRewardsSol, 0);
  assert.strictEqual(result.updatedOption.totalCompoundCount, 3);
});

test('processAutoCompound does not re-stake if accrued rewards are below threshold', () => {
  const belowOption = {
    ...baseOption,
    accruedRewardsSol: 0.02, // < 0.05
  };
  const result = processAutoCompound(belowOption);

  assert.strictEqual(result.didCompound, false);
  assert.strictEqual(result.updatedOption.stakedAmount, 1.5);
  assert.strictEqual(result.updatedOption.accruedRewardsSol, 0.02);
});

test('processAutoCompound does not re-stake if autoStakeEnabled is false', () => {
  const disabledOption = {
    ...baseOption,
    autoStakeEnabled: false,
    accruedRewardsSol: 0.1,
  };
  const result = processAutoCompound(disabledOption);

  assert.strictEqual(result.didCompound, false);
  assert.strictEqual(result.updatedOption.stakedAmount, 1.5);
});

test('updateAutoStakeSettings sets enabled state and minimum threshold', () => {
  const updated = updateAutoStakeSettings(baseOption, false, 0.08);

  assert.strictEqual(updated.autoStakeEnabled, false);
  assert.strictEqual(updated.autoStakeThreshold, 0.08);
});
