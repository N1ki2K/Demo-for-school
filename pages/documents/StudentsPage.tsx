
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const StudentsPage: React.FC = () => {
  const { t } = useLanguage();
  const s = t.studentsPage;
  return (
    <PageWrapper title={s.title}>
      <p className="mb-10">{s.intro}</p>
      
      <div className="grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">{s.rights.title}</h2>
          <div className="space-y-4">
            <p>{s.rights.p1}</p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 pl-4">
              <li>{s.rights.items.i1}</li>
              <li>{s.rights.items.i2}</li>
              <li>{s.rights.items.i3}</li>
              <li>{s.rights.items.i4}</li>
              <li>{s.rights.items.i5}</li>
              <li>{s.rights.items.i6}</li>
              <li>{s.rights.items.i7}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-700 mb-4">{s.duties.title}</h2>
          <div className="space-y-4">
            <p>{s.duties.p1}</p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 pl-4">
              <li>{s.duties.items.i1}</li>
              <li>{s.duties.items.i2}</li>
              <li>{s.duties.items.i3}</li>
              <li>{s.duties.items.i4}</li>
              <li>{s.duties.items.i5}</li>
              <li>{s.duties.items.i6}</li>
              <li>{s.duties.items.i7}</li>
            </ul>
          </div>
        </section>
      </div>

       <section className="mt-12 bg-brand-blue-dark text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-brand-gold mb-4">{s.rules.title}</h2>
          <p>{s.rules.text}</p>
        </section>
    </PageWrapper>
  );
};

export default StudentsPage;
