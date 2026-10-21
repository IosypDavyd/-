import React from 'react';
import {
  Wallet,
  ArrowLeftRight,
  Bot,
  MessageSquare,
  Compass,
  Settings,
  LifeBuoy,
  Sparkles,
  Globe,
} from 'lucide-react';
import { LanguageCode } from '../types/wallet';
import { TRANSLATIONS } from '../utils/i18n';

export type ActiveTab =
  | 'portfolio'
  | 'gallery'
  | 'swap'
  | 'chat'
  | 'explore'
  | 'portal'
  | 'settings'
  | 'support';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  language: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'portfolio', label: t.portfolio, icon: Wallet },
    { id: 'gallery', label: t.gallery || '25¢ NFT', icon: Sparkles },
    { id: 'swap', label: t.swap, icon: ArrowLeftRight },
    { id: 'chat', label: language === 'uk' ? 'ШІ & Чат' : 'AI & Chat', icon: MessageSquare },
    { id: 'explore', label: language === 'uk' ? 'Веб-3 & DEX' : 'Web-3 Hub', icon: Compass },
    { id: 'portal', label: language === 'uk' ? 'Портал' : 'Portal', icon: Globe },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0d14]/95 backdrop-blur-xl px-2 py-2"
      aria-label="Wallet workspace"
    >
      <div className="mx-auto flex max-w-xl items-center justify-around gap-1 sm:max-w-3xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-all text-xs font-medium cursor-pointer ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span className="mt-1 text-[10px] leading-tight truncate max-w-[62px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
