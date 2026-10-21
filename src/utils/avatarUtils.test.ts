import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AVATAR_MINT_PRICE_USD,
  calculateMintPriceInTokens,
  assignAvatarToCard,
  filterAvatarsByCategory,
} from './avatarUtils.ts';
import type { MysteryumCard, AvatarNFTItem } from '../types/wallet.ts';

test('AVATAR_MINT_PRICE_USD is exactly 0.25 (25 cents)', () => {
  assert.equal(AVATAR_MINT_PRICE_USD, 0.25);
});

test('calculateMintPriceInTokens calculates proper 25 cent token amounts', () => {
  const result = calculateMintPriceInTokens(200, 0.00001);
  assert.equal(result.usd, 0.25);
  assert.equal(result.usdc, 0.25);
  assert.equal(result.sol, 0.00125);
  assert.equal(result.kpgm, 25);
});

test('assignAvatarToCard sets avatar theme and name on targeted card', () => {
  const mockCards: MysteryumCard[] = [
    {
      id: 1,
      title: 'Card 1',
      series: 'Series 1/8',
      cardNumber: '•••• 1111',
      holder: 'Holder 1',
      tier: 'Diamond',
      color: 'bg-black',
      balanceUsd: 100,
      expiry: '12/28',
      avatarTheme: 'cyber-king',
    },
    {
      id: 2,
      title: 'Card 2',
      series: 'Series 2/8',
      cardNumber: '•••• 2222',
      holder: 'Holder 2',
      tier: 'Obsidian',
      color: 'bg-slate-900',
      balanceUsd: 200,
      expiry: '12/29',
      avatarTheme: 'neon-grail',
    },
  ];

  const updated = assignAvatarToCard(mockCards, 2, {
    theme: 'golden-midas',
    name: 'Golden Midas Sovereign',
  });

  assert.equal(updated[1].avatarTheme, 'golden-midas');
  assert.equal(updated[1].avatarName, 'Golden Midas Sovereign');
  assert.equal(updated[0].avatarTheme, 'cyber-king'); // unaffected
});

test('filterAvatarsByCategory accurately filters themes', () => {
  const mockAvatars: AvatarNFTItem[] = [
    {
      id: '1',
      name: 'Cyber King',
      theme: 'cyber-king',
      tier: 'Mythic',
      title: 'King',
      description: '',
      priceUsd: 0.25,
      priceSol: 0.00135,
      priceUsdc: 0.25,
      priceKpgm: 25,
      mintAddress: 'abc',
      isMinted: true,
      isEquipped: true,
      traits: { crown: '', eyes: '', armor: '', rarity: '', powerLevel: 90 },
    },
    {
      id: '2',
      name: 'Frost Emperor',
      theme: 'frost-emperor',
      tier: 'Rare',
      title: 'Emperor',
      description: '',
      priceUsd: 0.25,
      priceSol: 0.00135,
      priceUsdc: 0.25,
      priceKpgm: 25,
      mintAddress: 'def',
      isMinted: false,
      isEquipped: false,
      traits: { crown: '', eyes: '', armor: '', rarity: '', powerLevel: 80 },
    },
  ];

  const kings = filterAvatarsByCategory(mockAvatars, 'kings');
  assert.equal(kings.length, 1);
  assert.equal(kings[0].theme, 'cyber-king');

  const elemental = filterAvatarsByCategory(mockAvatars, 'elemental');
  assert.equal(elemental.length, 1);
  assert.equal(elemental[0].theme, 'frost-emperor');

  const aces = filterAvatarsByCategory(mockAvatars, 'aces');
  assert.equal(aces.length, 0);
});
