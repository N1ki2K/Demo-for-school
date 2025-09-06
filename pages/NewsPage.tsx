import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../src/services/api';
import PageWrapper from '../components/PageWrapper';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  published_date: string;
  is_published: boolean;
  is_featured: boolean;
}

const NewsPage: React.FC = () => {
  const { getTranslation, locale } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load both regular news and featured news
        const [newsData, featuredData] = await Promise.all([
          apiService.getNews(locale, true), // publishedOnly = true
          apiService.getFeaturedNews(locale, 3) // limit to 3 featured articles
        ]);
        
        setArticles(newsData);
        setFeaturedArticles(featuredData);
      } catch (error) {
        console.error('Error loading news:', error);
        setError(getTranslation('news.loadError', 'Failed to load news articles'));
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [locale, getTranslation]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'bg' ? 'bg-BG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  };

  if (isLoading) {
    return (
      <PageWrapper title={getTranslation('news.title', 'News')}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">{getTranslation('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title={getTranslation('news.title', 'News')}>
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {getTranslation('common.error', 'Error')}
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={getTranslation('news.title', 'News')}>
      <div className="space-y-12">
        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <section>
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-brand-blue-dark">
                {getTranslation('news.featured', 'Featured News')}
              </h2>
              <div className="ml-3 h-px bg-brand-gold flex-1"></div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {article.featured_image_url && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-brand-gold text-brand-blue-dark px-2 py-1 rounded text-xs font-semibold">
                        {getTranslation('news.featured', 'Featured')}
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {formatDate(article.published_date)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-blue transition-colors mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="mt-4 flex items-center text-brand-blue text-sm font-medium group-hover:text-brand-blue-dark">
                      {getTranslation('news.readMore', 'Read more')}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section>
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-blue-dark">
              {featuredArticles.length > 0 
                ? getTranslation('news.allNews', 'All News') 
                : getTranslation('news.title', 'News')
              }
            </h2>
            <div className="ml-3 h-px bg-brand-gold flex-1"></div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 011 2v1m2 13a2 2 0 01-2-2V7m2 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {getTranslation('news.noArticles', 'No news articles')}
              </h3>
              <p className="text-gray-600">
                {getTranslation('news.checkBackSoon', 'Check back soon for the latest news and updates.')}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="md:flex">
                    {article.featured_image_url && (
                      <div className="md:w-1/3">
                        <div className="h-48 md:h-full w-full overflow-hidden">
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className={`p-6 ${article.featured_image_url ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(article.published_date)}
                        </span>
                        {article.is_featured && (
                          <span className="bg-brand-gold text-brand-blue-dark px-2 py-1 rounded text-xs font-semibold">
                            {getTranslation('news.featured', 'Featured')}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-brand-blue transition-colors mb-3">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center text-brand-blue text-sm font-medium group-hover:text-brand-blue-dark">
                        {getTranslation('news.readMore', 'Read more')}
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

export default NewsPage;