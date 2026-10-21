export type ModerationReason =
  | 'phishing'
  | 'spam'
  | 'security_violation'
  | 'offensive'
  | 'illegal'
  | 'seed_leak';

export interface ModerationReport {
  id: string;
  messageId: string;
  reportedSenderName: string;
  reportedSenderAddress: string;
  reportedMessageText: string;
  reporterAddress: string;
  reason: ModerationReason;
  details?: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

export interface HarmfulCheckResult {
  isHarmful: boolean;
  reason?: string;
  flaggedPatterns?: string[];
  sanitizedText?: string;
}

// Patterns that compromise wallet safety: seed phrase leaks, private key leaks, scam drainers
const HARMFUL_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /(?:private[_\s-]?key|secret[_\s-]?key|seed[_\s-]?phrase|mnemonic|12[_\s-]?words|24[_\s-]?words)\s*[:=]\s*[a-zA-Z0-9\s]{20,}/i,
    reason: 'Витік приватного ключа або сід-фрази (Seed/Private Key Leak)',
  },
  {
    pattern: /(?:phishing|claim[-_.]?(?:sol|airdrop|bonus)|free[-_.]?solana|wallet[-_.]?drainer|bonus[-_.]?token)\.(?:xyz|top|pw|cc|tk|ml|ga|cf|ru|click)/i,
    reason: 'Небезпечне фішингове або dreiner-посилання (Malicious Drainer Link)',
  },
  {
    pattern: /(?:give\s+me\s+your\s+seed|send\s+your\s+private\s+key|надішли\s+сід|скинь\s+ключ|дай\s+пароль)/i,
    reason: 'Спроба шахрайства та соціальної інженерії (Phishing Social Engineering)',
  },
  {
    pattern: /(?:win\s+100\s+sol|airdrop\s+free\s+50\s+sol|claim\s+1000\s+usdt\s+now|дублювання\s+солани)/i,
    reason: 'Спам / Фінансове шахрайство (Financial Scam / Spam)',
  },
];

/**
 * Validates text against known harmful wallet violations, scam patterns, and seed leaks.
 */
export function filterHarmfulContent(text: string): HarmfulCheckResult {
  if (!text || typeof text !== 'string') {
    return { isHarmful: false, sanitizedText: text || '' };
  }

  const flaggedPatterns: string[] = [];
  let foundReason: string | undefined;

  for (const item of HARMFUL_PATTERNS) {
    if (item.pattern.test(text)) {
      flaggedPatterns.push(item.pattern.toString());
      if (!foundReason) {
        foundReason = item.reason;
      }
    }
  }

  if (foundReason) {
    return {
      isHarmful: true,
      reason: foundReason,
      flaggedPatterns,
      sanitizedText: '[Вміст приховано системою безпеки Mysteryum Shield]',
    };
  }

  return {
    isHarmful: false,
    sanitizedText: text,
  };
}

/**
 * Checks if a specific address is blocked.
 */
export function isUserBlocked(address: string, blockedAddresses: string[]): boolean {
  if (!address || !Array.isArray(blockedAddresses)) return false;
  const target = address.trim().toLowerCase();
  return blockedAddresses.some((b) => b.trim().toLowerCase() === target);
}

/**
 * Filters visible messages excluding blocked users.
 */
export function filterVisibleMessages<T extends { senderAddress: string }>(
  messages: T[],
  blockedAddresses: string[]
): T[] {
  if (!Array.isArray(messages)) return [];
  if (!blockedAddresses || blockedAddresses.length === 0) return messages;

  const blockedSet = new Set(blockedAddresses.map((a) => a.trim().toLowerCase()));
  return messages.filter((m) => !blockedSet.has(m.senderAddress.trim().toLowerCase()));
}

/**
 * Creates a structured moderation report for the wallet moderation desk.
 */
export function createModerationReport(params: {
  messageId: string;
  reportedSenderName: string;
  reportedSenderAddress: string;
  reportedMessageText: string;
  reporterAddress: string;
  reason: ModerationReason;
  details?: string;
}): ModerationReport {
  return {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    messageId: params.messageId,
    reportedSenderName: params.reportedSenderName,
    reportedSenderAddress: params.reportedSenderAddress,
    reportedMessageText: params.reportedMessageText,
    reporterAddress: params.reporterAddress,
    reason: params.reason,
    details: params.details,
    timestamp: Date.now(),
    status: 'pending',
  };
}
