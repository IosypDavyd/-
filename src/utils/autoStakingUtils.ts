import type { StakingOption } from '../types/wallet.ts';

export interface AutoCompoundResult {
  updatedOption: StakingOption;
  didCompound: boolean;
  compoundedAmountSol: number;
}

/**
 * Checks if auto-staking is enabled and accrued rewards meet or exceed the user threshold.
 * If so, transfers accrued rewards back into stakedAmount, resets accruedRewardsSol,
 * and increments totalCompoundCount.
 */
export function processAutoCompound(option: StakingOption): AutoCompoundResult {
  const isEnabled = Boolean(option.autoStakeEnabled);
  const threshold = option.autoStakeThreshold ?? 0.05;
  const accrued = option.accruedRewardsSol ?? 0;

  if (isEnabled && accrued >= threshold && accrued > 0) {
    const compoundedAmountSol = Math.round(accrued * 10000) / 10000;
    const newStakedAmount = Math.round((option.stakedAmount + compoundedAmountSol) * 10000) / 10000;

    return {
      updatedOption: {
        ...option,
        stakedAmount: newStakedAmount,
        accruedRewardsSol: 0,
        totalCompoundCount: (option.totalCompoundCount ?? 0) + 1,
      },
      didCompound: true,
      compoundedAmountSol,
    };
  }

  return {
    updatedOption: option,
    didCompound: false,
    compoundedAmountSol: 0,
  };
}

/**
 * Helper to update auto-staking configuration settings on an option
 */
export function updateAutoStakeSettings(
  option: StakingOption,
  enabled: boolean,
  thresholdSol: number
): StakingOption {
  return {
    ...option,
    autoStakeEnabled: enabled,
    autoStakeThreshold: Math.max(0.01, thresholdSol),
  };
}
