export type NetworkId = 'mainnet-beta' | 'devnet' | 'testnet';

export type LanguageCode =
  | 'en'
  | 'uk'
  | 'ru'
  | 'es'
  | 'de'
  | 'fr'
  | 'it'
  | 'pt'
  | 'pl'
  | 'tr'
  | 'ar'
  | 'hi'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'id';

export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  seedPhrase: string[];
  privateKeyHex: string;
  createdAt: number;
}

export interface TokenAsset {
  symbol: string;
  name: string;
  balance: number;
  usdPrice: number;
  change24h: number;
  decimals: number;
  mintAddress: string;
  icon: string;
  isVerified: boolean;
  category: 'native' | 'spl' | 'custom';
}

export interface XStockAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  underlying: string;
  icon: string;
  category: string;
}

export interface PerpMarket {
  symbol: string;
  name: string;
  markPrice: number;
  change24h: number;
  fundingRate: number;
  openInterestUsd: string;
  maxLeverage: number;
}

export interface PerpPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  sizeUsd: number;
  collateralUsd: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  liquidationPrice: number;
  pnlUsd: number;
  pnlPercent: number;
  timestamp: number;
}

export interface StakingOption {
  id: string;
  name: string;
  token: string;
  apy: number;
  type: 'liquid' | 'native';
  provider: string;
  stakedAmount: number;
  description: string;
}

export interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPriceSol: number;
  mintAddress: string;
  attributes: { trait_type: string; value: string }[];
}

export interface MysteryumCard {
  id: number;
  title: string;
  series: string;
  cardNumber: string;
  holder: string;
  tier: 'Diamond' | 'Obsidian' | 'Cyber' | 'Titanium';
  color: string;
  balanceUsd: number;
  expiry: string;
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  symbol: string;
  amount: number;
  amountUsd: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  signature: string;
  feeSol: number;
}

export type PriceAlertDirection = 'up' | 'down' | 'any';

export interface PriceAlert {
  id: string;
  tokenSymbol: string;
  basePriceUsd: number;
  targetDeviationPercent: number; // e.g. 5 for 5%
  direction: PriceAlertDirection;
  enabled: boolean;
  createdAt: number;
  lastTriggeredAt?: number;
}

export interface TriggeredPriceAlert {
  id: string;
  alertId: string;
  tokenSymbol: string;
  basePriceUsd: number;
  currentPriceUsd: number;
  deviationPercent: number;
  direction: 'up' | 'down';
  timestamp: number;
}
