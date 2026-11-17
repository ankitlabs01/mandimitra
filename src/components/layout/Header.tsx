'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { NotificationDropdown } from './NotificationDropdown';
import { Mic, MicOff, Sprout, Shield, User, Menu, Database } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { Badge } from '@/components/common/Badge';
import { isSupabaseConfigured } from '@/lib/supabase';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenVoiceModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenVoiceModal,
  onOpenAuthModal,
}) => {
  const { user, role, switchRole, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isListening, isSpeaking } = useVoice();

  const roleColors: Record<UserRole, { badge: 'green' | 'blue' | 'purple' | 'amber'; label: string }> = {
    farmer: { badge: 'green', label: 'Farmer (किसान)' },
    buyer: { badge: 'blue', label: 'Buyer / Trader' },
    fpo: { badge: 'purple', label: 'FPO Coordinator' },
    admin: { badge: 'amber', label: 'Administrator' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile menu button & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-mandi-dark hover:bg-emerald-50 rounded-xl lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 select-none cursor-pointer">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-mandi-dark via-mandi-medium to-mandi-leaf flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-mandi-dark font-sans">
                  MANDI MITRA
                </span>
                <span className="text-xs font-black bg-mandi-leaf/20 text-mandi-dark px-1.5 py-0.5 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium hidden sm:block">
                Smart Decisions. Better Farming.
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase Connection Status Pill */}
          <button
            onClick={onOpenAuthModal}
            className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
            title="Supabase Database Connection Status"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-600'}`} />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Connect DB'}</span>
          </button>

          {/* Persona Role Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200/80 rounded-xl p-1 text-xs">
            <span className="text-[11px] font-semibold text-gray-500 px-2 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-700" /> Persona:
            </span>
            {(['farmer', 'buyer', 'fpo', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all capitalize ${
                  role === r
                    ? 'bg-mandi-dark text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Voice Assistant Pill Button */}
          <button
            onClick={onOpenVoiceModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
              isListening || isSpeaking
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-300'
            }`}
            title="Voice Assistant (12 Indian Languages)"
          >
            {isListening ? (
              <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
            ) : (
              <Mic className="w-4 h-4 text-emerald-700" />
            )}
            <span className="hidden sm:inline" suppressHydrationWarning>
              {isListening ? t('listening') : t('voiceAssistant')}
            </span>
          </button>

          {/* Multilingual Selector */}
          <LanguageSelector compact />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile / Auth Pill */}
          <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
            {isAuthenticated && user ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs" suppressHydrationWarning>
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]" suppressHydrationWarning>
                    {user.name.split(' ')[0]}
                  </p>
                  <Badge variant={roleColors[role].badge} size="sm">
                    {role}
                  </Badge>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-mandi-dark text-white rounded-xl text-xs font-semibold hover:bg-mandi-medium transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
