import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EditableText} from '../components/cms/EditableText';
import { EditableImage  } from '../components/cms/EditableImage';
import { EditableList } from '../components/cms/EditableList';
import { apiService } from '../src/services/api';

const HeroSection: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  return (
    <div className="relative bg-brand-blue text-white overflow-hidden">
      <div className="absolute inset-0">
        <EditableImage 
          id="hero-background"
          defaultSrc="https://picsum.photos/1600/900?random=1"
          alt={getTranslation('homePage.hero.alt', 'School building')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-blue bg-opacity-70"></div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 text-center">
        <EditableText
          id="hero-title"
          defaultContent={getTranslation('homePage.hero.title', 'Добре дошли в ОУ "Кольо Ганчев"')}
          tag="h1"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white animate-fade-in-up leading-tight"
        />
        <EditableText
          id="hero-subtitle"
          defaultContent={getTranslation('homePage.hero.subtitle', 'Съвременно образование с традиции')}
          tag="p"
          className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-brand-gold-light animate-fade-in-up px-4"
        />
        <div className="mt-8 sm:mt-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/documents/admissions" className="inline-block bg-brand-gold text-brand-blue-dark font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-brand-gold-light transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base">
            <EditableText
              id="hero-cta"
              defaultContent={getTranslation('homePage.hero.cta', 'Научи повече')}
              tag="span"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ 
  id: string;
  title: string; 
  date: string; 
  excerpt: string; 
  link: string; 
  imageUrl: string;
}> = ({ id, title, date, excerpt, link, imageUrl }) => {
  const { t, getTranslation } = useLanguage();
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <EditableImage 
          id={`${id}-image`}
          defaultSrc={imageUrl}
          alt={title}
          className="h-48 w-full object-cover"
        />
        <div className="p-6">
            <EditableText
              id={`${id}-date`}
              defaultContent={date}
              tag="p"
              className="text-sm text-gray-500 mb-2"
            />
            <EditableText
              id={`${id}-title`}
              defaultContent={title}
              tag="h3"
              className="text-xl font-bold text-brand-blue mb-2"
            />
            <EditableText
              id={`${id}-excerpt`}
              defaultContent={excerpt}
              tag="p"
              className="text-gray-600 mb-4"
            />
            <Link to={link} className="text-brand-blue-light font-semibold hover:text-brand-gold transition-colors">{getTranslation('homePage.news.readMore', 'Прочети повече')} &rarr;</Link>
        </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { t, getTranslation, language } = useLanguage();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoadingNews(true);
        const allNews = await apiService.getNews(language, true);
        const featuredNews = allNews.slice(0, 3); // Get the 3 most recent published articles
        
        const formattedNews = featuredNews.map((article: any) => ({
          id: `news-${article.id}`,
          title: article.title, // Already formatted by backend based on language
          date: new Date(article.publishedDate).toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US'),
          excerpt: article.excerpt, // Already formatted by backend based on language
          link: `/news/${article.id}`,
          imageUrl: article.featuredImage || "https://picsum.photos/400/300?random=2"
        }));

        setNewsItems(formattedNews);
      } catch (error) {
        console.error('Error loading featured news:', error);
        // If API fails, set empty array to hide news section
        setNewsItems([]);
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadNews();
  }, [language, t]);

  const defaultFeatures = [
    t.homePage.features.feature1.title,
    t.homePage.features.feature2.title,
    t.homePage.features.feature3.title
  ];

  const defaultDescriptions = [
    t.homePage.features.feature1.description,
    t.homePage.features.feature2.description,
    t.homePage.features.feature3.description
  ];

  const features = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>,
      titleId: 'feature-1-title',
      descId: 'feature-1-desc',
      defaultTitle: t.homePage.features.feature1.title,
      defaultDescription: t.homePage.features.feature1.description
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      titleId: 'feature-2-title',
      descId: 'feature-2-desc',
      defaultTitle: t.homePage.features.feature2.title,
      defaultDescription: t.homePage.features.feature2.description
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      titleId: 'feature-3-title',
      descId: 'feature-3-desc',
      defaultTitle: t.homePage.features.feature3.title,
      defaultDescription: t.homePage.features.feature3.description
    }
  ];

  return (
    <div className="bg-gray-50">
      <HeroSection />

      {(isLoadingNews || newsItems.length > 0) && (
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <EditableText
              id="news-title"
              defaultContent={getTranslation('homePage.news.title', 'Новини')}
              tag="h2"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-brand-blue mb-8 sm:mb-12"
            />
            {isLoadingNews ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {newsItems.map((item, index) => <NewsCard key={index} {...item} />)}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <EditableText
                  id="features-title"
                  defaultContent={getTranslation('homePage.features.title', 'Наши предимства')}
                  tag="h2"
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-blue"
                />
                <EditableText
                  id="features-subtitle"
                  defaultContent={getTranslation('homePage.features.subtitle', 'Какво ни прави специални')}
                  tag="p"
                  className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4"
                />
            </div>
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
              {features.map((feature, index) => (
                <div key={index} className="p-4 sm:p-6">
                    <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-brand-gold-light text-brand-blue mx-auto mb-4">
                        {feature.icon}
                    </div>
                    <EditableText
                      id={feature.titleId}
                      defaultContent={feature.defaultTitle}
                      tag="h3"
                      className="text-lg sm:text-xl font-semibold text-brand-blue-dark"
                    />
                    <EditableText
                      id={feature.descId}
                      defaultContent={feature.defaultDescription}
                      tag="p"
                      className="mt-2 text-sm sm:text-base text-gray-600"
                    />
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;