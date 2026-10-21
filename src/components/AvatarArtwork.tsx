import React from 'react';
import { AvatarTheme } from '../types/wallet';

interface AvatarArtworkProps {
  theme: AvatarTheme;
  className?: string;
  size?: number | string;
  showCrownGlow?: boolean;
  interactive?: boolean;
}

export const AvatarArtwork: React.FC<AvatarArtworkProps> = ({
  theme,
  className = '',
  size = '100%',
  showCrownGlow = true,
  interactive = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden select-none flex items-center justify-center ${interactive ? 'group cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. CYBER KING (Chrome & Sapphire Solana Monarch) */}
      {theme === 'cyber-king' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ck-bg" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0a0e1a" />
              <stop offset="50%" stopColor="#081426" />
              <stop offset="100%" stopColor="#050811" />
            </linearGradient>
            <linearGradient id="ck-chrome" x1="120" y1="100" x2="280" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="60%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="ck-gold" x1="100" y1="30" x2="300" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="solana-glow" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#00ffa3" />
              <stop offset="50%" stopColor="#03e1ff" />
              <stop offset="100%" stopColor="#dc1fff" />
            </linearGradient>
            <radialGradient id="sapphire-gem" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Cyberspace Grid */}
          <rect width="400" height="400" rx="32" fill="url(#ck-bg)" />
          <path d="M40 0 V400 M80 0 V400 M120 0 V400 M160 0 V400 M200 0 V400 M240 0 V400 M280 0 V400 M320 0 V400 M360 0 V400" stroke="#00f2fe" strokeOpacity="0.06" strokeWidth="1" />
          <path d="M0 40 H400 M0 80 H400 M0 120 H400 M0 160 H400 M0 200 H400 M0 240 H400 M0 280 H400 M0 320 H400 M0 360 H400" stroke="#00f2fe" strokeOpacity="0.06" strokeWidth="1" />

          {/* Neck & Shoulders Plating */}
          <path d="M140 330 L200 370 L260 330 L280 395 L120 395 Z" fill="#1e293b" stroke="#334155" strokeWidth="3" />
          <path d="M170 345 L200 380 L230 345" stroke="#ca8a04" strokeWidth="2.5" />

          {/* Head Base Silhouette */}
          <path d="M125 150 C125 110 160 95 200 95 C240 95 275 110 275 150 V240 C275 295 235 340 200 345 C165 340 125 295 125 240 Z" fill="url(#ck-chrome)" stroke="#475569" strokeWidth="2" />

          {/* Cybernetic Temples & Ear Sensors */}
          <rect x="110" y="195" width="16" height="40" rx="6" fill="#0f172a" stroke="#00f2fe" strokeWidth="1.5" />
          <rect x="274" y="195" width="16" height="40" rx="6" fill="#0f172a" stroke="#00f2fe" strokeWidth="1.5" />

          {/* Forehead Embossed 'M' Crest */}
          <path d="M165 142 L180 180 L200 156 L220 180 L235 142 L225 142 L215 168 L200 148 L185 168 L175 142 Z" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />

          {/* Cyber Beard and Braided Plating */}
          <g fill="#475569" stroke="#1e293b" strokeWidth="1.5">
            <path d="M140 250 C140 310 170 345 200 365 C230 345 260 310 260 250 C240 265 220 270 200 270 C180 270 160 265 140 250 Z" fill="#334155" />
            <path d="M160 265 C175 300 185 330 200 355 C215 330 225 300 240 265" stroke="#94a3b8" strokeWidth="2" />
            <path d="M180 272 C190 295 195 320 200 345 C205 320 210 295 220 272" stroke="#cbd5e1" strokeWidth="2" />
          </g>

          {/* Nose & Mouth Plates */}
          <path d="M192 185 L200 182 L208 185 L205 220 L195 220 Z" fill="#64748b" />
          <path d="M185 240 Q200 246 215 240" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

          {/* RIGHT EYE: Clockwork Key Mechanism */}
          <g transform="translate(142, 190)">
            <rect x="0" y="0" width="42" height="26" rx="13" fill="#090d16" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="21" cy="13" r="9" stroke="#eab308" strokeWidth="2" strokeDasharray="2 2" />
            {/* Key Graphic inside Eye */}
            <path d="M14 13 H28 M25 13 V17 M28 13 V16" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="13" r="3" stroke="#fef08a" strokeWidth="1.5" />
          </g>

          {/* LEFT EYE: Solana Glowing Pupil */}
          <g transform="translate(216, 190)">
            <rect x="0" y="0" width="42" height="26" rx="13" fill="#090d16" stroke="#00ffa3" strokeWidth="2" filter="url(#glow-filter)" />
            {/* Solana 3 Bars Logo */}
            <path d="M12 8 L28 8 L30 11 L14 11 Z" fill="url(#solana-glow)" />
            <path d="M14 12 L30 12 L28 15 L12 15 Z" fill="url(#solana-glow)" />
            <path d="M12 16 L28 16 L30 19 L14 19 Z" fill="url(#solana-glow)" />
          </g>

          {/* ROYAL GOLDEN CROWN WITH BLUE SAPPHIRES */}
          <g transform="translate(85, 30)">
            {/* Crown Base Band */}
            <path d="M25 105 Q115 118 205 105 L215 90 Q115 102 15 90 Z" fill="url(#ck-gold)" stroke="#78350f" strokeWidth="2" />
            {/* Crown Spikes & Fleur-de-lis */}
            <path d="M15 90 L25 45 L55 75 L115 18 L175 75 L205 45 L215 90 Z" fill="url(#ck-gold)" stroke="#ca8a04" strokeWidth="2.5" />
            {/* Center Royal Cross / Finial with Sapphire */}
            <circle cx="115" cy="18" r="14" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="2.5" filter="url(#glow-filter)" />
            {/* Side Sapphires */}
            <circle cx="25" cy="45" r="8" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="205" cy="45" r="8" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="65" cy="98" r="7" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="115" cy="102" r="9" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="2" />
            <circle cx="165" cy="98" r="7" fill="url(#sapphire-gem)" stroke="#fef08a" strokeWidth="1.5" />
          </g>

          {/* Solana Crown Glow Aura */}
          {showCrownGlow && (
            <circle cx="200" cy="50" r="45" fill="#00ffa3" fillOpacity="0.15" filter="url(#glow-filter)" />
          )}
        </svg>
      )}

      {/* 2. SOLANA NEON GRAIL (Matrix King with Neon Circuits) */}
      {theme === 'neon-grail' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ng-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#041a1a" />
              <stop offset="60%" stopColor="#022c22" />
              <stop offset="100%" stopColor="#06121e" />
            </linearGradient>
            <linearGradient id="neon-cyan" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="solana-p" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#ng-bg)" />

          {/* Floating Solana Coins in Cyberspace */}
          <g opacity="0.35">
            <circle cx="60" cy="90" r="18" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M52 86 H68 M50 90 H66 M52 94 H68" stroke="#22d3ee" strokeWidth="2" />
            <circle cx="340" cy="110" r="22" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M330 106 H350 M328 110 H348 M330 114 H350" stroke="#00ffa3" strokeWidth="2" />
            <circle cx="70" cy="320" r="24" stroke="#00ffa3" strokeWidth="2" />
            <circle cx="330" cy="310" r="20" stroke="#06b6d4" strokeWidth="2" />
          </g>

          {/* Circuit Traces */}
          <path d="M40 200 H110 L140 230 M360 200 H290 L260 230 M200 40 V100" stroke="#10b981" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="140" cy="230" r="4" fill="#00ffa3" filter="url(#neon-glow)" />
          <circle cx="260" cy="230" r="4" fill="#22d3ee" filter="url(#neon-glow)" />

          {/* Cyber King Head in Cyan Chrome */}
          <path d="M130 150 C130 100 165 95 200 95 C235 95 270 100 270 150 V240 C270 295 235 340 200 345 C165 340 130 295 130 240 Z" fill="#0f2b2b" stroke="#10b981" strokeWidth="3" />
          <path d="M150 240 C150 310 175 345 200 365 C225 345 250 310 250 240 Z" fill="#091e1e" stroke="#22d3ee" strokeWidth="2" />

          {/* Forehead Stylized M */}
          <path d="M170 145 L185 180 L200 160 L215 180 L230 145" stroke="#00ffa3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neon-glow)" />

          {/* Eyes: Double Solana & Key Lasers */}
          <g transform="translate(145, 195)">
            <rect width="40" height="24" rx="12" fill="#031616" stroke="#22d3ee" strokeWidth="2" />
            <circle cx="20" cy="12" r="6" fill="#00ffa3" filter="url(#neon-glow)" />
            <path d="M15 12 H25 M22 12 V15" stroke="#031616" strokeWidth="1.5" />
          </g>
          <g transform="translate(215, 195)">
            <rect width="40" height="24" rx="12" fill="#031616" stroke="#a855f7" strokeWidth="2" />
            <path d="M10 8 L30 8 M12 12 L28 12 M10 16 L30 16" stroke="#c084fc" strokeWidth="2" filter="url(#neon-glow)" />
          </g>

          {/* Neon Emerald Crown */}
          <g transform="translate(90, 35)">
            <path d="M20 95 L30 45 L70 75 L110 20 L150 75 L190 45 L200 95 Z" fill="#042f2e" stroke="#10b981" strokeWidth="3" />
            <circle cx="110" cy="20" r="14" fill="#00ffa3" filter="url(#neon-glow)" />
            <circle cx="30" cy="45" r="8" fill="#22d3ee" filter="url(#neon-glow)" />
            <circle cx="190" cy="45" r="8" fill="#a855f7" filter="url(#neon-glow)" />
          </g>
        </svg>
      )}

      {/* 3. SHIELD GUARDIAN (Quantum Visor Mask with Key Crest) */}
      {theme === 'shield-guardian' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sg-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#0c1024" />
              <stop offset="50%" stopColor="#151b3b" />
              <stop offset="100%" stopColor="#090c1a" />
            </linearGradient>
            <linearGradient id="sg-shield" x1="120" y1="120" x2="280" y2="340">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="45%" stopColor="#94a3b8" />
              <stop offset="80%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="sg-key-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#sg-bg)" />

          {/* Matrix Circuit Background */}
          <path d="M50 80 V320 M350 80 V320 M100 40 V360 M300 40 V360" stroke="#3b82f6" strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="200" cy="200" r="160" stroke="#8b5cf6" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 6" />

          {/* Royal Key Crest At Top */}
          <g transform="translate(185, 25)">
            <circle cx="15" cy="15" r="13" stroke="url(#sg-key-gold)" strokeWidth="3" />
            <path d="M15 28 V65 M15 50 H24 M15 60 H22" stroke="url(#sg-key-gold)" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Guardian Crown Base */}
          <path d="M120 90 L160 65 L200 80 L240 65 L280 90 L270 115 H130 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />

          {/* SHIELD-MASK FACEPLATE */}
          <path d="M120 120 L200 95 L280 120 L275 240 C275 295 240 335 200 355 C160 335 125 295 125 240 Z" fill="url(#sg-shield)" stroke="#38bdf8" strokeWidth="3" />

          {/* Embossed 'M' on Upper Shield */}
          <path d="M165 140 L185 185 L200 165 L215 185 L235 140" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Shield Visor Slits / Eyes */}
          <g transform="translate(135, 195)">
            <polygon points="5,5 50,0 55,20 10,22" fill="#030712" stroke="#38bdf8" strokeWidth="2" />
            <path d="M18 10 H42 M20 13 H40" stroke="#22d3ee" strokeWidth="2" />
          </g>
          <g transform="translate(210, 195)">
            <polygon points="5,0 50,5 45,22 0,20" fill="#030712" stroke="#a855f7" strokeWidth="2" />
            <path d="M12 10 H36 M14 13 H34" stroke="#c084fc" strokeWidth="2" />
          </g>

          {/* Beard Grid & Micro-mesh */}
          <path d="M160 260 L200 295 L240 260 L200 340 Z" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="200" cy="305" r="4" fill="#38bdf8" />
        </svg>
      )}

      {/* 4. GOLDEN MIDAS (Pure Molten Gold with Fire Crown) */}
      {theme === 'golden-midas' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gm-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#1a0b02" />
              <stop offset="50%" stopColor="#2e1303" />
              <stop offset="100%" stopColor="#0d0400" />
            </linearGradient>
            <linearGradient id="gold-molten" x1="100" y1="100" x2="300" y2="350">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="fire-gradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <radialGradient id="fire-vortex" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="80%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#gm-bg)" />

          {/* Blazing Flame Fire Crown */}
          <g transform="translate(80, 20)">
            <path
              d="M20 110 C15 70 30 50 40 30 C50 65 65 50 85 10 C95 45 120 5 140 0 C155 35 180 30 195 20 C205 55 220 70 220 110 Z"
              fill="url(#fire-gradient)"
              opacity="0.95"
            />
            {/* Inner Gold Crown Band */}
            <path d="M25 110 L45 80 L85 95 L120 70 L155 95 L195 80 L215 110 Z" fill="url(#gold-molten)" stroke="#fef08a" strokeWidth="2" />
          </g>

          {/* Molten Golden Head */}
          <path d="M125 150 C125 105 160 95 200 95 C240 95 275 105 275 150 V240 C275 295 235 340 200 345 C165 340 125 295 125 240 Z" fill="url(#gold-molten)" stroke="#ca8a04" strokeWidth="2" />

          {/* Golden Embossed 'M' */}
          <path d="M170 145 L185 180 L200 162 L215 180 L230 145" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />

          {/* Molten Braided Gold Beard */}
          <path d="M145 250 C145 315 170 350 200 370 C230 350 255 315 255 250 Z" fill="#92400e" stroke="#facc15" strokeWidth="2" />
          <path d="M165 265 Q200 330 200 365 Q200 330 235 265" stroke="#fef08a" strokeWidth="2.5" />

          {/* RIGHT EYE: Blazing Swirling Fire Vortex */}
          <g transform="translate(145, 195)">
            <ellipse cx="20" cy="12" rx="18" ry="12" fill="url(#fire-vortex)" stroke="#fef08a" strokeWidth="2" />
            <path d="M14 12 A6 6 0 1 0 26 12 A4 4 0 1 0 18 12" stroke="#ffffff" strokeWidth="2" fill="none" />
          </g>

          {/* LEFT EYE: Golden Radiant Key Eye */}
          <g transform="translate(215, 195)">
            <ellipse cx="20" cy="12" rx="18" ry="12" fill="#451a03" stroke="#facc15" strokeWidth="2" />
            <circle cx="16" cy="12" r="5" stroke="#fef08a" strokeWidth="2" />
            <path d="M21 12 H28 M25 12 V15" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      )}

      {/* 5. FROST EMPEROR (Crystalline Ice Crown & Cold Cyan Lasers) */}
      {theme === 'frost-emperor' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fe-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#081528" />
              <stop offset="50%" stopColor="#0c2340" />
              <stop offset="100%" stopColor="#050d1a" />
            </linearGradient>
            <linearGradient id="ice-crown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#a5f3fc" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="frost-titanium" x1="120" y1="120" x2="280" y2="340">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#93c5fd" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#fe-bg)" />

          {/* Floating Ice Crystal Shards */}
          <polygon points="50,110 60,95 65,115" fill="#38bdf8" opacity="0.6" />
          <polygon points="340,130 355,110 350,140" fill="#a5f3fc" opacity="0.6" />
          <polygon points="75,280 85,260 90,290" fill="#e0f2fe" opacity="0.4" />
          <polygon points="325,310 340,290 335,320" fill="#38bdf8" opacity="0.5" />

          {/* Frozen Crystalline Crown */}
          <g transform="translate(85, 20)">
            <polygon points="15,100 25,40 55,75 85,25 115,0 145,25 175,75 205,40 215,100" fill="url(#ice-crown)" stroke="#ffffff" strokeWidth="2.5" />
            {/* Center Ice Crystal Gem */}
            <polygon points="115,10 130,45 115,75 100,45" fill="#ffffff" opacity="0.9" />
          </g>

          {/* Frost Cybernetic Head */}
          <path d="M125 150 C125 105 160 95 200 95 C240 95 275 105 275 150 V240 C275 295 235 340 200 345 C165 340 125 295 125 240 Z" fill="url(#frost-titanium)" stroke="#bae6fd" strokeWidth="2" />

          {/* Forehead M Emblem */}
          <path d="M170 145 L185 180 L200 162 L215 180 L230 145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />

          {/* Glacial Beard */}
          <path d="M145 250 C145 315 170 350 200 370 C230 350 255 315 255 250 Z" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />
          <path d="M170 265 L200 355 L230 265" stroke="#e0f2fe" strokeWidth="2" />

          {/* LEFT EYE: Glowing Glacial Cyan Solana Pupil */}
          <g transform="translate(145, 195)">
            <rect width="40" height="24" rx="12" fill="#031526" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="20" cy="12" r="7" fill="#67e8f9" />
            <path d="M14 10 L26 10 M15 12 L25 12 M14 14 L26 14" stroke="#042f2e" strokeWidth="1.5" />
          </g>

          {/* RIGHT EYE: Frost Key Glyph */}
          <g transform="translate(215, 195)">
            <rect width="40" height="24" rx="12" fill="#031526" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="16" cy="12" r="4" stroke="#67e8f9" strokeWidth="1.5" />
            <path d="M20 12 H27 M25 12 V15" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      )}

      {/* 6. PROTOCOL GUARDIAN SEC-07 (Steampunk Gearwork King) */}
      {theme === 'protocol-guardian' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pg-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#1c140d" />
              <stop offset="60%" stopColor="#2b1a0d" />
              <stop offset="100%" stopColor="#100b06" />
            </linearGradient>
            <linearGradient id="bronze" x1="120" y1="120" x2="280" y2="340">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#pg-bg)" />

          {/* Background Clockwork Gears */}
          <g stroke="#78350f" strokeWidth="3" opacity="0.4" fill="none">
            <circle cx="60" cy="120" r="35" strokeDasharray="6 4" />
            <circle cx="340" cy="140" r="40" strokeDasharray="8 4" />
            <circle cx="70" cy="310" r="45" strokeDasharray="8 6" />
            <circle cx="330" cy="300" r="30" strokeDasharray="6 4" />
          </g>

          {/* Steampunk Crown with Cogs */}
          <g transform="translate(85, 30)">
            <path d="M15 95 L30 50 L75 80 L115 25 L155 80 L200 50 L215 95 Z" fill="#78350f" stroke="#d97706" strokeWidth="3" />
            {/* Center Cog Crest */}
            <circle cx="115" cy="25" r="14" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
          </g>

          {/* Bronze Robotic Face */}
          <path d="M125 150 C125 105 160 95 200 95 C240 95 275 105 275 150 V240 C275 295 235 340 200 345 C165 340 125 295 125 240 Z" fill="url(#bronze)" stroke="#78350f" strokeWidth="2" />

          {/* Embossed 'M' Double Crest */}
          <path d="M170 145 L185 178 L200 162 L215 178 L230 145" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />

          {/* Mechanical Clockwork Monocle on Right Eye */}
          <g transform="translate(142, 195)">
            <circle cx="16" cy="12" r="15" fill="#1c140d" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="16" cy="12" r="8" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M16 4 V20 M8 12 H24" stroke="#fef08a" strokeWidth="1.5" />
          </g>
          {/* Cyber Eye on Left */}
          <g transform="translate(216, 195)">
            <rect width="40" height="24" rx="12" fill="#1c140d" stroke="#92400e" strokeWidth="2" />
            <circle cx="20" cy="12" r="6" fill="#38bdf8" />
          </g>

          {/* Steampunk Beard & Gears */}
          <path d="M145 250 C145 315 170 345 200 360 C230 345 255 315 255 250 Z" fill="#451a03" stroke="#92400e" strokeWidth="2" />

          {/* Plaque: MYSTERYUM PROTOCOL GUARDIAN - SEC 07 */}
          <rect x="70" y="365" width="260" height="22" rx="4" fill="#29180c" stroke="#d97706" strokeWidth="1.5" />
          <text x="200" y="380" textAnchor="middle" fill="#fef08a" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            GUARDIAN · SEC-07
          </text>
        </svg>
      )}

      {/* 7. DIAMOND ACE (High Roller with Golden Ace Card) */}
      {theme === 'diamond-ace' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="da-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="card-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#da-bg)" />

          {/* Star Sparkles in Background */}
          <g fill="#fef08a" opacity="0.6">
            <polygon points="50,60 53,68 61,71 53,74 50,82 47,74 39,71 47,68" />
            <polygon points="340,80 342,86 348,88 342,90 340,96 338,90 332,88 338,86" />
            <polygon points="80,330 82,336 88,338 82,340 80,346 78,340 72,338 78,336" />
          </g>

          {/* Man Portrait in Cap */}
          {/* Shoulders */}
          <path d="M100 395 C120 330 160 310 200 310 C240 310 280 330 300 395 Z" fill="#1f2937" stroke="#374151" strokeWidth="2" />

          {/* Face */}
          <path d="M150 170 C150 130 170 120 200 120 C230 120 250 130 250 170 V240 C250 280 230 300 200 300 C170 300 150 280 150 240 Z" fill="#d4a373" stroke="#b08968" strokeWidth="2" />

          {/* Beard & Mustache */}
          <path d="M160 220 C160 270 180 295 200 295 C220 295 240 270 240 220 C230 235 215 240 200 240 C185 240 170 235 160 220 Z" fill="#1e293b" />
          <path d="M185 225 Q200 230 215 225" stroke="#0f172a" strokeWidth="3" />

          {/* Eyes & Eyebrows */}
          <ellipse cx="180" cy="185" rx="10" ry="7" fill="#ffffff" />
          <circle cx="180" cy="185" r="4" fill="#78350f" />
          <path d="M170 175 Q180 172 192 176" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

          <ellipse cx="220" cy="185" rx="10" ry="7" fill="#ffffff" />
          <circle cx="220" cy="185" r="4" fill="#78350f" />
          <path d="M208 176 Q220 172 230 175" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Playing-Card Patterned Cap */}
          <g transform="translate(130, 80)">
            {/* Cap Dome */}
            <path d="M20 75 C20 20 50 10 70 10 C90 10 120 20 120 75 Z" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
            {/* Card Suits on Cap */}
            <path d="M45 40 L49 33 L53 40 L49 47 Z" fill="#dc2626" />
            <path d="M95 38 L99 31 L103 38 L99 45 Z" fill="#dc2626" />
            <path d="M70 25 C68 22 64 24 65 27 C66 30 70 33 70 33 C70 33 74 30 75 27 C76 24 72 22 70 25 Z" fill="#dc2626" />
            {/* Cap Visor / Bill */}
            <path d="M10 75 Q70 65 130 75 L145 92 Q70 80 -5 92 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          </g>

          {/* GOLDEN ACE OF DIAMONDS IN HAND */}
          <g transform="translate(65, 200) rotate(-8)">
            {/* Card Body */}
            <rect width="105" height="155" rx="10" fill="url(#card-gold)" stroke="#fef08a" strokeWidth="3" />
            {/* Top 'A' and diamond */}
            <text x="14" y="26" fill="#78350f" fontSize="18" fontFamily="serif" fontWeight="bold">A</text>
            <polygon points="14,35 18,29 22,35 18,41" fill="#dc2626" />

            {/* Huge Center Inset Diamond */}
            <polygon points="52,50 82,78 52,106 22,78" fill="#ffffff" stroke="#78350f" strokeWidth="2.5" />
            <polygon points="52,60 72,78 52,96 32,78" fill="#e0f2fe" opacity="0.8" />
            {/* Sparkle Rays */}
            <line x1="18" y1="44" x2="10" y2="36" stroke="#fef08a" strokeWidth="2" />
            <line x1="86" y1="44" x2="94" y2="36" stroke="#fef08a" strokeWidth="2" />

            {/* Bottom Inverted 'A' */}
            <text x="90" y="145" fill="#78350f" fontSize="18" fontFamily="serif" fontWeight="bold" textAnchor="end">A</text>
          </g>
        </svg>
      )}

      {/* 8. SHADOW SPADE ACE (Stealth Split Red & Black Pop Art) */}
      {theme === 'shadow-spade' && (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ss-bg" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="100%" stopColor="#1f1116" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" rx="32" fill="url(#ss-bg)" />

          {/* Giant Ace of Spades in Background */}
          <g transform="translate(200, 240)">
            {/* Spade Left (Black) */}
            <path d="M0 -150 C-45 -110 -130 -40 -130 30 C-130 90 -80 120 -30 110 C-15 105 0 95 0 95 L-20 145 H0 Z" fill="#0f172a" />
            {/* Spade Right (Red) */}
            <path d="M0 -150 C45 -110 130 -40 130 30 C130 90 80 120 30 110 C15 105 0 95 0 95 L20 145 H0 Z" fill="#dc2626" />
          </g>

          {/* Split Face Portrait */}
          <g transform="translate(130, 90)">
            {/* Cap Crown */}
            <path d="M10 70 C10 20 40 10 70 10 V70 Z" fill="#334155" />
            <path d="M70 10 C100 10 130 20 130 70 H70 Z" fill="#991b1b" />
            {/* Cap Visor */}
            <path d="M-5 85 Q70 70 70 70 V85 Z" fill="#0f172a" />
            <path d="M70 70 Q70 70 145 85 H70 Z" fill="#7f1d1d" />

            {/* Left Face Half (Monochrome) */}
            <path d="M25 80 C25 150 45 200 70 215 V80 Z" fill="#e2e8f0" />
            {/* Right Face Half (Crimson) */}
            <path d="M115 80 C115 150 95 200 70 215 V80 Z" fill="#ef4444" />

            {/* Left Beard & Eye */}
            <path d="M25 130 C25 180 50 215 70 215 V175 C55 175 40 160 35 140 Z" fill="#0f172a" />
            <ellipse cx="50" cy="115" rx="8" ry="5" fill="#0f172a" />

            {/* Right Beard & Eye */}
            <path d="M115 130 C115 180 90 215 70 215 V175 C85 175 100 160 105 140 Z" fill="#450a0a" />
            <ellipse cx="90" cy="115" rx="8" ry="5" fill="#450a0a" />
          </g>
        </svg>
      )}
    </div>
  );
};
