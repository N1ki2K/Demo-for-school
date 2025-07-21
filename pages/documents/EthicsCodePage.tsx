
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const EthicsCodePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.ethicsPage.title}>
      <p className="mb-10">{t.ethicsPage.intro}</p>

      <div className="space-y-8">
        
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.ethicsPage.principles.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.ethicsPage.principles.p1.title}</h3>
              <p className="text-gray-700">{t.ethicsPage.principles.p1.text}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.ethicsPage.principles.p2.title}</h3>
              <p className="text-gray-700">{t.ethicsPage.principles.p2.text}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.ethicsPage.principles.p3.title}</h3>
              <p className="text-gray-700">{t.ethicsPage.principles.p3.text}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.ethicsPage.principles.p4.title}</h3>
              <p className="text-gray-700">{t.ethicsPage.principles.p4.text}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.ethicsPage.conflict.title}</h2>
          <p className="text-gray-700">{t.ethicsPage.conflict.text}</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.ethicsPage.professionalism.title}</h2>
          <p className="text-gray-700">{t.ethicsPage.professionalism.text}</p>
        </section>

      </div>
    </PageWrapper>
  );
};

export default EthicsCodePage;
