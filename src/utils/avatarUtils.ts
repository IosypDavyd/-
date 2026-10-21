import type { AvatarNFTItem, AvatarTheme, MysteryumCard } from '../types/wallet.ts';

export const AVATAR_MINT_PRICE_USD = 0.25; // 25 cents

/**
 * Calculates token amount equivalents for the fixed 25¢ mint price
 */
export function calculateMintPriceInTokens(
  solPriceUsd: number = 184.2,
  kpgmPriceUsd: number = 0.00000636
) {
  const usdcAmount = AVATAR_MINT_PRICE_USD; // 0.25 USDC
  const solAmount = Number((AVATAR_MINT_PRICE_USD / (solPriceUsd || 184.2)).toFixed(6)); // ~0.001357 SOL
  const kpgmAmount = Math.round(AVATAR_MINT_PRICE_USD / (kpgmPriceUsd || 0.00000636)); // ~39,308 KPGM or 25 tokens in scaled pool

  return {
    usd: AVATAR_MINT_PRICE_USD,
    usdc: usdcAmount,
    sol: solAmount,
    kpgm: 25, // Fixed 25 KPGM native perk
  };
}

/**
 * Assigns an avatar to a specific Mysteryum virtual card
 */
export function assignAvatarToCard(
  cards: MysteryumCard[],
  cardId: number,
  avatar: { theme: AvatarTheme; name: string }
): MysteryumCard[] {
  return cards.map((card) => {
    if (card.id === cardId) {
      return {
        ...card,
        avatarTheme: avatar.theme,
        avatarName: avatar.name,
      };
    }
    return card;
  });
}

/**
 * Finds the avatar currently assigned to a card
 */
export function getAvatarForCard(
  card: MysteryumCard,
  avatars: AvatarNFTItem[]
): AvatarNFTItem | undefined {
  if (card.avatarTheme) {
    return avatars.find((a) => a.theme === card.avatarTheme);
  }
  return undefined;
}

/**
 * Filter avatars by collection category
 */
export function filterAvatarsByCategory(
  avatars: AvatarNFTItem[],
  category: 'all' | 'kings' | 'guardians' | 'elemental' | 'aces'
): AvatarNFTItem[] {
  if (category === 'all') return avatars;
  if (category === 'kings') {
    return avatars.filter((a) => a.theme === 'cyber-king' || a.theme === 'neon-grail');
  }
  if (category === 'guardians') {
    return avatars.filter((a) => a.theme === 'shield-guardian' || a.theme === 'protocol-guardian');
  }
  if (category === 'elemental') {
    return avatars.filter((a) => a.theme === 'golden-midas' || a.theme === 'frost-emperor');
  }
  if (category === 'aces') {
    return avatars.filter((a) => a.theme === 'diamond-ace' || a.theme === 'shadow-spade');
  }
  return avatars;
}
