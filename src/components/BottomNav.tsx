import React from 'react';
import {
  Wallet,
  ArrowLeftRight,
  Bot,
  MessageSquare,
  Compass,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { LanguageCode } from '../types/wallet';
import { TRANSLATIONS } from '../utils/i18n';

export type ActiveTab = 'portfolio' | 'swap' | 'aiAgent' | 'chat' | 'explore' | 'settings' | 'support';

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
    { id: 'swap', label: t.swap, icon: ArrowLeftRight },
    { id: 'aiAgent', label: t.aiAgent, icon: Bot },
    { id: 'chat', label: t.chat, icon: MessageSquare },
    { id: 'explore', label: t.explore, icon: Compass },
    { id: 'settings', label: t.settings, icon: Settings },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0d14]/95 backdrop-blur-xl px-2 py-2"
      aria-label="Wallet workspace"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around gap-1 sm:max-w-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 transition-all text-xs font-medium cursor-pointer ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span className="mt-1 text-[11px] leading-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
