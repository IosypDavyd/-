export type NetworkCongestionLevel = 'low' | 'normal' | 'high' | 'congested';

export interface CongestionTierInfo {
  level: NetworkCongestionLevel;
  label: string;
  description: string;
  baseFeeSol: number;
  priorityFeeMicroLamports: number;
  totalFeeSol: number;
  confirmationTimeMs: number;
  tpsEstimate: number;
  badgeColor: string;
}

export type PrioritySpeed = 'standard' | 'fast' | 'turbo';

/**
 * Baseline configuration for Solana network congestion levels
 */
export const CONGESTION_CONFIGS: Record<NetworkCongestionLevel, {
  label: string;
  description: string;
  baseFeeSol: number;
  tps: number;
  avgConfirmationMs: number;
  badgeColor: string;
}> = {
  low: {
    label: 'Low Congestion',
    description: 'Optimal network conditions. Sub-second instant finality.',
    baseFeeSol: 0.000005,
    tps: 4200,
    avgConfirmationMs: 380,
    badgeColor: 'emerald',
  },
  normal: {
    label: 'Normal Traffic',
    description: 'Typical mainnet volume. Consistent sub-cent transfers.',
    baseFeeSol: 0.000005,
    tps: 3450,
    avgConfirmationMs: 420,
    badgeColor: 'cyan',
  },
  high: {
    label: 'High Traffic',
    description: 'Increased DEX & NFT minting volume. Moderate priority fee advised.',
    baseFeeSol: 0.000005,
    tps: 2600,
    avgConfirmationMs: 780,
    badgeColor: 'amber',
  },
  congested: {
    label: 'Heavy Congestion',
    description: 'Spike in liquidations/arbitrage bots. Priority fees ensure inclusion.',
    baseFeeSol: 0.000005,
    tps: 1850,
    avgConfirmationMs: 1450,
    badgeColor: 'rose',
  },
};

/**
 * Priority speed multipliers:
 * - standard: 1x multiplier
 * - fast: 2.2x multiplier
 * - turbo: 5x multiplier
 */
export const PRIORITY_MULTIPLIERS: Record<PrioritySpeed, {
  label: string;
  microLamports: number;
  additionalFeeSol: number;
  speedDesc: string;
}> = {
  standard: {
    label: 'Standard',
    microLamports: 1000,
    additionalFeeSol: 0.000002,
    speedDesc: '~400-800 ms',
  },
  fast: {
    label: 'Fast (+Priority)',
    microLamports: 10000,
    additionalFeeSol: 0.000015,
    speedDesc: '~350-450 ms',
  },
  turbo: {
    label: 'Turbo (Instant MEV Shield)',
    microLamports: 50000,
    additionalFeeSol: 0.000065,
    speedDesc: '&lt; 350 ms',
  },
};

/**
 * Calculates dynamically simulated Solana gas fees in SOL and USD
 */
export function estimateGasFee({
  congestionLevel = 'normal',
  priority = 'standard',
  solPriceUsd = 184.2,
}: {
  congestionLevel?: NetworkCongestionLevel;
  priority?: PrioritySpeed;
  solPriceUsd?: number;
}): {
  baseFeeSol: number;
  priorityFeeSol: number;
  totalFeeSol: number;
  totalFeeUsd: number;
  confirmationTimeMs: number;
  tpsEstimate: number;
  congestionLabel: string;
  congestionDescription: string;
} {
  const congestion = CONGESTION_CONFIGS[congestionLevel] || CONGESTION_CONFIGS.normal;
  const priorityConfig = PRIORITY_MULTIPLIERS[priority] || PRIORITY_MULTIPLIERS.standard;

  const baseFeeSol = congestion.baseFeeSol; // Standard 5000 lamports = 0.000005 SOL

  // Congestion multiplier on priority fee
  let congestionMultiplier = 1.0;
  if (congestionLevel === 'low') congestionMultiplier = 0.8;
  else if (congestionLevel === 'normal') congestionMultiplier = 1.0;
  else if (congestionLevel === 'high') congestionMultiplier = 2.4;
  else if (congestionLevel === 'congested') congestionMultiplier = 5.0;

  const priorityFeeSol = priorityConfig.additionalFeeSol * congestionMultiplier;
  const totalFeeSol = Math.round((baseFeeSol + priorityFeeSol) * 100000000) / 100000000;
  const totalFeeUsd = Math.round(totalFeeSol * solPriceUsd * 10000) / 10000;

  // Approximate confirmation time
  const confirmationTimeMs = Math.round(
    congestion.avgConfirmationMs / (priority === 'turbo' ? 1.6 : priority === 'fast' ? 1.25 : 1.0)
  );

  return {
    baseFeeSol,
    priorityFeeSol,
    totalFeeSol,
    totalFeeUsd,
    confirmationTimeMs,
    tpsEstimate: congestion.tps,
    congestionLabel: congestion.label,
    congestionDescription: congestion.description,
  };
}
