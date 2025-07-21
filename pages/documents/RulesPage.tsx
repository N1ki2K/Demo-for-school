
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const RulesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper title={t.rulesPage.title}>
      <p className="mb-10">{t.rulesPage.intro}</p>
      
      <div className="space-y-12">

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.rulesPage.strategy.title}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">{t.rulesPage.strategy.missionTitle}</h3>
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-700">
                {t.rulesPage.strategy.missionText}
              </blockquote>
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">{t.rulesPage.strategy.visionTitle}</h3>
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-700">
                {t.rulesPage.strategy.visionText}
              </blockquote>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.rulesPage.regulations.title}</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>{t.rulesPage.regulations.rightsTitle}</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{t.rulesPage.regulations.rights.r1}</li>
              <li>{t.rulesPage.regulations.rights.r2}</li>
              <li>{t.rulesPage.regulations.rights.r3}</li>
              <li>{t.rulesPage.regulations.rights.r4}</li>
            </ul>
            <p className="pt-4"><strong>{t.rulesPage.regulations.dutiesTitle}</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{t.rulesPage.regulations.duties.d1}</li>
              <li>{t.rulesPage.regulations.duties.d2}</li>
              <li>{t.rulesPage.regulations.duties.d3}</li>
              <li>{t.rulesPage.regulations.duties.d4}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.rulesPage.annualPlan.title}</h2>
           <ul className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
              <li>{t.rulesPage.annualPlan.priorities.p1}</li>
              <li>{t.rulesPage.annualPlan.priorities.p2}</li>
              <li>{t.rulesPage.annualPlan.priorities.p3}</li>
              <li>{t.rulesPage.annualPlan.priorities.p4}</li>
            </ul>
        </section>

      </div>
    </PageWrapper>
  );
};

export default RulesPage;
