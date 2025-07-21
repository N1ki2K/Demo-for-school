
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const ContinuingEducationPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.continuingEducationPage.title}>
      <p className="mb-10">{t.continuingEducationPage.intro}</p>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.continuingEducationPage.who.title}</h2>
          <div className="space-y-3 text-gray-700">
            <p>{t.continuingEducationPage.who.p1}</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{t.continuingEducationPage.who.items.i1}</li>
              <li>{t.continuingEducationPage.who.items.i2}</li>
              <li>{t.continuingEducationPage.who.items.i3}</li>
              <li>{t.continuingEducationPage.who.items.i4}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.continuingEducationPage.procedure.title}</h2>
          <div className="space-y-3 text-gray-700">
            <p>{t.continuingEducationPage.procedure.p1}</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>{t.continuingEducationPage.procedure.items.i1}</li>
              <li>{t.continuingEducationPage.procedure.items.i2}</li>
              <li>{t.continuingEducationPage.procedure.items.i3}</li>
            </ol>
            <p>{t.continuingEducationPage.procedure.p2}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.continuingEducationPage.organization.title}</h2>
           <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li>{t.continuingEducationPage.organization.items.i1}</li>
              <li>{t.continuingEducationPage.organization.items.i2}</li>
              <li>{t.continuingEducationPage.organization.items.i3}</li>
              <li>{t.continuingEducationPage.organization.items.i4}</li>
            </ul>
        </section>

      </div>
    </PageWrapper>
  );
};

export default ContinuingEducationPage;
