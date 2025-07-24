import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList'; 

const OresPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.oresPage.title}>
      <EditableText
        id="ores-intro"
        defaultContent={t.oresPage.intro}
        tag="p"
        className="mb-10"
      />

      <div className="space-y-12">
        <section>
          <EditableText
            id="ores-rules-title"
            defaultContent={t.oresPage.rules.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-3 text-gray-700">
            <EditableText
              id="ores-rules-p1"
              defaultContent={t.oresPage.rules.p1}
              tag="p"
            />
            <EditableList
              id="ores-rules-list"
              defaultItems={[
                t.oresPage.rules.r1,
                t.oresPage.rules.r2,
                t.oresPage.rules.r3,
                t.oresPage.rules.r4,
                t.oresPage.rules.r5
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="ores-guide-title"
            defaultContent={t.oresPage.guide.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="ores-guide-p1"
            defaultContent={t.oresPage.guide.p1}
            tag="p"
            className="text-gray-700 mb-4"
          />
          <EditableList
            id="ores-guide-steps"
            defaultItems={[
              t.oresPage.guide.g1,
              t.oresPage.guide.g2,
              t.oresPage.guide.g3,
              t.oresPage.guide.g4,
              t.oresPage.guide.g5
            ]}
            ordered={true}
            className="list-decimal list-inside space-y-2 text-gray-700 pl-4"
          />
        </section>

        <section>
          <EditableText
            id="ores-tips-title"
            defaultContent={t.oresPage.tips.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
           <EditableList
             id="ores-tips-list"
             defaultItems={[
               t.oresPage.tips.t1,
               t.oresPage.tips.t2,
               t.oresPage.tips.t3,
               t.oresPage.tips.t4,
               t.oresPage.tips.t5
             ]}
             className="list-disc list-inside space-y-2 text-gray-700 pl-4"
           />
        </section>

      </div>
    </PageWrapper>
  );
};

export default OresPage;