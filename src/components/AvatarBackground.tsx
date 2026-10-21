import React from 'react';
import { AvatarTheme } from '../types/wallet';
import { AvatarArtwork } from './AvatarArtwork';

interface AvatarBackgroundProps {
  theme?: AvatarTheme;
  opacity?: number;
  position?: 'top-right' | 'center' | 'bottom-left' | 'top-left' | 'bottom-right';
  className?: string;
}

export const AvatarBackground: React.FC<AvatarBackgroundProps> = ({
  theme = 'cyber-king',
  opacity = 0.06,
  position = 'top-right',
  className = '',
}) => {
  const positionClasses = {
    'top-right': 'top-2 right-2 sm:right-6',
    'top-left': 'top-2 left-2 sm:left-6',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-16 right-4 sm:right-10',
    'bottom-left': 'bottom-16 left-4 sm:left-10',
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      {/* Dynamic Cybernetic Glow Orb */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[110px] transition-all duration-1000 ease-in-out"
        style={{
          top: position.includes('top') ? '-10%' : '50%',
          right: position.includes('right') ? '-10%' : 'auto',
          left: position.includes('left') ? '-10%' : 'auto',
          background:
            theme === 'cyber-king'
              ? 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)'
              : theme === 'golden-midas'
              ? 'radial-gradient(circle, rgba(234,179,8,0.2) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)'
              : theme === 'frost-emperor'
              ? 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(147,197,253,0.08) 50%, transparent 70%)'
              : theme === 'neon-grail'
              ? 'radial-gradient(circle, rgba(244,63,94,0.2) 0%, rgba(249,115,22,0.08) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)',
        }}
      />

      {/* Holographic Watermark Avatar Art */}
      <div
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 transform transition-all duration-700 ease-out ${positionClasses}`}
        style={{ opacity }}
      >
        <div className="relative w-full h-full filter saturate-150 contrast-125">
          <AvatarArtwork
            theme={theme}
            size="100%"
            showCrownGlow={false}
            className="w-full h-full"
          />
        </div>

        {/* Cyber Hologram scanline & circuit ring overlay */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 scale-110 animate-pulse pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 scale-125 pointer-events-none" />
      </div>
    </div>
  );
};
