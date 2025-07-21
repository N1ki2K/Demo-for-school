
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const AdmissionsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.admissionsPage.title}>
      <p className="mb-10">{t.admissionsPage.intro}</p>

      <div className="space-y-12">
        
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">{t.admissionsPage.rules.title}</h2>
          <div className="space-y-3 text-gray-700">
            <p>{t.admissionsPage.rules.p1}</p>
            <p><strong>{t.admissionsPage.rules.criteriaTitle}</strong></p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>{t.admissionsPage.rules.criteria.c1}</li>
              <li>{t.admissionsPage.rules.criteria.c2}</li>
              <li>{t.admissionsPage.rules.criteria.c3}</li>
              <li>{t.admissionsPage.rules.criteria.c4}</li>
              <li>{t.admissionsPage.rules.criteria.c5}</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">{t.admissionsPage.schedule.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">{t.admissionsPage.schedule.header.activity}</th>
                  <th className="p-3">{t.admissionsPage.schedule.header.deadline}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.admissionsPage.schedule.rows.r1.activity}</td>
                  <td className="p-3">{t.admissionsPage.schedule.rows.r1.deadline}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.admissionsPage.schedule.rows.r2.activity}</td>
                  <td className="p-3">{t.admissionsPage.schedule.rows.r2.deadline}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.admissionsPage.schedule.rows.r3.activity}</td>
                  <td className="p-3">{t.admissionsPage.schedule.rows.r3.deadline}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3">{t.admissionsPage.schedule.rows.r4.activity}</td>
                  <td className="p-3">{t.admissionsPage.schedule.rows.r4.deadline}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">{t.admissionsPage.documents.title}</h2>
           <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li>{t.admissionsPage.documents.d1}</li>
              <li>{t.admissionsPage.documents.d2}</li>
              <li>{t.admissionsPage.documents.d3}</li>
              <li>{t.admissionsPage.documents.d4}</li>
            </ul>
        </section>
        
      </div>
    </PageWrapper>
  );
};

export default AdmissionsPage;
