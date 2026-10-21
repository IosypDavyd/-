import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Coins,
  ShieldCheck,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import { AvatarArtwork } from './AvatarArtwork';
import { AvatarBackground } from './AvatarBackground';

interface DAppItem {
  id: string;
  name: string;
  category: 'DEX' | 'CEX' | 'DeFi' | 'Staking' | 'xStocks' | 'NFT' | 'Analytics';
  description: string;
  url: string;
  icon: string;
  badge?: string;
  featured?: boolean;
}

const EXTENDED_WEB3_PLATFORMS: DAppItem[] = [
  // Solana DEXs
  {
    id: 'jup',
    name: 'Jupiter Exchange',
    category: 'DEX',
    description: 'The key liquidity aggregator on Solana for swaps, limit orders, DCA, and perpetuals.',
    url: 'https://jup.ag',
    icon: '🪐',
    badge: '#1 Solana DEX',
    featured: true,
  },
  {
    id: 'raydium',
    name: 'Raydium Protocol',
    category: 'DEX',
    description: 'On-chain order book AMM powering high-speed swaps, concentrated liquidity, and yield pools.',
    url: 'https://raydium.io',
    icon: '☀️',
    badge: 'AMM Leader',
    featured: true,
  },
  {
    id: 'orca',
    name: 'Orca Whirlpools',
    category: 'DEX',
    description: 'High capital efficiency concentrated liquidity DEX with user-friendly swaps.',
    url: 'https://orca.so',
    icon: '🐋',
    badge: 'Concentrated LP',
  },
  {
    id: 'phoenix',
    name: 'Phoenix DEX',
    category: 'DEX',
    description: 'Non-custodial, fully on-chain limit order book built on Solana with instant settlements.',
    url: 'https://phoenix.trade',
    icon: '🔥',
    badge: 'On-Chain CLOB',
  },
  {
    id: 'meteora',
    name: 'Meteora Dynamic Vaults',
    category: 'DEX',
    description: 'Dynamic liquidity market maker pools with yield-bearing multi-token vaults.',
    url: 'https://meteora.ag',
    icon: '☄️',
  },

  // Centralized Exchanges (CEX)
  {
    id: 'binance',
    name: 'Binance',
    category: 'CEX',
    description: 'World leading cryptocurrency exchange with direct Solana (SOL & SPL) deposits & withdrawals.',
    url: 'https://binance.com',
    icon: '🟡',
    badge: 'Top Volume CEX',
    featured: true,
  },
  {
    id: 'bybit',
    name: 'Bybit',
    category: 'CEX',
    description: 'Premier crypto derivatives & spot trading platform with instant Solana mainnet transfers.',
    url: 'https://bybit.com',
    icon: '⚫',
    badge: 'CEX Perps',
  },
  {
    id: 'okx',
    name: 'OKX Exchange',
    category: 'CEX',
    description: 'Global crypto exchange and Web3 portal with multi-chain Solana wallet integration.',
    url: 'https://okx.com',
    icon: '⚪',
    badge: 'Global CEX',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    category: 'CEX',
    description: 'US licensed regulated cryptocurrency exchange supporting Solana assets.',
    url: 'https://coinbase.com',
    icon: '🔵',
    badge: 'Regulated CEX',
  },
  {
    id: 'kraken',
    name: 'Kraken',
    category: 'CEX',
    description: 'Veteran crypto exchange renowned for advanced fiat onramps and Solana staking.',
    url: 'https://kraken.com',
    icon: '🐙',
  },

  // DeFi & Lending
  {
    id: 'kamino',
    name: 'Kamino Finance',
    category: 'DeFi',
    description: 'Solana premier lending, borrowing, and automated liquidity management protocol.',
    url: 'https://kamino.finance',
    icon: '🏦',
    badge: '$2B+ TVL',
    featured: true,
  },
  {
    id: 'drift',
    name: 'Drift Protocol',
    category: 'DeFi',
    description: 'Decentralized perpetuals exchange offering cross-margined trading up to 50x.',
    url: 'https://drift.trade',
    icon: '🎯',
    badge: '50x Perps',
  },
  {
    id: 'marginfi',
    name: 'MarginFi',
    category: 'DeFi',
    description: 'Decentralized lending protocol with dynamic risk management on Solana.',
    url: 'https://marginfi.com',
    icon: '📈',
  },
  {
    id: 'save',
    name: 'Save (formerly Solend)',
    category: 'DeFi',
    description: 'Autonomous interest rate protocol for lending and borrowing Solana assets.',
    url: 'https://save.finance',
    icon: '🛡️',
  },

  // Tokenized Stocks (xStocks)
  {
    id: 'backed',
    name: 'Backed Finance',
    category: 'xStocks',
    description: 'Tokenized 1:1 backed securities on Solana (NVDA, TSLA, AAPL, bIB01 US Treasury).',
    url: 'https://backed.fi',
    icon: '🏛️',
    badge: 'RWA Regulated',
    featured: true,
  },
  {
    id: 'dinari',
    name: 'Dinari dShares',
    category: 'xStocks',
    description: 'Securities-backed tokens providing 24/7 exposure to US equities on decentralized rails.',
    url: 'https://dinari.com',
    icon: '📊',
    badge: 'Securities Token',
  },
  {
    id: 'ondo',
    name: 'Ondo Finance (USDY)',
    category: 'xStocks',
    description: 'Institutional-grade tokenized US Treasuries with daily yield payouts on Solana.',
    url: 'https://ondo.finance',
    icon: '💵',
    badge: 'US Treasuries',
  },

  // Liquid Staking
  {
    id: 'jito',
    name: 'Jito Network',
    category: 'Staking',
    description: 'Solana liquid staking with maximum extractable value (MEV) rewards (JitoSOL ~7.8% APY).',
    url: 'https://jito.network',
    icon: '⚡',
    badge: 'MEV Yield',
    featured: true,
  },
  {
    id: 'marinade',
    name: 'Marinade Finance',
    category: 'Staking',
    description: 'Decentralized liquid staking delegating across 100+ vetted Solana validators.',
    url: 'https://marinade.finance',
    icon: '🌊',
    badge: 'mSOL Pioneer',
  },
  {
    id: 'blazestake',
    name: 'BlazeStake',
    category: 'Staking',
    description: 'Non-custodial Solana stake pool providing bSOL with automatic compounding rewards.',
    url: 'https://stake.solblaze.org',
    icon: '🔥',
  },

  // NFT & Avatars
  {
    id: 'magiceden',
    name: 'Magic Eden',
    category: 'NFT',
    description: 'The premier community NFT marketplace and launchpad on Solana.',
    url: 'https://magiceden.io',
    icon: '🪄',
    badge: 'Top NFT Market',
  },
  {
    id: 'tensor',
    name: 'Tensor Trade',
    category: 'NFT',
    description: 'Pro-grade trading terminal for Solana NFTs with real-time AMM sweeps.',
    url: 'https://tensor.trade',
    icon: '⚡',
  },

  // Analytics & Explorers
  {
    id: 'dexscreener',
    name: 'DexScreener Solana',
    category: 'Analytics',
    description: 'Real-time Solana trading charts, liquidity metrics, and newly minted pairs.',
    url: 'https://dexscreener.com/solana',
    icon: '📈',
    badge: 'Live Charts',
  },
  {
    id: 'birdeye',
    name: 'Birdeye Solana',
    category: 'Analytics',
    description: 'Cryptocurrency trading data aggregator with deep Solana on-chain metrics.',
    url: 'https://birdeye.so',
    icon: '🦅',
  },
  {
    id: 'solscan',
    name: 'Solscan Explorer',
    category: 'Analytics',
    description: 'Official comprehensive Solana blockchain analytics and explorer.',
    url: 'https://solscan.io',
    icon: '🔍',
  },
  {
    id: 'defillama',
    name: 'DeFiLlama Solana',
    category: 'Analytics',
    description: 'Open and transparent DeFi analytics tracking total value locked (TVL) across Solana.',
    url: 'https://defillama.com/chain/Solana',
    icon: '🦙',
  },
];

interface ExploreViewProps {
  onOpenGallery?: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onOpenGallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'DEX',
    'CEX',
    'DeFi',
    'Staking',
    'xStocks',
    'NFT',
    'Analytics',
  ];

  const filteredPlatforms = EXTENDED_WEB3_PLATFORMS.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative mx-auto max-w-4xl space-y-6 pb-28 text-slate-100">
      {/* Ambient Avatar Background */}
      <AvatarBackground theme="neon-grail" opacity={0.06} position="top-right" />

      {/* Top Banner */}
      <div className="relative z-10 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-950/80 p-3 border border-cyan-500/30 text-cyan-400 shadow-md">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-white">
                Web-3 Ecosystem & Platforms
              </h2>
              <p className="text-xs text-slate-400">
                Direct access to premier Solana DEXes, CEX gateways, DeFi lending, and xStocks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
              {EXTENDED_WEB3_PLATFORMS.length} Verified Platforms
            </span>
          </div>
        </div>
      </div>

      {/* Featured Mysteryum 25¢ NFT Avatar Card */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0d1322] via-[#101b33] to-[#0a101d] p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
              <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span>OFFICIAL MINT GALLERY</span>
              <span className="text-emerald-400 font-mono">0.00136 SOL (25¢)</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">
              Mysteryum 25¢ NFT Monarch Avatars
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mint custom Metaplex avatars for <strong>25 cents ($0.25 USD)</strong> in SOL.
              Equip to your Solana account, link to your 8 virtual cards, and get zero-fee DEX routing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-3 overflow-hidden p-1">
              {(['cyber-king', 'neon-grail', 'golden-midas', 'shield-guardian'] as const).map((theme) => (
                <div key={theme} className="inline-block h-12 w-12 rounded-xl ring-2 ring-cyan-500/50 bg-black overflow-hidden shadow-lg">
                  <AvatarArtwork theme={theme} size="100%" showCrownGlow={false} />
                </div>
              ))}
            </div>

            {onOpenGallery && (
              <button
                onClick={onOpenGallery}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-90 px-4 py-2.5 text-xs font-black text-black transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Mint 25¢</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-10 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Solana DEXes, CEX exchanges (Binance, Bybit), DeFi, xStocks, or tools..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none shadow-lg"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'All Web-3' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map((app) => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-[#0f1422]/90 hover:border-cyan-500/40 hover:bg-[#131b2e] p-5 transition-all shadow-xl hover:shadow-cyan-950"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {app.name}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {app.category}
                    </span>
                  </div>
                </div>

                {app.badge && (
                  <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                    {app.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4 text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
              <span>Open Platform</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
