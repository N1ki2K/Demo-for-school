import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';

const EthicsCodePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.ethicsPage.title}>
      <EditableText
        id="ethics-intro"
        defaultContent={t.ethicsPage.intro}
        tag="p"
        className="mb-10"
      />

      <div className="space-y-8">
        
        <section>
          <EditableText
            id="ethics-principles-title"
            defaultContent={t.ethicsPage.principles.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <EditableText
                id="ethics-principle-1-title"
                defaultContent={t.ethicsPage.principles.p1.title}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="ethics-principle-1-text"
                defaultContent={t.ethicsPage.principles.p1.text}
                tag="p"
                className="text-gray-700"
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <EditableText
                id="ethics-principle-2-title"
                defaultContent={t.ethicsPage.principles.p2.title}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="ethics-principle-2-text"
                defaultContent={t.ethicsPage.principles.p2.text}
                tag="p"
                className="text-gray-700"
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <EditableText
                id="ethics-principle-3-title"
                defaultContent={t.ethicsPage.principles.p3.title}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="ethics-principle-3-text"
                defaultContent={t.ethicsPage.principles.p3.text}
                tag="p"
                className="text-gray-700"
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-gold">
              <EditableText
                id="ethics-principle-4-title"
                defaultContent={t.ethicsPage.principles.p4.title}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="ethics-principle-4-text"
                defaultContent={t.ethicsPage.principles.p4.text}
                tag="p"
                className="text-gray-700"
              />
            </div>
          </div>
        </section>

        <section>
          <EditableText
            id="ethics-conflict-title"
            defaultContent={t.ethicsPage.conflict.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="ethics-conflict-text"
            defaultContent={t.ethicsPage.conflict.text}
            tag="p"
            className="text-gray-700"
          />
        </section>
        
        <section>
          <EditableText
            id="ethics-professionalism-title"
            defaultContent={t.ethicsPage.professionalism.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="ethics-professionalism-text"
            defaultContent={t.ethicsPage.professionalism.text}
            tag="p"
            className="text-gray-700"
          />
        </section>

      </div>
    </PageWrapper>
  );
};

export default EthicsCodePage;