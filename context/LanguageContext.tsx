
import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useTranslationsSimple } from '../hooks/useTranslationsSimple';

type Locale = 'bg' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: any;
  flatTranslations: { [key: string]: string };
  loading: boolean;
  error: string | null;
  refreshTranslations: (lang?: string) => Promise<void>;
  getTranslation: (keyPath: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useLocalStorageState<Locale>('language', {
    defaultValue: 'bg',
  });

  const { 
    translations, 
    flatTranslations, 
    loading, 
    error, 
    t: getTranslation, 
    refreshTranslations 
  } = useTranslationsSimple(locale);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations,
    flatTranslations,
    loading,
    error,
    refreshTranslations,
    getTranslation,
  }), [locale, translations, flatTranslations, loading, error, getTranslation]);

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
