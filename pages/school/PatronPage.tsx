import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface PatronContentItem {
  id: number;
  section_key: string;
  title?: string;
  content?: string;
  image_url?: string;
  position: number;
}

const PatronPage: React.FC = () => {
  const { t, locale } = useLanguage();
  const [patronContent, setPatronContent] = useState<PatronContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatronContent();
  }, [locale]);

  const loadPatronContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPatronContent(locale);
      setPatronContent(response.content);
    } catch (err) {
      console.error('Failed to load patron content:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load patron content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getContentByKey = (key: string) => {
    return patronContent.find(item => item.section_key === key);
  };

  if (isLoading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading patron content...</span>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Error">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Content</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadPatronContent}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </PageWrapper>
    );
  }

  const quoteContent = getContentByKey('quote');
  const legacyTitleContent = getContentByKey('legacy_title');
  const legacyContent = getContentByKey('legacy_content');
  const imageContent = getContentByKey('image_main');
  const imageCaptionContent = getContentByKey('image_caption');

  return (
    <PageWrapper title={t.patronPage.title}>
      <div className="space-y-6">
        {/* Hero Quote */}
        {quoteContent && (
          <div className="text-center bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <blockquote className="text-xl font-semibold text-blue-900 italic">
              {quoteContent.content}
            </blockquote>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:w-2/3 space-y-6">
            {/* Biography paragraphs */}
            {['biography_p1', 'biography_p2', 'biography_p3', 'biography_p4', 'biography_p5'].map(key => {
              const content = getContentByKey(key);
              if (!content) return null;
              
              return (
                <div key={key}>
                  {content.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
                  )}
                  <p className="text-lg leading-relaxed text-gray-700">{content.content}</p>
                </div>
              );
            })}
            
            {/* Legacy section */}
            {(legacyTitleContent || legacyContent) && (
              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                {legacyTitleContent && (
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {legacyTitleContent.content}
                  </h2>
                )}
                {legacyContent && (
                  <p className="text-gray-700">{legacyContent.content}</p>
                )}
              </div>
            )}
          </div>

          {/* Image sidebar */}
          {imageContent && (
            <div className="lg:w-1/3">
              <figure className="sticky top-8">
                <img 
                  src={imageContent.image_url || 'https://picsum.photos/400/500?random=11'}
                  alt={imageCaptionContent?.content || t.patronPage.imageAlt}
                  className="w-full h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/400/500?random=11';
                  }}
                />
                {imageCaptionContent && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2">
                    {imageCaptionContent.content}
                  </figcaption>
                )}
              </figure>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default PatronPage;