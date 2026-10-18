import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface DAppItem {
  id: string;
  name: string;
  category: 'DeFi' | 'Staking' | 'NFT' | 'Perps' | 'Analytics';
  description: string;
  url: string;
  icon: string;
  featured?: boolean;
}

const DAPPS_DATA: DAppItem[] = [
  {
    id: 'jup',
    name: 'Jupiter Exchange',
    category: 'DeFi',
    description: 'The key liquidity aggregator on Solana for swaps, limit orders, and DCA.',
    url: 'https://jup.ag',
    icon: '🪐',
    featured: true,
  },
  {
    id: 'raydium',
    name: 'Raydium Protocol',
    category: 'DeFi',
    description: 'On-chain order book AMM powering high-speed swaps and yield farms.',
    url: 'https://raydium.io',
    icon: '☀️',
    featured: true,
  },
  {
    id: 'jito',
    name: 'Jito Network',
    category: 'Staking',
    description: 'Solana liquid staking with maximum extractable value (MEV) rewards.',
    url: 'https://jito.network',
    icon: '⚡',
    featured: true,
  },
  {
    id: 'marinade',
    name: 'Marinade Finance',
    category: 'Staking',
    description: 'Decentralized liquid staking protocol delegating across 100+ validators.',
    url: 'https://marinade.finance',
    icon: '🌊',
  },
  {
    id: 'drift',
    name: 'Drift Protocol',
    category: 'Perps',
    description: 'Decentralized perpetuals exchange offering cross-margined trading up to 50x.',
    url: 'https://drift.trade',
    icon: '🎯',
    featured: true,
  },
  {
    id: 'magiceden',
    name: 'Magic Eden',
    category: 'NFT',
    description: 'The premier community NFT marketplace and launchpad on Solana.',
    url: 'https://magiceden.io',
    icon: '🪄',
  },
  {
    id: 'tensor',
    name: 'Tensor Trade',
    category: 'NFT',
    description: 'Pro-grade trading terminal for Solana NFTs with real-time AMM sweeps.',
    url: 'https://tensor.trade',
    icon: '📊',
  },
  {
    id: 'orca',
    name: 'Orca Whirlpools',
    category: 'DeFi',
    description: 'User-friendly DEX and concentrated liquidity market maker.',
    url: 'https://orca.so',
    icon: '🐋',
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
    id: 'dexscreener',
    name: 'DexScreener Solana',
    category: 'Analytics',
    description: 'Real-time Solana trading charts, liquidity metrics, and newly minted pairs.',
    url: 'https://dexscreener.com/solana',
    icon: '📈',
  },
];

export const ExploreView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'DeFi', 'Staking', 'Perps', 'NFT', 'Analytics'];

  const filteredDApps = DAPPS_DATA.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-cyan-950 p-2 border border-cyan-500/30 text-cyan-400">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Solana Ecosystem</h2>
            <p className="text-xs text-slate-400">
              Verified Web3 decentralized applications & tools
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Solana dApps, protocols, and tools..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* dApps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredDApps.map((dapp) => (
          <a
            key={dapp.id}
            href={dapp.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0f1420]/80 p-4 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{dapp.icon}</span>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {dapp.name}
                    </h3>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                      {dapp.category}
                    </span>
                  </div>
                </div>

                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                {dapp.description}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-400">
              <span>Open in Solana Web3</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
