import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../src/services/api';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  publishedDate: string;
  isPublished: boolean;
  isFeatured: boolean;
}

const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, getTranslation, language } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setError('No article ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const articleData = await apiService.getNewsArticle(id, language);
        setArticle(articleData);
        setError(null);
      } catch (error) {
        console.error('Error loading news article:', error);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getTranslation('common.error', 'Грешка')}</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            {getTranslation('common.goHome', 'Начало')}
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getTranslation('common.notFound', 'Не е намерено')}</h1>
          <p className="text-gray-600 mb-6">The requested article was not found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            {getTranslation('common.goHome', 'Начало')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-brand-blue hover:text-brand-blue-dark transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {getTranslation('common.back', 'Назад')}
        </button>

        {/* Article content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Featured image */}
          {article.featuredImage && (
            <div className="w-full h-64 sm:h-80 md:h-96">
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-12">
            {/* Article header */}
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <time dateTime={article.publishedDate}>
                  {new Date(article.publishedDate).toLocaleDateString(
                    language === 'bg' ? 'bg-BG' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  )}
                </time>
                {article.isFeatured && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-brand-gold text-brand-blue-dark px-2 py-1 rounded text-xs font-semibold">
                      {getTranslation('news.featured', 'Препоръчано')}
                    </span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-blue leading-tight mb-6">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </header>

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: article.content?.replace(/\n/g, '<br>') || ''
                }}
              />
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-brand-blue text-white px-8 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors font-semibold"
          >
            {getTranslation('common.backToHome', 'Към началото')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticlePage;