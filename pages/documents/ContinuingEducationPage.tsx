import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList'; 

const ContinuingEducationPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.continuingEducationPage.title}>
      <EditableText
        id="continuing-education-intro"
        defaultContent={t.continuingEducationPage.intro}
        tag="p"
        className="mb-10"
      />

      <div className="space-y-10">
        <section>
          <EditableText
            id="continuing-education-who-title"
            defaultContent={t.continuingEducationPage.who.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-3 text-gray-700">
            <EditableText
              id="continuing-education-who-p1"
              defaultContent={t.continuingEducationPage.who.p1}
              tag="p"
            />
            <EditableList
              id="continuing-education-who-items"
              defaultItems={[
                t.continuingEducationPage.who.items.i1,
                t.continuingEducationPage.who.items.i2,
                t.continuingEducationPage.who.items.i3,
                t.continuingEducationPage.who.items.i4
              ]}
              className="list-disc list-inside space-y-2 pl-4"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="continuing-education-procedure-title"
            defaultContent={t.continuingEducationPage.procedure.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="space-y-3 text-gray-700">
            <EditableText
              id="continuing-education-procedure-p1"
              defaultContent={t.continuingEducationPage.procedure.p1}
              tag="p"
            />
            <EditableList
              id="continuing-education-procedure-items"
              defaultItems={[
                t.continuingEducationPage.procedure.items.i1,
                t.continuingEducationPage.procedure.items.i2,
                t.continuingEducationPage.procedure.items.i3
              ]}
              ordered={true}
              className="list-decimal list-inside space-y-2 pl-4"
            />
            <EditableText
              id="continuing-education-procedure-p2"
              defaultContent={t.continuingEducationPage.procedure.p2}
              tag="p"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="continuing-education-organization-title"
            defaultContent={t.continuingEducationPage.organization.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
           <EditableList
             id="continuing-education-organization-items"
             defaultItems={[
               t.continuingEducationPage.organization.items.i1,
               t.continuingEducationPage.organization.items.i2,
               t.continuingEducationPage.organization.items.i3,
               t.continuingEducationPage.organization.items.i4
             ]}
             className="list-disc list-inside space-y-2 text-gray-700 pl-4"
           />
        </section>

      </div>
    </PageWrapper>
  );
};

export default ContinuingEducationPage;