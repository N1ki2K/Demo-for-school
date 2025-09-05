import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { apiService, ApiError } from '../src/services/api';

interface UsefulLink {
  id: number;
  link_key: string;
  title: string;
  description?: string;
  url: string;
  cta?: string;
  position: number;
}

interface UsefulLinksContent {
  id: number;
  section_key: string;
  title?: string;
  content?: string;
  position: number;
}

const LinkCard: React.FC<{ 
  title: string; 
  url: string; 
  description?: string; 
  cta?: string;
  defaultCta: string;
}> = ({ title, url, description, cta, defaultCta }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-brand-gold transition-all duration-300 group">
        <h3 className="text-xl font-bold text-brand-blue mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-3">{description}</p>
        )}
        <span className="text-brand-blue-light font-semibold group-hover:text-brand-gold transition-colors">
          {cta || defaultCta} &rarr;
        </span>
    </a>
)

const UsefulLinksPage: React.FC = () => {
  const { t, getTranslation, locale } = useLanguage();
  const navigate = useNavigate();
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [content, setContent] = useState<UsefulLinksContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsefulLinksContent();
  }, [locale, navigate]);

  const loadUsefulLinksContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUsefulLinksContent(locale);
      setLinks(response.links);
      setContent(response.content);
    } catch (err) {
      console.error('Failed to load useful links content:', err);
      
      // Check if this is a backend connection error
      if (err instanceof ApiError && err.status === 0) {
        console.log('Backend connection error detected, redirecting to 404');
        navigate('/404', { replace: true });
        return;
      }
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.usefulLinksPage.failedToLoad);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getContentByKey = (key: string) => {
    return content.find(item => item.section_key === key);
  };

  if (isLoading) {
    return (
      <PageWrapper title={getTranslation('usefulLinksPage.loadingTitle', 'Зареждане...')}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{getTranslation('usefulLinksPage.loading', 'Зарежда...')}</span>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title={getTranslation('usefulLinksPage.errorTitle', 'Грешка')}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">{getTranslation('usefulLinksPage.error', 'Грешка')}</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadUsefulLinksContent}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {getTranslation('usefulLinksPage.tryAgain', 'Опитай отново')}
          </button>
        </div>
      </PageWrapper>
    );
  }

  const introContent = getContentByKey('intro');

  return (
    <PageWrapper title={getTranslation('usefulLinksPage.title', 'Полезни връзки')}>
      {introContent && (
        <p className="mb-12 text-lg leading-relaxed text-gray-700">
          {introContent.content}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map(link => (
          <LinkCard 
            key={link.id} 
            title={link.title}
            url={link.url}
            description={link.description}
            cta={link.cta}
            defaultCta={getTranslation('usefulLinksPage.defaultCta', 'Прочети повече')}
          />
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{getTranslation('usefulLinksPage.noLinks', 'Няма връзки')}</p>
          <button
            onClick={loadUsefulLinksContent}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {getTranslation('usefulLinksPage.refresh', 'Опресни')}
          </button>
        </div>
      )}
    </PageWrapper>
  );
};

export default UsefulLinksPage;