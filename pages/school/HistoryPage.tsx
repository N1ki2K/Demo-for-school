
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.historyPage.title}>
      <div className="space-y-6">
        <p>{t.historyPage.p1}</p>
        <p>{t.historyPage.p2}</p>
        <figure className="my-8">
            <img className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md" src="https://picsum.photos/1200/400?random=10" alt={t.historyPage.imageAlt} />
            <figcaption className="text-center text-sm text-gray-500 mt-2">{t.historyPage.imageCaption}</figcaption>
        </figure>
        <p>{t.historyPage.p3}</p>
        <p>{t.historyPage.p4}</p>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;
