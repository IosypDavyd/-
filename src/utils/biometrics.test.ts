import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifySecurityPin,
  maskBalance,
  validateBiometricScan,
  DEFAULT_SECURITY_PIN,
} from './biometrics.ts';

test('verifySecurityPin validates default and custom PINs correctly', () => {
  assert.equal(verifySecurityPin('4190'), true);
  assert.equal(verifySecurityPin('4190', DEFAULT_SECURITY_PIN), true);
  assert.equal(verifySecurityPin('1234', '1234'), true);

  // Incorrect PINs
  assert.equal(verifySecurityPin('0000'), false);
  assert.equal(verifySecurityPin('9999'), false);
  assert.equal(verifySecurityPin(''), false);
});

test('maskBalance properly hides balances when locked', () => {
  assert.equal(maskBalance('$2,565.92', true), '••••••••');
  assert.equal(maskBalance('$2,565.92', false), '$2,565.92');
  assert.equal(maskBalance('4.85 SOL', true), '••••••••');
  assert.equal(maskBalance('4.85 SOL', false), '4.85 SOL');
});

test('validateBiometricScan properly checks score threshold', () => {
  const pass = validateBiometricScan(95, 70);
  assert.equal(pass.success, true);
  assert.equal(pass.confidence, 95);
  assert.ok(pass.message.includes('verified'));

  const fail = validateBiometricScan(45, 70);
  assert.equal(fail.success, false);
  assert.equal(fail.confidence, 45);
  assert.ok(fail.message.includes('mismatch'));
});
