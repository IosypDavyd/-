// Pure cryptographic, address, and financial calculation utilities for Mysteryum Wallet

// Standard BIP-39 English wordlist sample for seed phrases
export const BIP39_WORDS: string[] = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
  'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
  'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
  'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless',
  'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
  'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss',
  'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread',
  'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze',
  'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb',
  'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy',
  'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call',
  'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas',
  'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry',
  'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category',
  'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century',
  'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase',
  'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child',
  'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle',
  'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk',
  'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close',
  'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut',
  'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort',
  'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control',
  'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost',
  'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle',
  'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek',
  'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial',
  'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup',
  'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad'
];

// Base58 alphabet (Bitcoin/Solana standard)
export const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Validates whether a string has a valid Solana public key Base58 format
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  for (let i = 0; i < trimmed.length; i++) {
    if (!BASE58_ALPHABET.includes(trimmed[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Generates a 12-word mnemonic phrase from a seed index or random values
 */
export function generateSeedPhrase(deterministicSeed?: number): string[] {
  const words: string[] = [];
  const listLen = BIP39_WORDS.length;
  for (let i = 0; i < 12; i++) {
    const idx = deterministicSeed !== undefined
      ? (deterministicSeed * 37 + i * 97 + (i * i * 13)) % listLen
      : Math.floor(Math.random() * listLen);
    words.push(BIP39_WORDS[Math.abs(idx) % listLen]);
  }
  return words;
}

/**
 * Encodes a byte array to Base58 string
 */
export function toBase58(bytes: Uint8Array): string {
  const digits: number[] = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let result = '';
  // Deal with leading zeros
  for (let k = 0; k < bytes.length && bytes[k] === 0; k++) {
    result += BASE58_ALPHABET[0];
  }
  for (let q = digits.length - 1; q >= 0; q--) {
    result += BASE58_ALPHABET[digits[q]];
  }
  return result;
}

/**
 * Derives a deterministic Solana Base58 public address from a seed phrase
 */
export function deriveSolanaAddressFromSeed(words: string[]): string {
  const joined = words.join(' ');
  const bytes = new Uint8Array(32);
  let hash = 0x811c9dc5;
  for (let i = 0; i < joined.length; i++) {
    hash ^= joined.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
    bytes[i % 32] = (bytes[i % 32] + (hash & 0xff)) % 256;
  }
  // Ensure non-zero bytes
  for (let j = 0; j < 32; j++) {
    bytes[j] = (bytes[j] ^ (j * 17 + 53)) % 256;
  }
  return toBase58(bytes);
}

/**
 * Shortens a Solana address for display, e.g. "7xKq...9Z1p"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Calculates liquidation price and PnL for perpetual contracts
 */
export function calculatePerpPnL(
  side: 'long' | 'short',
  entryPrice: number,
  currentPrice: number,
  sizeUsd: number,
  leverage: number
): { pnlUsd: number; pnlPercent: number; liquidationPrice: number } {
  if (entryPrice <= 0 || sizeUsd <= 0 || leverage <= 0) {
    return { pnlUsd: 0, pnlPercent: 0, liquidationPrice: 0 };
  }

  const priceDiff = side === 'long' ? currentPrice - entryPrice : entryPrice - currentPrice;
  const pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
  const collateralUsd = sizeUsd / leverage;
  const pnlUsd = (collateralUsd * pnlPercent) / 100;

  // Maintenance margin ~ 85% of collateral liquidation threshold
  const liqThreshold = 1 / leverage * 0.9;
  const liquidationPrice =
    side === 'long'
      ? entryPrice * (1 - liqThreshold)
      : entryPrice * (1 + liqThreshold);

  return {
    pnlUsd: Number(pnlUsd.toFixed(2)),
    pnlPercent: Number(pnlPercent.toFixed(2)),
    liquidationPrice: Math.max(0, Number(liquidationPrice.toFixed(2))),
  };
}

/**
 * Calculates swap output and estimated price impact
 */
export function calculateSwapOutput(
  inputAmount: number,
  fromPriceUsd: number,
  toPriceUsd: number,
  slippagePercent: number = 0.5
): {
  outputAmount: number;
  minimumReceived: number;
  feeSol: number;
  priceImpactPercent: number;
} {
  if (inputAmount <= 0 || fromPriceUsd <= 0 || toPriceUsd <= 0) {
    return { outputAmount: 0, minimumReceived: 0, feeSol: 0.000005, priceImpactPercent: 0 };
  }

  const rawOut = (inputAmount * fromPriceUsd) / toPriceUsd;
  // Dynamic liquidity curve impact estimation
  const impact = Math.min(2.5, (inputAmount * fromPriceUsd) / 50000);
  const adjustedOut = rawOut * (1 - impact / 100);
  const minRec = adjustedOut * (1 - slippagePercent / 100);

  return {
    outputAmount: Number(adjustedOut.toFixed(6)),
    minimumReceived: Number(minRec.toFixed(6)),
    feeSol: 0.000005,
    priceImpactPercent: Number(impact.toFixed(2)),
  };
}
