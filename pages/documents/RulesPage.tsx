import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList';

const RulesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper title={t.rulesPage.title}>
      <EditableText
        id="rules-intro"
        defaultContent={t.rulesPage.intro}
        tag="p"
        className="mb-10"
      />
      
      <div className="space-y-12">

        <section>
          <EditableText
            id="rules-strategy-title"
            defaultContent={t.rulesPage.strategy.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-4">
            <div>
              <EditableText
                id="rules-mission-title"
                defaultContent={t.rulesPage.strategy.missionTitle}
                tag="h3"
                className="text-xl font-bold text-brand-blue mb-2"
              />
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-700">
                <EditableText
                  id="rules-mission-text"
                  defaultContent={t.rulesPage.strategy.missionText}
                  tag="span"
                />
              </blockquote>
            </div>
            <div>
              <EditableText
                id="rules-vision-title"
                defaultContent={t.rulesPage.strategy.visionTitle}
                tag="h3"
                className="text-xl font-bold text-brand-blue mb-2"
              />
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-700">
                <EditableText
                  id="rules-vision-text"
                  defaultContent={t.rulesPage.strategy.visionText}
                  tag="span"
                />
              </blockquote>
            </div>
          </div>
        </section>

        <section>
          <EditableText
            id="rules-regulations-title"
            defaultContent={t.rulesPage.regulations.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-3 text-gray-700">
            <EditableText
              id="rules-rights-title"
              defaultContent={t.rulesPage.regulations.rightsTitle}
              tag="p"
              className="font-bold"
            />
            <EditableList
              id="rules-rights-list"
              defaultItems={[
                t.rulesPage.regulations.rights.r1,
                t.rulesPage.regulations.rights.r2,
                t.rulesPage.regulations.rights.r3,
                t.rulesPage.regulations.rights.r4
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
            <EditableText
              id="rules-duties-title"
              defaultContent={t.rulesPage.regulations.dutiesTitle}
              tag="p"
              className="pt-4 font-bold"
            />
            <EditableList
              id="rules-duties-list"
              defaultItems={[
                t.rulesPage.regulations.duties.d1,
                t.rulesPage.regulations.duties.d2,
                t.rulesPage.regulations.duties.d3,
                t.rulesPage.regulations.duties.d4
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="rules-annual-plan-title"
            defaultContent={t.rulesPage.annualPlan.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
           <EditableList
             id="rules-priorities-list"
             defaultItems={[
               t.rulesPage.annualPlan.priorities.p1,
               t.rulesPage.annualPlan.priorities.p2,
               t.rulesPage.annualPlan.priorities.p3,
               t.rulesPage.annualPlan.priorities.p4
             ]}
             ordered={true}
             className="list-decimal list-inside space-y-2 text-gray-700 pl-4"
           />
        </section>

      </div>
    </PageWrapper>
  );
};

export default RulesPage;