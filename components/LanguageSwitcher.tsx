
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isMobile?: boolean;
}

const LanguageSwitcher: React.FC<Props> = ({ isMobile = false }) => {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (lang: 'bg' | 'en') => {
    setLocale(lang);
  };

  if (isMobile) {
      return (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handleLanguageChange('bg')}
            className={`px-6 py-2 text-base font-bold rounded-md transition-colors duration-300 ${
              locale === 'bg' ? 'bg-brand-gold text-brand-blue-dark' : 'bg-brand-blue-light text-white'
            }`}
            aria-label="Смени на български"
          >
            БГ
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-6 py-2 text-base font-bold rounded-md transition-colors duration-300 ${
              locale === 'en' ? 'bg-brand-gold text-brand-blue-dark' : 'bg-brand-blue-light text-white'
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
        </div>
      );
  }

  return (
    <div className="flex items-center space-x-2 bg-brand-blue-light p-1 rounded-full">
      <button
        onClick={() => handleLanguageChange('bg')}
        className={`px-3 py-1 text-sm font-bold rounded-full transition-colors duration-300 ${
          locale === 'bg' ? 'bg-brand-gold text-brand-blue-dark' : 'text-white hover:bg-brand-blue'
        }`}
        aria-label="Смени на български"
      >
        БГ
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-bold rounded-full transition-colors duration-300 ${
          locale === 'en' ? 'bg-brand-gold text-brand-blue-dark' : 'text-white hover:bg-brand-blue'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
