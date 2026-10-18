import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidSolanaAddress,
  generateSeedPhrase,
  deriveSolanaAddressFromSeed,
  shortenAddress,
  calculatePerpPnL,
  calculateSwapOutput,
} from './crypto.ts';

test('Solana address validation validates proper base58 addresses', () => {
  const validAddr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  assert.equal(isValidSolanaAddress(validAddr), true);

  // Too short
  assert.equal(isValidSolanaAddress('abc123'), false);
  // Invalid chars (0, O, I, l are not in Base58)
  assert.equal(isValidSolanaAddress('0x1234567890123456789012345678901234567890'), false);
  // Empty
  assert.equal(isValidSolanaAddress(''), false);
});

test('generateSeedPhrase generates 12 valid words', () => {
  const phrase = generateSeedPhrase();
  assert.equal(phrase.length, 12);
  assert.ok(phrase.every((word) => typeof word === 'string' && word.length > 2));

  // Deterministic seed returns reproducible words
  const det1 = generateSeedPhrase(42);
  const det2 = generateSeedPhrase(42);
  assert.deepEqual(det1, det2);
});

test('deriveSolanaAddressFromSeed produces a valid Base58 address', () => {
  const phrase = generateSeedPhrase(101);
  const address = deriveSolanaAddressFromSeed(phrase);
  assert.ok(address.length >= 32 && address.length <= 44);
  assert.equal(isValidSolanaAddress(address), true);
});

test('shortenAddress properly formats truncated address string', () => {
  const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  const shortened = shortenAddress(addr, 4);
  assert.equal(shortened, '7xKX...gAsU');
});

test('calculatePerpPnL computes long and short returns accurately', () => {
  // Long: entry $100, current $110, size $1000, 10x leverage
  // Price up 10% -> 10% * 10x = 100% PnL on $100 collateral = +$100
  const longRes = calculatePerpPnL('long', 100, 110, 1000, 10);
  assert.equal(longRes.pnlPercent, 100);
  assert.equal(longRes.pnlUsd, 100);
  assert.equal(longRes.liquidationPrice, 91); // 100 * (1 - 0.09)

  // Short: entry $100, current $95, size $1000, 5x leverage
  // Price down 5% -> 5% * 5x = +25% PnL
  const shortRes = calculatePerpPnL('short', 100, 95, 1000, 5);
  assert.equal(shortRes.pnlPercent, 25);
  assert.equal(shortRes.pnlUsd, 50); // $200 collateral * 25% = $50
});

test('calculateSwapOutput calculates correct exchange output and fees', () => {
  // Swapping 1 SOL ($180) to USDC ($1)
  const res = calculateSwapOutput(1, 180, 1, 0.5);
  assert.ok(res.outputAmount > 175 && res.outputAmount <= 180);
  assert.ok(res.minimumReceived < res.outputAmount);
  assert.equal(res.feeSol, 0.000005);
});
