
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const OresPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.oresPage.title}>
      <p className="mb-10">{t.oresPage.intro}</p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.oresPage.rules.title}</h2>
          <div className="space-y-3 text-gray-700">
            <p>{t.oresPage.rules.p1}</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{t.oresPage.rules.r1}</li>
              <li dangerouslySetInnerHTML={{ __html: t.oresPage.rules.r2 }} />
              <li>{t.oresPage.rules.r3}</li>
              <li>{t.oresPage.rules.r4}</li>
              <li>{t.oresPage.rules.r5}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.oresPage.guide.title}</h2>
          <p className="text-gray-700 mb-4">{t.oresPage.guide.p1}</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
            <li>{t.oresPage.guide.g1}</li>
            <li>{t.oresPage.guide.g2}</li>
            <li>{t.oresPage.guide.g3}</li>
            <li>{t.oresPage.guide.g4}</li>
            <li>{t.oresPage.guide.g5}</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.oresPage.tips.title}</h2>
           <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li>{t.oresPage.tips.t1}</li>
              <li>{t.oresPage.tips.t2}</li>
              <li>{t.oresPage.tips.t3}</li>
              <li>{t.oresPage.tips.t4}</li>
              <li>{t.oresPage.tips.t5}</li>
            </ul>
        </section>

      </div>
    </PageWrapper>
  );
};

export default OresPage;
