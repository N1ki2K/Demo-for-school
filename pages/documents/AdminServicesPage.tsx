import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList';

const AdmissionsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.admissionsPage.title}>
      <EditableText
        id="admissions-intro"
        defaultContent={t.admissionsPage.intro}
        tag="p"
        className="mb-10"
      />

      <div className="space-y-12">
        
        <section>
          <EditableText
            id="admissions-rules-title"
            defaultContent={t.admissionsPage.rules.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4"
          />
          <div className="space-y-3 text-gray-700">
            <EditableText
              id="admissions-rules-p1"
              defaultContent={t.admissionsPage.rules.p1}
              tag="p"
            />
            <EditableText
              id="admissions-criteria-title"
              defaultContent={t.admissionsPage.rules.criteriaTitle}
              tag="p"
              className="font-bold"
            />
            <EditableList
              id="admissions-criteria"
              defaultItems={[
                t.admissionsPage.rules.criteria.c1,
                t.admissionsPage.rules.criteria.c2,
                t.admissionsPage.rules.criteria.c3,
                t.admissionsPage.rules.criteria.c4,
                t.admissionsPage.rules.criteria.c5
              ]}
              ordered={true}
              className="list-decimal list-inside space-y-2 pl-4"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="admissions-schedule-title"
            defaultContent={t.admissionsPage.schedule.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">
                    <EditableText
                      id="admissions-table-activity"
                      defaultContent={t.admissionsPage.schedule.header.activity}
                      tag="span"
                    />
                  </th>
                  <th className="p-3">
                    <EditableText
                      id="admissions-table-deadline"
                      defaultContent={t.admissionsPage.schedule.header.deadline}
                      tag="span"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="admissions-activity-1"
                      defaultContent={t.admissionsPage.schedule.rows.r1.activity}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="admissions-deadline-1"
                      defaultContent={t.admissionsPage.schedule.rows.r1.deadline}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="admissions-activity-2"
                      defaultContent={t.admissionsPage.schedule.rows.r2.activity}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="admissions-deadline-2"
                      defaultContent={t.admissionsPage.schedule.rows.r2.deadline}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="admissions-activity-3"
                      defaultContent={t.admissionsPage.schedule.rows.r3.activity}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="admissions-deadline-3"
                      defaultContent={t.admissionsPage.schedule.rows.r3.deadline}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="admissions-activity-4"
                      defaultContent={t.admissionsPage.schedule.rows.r4.activity}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="admissions-deadline-4"
                      defaultContent={t.admissionsPage.schedule.rows.r4.deadline}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <EditableText
            id="admissions-documents-title"
            defaultContent={t.admissionsPage.documents.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4"
          />
           <EditableList
             id="admissions-documents"
             defaultItems={[
               t.admissionsPage.documents.d1,
               t.admissionsPage.documents.d2,
               t.admissionsPage.documents.d3,
               t.admissionsPage.documents.d4
             ]}
             className="list-disc list-inside space-y-2 text-gray-700 pl-4"
           />
        </section>
        
      </div>
    </PageWrapper>
  );
};

export default AdmissionsPage;