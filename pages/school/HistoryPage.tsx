import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.historyPage.title}>
      <div className="space-y-6">
        <p className="text-lg leading-relaxed">{t.historyPage.p1}</p>
        <p className="text-lg leading-relaxed">{t.historyPage.p2}</p>
        
        <figure className="my-8">
            <img 
                className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md" 
                src="https://picsum.photos/1200/400?random=10" 
                alt={t.historyPage.imageAlt} 
            />
            <figcaption className="text-center text-sm text-gray-500 mt-2">
                {t.historyPage.imageCaption}
            </figcaption>
        </figure>
        
        <p className="text-lg leading-relaxed">{t.historyPage.p3}</p>
        <p className="text-lg leading-relaxed">{t.historyPage.p4}</p>

        {/* Achievements Section */}
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
                {t.historyPage.achievements.title}
            </h2>
            <ul className="space-y-2">
                {t.historyPage.achievements.list.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2 text-lg">•</span>
                        <span className="text-gray-700">{achievement}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Directors Section */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.historyPage.directors.title}
            </h2>
            <ul className="space-y-2">
                {t.historyPage.directors.list.map((director, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-gray-600 mr-2 text-lg">•</span>
                        <span className="text-gray-700">{director}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;