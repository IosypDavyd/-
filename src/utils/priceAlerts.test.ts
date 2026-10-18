import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePriceDeviation,
  shouldTriggerAlert,
  evaluatePriceAlerts,
} from './priceAlerts.ts';
import type { PriceAlert } from '../types/wallet.ts';

test('calculatePriceDeviation computes positive and negative percentage changes', () => {
  assert.equal(calculatePriceDeviation(105, 100), 5);
  assert.equal(calculatePriceDeviation(92, 100), -8);
  assert.equal(calculatePriceDeviation(184.2, 184.2), 0);
  assert.equal(calculatePriceDeviation(0, 100), 0);
  assert.equal(calculatePriceDeviation(100, 0), 0);
});

test('shouldTriggerAlert handles direction and threshold conditions properly', () => {
  const alertUp: PriceAlert = {
    id: 'a1',
    tokenSymbol: 'SOL',
    basePriceUsd: 100,
    targetDeviationPercent: 5,
    direction: 'up',
    enabled: true,
    createdAt: Date.now(),
  };

  // Up 5.5% -> should trigger
  const res1 = shouldTriggerAlert(alertUp, 105.5);
  assert.equal(res1.shouldTrigger, true);
  assert.equal(res1.deviationPercent, 5.5);
  assert.equal(res1.direction, 'up');

  // Up only 3% -> should not trigger
  const res2 = shouldTriggerAlert(alertUp, 103);
  assert.equal(res2.shouldTrigger, false);

  // Down 10% on an 'up' alert -> should not trigger
  const res3 = shouldTriggerAlert(alertUp, 90);
  assert.equal(res3.shouldTrigger, false);

  // Disabled alert -> should not trigger
  const alertDisabled = { ...alertUp, enabled: false };
  assert.equal(shouldTriggerAlert(alertDisabled, 120).shouldTrigger, false);

  // Direction 'any' -> triggers in either direction
  const alertAny: PriceAlert = { ...alertUp, direction: 'any' };
  assert.equal(shouldTriggerAlert(alertAny, 106).shouldTrigger, true);
  assert.equal(shouldTriggerAlert(alertAny, 93).shouldTrigger, true);
});

test('evaluatePriceAlerts returns triggered alerts for matching price changes', () => {
  const alerts: PriceAlert[] = [
    {
      id: 'alert-sol',
      tokenSymbol: 'SOL',
      basePriceUsd: 180,
      targetDeviationPercent: 5,
      direction: 'up',
      enabled: true,
      createdAt: Date.now(),
    },
    {
      id: 'alert-bonk',
      tokenSymbol: 'BONK',
      basePriceUsd: 0.00002,
      targetDeviationPercent: 10,
      direction: 'down',
      enabled: true,
      createdAt: Date.now(),
    },
    {
      id: 'alert-jup',
      tokenSymbol: 'JUP',
      basePriceUsd: 1.0,
      targetDeviationPercent: 15,
      direction: 'any',
      enabled: false, // disabled
      createdAt: Date.now(),
    },
  ];

  const prices = {
    SOL: 195, // +8.33% -> triggers
    BONK: 0.000017, // -15% -> triggers
    JUP: 1.3, // +30% but disabled -> does not trigger
  };

  const triggered = evaluatePriceAlerts(alerts, prices);
  assert.equal(triggered.length, 2);
  assert.equal(triggered[0].tokenSymbol, 'SOL');
  assert.equal(triggered[0].direction, 'up');
  assert.equal(triggered[1].tokenSymbol, 'BONK');
  assert.equal(triggered[1].direction, 'down');
});
