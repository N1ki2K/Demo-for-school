
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const PatronPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.patronPage.title}>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-2/3 space-y-4">
            <p dangerouslySetInnerHTML={{ __html: t.patronPage.p1 }} />
            <p>{t.patronPage.p2}</p>
            <p>{t.patronPage.p3}</p>
            <p>{t.patronPage.p4}</p>
        </div>
        <div className="md:w-1/3">
             <figure>
                <img className="w-full h-auto rounded-lg shadow-md" src="https://picsum.photos/400/500?random=11" alt={t.patronPage.imageAlt} />
                <figcaption className="text-center text-sm text-gray-500 mt-2">{t.patronPage.imageCaption}</figcaption>
            </figure>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PatronPage;
