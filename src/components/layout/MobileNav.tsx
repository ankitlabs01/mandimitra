'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  Inbox,
  Mic,
} from 'lucide-react';
import clsx from 'clsx';

interface MobileNavProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  onOpenVoice: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentModule,
  onSelectModule,
  onOpenVoice,
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'marketPrices', labelKey: 'marketPrices', icon: TrendingUp },
    { id: 'sellNowVsWait', labelKey: 'sellNowVsWait', icon: Scale, highlight: true },
    { id: 'buyerOffers', labelKey: 'buyerOffers', icon: Inbox },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-40 lg:hidden px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all',
                isActive ? 'text-mandi-dark font-bold' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-mandi-dark stroke-[2.5]')} />
              <span className="text-[10px] mt-0.5 max-w-[65px] truncate">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}

        {/* Center Prominent Sell Now vs Wait Action */}
        <button
          onClick={() => onSelectModule('sellNowVsWait')}
          className="relative -top-4 flex flex-col items-center justify-center group"
          aria-label="Sell Now vs Wait AI Engine"
        >
          <div className="w-13 h-13 p-3 bg-gradient-to-tr from-mandi-dark to-mandi-leaf rounded-full shadow-lg shadow-emerald-900/30 text-white flex items-center justify-center transform active:scale-95 transition-transform border-4 border-white">
            <Scale className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-mandi-dark mt-0.5">
            AI Sell/Wait
          </span>
        </button>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all',
                isActive ? 'text-mandi-dark font-bold' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-mandi-dark stroke-[2.5]')} />
              <span className="text-[10px] mt-0.5 max-w-[65px] truncate">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}

        {/* Voice Quick Action */}
        <button
          onClick={onOpenVoice}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-800 hover:text-emerald-950"
          aria-label="Voice Assistant"
        >
          <div className="p-1 rounded-full bg-emerald-100">
            <Mic className="w-4 h-4 text-emerald-800" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold">
            Voice
          </span>
        </button>
      </div>
    </nav>
  );
};
