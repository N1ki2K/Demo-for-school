
import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';

const InfoAccessPage: React.FC = () => {
  const { t } = useLanguage();
  const i = t.infoAccessPage;
  return (
    <PageWrapper title={i.title}>
      <p className="mb-8">{i.intro}</p>

      <div className="space-y-10">
        
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{i.rules.title}</h2>
          <div className="space-y-4 text-gray-700">
            <p>{i.rules.p1}</p>
            <p><strong>{i.rules.principlesTitle}:</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{i.rules.principles.p1}</li>
              <li>{i.rules.principles.p2}</li>
              <li>{i.rules.principles.p3}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{i.howTo.title}</h2>
          <div className="space-y-4 text-gray-700">
            <p>{i.howTo.p1}</p>
            <ul className="list-decimal list-inside space-y-2 pl-4">
              <li dangerouslySetInnerHTML={{ __html: i.howTo.methods.m1 }} />
              <li dangerouslySetInnerHTML={{ __html: i.howTo.methods.m2 }} />
              <li dangerouslySetInnerHTML={{ __html: i.howTo.methods.m3 }} />
            </ul>
            <p>{i.howTo.p2}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{i.report.title}</h2>
          <div className="space-y-4 text-gray-700">
            <p>{i.report.p1}</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{i.report.stats.s1}</li>
              <li>{i.report.stats.s2}</li>
              <li>{i.report.stats.s3}</li>
            </ul>
            <p>{i.report.p2}</p>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
};

export default InfoAccessPage;
