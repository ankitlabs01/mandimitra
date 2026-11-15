'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-emerald-700 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className={`appearance-none bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-950 font-medium rounded-xl border border-emerald-200/80 pl-8 pr-7 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all ${
          compact ? 'py-1 pl-7 pr-6 text-xs' : ''
        }`}
        aria-label="Select language"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName} ({l.name})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-emerald-800 text-xs">
        ▼
      </div>
    </div>
  );
};
