import type { PriceAlert, TriggeredPriceAlert } from '../types/wallet.ts';

/**
 * Calculates percentage deviation between current price and base reference price
 */
export function calculatePriceDeviation(currentPrice: number, basePrice: number): number {
  if (basePrice <= 0 || currentPrice <= 0) return 0;
  const deviation = ((currentPrice - basePrice) / basePrice) * 100;
  return Number(deviation.toFixed(2));
}

/**
 * Checks whether an active PriceAlert criteria is met by current token price
 */
export function shouldTriggerAlert(
  alert: PriceAlert,
  currentPrice: number
): { shouldTrigger: boolean; deviationPercent: number; direction: 'up' | 'down' } {
  if (!alert.enabled || alert.basePriceUsd <= 0 || currentPrice <= 0) {
    return { shouldTrigger: false, deviationPercent: 0, direction: 'up' };
  }

  const deviation = calculatePriceDeviation(currentPrice, alert.basePriceUsd);
  const direction: 'up' | 'down' = deviation >= 0 ? 'up' : 'down';
  const absDeviation = Math.abs(deviation);

  if (absDeviation < alert.targetDeviationPercent) {
    return { shouldTrigger: false, deviationPercent: deviation, direction };
  }

  if (alert.direction === 'up' && deviation < 0) {
    return { shouldTrigger: false, deviationPercent: deviation, direction };
  }

  if (alert.direction === 'down' && deviation > 0) {
    return { shouldTrigger: false, deviationPercent: deviation, direction };
  }

  return {
    shouldTrigger: true,
    deviationPercent: deviation,
    direction,
  };
}

/**
 * Evaluates an array of alerts against updated token prices and returns triggered alerts
 */
export function evaluatePriceAlerts(
  alerts: PriceAlert[],
  tokenPrices: Record<string, number>
): TriggeredPriceAlert[] {
  const triggered: TriggeredPriceAlert[] = [];

  for (const alert of alerts) {
    const currentPrice = tokenPrices[alert.tokenSymbol];
    if (currentPrice === undefined) continue;

    const evalResult = shouldTriggerAlert(alert, currentPrice);
    if (evalResult.shouldTrigger) {
      triggered.push({
        id: `triggered-${alert.id}-${Date.now()}`,
        alertId: alert.id,
        tokenSymbol: alert.tokenSymbol,
        basePriceUsd: alert.basePriceUsd,
        currentPriceUsd: currentPrice,
        deviationPercent: evalResult.deviationPercent,
        direction: evalResult.direction,
        timestamp: Date.now(),
      });
    }
  }

  return triggered;
}
