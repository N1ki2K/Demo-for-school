
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-white animate-fade-in">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand-blue">404</h1>
        <p className="text-2xl md:text-3xl font-light text-gray-600 mt-4">{t.notFoundPage.title}</p>
        <p className="mt-4 text-gray-500">{t.notFoundPage.message}</p>
        <div className="mt-8">
          <Link to="/" className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-md hover:bg-brand-blue-light transition-colors">
            {t.notFoundPage.homeButton}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
