
import React, { createContext, useState, useContext, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { bg } from '../locales/bg';
import { en } from '../locales/en';

type Locale = 'bg' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof bg;
}

const translations = { bg, en };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useLocalStorageState<Locale>('language', {
    defaultValue: 'bg',
  });

  const t = useMemo(() => translations[locale], [locale]);

  const value = {
    locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
