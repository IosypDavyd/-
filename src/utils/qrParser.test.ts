import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractSolanaAddressFromQr } from './qrParser.ts';

test('extractSolanaAddressFromQr extracts direct Base58 addresses correctly', () => {
  const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  assert.strictEqual(extractSolanaAddressFromQr(addr), addr);
  assert.strictEqual(extractSolanaAddressFromQr(`  ${addr}  `), addr);
});

test('extractSolanaAddressFromQr handles solana: URI standard scheme', () => {
  const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  assert.strictEqual(extractSolanaAddressFromQr(`solana:${addr}`), addr);
  assert.strictEqual(extractSolanaAddressFromQr(`solana:${addr}?amount=2.5&label=VaultPayment`), addr);
  assert.strictEqual(extractSolanaAddressFromQr(`SOLANA:${addr}`), addr);
});

test('extractSolanaAddressFromQr extracts address from embedded URL or text', () => {
  const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
  assert.strictEqual(extractSolanaAddressFromQr(`https://explorer.solana.com/address/${addr}`), addr);
  assert.strictEqual(extractSolanaAddressFromQr(`Send funds to ${addr} thank you`), addr);
});

test('extractSolanaAddressFromQr returns null for invalid non-solana inputs', () => {
  assert.strictEqual(extractSolanaAddressFromQr(''), null);
  assert.strictEqual(extractSolanaAddressFromQr('hello world random qr'), null);
  assert.strictEqual(extractSolanaAddressFromQr('0x1234567890abcdef1234567890abcdef12345678'), null);
});
