
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const CouncilPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.councilPage.title}>
      <div className="space-y-6">
        <p>{t.councilPage.intro}</p>
        
        <h2 className="text-2xl font-semibold text-brand-blue-dark pt-4">{t.councilPage.functionsTitle}</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>{t.councilPage.functions.f1}</li>
          <li>{t.councilPage.functions.f2}</li>
          <li>{t.councilPage.functions.f3}</li>
          <li>{t.councilPage.functions.f4}</li>
          <li>{t.councilPage.functions.f5}</li>
        </ul>

        <h2 className="text-2xl font-semibold text-brand-blue-dark pt-4">{t.councilPage.membersTitle}</h2>
        <ul className="list-decimal list-inside space-y-2">
            <li><strong>{t.councilPage.members.m1.role}:</strong> {t.councilPage.members.m1.name}</li>
            <li><strong>{t.councilPage.members.m2.role}:</strong></li>
            <ul className="list-disc list-inside ml-6">
                <li>{t.councilPage.members.m2.names.n1}</li>
                <li>{t.councilPage.members.m2.names.n2}</li>
                <li>{t.councilPage.members.m2.names.n3}</li>
                <li>{t.councilPage.members.m2.names.n4}</li>
            </ul>
        </ul>
        <p dangerouslySetInnerHTML={{ __html: t.councilPage.contact }} />
      </div>
    </PageWrapper>
  );
};

export default CouncilPage;
