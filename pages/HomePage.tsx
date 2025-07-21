
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="relative bg-brand-blue text-white overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://picsum.photos/1600/900?random=1" alt={t.homePage.hero.alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-blue bg-opacity-70"></div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white animate-fade-in-up">
          {t.homePage.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-brand-gold-light animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {t.homePage.hero.subtitle}
        </p>
        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/documents/admissions" className="bg-brand-gold text-brand-blue-dark font-bold py-3 px-8 rounded-full hover:bg-brand-gold-light transition-transform duration-300 transform hover:scale-105">
            {t.homePage.hero.cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ title: string; date: string; excerpt: string; link: string; imageUrl: string }> = ({ title, date, excerpt, link, imageUrl }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img className="h-48 w-full object-cover" src={imageUrl} alt={title} />
        <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{date}</p>
            <h3 className="text-xl font-bold text-brand-blue mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{excerpt}</p>
            <Link to={link} className="text-brand-blue-light font-semibold hover:text-brand-gold transition-colors">{t.homePage.news.readMore} &rarr;</Link>
        </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const newsItems = [
    { 
      title: t.homePage.news.item1.title,
      date: t.homePage.news.item1.date,
      excerpt: t.homePage.news.item1.excerpt,
      link: "/documents/announcement",
      imageUrl: "https://picsum.photos/400/300?random=2"
    },
    { 
      title: t.homePage.news.item2.title,
      date: t.homePage.news.item2.date,
      excerpt: t.homePage.news.item2.excerpt,
      link: "/documents/olympiads",
      imageUrl: "https://picsum.photos/400/300?random=3"
    },
    { 
      title: t.homePage.news.item3.title,
      date: t.homePage.news.item3.date,
      excerpt: t.homePage.news.item3.excerpt,
      link: "/projects/education-for-tomorrow",
      imageUrl: "https://picsum.photos/400/300?random=4"
    }
  ];

  const features = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>,
      title: t.homePage.features.feature1.title,
      description: t.homePage.features.feature1.description
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      title: t.homePage.features.feature2.title,
      description: t.homePage.features.feature2.description
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      title: t.homePage.features.feature3.title,
      description: t.homePage.features.feature3.description
    }
  ];

  return (
    <div className="bg-gray-50">
      <HeroSection />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-12">{t.homePage.news.title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, index) => <NewsCard key={index} {...item} />)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">{t.homePage.features.title}</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{t.homePage.features.subtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {features.map((feature, index) => (
                <div key={index} className="p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-gold-light text-brand-blue mx-auto mb-4">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-brand-blue-dark">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
