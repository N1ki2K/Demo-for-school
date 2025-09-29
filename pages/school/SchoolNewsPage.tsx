import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';
import PageWrapper from '../../components/PageWrapper';

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

const SchoolNewsPage: React.FC = () => {
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const NewsCard: React.FC<{ article: NewsArticle; isFeatured?: boolean }> = ({ article, isFeatured = false }) => (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isFeatured ? 'border-2 border-brand-gold' : ''}`}>
      {article.featured_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        {isFeatured && (
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-gold text-brand-blue-dark">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {getTranslation('news.featured', 'Актуални')}
            </span>
          </div>
        )}
        <time className="text-sm text-gray-500 mb-2 block">
          {formatDate(article.published_date)}
        </time>
        <h2 className="text-xl font-bold text-brand-blue-dark mb-3 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <Link
          to={`/news/${article.id}`}
          className="inline-flex items-center text-brand-blue-light hover:text-brand-gold transition-colors duration-200 font-medium"
        >
          {getTranslation('news.readMore', 'Прочети повече')}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );

  if (isLoading) {
    return (
      <PageWrapper title={getTranslation('schoolNews.title', 'Училищни новини')}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title={getTranslation('schoolNews.title', 'Училищни новини')}>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-semibold">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            {getTranslation('common.retry', 'Опитай отново')}
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={getTranslation('schoolNews.title', 'Училищни новини')}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-blue-dark mb-4">
            {getTranslation('schoolNews.title', 'Училищни новини')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {getTranslation('schoolNews.description', 'Следете последните новини и събития от нашето училище')}
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-brand-blue-dark flex items-center">
                <svg className="w-6 h-6 mr-2 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {getTranslation('news.featured', 'Актуални новини')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <NewsCard key={`featured-${article.id}`} article={article} isFeatured />
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles */}
        {articles.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-brand-blue-dark">
                {getTranslation('news.allNews', 'Всички новини')}
              </h2>
              <div className="text-sm text-gray-500">
                {getTranslation('news.articlesCount', '{count} статии').replace('{count}', articles.length.toString())}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-6-3L9 7.5 7.5 9M15 13.5L13.5 15 12 13.5M9 15l1.5-1.5L12 15" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {getTranslation('news.noNews', 'Няма налични новини')}
              </h3>
              <p className="text-gray-500">
                {getTranslation('news.checkBackLater', 'Моля, проверете отново по-късно')}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default SchoolNewsPage;