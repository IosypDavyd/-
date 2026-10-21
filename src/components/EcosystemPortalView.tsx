import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Shield,
  ShieldCheck,
  Cpu,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Coins,
  CheckCircle2,
  Lock,
  Download,
  Terminal,
  Zap,
  Flame,
  Award,
  CreditCard,
  MessageSquare,
  Bot,
  Users,
  BarChart3,
  Search,
} from 'lucide-react';
import { LanguageCode, AvatarTheme } from '../types/wallet';
import { AvatarArtwork } from './AvatarArtwork';
import { AvatarBackground } from './AvatarBackground';

interface EcosystemPortalViewProps {
  onOpenGallery: () => void;
  onOpenSwap: () => void;
  onOpenExplore: () => void;
  language?: LanguageCode;
  activeAvatarTheme?: AvatarTheme;
}

export const EcosystemPortalView: React.FC<EcosystemPortalViewProps> = ({
  onOpenGallery,
  onOpenSwap,
  onOpenExplore,
  language = 'uk',
  activeAvatarTheme = 'cyber-king',
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'web3' | 'security' | 'tokenomics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const isUk = language === 'uk';

  const ecosystemLinks = [
    {
      category: 'Solana DEX Aggregators',
      items: [
        { name: 'Jupiter Aggregator', desc: isUk ? 'Найкращі котирування серед усіх пулів Solana' : 'Best swap rates across all Solana AMMs', url: 'https://jup.ag', tag: 'DEX #1' },
        { name: 'Raydium Protocol', desc: isUk ? 'Провідний AMM та лаунчпад на Solana' : 'Next-gen liquidity & on-chain orderbook', url: 'https://raydium.io', tag: 'AMM' },
        { name: 'Orca Whirlpools', desc: isUk ? 'Концентрована ліквідність із мінімальним сліпеджем' : 'Concentrated liquidity AMM on Solana', url: 'https://www.orca.so', tag: 'CLMM' },
        { name: 'Lifinity DEX', desc: isUk ? 'Оракул-керований AMM із захистом від IL' : 'Oracle-guided proactive market maker', url: 'https://lifinity.io', tag: 'Oracle AMM' },
      ],
    },
    {
      category: isUk ? 'Провідні Криптобіржі (CEX)' : 'Top Crypto Exchanges (CEX)',
      items: [
        { name: 'Binance', desc: isUk ? 'Найбільша світова криптобіржа за обсягом торгів' : 'World largest crypto exchange by volume', url: 'https://binance.com', tag: 'CEX' },
        { name: 'Bybit', desc: isUk ? 'Провідна біржа для деривативів та споту' : 'Top Tier crypto exchange & derivatives', url: 'https://bybit.com', tag: 'CEX' },
        { name: 'OKX', desc: isUk ? 'Інноваційна біржа та Web3-платформа' : 'Global digital asset trading & Web3 portal', url: 'https://okx.com', tag: 'CEX' },
        { name: 'Coinbase', desc: isUk ? 'Регульована американська публічна біржа (NASDAQ)' : 'US-regulated public exchange (NASDAQ: COIN)', url: 'https://coinbase.com', tag: 'Licensed' },
        { name: 'Kraken', desc: isUk ? 'Одна з найстаріших та найбезпечніших криптобірж' : 'Veteran exchange with high security track record', url: 'https://kraken.com', tag: 'Secure' },
      ],
    },
    {
      category: isUk ? 'Solana DeFi & Ліквідний Стейкінг' : 'Solana DeFi & Staking',
      items: [
        { name: 'Jito Network', desc: isUk ? 'Ліквідний стейкінг із розподілом MEV-винагород (~7.82% APY)' : 'MEV-boosted liquid staking for Solana', url: 'https://jito.network', tag: 'JitoSOL' },
        { name: 'Marinade Finance', desc: isUk ? 'Децентралізований ліквідний стейкінг серед 100+ валідаторів' : 'Non-custodial staking protocol on Solana', url: 'https://marinade.finance', tag: 'mSOL' },
        { name: 'Kamino Finance', desc: isUk ? 'Автоматизоване управління ліквідністю та кредитування' : 'Automated liquidity vaults and lending', url: 'https://kamino.finance', tag: 'Lending' },
        { name: 'Drift Protocol', desc: isUk ? 'Децентралізовані безстрокові фʼючерси (Perps) до 20x' : 'Decentralized perpetual futures on Solana', url: 'https://drift.trade', tag: 'Perps' },
      ],
    },
    {
      category: isUk ? 'Аналітика, Блокчейн-Експлорери та Акції' : 'Analytics, Explorers & Stocks',
      items: [
        { name: 'SolanaFM', desc: isUk ? 'Зручний візуальний провідник транзакцій Solana' : 'Friendly, human-readable Solana blockchain explorer', url: 'https://solana.fm', tag: 'Explorer' },
        { name: 'Solscan', desc: isUk ? 'Повний аналіз контрактів, токенів та транзакцій' : 'Comprehensive Solana account & token tracker', url: 'https://solscan.io', tag: 'Explorer' },
        { name: 'DexScreener Solana', desc: isUk ? 'Графіки котирувань нових пар у реальному часі' : 'Real-time DEX charts, liquidity, and volume', url: 'https://dexscreener.com/solana', tag: 'Live Charts' },
        { name: 'Birdeye Analytics', desc: isUk ? 'Професійний термінал аналізу токенів та китів' : 'Crypto intelligence and trading terminal', url: 'https://birdeye.so', tag: 'Analytics' },
      ],
    },
  ];

  const filteredLinks = ecosystemLinks.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="relative mx-auto max-w-5xl space-y-8 pb-28 text-slate-100">
      {/* Ambient Avatar Background Watermark */}
      <AvatarBackground
        theme={activeAvatarTheme}
        opacity={0.06}
        position="top-right"
      />

      {/* Official Website Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1220] via-slate-900 to-[#080d1a] p-6 sm:p-10 shadow-2xl">
        {/* Glow acccents */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://mysteryum.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-950/90 border border-cyan-400/50 px-3.5 py-1 text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-300 transition-all shadow-md shadow-cyan-950"
              >
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono">https://mysteryum.io</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isUk ? 'Офіційний Домен' : 'Official Domain'}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
              ECOSYSTEM <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">WALLET</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {isUk
                ? 'Нове покоління некастодіального безпечного криптогаманця на Solana. Повний контроль над приватними ключами, вбудована 25¢ NFT-галерея унікальних аватарів, 8 віртуальних карток, AI-професіонал з крипти та акцій, та миттєвий доступ до всіх DEX і CEX бірж світу.'
                : 'Next-generation non-custodial secure crypto wallet on Solana. 100% self-custody with BIP-39 local keys, integrated 25¢ NFT Avatar Mint Engine, 8 customizable virtual cards, professional AI Crypto & Stocks Advisor, and instant routing to top DEXs & global CEX exchanges.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenGallery}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isUk ? 'Галерея Аватарів за 25¢' : '25¢ Avatar Gallery'}</span>
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-mono">0.00136 SOL</span>
              </button>

              <button
                onClick={onOpenSwap}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{isUk ? 'Миттєвий DEX Своп' : 'Instant DEX Swap'}</span>
              </button>

              <button
                onClick={onOpenExplore}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <CompassIcon className="h-4 w-4 text-cyan-400" />
                <span>{isUk ? 'Каталог Web-3 & Бірж' : 'Web-3 Directory'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-30 blur-xl group-hover:opacity-60 transition duration-500" />
              <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-3xl border border-cyan-500/40 bg-black/60 p-3 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
                <div className="h-40 w-40 sm:h-48 sm:w-48">
                  <AvatarArtwork
                    theme={activeAvatarTheme}
                    size="100%"
                    showCrownGlow={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-bold text-cyan-300 font-mono">25¢ Solana Avatar</div>
                  <div className="text-[10px] text-slate-400">0.00136 SOL · VIP Linked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Network & Ecosystem Stats Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
            <div className="text-[10px] font-semibold uppercase text-slate-400">Solana Speed</div>
            <div className="text-lg font-bold font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>3,842</span> <span className="text-xs text-slate-400 font-normal">TPS</span>
            </div>
            <div className="text-[10px] text-slate-500">Block time ~398ms</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
            <div className="text-[10px] font-semibold uppercase text-slate-400">Average Gas Fee</div>
            <div className="text-lg font-bold font-mono text-cyan-300 flex items-center gap-1 mt-0.5">
              <span>&lt; $0.0008</span>
            </div>
            <div className="text-[10px] text-slate-500">0.000005 SOL per tx</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
            <div className="text-[10px] font-semibold uppercase text-slate-400">Avatar Price</div>
            <div className="text-lg font-bold font-mono text-amber-300 flex items-center gap-1 mt-0.5">
              <span>$0.25</span> <span className="text-xs text-slate-400 font-normal">USD</span>
            </div>
            <div className="text-[10px] text-slate-500">0.00136 SOL fixed rate</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
            <div className="text-[10px] font-semibold uppercase text-slate-400">Security Standard</div>
            <div className="text-lg font-bold font-mono text-purple-300 flex items-center gap-1 mt-0.5">
              <span>BIP-39 / Ed25519</span>
            </div>
            <div className="text-[10px] text-slate-500">100% Non-Custodial</div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{isUk ? 'Огляд Екосистеми' : 'Ecosystem Pillars'}</span>
        </button>

        <button
          onClick={() => setActiveSection('web3')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'web3'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{isUk ? 'Каталог Web-3 & Бірж' : 'Web-3 & DEX Hub'}</span>
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'security'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{isUk ? 'Безпека & Модерація' : 'Security & Moderation'}</span>
        </button>

        <button
          onClick={() => setActiveSection('tokenomics')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'tokenomics'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          <span>{isUk ? 'Токеноміка KPGM' : 'KPGM Tokenomics'}</span>
        </button>
      </div>

      {/* SECTION: Overview / Pillars */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: 25¢ Solana Avatar Gallery */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0e1424] p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  25¢ in SOL
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                {isUk ? 'NFT-Аватарки за 25 Центів' : '25¢ NFT Avatar Gallery'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isUk
                  ? 'Колекція з 8 авторських кібер-аватарів (Mythic & Legendary) за фіксованою ціною 25¢ у перерахунку на Solana (0.00136 SOL). Аватари синхронізуються як фон сторінок та наносяться на віртуальні банківські картки Ecosystem.'
                  : 'Curated 8-item cybernetic avatar series mintable at a fixed $0.25 in Solana (0.00136 SOL). Equip avatars to your profile, personalize virtual cards, and enjoy dynamic holographic page watermarks.'}
              </p>
              <button
                onClick={onOpenGallery}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2 cursor-pointer"
              >
                <span>{isUk ? 'Відкрити Галерею Аватарів' : 'Launch Avatar Gallery'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Pillar 2: AI Crypto, Exchanges & Stocks Advisor */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-[#0e1424] p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-indigo-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                  AI 24/7 Expert
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                {isUk ? 'Професійний AI-Консультант' : 'AI Market & Security Pro'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isUk
                  ? 'Вбудований у чат ШІ-експерт у сфері блокчейнів, захисту некастодіальних гаманців, котирувань CEX/DEX бірж та токенізованих американських акцій (NVDA, TSLA, AAPL, SPY).'
                  : 'Embedded conversational AI agent specialized in Solana architecture, wallet seed defense, CEX vs DEX comparisons, liquidity analysis, and tokenized US equities (xStocks).'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 pt-2">
                <span>{isUk ? 'Доступний у вкладці «ШІ & Чат»' : 'Available in AI & Chat tab'}</span>
              </div>
            </div>

            {/* Pillar 3: Web-3, DEX, CEX & DeFi Hub */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-[#0e1424] p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <CompassIcon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-purple-950/80 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  100+ Protocols
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                {isUk ? 'Веб-3, DEX & Провідні Біржі' : 'Web-3, DEX & CEX Ecosystem'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isUk
                  ? 'Прямі посилання та маршрутизація на найкращі DEX (Jupiter, Raydium, Orca), CEX (Binance, Bybit, OKX, Coinbase), платформи стейкінгу (Jito, Marinade) та ончейн-аналітику.'
                  : 'Fast-track routing to Solana DEXs, global CEX exchanges, liquid staking, perpetual contracts, and on-chain intelligence terminals.'}
              </p>
              <button
                onClick={onOpenExplore}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 pt-2 cursor-pointer"
              >
                <span>{isUk ? 'Переглянути Каталог Веб-3' : 'Explore Web-3 Directory'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 8 Virtual Cards Section */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <CreditCard className="h-4 w-4" />
                  <span>{isUk ? '8 Віртуальних Карток із Вашими Аватарками' : '8 Customizable Virtual Cards'}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading mt-1">
                  {isUk ? 'Персоналізуйте свої картки за допомогою 25¢ NFT' : 'Equip 25¢ NFT Avatars to Cards'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {isUk
                    ? 'Кожна віртуальна картка Ecosystem (Solana Black VIP, Neon Cyber, Golden Midas, Cybernetic King тощо) має окремий ліміт витрат та відображає обрану вами аватарку.'
                    : 'Each virtual card features dedicated spending limits, auto-freeze toggles, and showcases your minted 25¢ NFT artwork.'}
                </p>
              </div>

              <button
                onClick={onOpenGallery}
                className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 px-5 py-2.5 text-xs font-bold text-cyan-300 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isUk ? 'Призначити аватарку' : 'Assign Avatar to Card'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Web-3 Directory */}
      {activeSection === 'web3' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {isUk ? 'Каталог Веб-3, DEX та Бірж' : 'Web-3 Directory: Exchanges, DEX & DeFi'}
              </h2>
              <p className="text-xs text-slate-400">
                {isUk
                  ? 'Офіційні перевірені посилання на біржі, децентралізовані протоколи та аналітичні сервіси.'
                  : 'Curated and verified gateways to exchanges, decentralized protocols, and live analytics.'}
              </p>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isUk ? 'Пошук біржі чи протоколу...' : 'Search exchange or protocol...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredLinks.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{cat.category}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.items.map((item, iIdx) => (
                    <a
                      key={iIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0e1424] hover:bg-[#121a30] hover:border-cyan-500/40 p-4 transition-all shadow-md cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-mono text-slate-300 border border-white/5">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 mt-3 pt-2 border-t border-white/5 group-hover:underline">
                        <span>{isUk ? 'Перейти на платформу' : 'Open Platform'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Security & Moderation */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-[#0e1424] p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  {isUk ? 'Архітектура Безпеки та Модерація Спільноти' : 'Security Architecture & Content Moderation'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isUk ? 'Повна некастодіальність, захист від дренейрів та безпечне середовище спілкування' : 'Zero custody, drainer resistance, and verified community chat safety'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isUk ? '100% Некастодіальне зберігання' : '100% Non-Custodial Vault'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Ваші ключі генеруються виключно у вашому браузері за стандартом BIP-39 та криптографією Ed25519. Жоден сервер не має доступу до сід-фрази.'
                    : 'Private keys are derived locally using standard BIP-39 / Ed25519 curves. No third-party server ever sees or stores your private key.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isUk ? 'Модерація чату та блокування користувачів' : 'Chat Moderation & User Blocking'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Користувачі мають повну можливість блокувати небажаних співрозмовників в один клік, а також надсилати скарги на фішинг, спам або порушення законів гаманця до Модераційного центру.'
                    : 'Instant one-tap user blocking, phishing detection, and report submission to the built-in community moderation desk.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isUk ? 'Автоматичний фільтр зливу ключів' : 'Seed Leak & Drainer Auto-Filter'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Чат автоматично виявляє та блокує відправку сід-фраз, приватних ключів або шкідливих доменів дренейрів, захищаючи користувачів від втрати коштів.'
                    : 'Real-time text scanner detects and blocks accidental seed leaks or malicious drainer URLs before broadcast.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{isUk ? 'Голосовий звʼязок та обмін медіа' : 'Voice Notes & Secure Media Sharing'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUk
                    ? 'Підтримка надсилання голосових нотаток, скріншотів аналітики та графіків із попереднім скануванням вмісту.'
                    : 'Exchange voice notes and market charts safely with peer-to-peer verification and moderation tools.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Tokenomics */}
      {activeSection === 'tokenomics' && (
        <div className="rounded-3xl border border-amber-500/30 bg-[#0e1424] p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                {isUk ? 'Токеноміка KPGM & Утиліта Аватарів' : 'KPGM Tokenomics & Avatar Utilities'}
              </h2>
              <p className="text-xs text-slate-400">
                {isUk ? 'Економіка екосистеми Ecosystem Wallet' : 'Ecosystem economics, staking incentives, and avatar utility'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="text-xs text-slate-400">Fixed Avatar Mint Price</div>
              <div className="text-xl font-bold text-amber-300 font-mono mt-1">$0.25 USD</div>
              <div className="text-xs text-slate-400 mt-1">
                {isUk ? '0.00136 SOL або 2.08 KPGM' : '0.00136 SOL or 2.08 KPGM'}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="text-xs text-slate-400">KPGM Staking Rewards</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">14.5% APY</div>
              <div className="text-xs text-slate-400 mt-1">
                {isUk ? 'Знижка 50% на комісії DEX-свопу' : '50% discount on DEX swap fees'}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="text-xs text-slate-400">Total Supply</div>
              <div className="text-xl font-bold text-cyan-300 font-mono mt-1">100,000,000</div>
              <div className="text-xs text-slate-400 mt-1">
                {isUk ? 'Фіксована емісія без інфляції' : 'Hard-capped non-inflationary supply'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CompassIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
