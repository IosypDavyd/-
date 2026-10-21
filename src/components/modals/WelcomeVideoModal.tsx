import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Layers,
  Bot,
  Compass,
  CreditCard,
  Maximize2,
} from 'lucide-react';
import { LanguageCode } from '../../types/wallet';
import { AvatarArtwork } from '../AvatarArtwork';

interface WelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: LanguageCode;
  onExploreFeatures?: (tab: 'portal' | 'gallery' | 'swap' | 'chat') => void;
}

interface VideoScene {
  id: number;
  durationSec: number;
  badge: string;
  badgeColor: string;
  headlineEn: string;
  headlineUk: string;
  subtextEn: string;
  subtextUk: string;
  tag: string;
  metricLabel: string;
  metricValue: string;
  gradient: string;
  visualType: 'intro' | 'security' | 'avatars' | 'ai-copilot' | 'web3-ecosystem';
}

const SCENES: VideoScene[] = [
  {
    id: 1,
    durationSec: 5,
    badge: 'NEW GENERATION 2026',
    badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/70',
    headlineEn: 'Welcome to ECOSYSTEM WALLET SOLANA',
    headlineUk: 'Ласкаво просимо в ECOSYSTEM WALLET SOLANA',
    subtextEn: 'The unified next-gen Web3 financial terminal powered by Solana speed, zero-custody security, and sovereign decentralization.',
    subtextUk: 'Єдиний некастодіальний фінансовий Web3-термінал нового покоління на надшвидкому блокчейні Solana з повною суверенністю ваших коштів.',
    tag: '⚡ 65,000 TPS · Sub-Cent Gas',
    metricLabel: 'BLOCK TIME',
    metricValue: '400 ms',
    gradient: 'from-cyan-500/20 via-indigo-950/60 to-purple-950/40',
    visualType: 'intro',
  },
  {
    id: 2,
    durationSec: 5,
    badge: '100% SELF-CUSTODY VAULT',
    badgeColor: 'border-emerald-400 text-emerald-300 bg-emerald-950/70',
    headlineEn: 'Your Keys. Your Assets. Absolute Sovereignty.',
    headlineUk: 'Ваші ключі. Ваші активи. Абсолютна безпека.',
    subtextEn: 'Private keys and 12-word seed phrases are encrypted locally with AES-GCM & Ed25519 cryptography. No servers or intermediaries ever touch your funds.',
    subtextUk: 'Приватні ключі та 12-слівні сід-фрази шифруються локально за допомогою AES-GCM та Ed25519. Жоден сервер чи посередник не має доступу.',
    tag: '🔒 Hardware-Grade Local Encryption',
    metricLabel: 'SECURITY SCORE',
    metricValue: '100/100',
    gradient: 'from-emerald-500/20 via-slate-900/80 to-cyan-950/50',
    visualType: 'security',
  },
  {
    id: 3,
    durationSec: 5,
    badge: 'AVATARS AT 25 CENTS IN SOL',
    badgeColor: 'border-amber-400 text-amber-300 bg-amber-950/70',
    headlineEn: 'Unique 25¢ Solana NFT Avatars & Dynamic Cards',
    headlineUk: 'Авторські NFT-аватарки по 25 центів у SOL та віртуальні картки',
    subtextEn: 'Mint high-definition on-chain avatars for only $0.25 (0.00136 SOL), customize dynamic virtual card skins, and personalize every screen.',
    subtextUk: 'Мінтуйте унікальні авторські NFT всього по $0.25 (0.00136 SOL), привʼязуйте їх до 8 віртуальних карток та кастомізуйте тему гаманця.',
    tag: '💎 Fixed 25¢ SOL Mint Rate',
    metricLabel: 'MINT PRICE',
    metricValue: '$0.25 SOL',
    gradient: 'from-amber-500/20 via-purple-950/60 to-cyan-950/50',
    visualType: 'avatars',
  },
  {
    id: 4,
    durationSec: 5,
    badge: 'PRO AI COPILOT & CHAT',
    badgeColor: 'border-purple-400 text-purple-300 bg-purple-950/70',
    headlineEn: 'Specialized Crypto, DEX & Stock AI Advisor',
    headlineUk: 'Професійний ШІ-консультант крипти, DEX, бірж та акцій',
    subtextEn: 'Consult the embedded neural agent on Solana protocols, smart contract audits, CEX vs DEX arbitrage, voice notes, and P2P messaging.',
    subtextUk: 'Вбудований AI-агент відповість на будь-які запитання про Solana, біржі CEX/DEX, xStocks, а також підтримує голосовий та фото-чат.',
    tag: '🧠 Deep Market & Security Intelligence',
    metricLabel: 'AGENT LATENCY',
    metricValue: '0.2 sec',
    gradient: 'from-purple-500/25 via-indigo-950/70 to-slate-950/80',
    visualType: 'ai-copilot',
  },
  {
    id: 5,
    durationSec: 5,
    badge: 'ALL-IN-ONE ECOSYSTEM PORTAL',
    badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/70',
    headlineEn: 'Gateway to Solana DEX, CEX, DeFi & Perpetuals',
    headlineUk: 'Шлюз до кращих бірж, DEX, DeFi, стейкінгу та деривативів',
    subtextEn: 'Direct integration with Jupiter, Raydium, Drift, JitoSOL staking, Binance, Bybit, tokenized US equities, and official publishing guides.',
    subtextUk: 'Прямий доступ до Jupiter, Raydium, Drift, стейкінгу JitoSOL, бірж Binance, Bybit, токенізованих акцій США та інструкцій запуску.',
    tag: '🌐 Full Solana Ecosystem in Your Pocket',
    metricLabel: 'INTEGRATIONS',
    metricValue: '25+ DApps',
    gradient: 'from-cyan-600/20 via-blue-950/70 to-emerald-950/40',
    visualType: 'web3-ecosystem',
  },
];

export const WelcomeVideoModal: React.FC<WelcomeVideoModalProps> = ({
  isOpen,
  onClose,
  language = 'uk',
  onExploreFeatures,
}) => {
  const isUk = language === 'uk';
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 within current scene
  const [hasSoundBeeped, setHasSoundBeeped] = useState(false);

  const scene = SCENES[currentSceneIdx];

  // Synthesize futuristic gentle audio tone on scene transition if unmuted
  const playCyberChime = (freq = 520) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext may be restricted by browser policy before first interaction
    }
  };

  // Scene progression timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 50;
    const step = (intervalMs / (scene.durationSec * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          // Advance to next scene or loop back to 0
          setCurrentSceneIdx((curr) => {
            const next = (curr + 1) % SCENES.length;
            playCyberChime(440 + next * 80);
            return next;
          });
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIdx, isMuted]);

  const handleNextScene = () => {
    setCurrentSceneIdx((curr) => (curr + 1) % SCENES.length);
    setProgress(0);
    playCyberChime(580);
  };

  const handlePrevScene = () => {
    setCurrentSceneIdx((curr) => (curr - 1 + SCENES.length) % SCENES.length);
    setProgress(0);
    playCyberChime(480);
  };

  const handleSelectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setProgress(0);
    playCyberChime(460 + idx * 60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-cyan-500/40 bg-[#080d1a] shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0c1224]/90 z-20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black font-black text-xs shadow-md shadow-cyan-500/30">
              ECO
            </div>
            <div>
              <span className="font-heading text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
                ECOSYSTEM WALLET SOLANA
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  OFFICIAL PROMO VIDEO
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playCyberChime(660);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/60 hover:text-rose-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage with Ambient Glow */}
        <div className={`relative min-h-[380px] sm:min-h-[420px] bg-gradient-to-b ${scene.gradient} p-6 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-700`}>
          {/* Animated Background Grids & Orbs */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none animate-pulse" />

          {/* Top Status & Scene Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono font-bold tracking-wider border shadow-sm ${scene.badgeColor}`}>
              <Sparkles className="h-3 w-3" />
              {scene.badge}
            </span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400">
                SCENE {scene.id} / {SCENES.length}
              </span>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>

          {/* Center Stage Presentation Content */}
          <div className="relative z-10 py-6 sm:py-8 space-y-4">
            {/* Visual Centerpiece per scene */}
            <div className="flex items-center gap-4 sm:gap-6">
              {scene.visualType === 'intro' && (
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-2xl shadow-cyan-500/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0a0f1d]">
                    <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              )}

              {scene.visualType === 'security' && (
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-2xl shadow-emerald-500/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0a1815]">
                    <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400" />
                  </div>
                </div>
              )}

              {scene.visualType === 'avatars' && (
                <div className="relative flex -space-x-4 shrink-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-cyan-400 bg-black overflow-hidden shadow-xl transform -rotate-6">
                    <AvatarArtwork theme="cyber-king" size="100%" showCrownGlow={false} />
                  </div>
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-amber-400 bg-black overflow-hidden shadow-xl transform rotate-6">
                    <AvatarArtwork theme="golden-midas" size="100%" showCrownGlow={false} />
                  </div>
                </div>
              )}

              {scene.visualType === 'ai-copilot' && (
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-600 to-cyan-400 p-0.5 shadow-2xl shadow-purple-500/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#120a1f]">
                    <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" />
                  </div>
                </div>
              )}

              {scene.visualType === 'web3-ecosystem' && (
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 via-emerald-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#081422]">
                    <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-300" />
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-1">
                <span className="font-mono text-[11px] font-semibold text-cyan-400 tracking-wider">
                  {scene.tag}
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white leading-tight">
                  {isUk ? scene.headlineUk : scene.headlineEn}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              {isUk ? scene.subtextUk : scene.subtextEn}
            </p>

            {/* Key Live Metric Card */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 mt-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                {scene.metricLabel}:
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
                {scene.metricValue}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          {/* Scene Playback Progress Bars (Instagram Stories / TikTok Style) */}
          <div className="relative z-10 grid grid-cols-5 gap-1.5 pt-4">
            {SCENES.map((s, idx) => {
              const isPast = idx < currentSceneIdx;
              const isCurrent = idx === currentSceneIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectScene(idx)}
                  className="h-1.5 w-full rounded-full bg-slate-700/60 overflow-hidden cursor-pointer"
                  title={`Scene ${s.id}`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                    style={{
                      width: isPast ? '100%' : isCurrent ? `${progress}%` : '0%',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Playback & Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#0a0f1d] border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isUk ? 'Пауза' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isUk ? 'Продовжити' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrevScene}
              className="rounded-xl border border-white/10 bg-slate-800/80 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700"
            >
              ◀
            </button>
            <button
              onClick={handleNextScene}
              className="rounded-xl border border-white/10 bg-slate-800/80 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700"
            >
              ▶
            </button>
          </div>

          {/* Quick CTA to start using ECOSYSTEM WALLET SOLANA */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onExploreFeatures && (
              <button
                onClick={() => {
                  onClose();
                  onExploreFeatures('portal');
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-2 text-xs font-bold text-black hover:opacity-95 shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>{isUk ? 'Відкрити Екосистему' : 'Open Ecosystem Portal'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {isUk ? 'До гаманця' : 'Go to Wallet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
