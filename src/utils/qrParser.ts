import { isValidSolanaAddress } from './crypto.ts';

/**
 * Extracts a clean Solana address from a raw QR code string.
 * Supports:
 * - Direct Base58 address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
 * - Standard Solana URI: 'solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
 * - Solana URI with parameters: 'solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=1.5&label=Vault'
 * - Web URLs containing addresses
 */
export function extractSolanaAddressFromQr(rawText: string): string | null {
  if (!rawText || typeof rawText !== 'string') return null;

  const trimmed = rawText.trim();

  // 1. Direct address check
  if (isValidSolanaAddress(trimmed)) {
    return trimmed;
  }

  // 2. Solana URI scheme (solana:<address>[?query])
  const solanaUriMatch = trimmed.match(/^solana:([1-9A-HJ-NP-za-km-z]{32,44})/i);
  if (solanaUriMatch && isValidSolanaAddress(solanaUriMatch[1])) {
    return solanaUriMatch[1];
  }

  // 3. Fallback regex to search for any Base58 32-44 char string within the QR content
  const matches = trimmed.match(/[1-9A-HJ-NP-za-km-z]{32,44}/g);
  if (matches) {
    for (const candidate of matches) {
      if (isValidSolanaAddress(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}
