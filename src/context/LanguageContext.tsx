'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '@/lib/types';
import { translations, SUPPORTED_LANGUAGES, LanguageMeta } from '@/lib/translations';
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const DEFAULT_LANGUAGE: SupportedLanguage = 'hi';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Consistent static default language for identical server and client initial render
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 2. Load user's saved language preference ONLY after component mounting
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = getStorageItem<SupportedLanguage>('language', DEFAULT_LANGUAGE);
      const isValid = SUPPORTED_LANGUAGES.some((l) => l.code === saved);
      if (isValid && saved !== DEFAULT_LANGUAGE) {
        setLanguageState(saved);
      }
    } catch (err) {
      console.warn('Error restoring saved language preference:', err);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setStorageItem('language', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key]) return langDict[key];
    return (translations.en && translations.en[key]) || key;
  };

  const currentLanguageMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
        isMounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
