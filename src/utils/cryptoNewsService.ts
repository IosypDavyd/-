export type CryptoNewsCategory =
  | 'all'
  | 'solana'
  | 'defi'
  | 'macro'
  | 'regulation'
  | 'tokenized-stocks';

export type MarketImpactSentiment = 'bullish' | 'bearish' | 'neutral';

export interface CryptoNewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: CryptoNewsCategory;
  relatedTokens: string[];
  impactSentiment: MarketImpactSentiment;
  impactScore: number; // 1-100 scale of portfolio relevance
  publishedAgo: string;
  readTimeMinutes: number;
  featured?: boolean;
}

/**
 * High-quality curated real-time crypto headlines specifically mapped
 * to Solana ecosystem tokens (SOL, JitoSOL, JUP, RAY, BONK, USDC) and portfolio dynamics.
 */
export const MOCK_CRYPTO_NEWS: CryptoNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Solana Network Daily DEX Volume Flips Ethereum Mainnet Amid Jupiter & Raydium Surge',
    summary:
      'Solana decentralized exchange volume hit $3.4B in 24 hours driven by Jupiter ultra-low slippage routing and heightened meme coin & liquid staking liquidity, pushing native SOL above key resistance.',
    source: 'Solana Floor',
    url: 'https://solanafloor.com',
    category: 'solana',
    relatedTokens: ['SOL', 'JUP', 'RAY'],
    impactSentiment: 'bullish',
    impactScore: 94,
    publishedAgo: '18m ago',
    readTimeMinutes: 2,
    featured: true,
  },
  {
    id: 'news-2',
    title: 'JitoSOL Liquid Staking APY Climbs to 7.8% on Increased MEV Tip Rewards',
    summary:
      'Validator MEV tips distributed to JitoSOL liquid stakers reached month-high distributions as arbitrage activity accelerated on high-volatility trading pairs.',
    source: 'Blockworks',
    url: 'https://blockworks.co',
    category: 'defi',
    relatedTokens: ['JitoSOL', 'SOL'],
    impactSentiment: 'bullish',
    impactScore: 88,
    publishedAgo: '42m ago',
    readTimeMinutes: 3,
  },
  {
    id: 'news-3',
    title: 'Tokenized US Stocks (xStocks) on Solana Cross $250M Total Value Locked in 24/7 Trading',
    summary:
      'Synthetic equities representing NVDA, TSLA, and AAPL backed 1:1 on Solana USDC smart vaults see double-digit volume expansion as traditional markets remain closed overnight.',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
    category: 'tokenized-stocks',
    relatedTokens: ['USDC', 'SOL'],
    impactSentiment: 'bullish',
    impactScore: 82,
    publishedAgo: '1h ago',
    readTimeMinutes: 3,
  },
  {
    id: 'news-4',
    title: 'US CPI Data Meets Expectations: Tech Equities and Crypto Volatility Tightens',
    summary:
      'Federal Reserve macro indicators suggest stabilizing interest rate expectations, triggering portfolio capital rotations into high-throughput layer 1 assets.',
    source: 'Bloomberg Crypto',
    url: 'https://bloomberg.com',
    category: 'macro',
    relatedTokens: ['SOL', 'USDC'],
    impactSentiment: 'neutral',
    impactScore: 76,
    publishedAgo: '2h ago',
    readTimeMinutes: 4,
  },
  {
    id: 'news-5',
    title: 'Jupiter Aggregator Unveils Dynamic Perps Liquidity Vault with Zero Price Impact',
    summary:
      'The upgrade introduces deeper perpetual contract routing for SOL-PERP and top SPL assets, reducing liquidations and lowering borrowing fees for long and short leverage traders.',
    source: 'Decrypt',
    url: 'https://decrypt.co',
    category: 'defi',
    relatedTokens: ['JUP', 'SOL'],
    impactSentiment: 'bullish',
    impactScore: 85,
    publishedAgo: '3h ago',
    readTimeMinutes: 2,
  },
  {
    id: 'news-6',
    title: 'SEC Finalizes Clarified Non-Custodial Web3 Wallet Regulatory Guidance',
    summary:
      'Regulators explicitly confirm that purely self-custodial software wallets and hardware key managers are exempt from broker-dealer custody obligations, eliminating key legal overhangs.',
    source: 'The Block',
    url: 'https://theblock.co',
    category: 'regulation',
    relatedTokens: ['SOL', 'USDC', 'USDT'],
    impactSentiment: 'bullish',
    impactScore: 91,
    publishedAgo: '4h ago',
    readTimeMinutes: 3,
  },
  {
    id: 'news-7',
    title: 'BONK DAO Proposes $10M Community Treasury Burn to Accelerate Ecosystem Deflation',
    summary:
      'A community vote initiates an aggressive token burn strategy, increasing utility on DeFi launchpads and reducing circulating token supplies across Raydium liquidity pairs.',
    source: 'CoinTelegraph',
    url: 'https://cointelegraph.com',
    category: 'solana',
    relatedTokens: ['BONK', 'RAY'],
    impactSentiment: 'bullish',
    impactScore: 74,
    publishedAgo: '5h ago',
    readTimeMinutes: 2,
  },
  {
    id: 'news-8',
    title: 'Solana Mainnet Firedancer Validator Client Testnet Achieves 1,000,000 TPS Benchmark',
    summary:
      'Jump Crypto second-generation Firedancer client demonstrably handles gigabit throughput with near-zero latency in stress tests, paving the way for institutional enterprise adoption.',
    source: 'Bankless',
    url: 'https://bankless.com',
    category: 'solana',
    relatedTokens: ['SOL'],
    impactSentiment: 'bullish',
    impactScore: 96,
    publishedAgo: '7h ago',
    readTimeMinutes: 4,
  },
];

/**
 * Filter news items by selected category, token search, or sentiment
 */
export function filterCryptoNews(
  articles: CryptoNewsArticle[],
  filter: {
    category?: CryptoNewsCategory;
    tokenSymbol?: string;
    sentiment?: MarketImpactSentiment;
    searchQuery?: string;
  }
): CryptoNewsArticle[] {
  return articles.filter((article) => {
    // Category check
    if (filter.category && filter.category !== 'all' && article.category !== filter.category) {
      return false;
    }

    // Token symbol check
    if (
      filter.tokenSymbol &&
      filter.tokenSymbol !== 'ALL' &&
      !article.relatedTokens.includes(filter.tokenSymbol)
    ) {
      return false;
    }

    // Sentiment check
    if (filter.sentiment && article.impactSentiment !== filter.sentiment) {
      return false;
    }

    // Search query check
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchSummary = article.summary.toLowerCase().includes(q);
      const matchSource = article.source.toLowerCase().includes(q);
      const matchTokens = article.relatedTokens.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchSource && !matchTokens) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Mock news aggregator service that simulates network latency and live updates
 */
export async function fetchCryptoNewsAggregator(
  category: CryptoNewsCategory = 'all',
  tokenSymbol?: string
): Promise<CryptoNewsArticle[]> {
  // Simulate realistic network delay (150-300ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const filtered = filterCryptoNews(MOCK_CRYPTO_NEWS, {
    category,
    tokenSymbol,
  });

  return filtered;
}
