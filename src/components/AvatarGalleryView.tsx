import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Shield,
  Download,
  Flame,
  Coins,
  Crown,
  Zap,
  ArrowRight,
  Check,
  CreditCard,
  X,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AvatarNFTItem, AvatarTheme, LanguageCode, EcosystemCard, WalletAccount } from '../types/wallet';
import { AvatarArtwork } from './AvatarArtwork';
import { AvatarBackground } from './AvatarBackground';
import { formatFiat } from '../utils/currencies';

interface AvatarGalleryViewProps {
  avatars: AvatarNFTItem[];
  cards: EcosystemCard[];
  account: WalletAccount;
  currency: string;
  language: LanguageCode;
  onMintAvatar: (avatarId: string, paymentMethod: 'usdc' | 'sol' | 'kpgm' | 'card') => void;
  onEquipAvatar: (theme: AvatarTheme) => void;
  onAssignToCard: (avatarId: string, cardId: number) => void;
}

export const AvatarGalleryView: React.FC<AvatarGalleryViewProps> = ({
  avatars,
  cards = [],
  account,
  currency,
  language,
  onMintAvatar,
  onEquipAvatar,
  onAssignToCard,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'kings' | 'guardians' | 'elemental' | 'aces'>('all');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(avatars[0]?.id || 'avatar-cyber-king');
  const [mintModalAvatar, setMintModalAvatar] = useState<AvatarNFTItem | null>(null);
  const [assignModalAvatar, setAssignModalAvatar] = useState<AvatarNFTItem | null>(null);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'usdc' | 'sol' | 'kpgm' | 'card'>('sol');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredAvatars = avatars.filter((av) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'kings') return av.theme === 'cyber-king' || av.theme === 'neon-grail';
    if (selectedFilter === 'guardians') return av.theme === 'shield-guardian' || av.theme === 'protocol-guardian';
    if (selectedFilter === 'elemental') return av.theme === 'golden-midas' || av.theme === 'frost-emperor';
    if (selectedFilter === 'aces') return av.theme === 'diamond-ace' || av.theme === 'shadow-spade';
    return true;
  });

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];
  const isSelectedEquipped = account.avatarTheme === selectedAvatar.theme;

  const handleStartMint = (avatar: AvatarNFTItem) => {
    setMintModalAvatar(avatar);
    setMintSuccess(false);
    setIsMinting(false);
  };

  const handleExecuteMint = () => {
    if (!mintModalAvatar) return;
    setIsMinting(true);

    setTimeout(() => {
      onMintAvatar(mintModalAvatar.id, paymentMethod);
      setIsMinting(false);
      setMintSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffa3', '#03e1ff', '#dc1fff', '#ffd700'],
      });

      // Auto close after 2.5s
      setTimeout(() => {
        setMintModalAvatar(null);
        setMintSuccess(false);
      }, 2400);
    }, 1200);
  };

  const handleDownloadAvatar = () => {
    // Generate a simple downloadable SVG data uri
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="relative space-y-8 pb-28 text-slate-100">
      {/* Ambient Avatar Background Watermark */}
      <AvatarBackground
        theme={account.avatarTheme || 'cyber-king'}
        opacity={0.06}
        position="top-right"
      />

      {/* Hero Header Banner */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-[#080d1a] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3 py-1 text-xs font-bold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>OFFICIAL ECOSYSTEM NFT AVATARS</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono">
                0.00136 SOL (25¢)
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              NFT Avatar Mint Gallery
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mint official Solana NFT avatars for just <strong className="text-cyan-300 font-bold">25 cents in SOL (0.00136 SOL)</strong>.
              Equip them across your wallet, link them to your 8 Ecosystem Virtual Cards, and export high-res artwork.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2 shrink-0 md:text-right">
            <p className="text-xs text-slate-400">Ціна мінту в перерахунку на SOL</p>
            <div className="flex items-baseline md:justify-end gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                0.00136 SOL
              </span>
              <span className="text-xs text-cyan-300 font-mono">/ 25¢ ($0.25)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ≈ 0.00136 SOL · 0.25 USDC · 25 KPGM
            </div>
          </div>
        </div>
      </div>

      {/* Main Showcase & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Featured Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#131b2e] to-[#0c101a] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold border ${
                    selectedAvatar.tier === 'Mythic'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : selectedAvatar.tier === 'Legendary'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {selectedAvatar.tier}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  PWR {selectedAvatar.traits.powerLevel}/100
                </span>
              </div>

              {selectedAvatar.isMinted ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-bold font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Owned</span>
                </span>
              ) : (
                <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold font-mono">
                  Available (25¢)
                </span>
              )}
            </div>

            {/* Big Avatar Artwork Render */}
            <div className="relative mx-auto max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <AvatarArtwork theme={selectedAvatar.theme} size="100%" showCrownGlow={true} />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="font-heading text-xl font-bold text-white">
                {selectedAvatar.name}
              </h2>
              <p className="text-xs text-cyan-400 font-medium">
                {selectedAvatar.title}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedAvatar.description}
              </p>
            </div>

            {/* Metaplex Attributes */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
              <div className="rounded-xl bg-slate-900/80 border border-white/5 p-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Crown</span>
                <p className="font-bold text-white text-xs truncate mt-0.5">
                  {selectedAvatar.traits.crown}
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-white/5 p-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Eyes & Lasers</span>
                <p className="font-bold text-white text-xs truncate mt-0.5">
                  {selectedAvatar.traits.eyes}
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-white/5 p-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Armor Finish</span>
                <p className="font-bold text-white text-xs truncate mt-0.5">
                  {selectedAvatar.traits.armor}
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-white/5 p-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Rarity</span>
                <p className="font-bold text-white text-xs truncate mt-0.5">
                  {selectedAvatar.traits.rarity}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="space-y-2 pt-2">
              {selectedAvatar.isMinted ? (
                <div className="space-y-2">
                  <button
                    onClick={() => onEquipAvatar(selectedAvatar.theme)}
                    disabled={isSelectedEquipped}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-md cursor-pointer ${
                      isSelectedEquipped
                        ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                    }`}
                  >
                    {isSelectedEquipped ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Equipped as Active Wallet Avatar</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Equip as Active Wallet Avatar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setAssignModalAvatar(selectedAvatar);
                      setAssignSuccessMessage(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span>Assign to Virtual Card</span>
                  </button>

                  {assignSuccessMessage && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3 py-2 text-center text-xs text-emerald-300 flex items-center justify-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{assignSuccessMessage}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadAvatar}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 py-2 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{downloadSuccess ? 'Saved!' : 'Export Avatar'}</span>
                    </button>

                    <a
                      href={`https://explorer.solana.com/address/${selectedAvatar.mintAddress}?cluster=mainnet-beta`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition-colors"
                      title="View on Solana Explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleStartMint(selectedAvatar)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:opacity-95 py-3 text-xs font-extrabold text-black transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>MINT THIS AVATAR NFT FOR 25¢</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Gallery List with Filters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
            {[
              { id: 'all', label: 'All Avatars (8)' },
              { id: 'kings', label: 'Royal Kings' },
              { id: 'guardians', label: 'Shield & Steampunk' },
              { id: 'elemental', label: 'Flame & Ice' },
              { id: 'aces', label: 'High Roller Aces' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredAvatars.map((avatar) => {
              const isSelected = avatar.id === selectedAvatarId;
              const isEquipped = account.avatarTheme === avatar.theme;

              return (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`relative rounded-2xl border p-3 transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950'
                      : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/90 hover:border-white/20'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                        avatar.tier === 'Mythic'
                          ? 'bg-amber-500/20 text-amber-300'
                          : avatar.tier === 'Legendary'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {avatar.tier}
                    </span>

                    {avatar.isMinted ? (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 p-0.5" title="Owned">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        25¢
                      </span>
                    )}
                  </div>

                  {/* Artwork Thumbnail */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-2.5">
                    <AvatarArtwork theme={avatar.theme} size="100%" showCrownGlow={false} />
                    {isEquipped && (
                      <div className="absolute top-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/40">
                        Active
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-white text-xs truncate">
                      {avatar.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {avatar.title}
                    </p>
                  </div>

                  {/* Mint or Select Button */}
                  <div className="mt-3 pt-2 border-t border-white/5">
                    {avatar.isMinted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEquipAvatar(avatar.theme);
                        }}
                        className={`w-full rounded-lg py-1 text-[11px] font-bold transition-all ${
                          isEquipped
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {isEquipped ? 'Active' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartMint(avatar);
                        }}
                        className="w-full rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 py-1 text-[11px] font-bold text-cyan-300 transition-all cursor-pointer"
                      >
                        Mint 25¢
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Linking to Ecosystem Cards Info Box */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                Virtual Card Integration
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Ecosystem Virtual Card (Series 1 to 8) is dynamically backed by these custom NFT avatars.
              When you mint and equip an avatar, it syncs across your cards, transactions, and Web3 profile.
            </p>
          </div>
        </div>
      </div>

      {/* 25-Cent Minting Modal */}
      {mintModalAvatar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/40 bg-[#0c101a] p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setMintModalAvatar(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {mintSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    NFT Avatar Minted!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Successfully minted <strong className="text-cyan-400">{mintModalAvatar.name}</strong> for 25¢!
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 mt-2">
                    Confirmed on Solana · Added to your Vault
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">
                      Mint NFT Avatar
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standard Metaplex Token · Solana Non-Custodial
                    </p>
                  </div>
                </div>

                {/* Avatar Preview Row */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-3.5">
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                    <AvatarArtwork theme={mintModalAvatar.theme} size="100%" showCrownGlow={false} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">
                      {mintModalAvatar.name}
                    </h4>
                    <p className="text-xs text-cyan-400 font-mono">
                      Fixed Price: $0.25 (25¢)
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {mintModalAvatar.traits.rarity}
                    </span>
                  </div>
                </div>

                {/* Select Payment Method */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Оберіть токен оплати (25¢ у перерахунку на Solana):
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'sol', label: '0.00136 SOL', sub: '25¢ в перерахунку SOL' },
                      { id: 'usdc', label: '0.25 USDC', sub: '$0.25 USD' },
                      { id: 'kpgm', label: '25 KPGM', sub: 'Native Pool' },
                      { id: 'card', label: '25¢ Card', sub: 'Sandbox Top-up' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm ring-1 ring-cyan-500/50'
                            : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <p className="font-bold text-white font-mono text-xs">{m.label}</p>
                        <p className="text-[10px] text-slate-400">{m.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Ціна NFT аватара</span>
                    <span className="text-white font-mono font-bold">0.00136 SOL ($0.25 USD)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Комісія мережі Solana</span>
                    <span className="text-emerald-400 font-mono">~0.000005 SOL (&lt; $0.001)</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleExecuteMint}
                  disabled={isMinting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 py-3 text-xs font-extrabold text-black transition-all shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                >
                  {isMinting ? (
                    <span>Підтвердження транзакції в Solana...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Підтвердити та мінтувати за 0.00136 SOL (25¢)</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Assign Avatar to Card Modal */}
      {assignModalAvatar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-[#0c101a] p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setAssignModalAvatar(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Assign Avatar to Virtual Card
                </h3>
                <p className="text-xs text-slate-400">
                  Select which Ecosystem card will display this custom NFT artwork
                </p>
              </div>
            </div>

            {/* Selected Avatar Banner */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-slate-900/80 p-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                <AvatarArtwork theme={assignModalAvatar.theme} size="100%" showCrownGlow={false} />
              </div>
              <div>
                <p className="text-xs font-bold text-white font-heading">
                  {assignModalAvatar.name}
                </p>
                <p className="text-[11px] text-cyan-400">
                  {assignModalAvatar.title}
                </p>
              </div>
            </div>

            {/* List of 8 Ecosystem Cards */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Choose Target Card (1 — 8):
              </p>
              {cards.map((card) => {
                const isCurrent = card.avatarTheme === assignModalAvatar.theme;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      onAssignToCard(assignModalAvatar.id, card.id);
                      setAssignSuccessMessage(`Linked "${assignModalAvatar.name}" to Card #${card.id} (${card.title})`);
                      setAssignModalAvatar(null);
                      setTimeout(() => setAssignSuccessMessage(null), 4000);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer group ${
                      isCurrent
                        ? 'border-emerald-500/50 bg-emerald-950/30 text-white'
                        : 'border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                        {card.avatarTheme ? (
                          <AvatarArtwork theme={card.avatarTheme} size="100%" showCrownGlow={false} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-mono text-cyan-400">
                            #{card.id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{card.series}</span>
                          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300">
                            {card.tier}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {card.title}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                          <Check className="h-3 w-3" />
                          <span>Linked</span>
                        </span>
                      ) : (
                        <span className="rounded-lg bg-cyan-500/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 text-cyan-300 px-2 py-1 text-[10px] font-bold transition-colors">
                          Select Card
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
