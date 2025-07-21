import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const PatronPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.patronPage.title}>
      <div className="space-y-6">
        {/* Hero Quote */}
        <div className="text-center bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <blockquote className="text-xl font-semibold text-blue-900 italic">
            {t.patronPage.quote}
          </blockquote>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:w-2/3 space-y-6">
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t.patronPage.p1 }} />
            <p className="text-lg leading-relaxed">{t.patronPage.p2}</p>
            <p className="text-lg leading-relaxed">{t.patronPage.p3}</p>
            <p className="text-lg leading-relaxed">{t.patronPage.p4}</p>
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t.patronPage.p5 }} />
            
            {/* Legacy section */}
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Наследство</h2>
              <p className="text-gray-700">{t.patronPage.legacy}</p>
            </div>
          </div>

          <div className="lg:w-1/3">
            <figure className="sticky top-8">
              <img 
                className="w-full h-auto rounded-lg shadow-md" 
                src="https://picsum.photos/400/500?random=11" 
                alt={t.patronPage.imageAlt} 
              />
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {t.patronPage.imageCaption}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PatronPage;