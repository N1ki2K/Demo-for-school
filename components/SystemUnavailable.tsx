import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SystemUnavailableProps {
  onRetry: () => void;
  isRetrying?: boolean;
  error?: string;
}

const SystemUnavailable: React.FC<SystemUnavailableProps> = ({ 
  onRetry, 
  isRetrying = false,
  error 
}) => {
  const { t, getTranslation } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-blue font-bold text-lg">📚</span>
              </div>
              <h1 className="text-xl font-bold">
                {getTranslation('header.title', 'Kolyo Ganchev Elementary School')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              {getTranslation('systemError.title', 'Error Loading Content')}
            </h2>
            
            <p className="text-red-700 mb-4 text-lg">
              {getTranslation('systemError.message', 'Unable to connect to server. Please check if the backend is running.')}
            </p>

            {error && (
              <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
                <p className="text-sm text-red-600 font-mono">{error}</p>
              </div>
            )}

            <button
              onClick={onRetry}
              disabled={isRetrying}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isRetrying
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isRetrying ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{getTranslation('systemError.retrying', 'Retrying...')}</span>
                </div>
              ) : (
                getTranslation('systemError.tryAgain', 'Try Again')
              )}
            </button>
          </div>

          {/* Help Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              {getTranslation('systemError.helpTitle', 'What can you do?')}
            </h3>
            
            <ul className="text-left text-blue-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{getTranslation('systemError.help1', 'Check your internet connection')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{getTranslation('systemError.help2', 'Try refreshing the page')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{getTranslation('systemError.help3', 'Contact the website administrator if the problem persists')}</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-gold mb-4">
                {getTranslation('footer.schoolName', 'Kolyo Ganchev Elementary School')}
              </h3>
              <p className="text-blue-100">
                {getTranslation('footer.motto', 'Education with care for the future.')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brand-gold mb-3">
                {getTranslation('footer.contacts.title', 'Contacts')}
              </h4>
              <div className="text-blue-100 space-y-1">
                <p>
                  <span className="font-medium">{getTranslation('footer.contacts.addressLabel', 'Address')}:</span>
                  <br />Stara Zagora, Kazanski District
                  <br />15 Dobrudzha St.
                </p>
                <p>
                  <span className="font-medium">{getTranslation('footer.contacts.phoneLabel', 'Phone')}:</span> +359 42 123 456
                </p>
                <p>
                  <span className="font-medium">{getTranslation('footer.contacts.emailLabel', 'Email')}:</span> info-2400124@edu.mon.bg
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-brand-gold mb-3">
                {getTranslation('footer.quickLinks.title', 'Quick Links')}
              </h4>
              <div className="text-blue-100 space-y-1">
                <p>{getTranslation('footer.quickLinks.contacts', 'Contacts')}</p>
                <p>{getTranslation('footer.quickLinks.admissions', 'Admissions')}</p>
                <p>{getTranslation('footer.quickLinks.usefulLinks', 'Useful Links')}</p>
                <p>{getTranslation('footer.quickLinks.gallery', 'Gallery')}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-600 pt-6 mt-8 text-center text-blue-100">
            <p>{getTranslation('footer.copyright', 'All rights reserved.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SystemUnavailable;