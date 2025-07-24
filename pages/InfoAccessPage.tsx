import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';
import { EditableList } from '../components/cms/EditableList';

const InfoAccessPage: React.FC = () => {
  const { t } = useLanguage();
  const i = t.infoAccessPage;
  return (
    <PageWrapper title={i.title}>
      <EditableText
        id="info-access-intro"
        defaultContent={i.intro}
        tag="p"
        className="mb-8"
      />

      <div className="space-y-10">
        
        <section>
          <EditableText
            id="info-access-rules-title"
            defaultContent={i.rules.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-4 text-gray-700">
            <EditableText
              id="info-access-rules-p1"
              defaultContent={i.rules.p1}
              tag="p"
            />
            <EditableText
              id="info-access-principles-title"
              defaultContent={i.rules.principlesTitle}
              tag="p"
              className="font-bold"
            />
            <EditableList
              id="info-access-principles"
              defaultItems={[
                i.rules.principles.p1,
                i.rules.principles.p2,
                i.rules.principles.p3
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="info-access-howto-title"
            defaultContent={i.howTo.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-4 text-gray-700">
            <EditableText
              id="info-access-howto-p1"
              defaultContent={i.howTo.p1}
              tag="p"
            />
            <EditableList
              id="info-access-methods"
              defaultItems={[
                i.howTo.methods.m1,
                i.howTo.methods.m2,
                i.howTo.methods.m3
              ]}
              ordered={true}
              className="list-decimal list-inside space-y-2 pl-4"
            />
            <EditableText
              id="info-access-howto-p2"
              defaultContent={i.howTo.p2}
              tag="p"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="info-access-report-title"
            defaultContent={i.report.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-4 text-gray-700">
            <EditableText
              id="info-access-report-p1"
              defaultContent={i.report.p1}
              tag="p"
            />
            <EditableList
              id="info-access-stats"
              defaultItems={[
                i.report.stats.s1,
                i.report.stats.s2,
                i.report.stats.s3
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
            <EditableText
              id="info-access-report-p2"
              defaultContent={i.report.p2}
              tag="p"
            />
          </div>
        </section>

      </div>
    </PageWrapper>
  );
};

export default InfoAccessPage;