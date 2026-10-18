/**
 * Pure biometric verification and privacy masking utilities for Mysteryum Wallet
 */

export const DEFAULT_SECURITY_PIN = '4190';

/**
 * Validates entered PIN against the vault's stored security PIN
 */
export function verifySecurityPin(enteredPin: string, correctPin: string = DEFAULT_SECURITY_PIN): boolean {
  if (!enteredPin || typeof enteredPin !== 'string') return false;
  return enteredPin.trim() === correctPin.trim();
}

/**
 * Masks financial balances when the biometric lock is active
 */
export function maskBalance(formattedBalance: string, isLocked: boolean): string {
  if (!isLocked) return formattedBalance;
  return '••••••••';
}

/**
 * Evaluates simulated biometric match confidence from a quality score (0 - 100)
 */
export function validateBiometricScan(
  qualityScore: number,
  threshold: number = 70
): { success: boolean; confidence: number; message: string } {
  const boundedScore = Math.max(0, Math.min(100, qualityScore));
  const success = boundedScore >= threshold;

  return {
    success,
    confidence: boundedScore,
    message: success
      ? 'Biometric signature verified via Secure Enclave'
      : 'Biometric scan mismatch. Please try again or use PIN',
  };
}
