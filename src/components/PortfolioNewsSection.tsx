import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Filter,
  Search,
  Clock,
  Sparkles,
  RefreshCw,
  Flame,
  Globe,
  Radio,
  Tag,
  Share2,
  Check,
} from 'lucide-react';
import {
  CryptoNewsArticle,
  CryptoNewsCategory,
  fetchCryptoNewsAggregator,
  filterCryptoNews,
  MOCK_CRYPTO_NEWS,
} from '../utils/cryptoNewsService';
import { TokenAsset } from '../types/wallet';

interface PortfolioNewsSectionProps {
  tokens: TokenAsset[];
  onSelectTokenTrade?: (tokenSymbol: string) => void;
}

export const PortfolioNewsSection: React.FC<PortfolioNewsSectionProps> = ({
  tokens,
  onSelectTokenTrade,
}) => {
  const [articles, setArticles] = useState<CryptoNewsArticle[]>(MOCK_CRYPTO_NEWS);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CryptoNewsCategory>('all');
  const [selectedToken, setSelectedToken] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: CryptoNewsCategory; label: string }[] = [
    { id: 'all', label: 'All News' },
    { id: 'solana', label: 'Solana L1' },
    { id: 'defi', label: 'DeFi & DEX' },
    { id: 'tokenized-stocks', label: 'xStocks' },
    { id: 'macro', label: 'Macro' },
    { id: 'regulation', label: 'Policy' },
  ];

  // Distinct list of token symbols present in portfolio
  const availableTokens = ['ALL', ...tokens.map((t) => t.symbol)];

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await fetchCryptoNewsAggregator(selectedCategory, selectedToken === 'ALL' ? undefined : selectedToken);
      const filtered = filterCryptoNews(result, {
        category: selectedCategory,
        tokenSymbol: selectedToken === 'ALL' ? undefined : selectedToken,
        searchQuery,
      });
      setArticles(filtered);
    } catch (err) {
      console.warn('Failed to load crypto news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedToken, searchQuery]);

  const handleShare = (article: CryptoNewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${article.title} - ${article.url}`);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111728]/90 via-[#0d121f]/95 to-[#080d16] p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-1.5">
                <span>Crypto Market Headlines</span>
                <span className="flex items-center gap-1 rounded bg-emerald-950/90 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE AGGREGATOR
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Curated market catalysts and macro context explaining your Solana portfolio volatility
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadNews}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          title="Refresh live headlines"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Fetching...' : 'Refresh News'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input & Token Filter */}
        <div className="flex items-center gap-2">
          {/* Token Tag Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-900/80 border border-white/10 px-2.5 py-1.5 text-xs">
            <Tag className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="bg-transparent text-xs text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              {availableTokens.map((sym) => (
                <option key={sym} value={sym} className="bg-slate-900 text-white">
                  {sym === 'ALL' ? 'All Tokens' : sym}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter headlines..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Featured Headline Banner */}
      {featuredArticle && (
        <div className="relative z-10 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-indigo-950/40 p-4 sm:p-5 shadow-lg group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-400" />
                  KEY CATALYST
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                  {featuredArticle.source}
                </span>
                <span className="text-[11px] text-slate-500">·</span>
                <span className="text-[11px] text-slate-400 font-mono">{featuredArticle.publishedAgo}</span>
              </div>

              <h4 className="font-heading text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {featuredArticle.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {featuredArticle.summary}
              </p>

              {/* Related Portfolio Tokens & Sentiment Tag */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold border ${
                    featuredArticle.impactSentiment === 'bullish'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : featuredArticle.impactSentiment === 'bearish'
                      ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800 border-white/10 text-slate-300'
                  }`}
                >
                  {featuredArticle.impactSentiment === 'bullish' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{featuredArticle.impactSentiment.toUpperCase()}</span>
                </span>

                <span className="text-[11px] text-slate-400">Impact on:</span>
                {featuredArticle.relatedTokens.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => onSelectTokenTrade && onSelectTokenTrade(sym)}
                    className="rounded-lg bg-black/40 hover:bg-cyan-950 border border-white/10 hover:border-cyan-500/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 transition-all cursor-pointer"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Read & Share Controls */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
              <a
                href={featuredArticle.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-black shadow-md shadow-cyan-500/20 transition-all"
              >
                <span>Read Story</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={(e) => handleShare(featuredArticle, e)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer transition-colors"
                title="Copy headline and link"
              >
                {copiedId === featuredArticle.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid List */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {regularArticles.map((article) => (
          <div
            key={article.id}
            className="flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-900/50 hover:bg-slate-900/80 hover:border-cyan-500/30 p-4 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400">{article.source}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-slate-400">{article.publishedAgo}</span>
                </div>

                {/* Sentiment Pill */}
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[9px] font-mono font-bold border ${
                    article.impactSentiment === 'bullish'
                      ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                      : article.impactSentiment === 'bearish'
                      ? 'bg-rose-950/70 border-rose-500/30 text-rose-300'
                      : 'bg-slate-800 border-white/10 text-slate-300'
                  }`}
                >
                  {article.impactSentiment === 'bullish' ? '+' : ''}
                  {article.impactSentiment.toUpperCase()}
                </span>
              </div>

              <h5 className="font-heading text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {article.title}
              </h5>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-[11px]">
              <div className="flex items-center gap-1.5">
                {article.relatedTokens.map((sym) => (
                  <span
                    key={sym}
                    className="rounded bg-black/40 border border-white/5 px-1.5 py-0.2 font-mono text-[10px] font-bold text-cyan-300"
                  >
                    ${sym}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleShare(article, e)}
                  className="p-1 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Share link"
                >
                  {copiedId === article.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="h-3.5 w-3.5" />
                  )}
                </button>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Details</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="py-8 text-center space-y-2">
          <Newspaper className="mx-auto h-8 w-8 text-slate-600" />
          <p className="text-xs text-slate-400">No market headlines matched your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedToken('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
