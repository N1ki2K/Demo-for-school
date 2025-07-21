
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const ScheduleTable: React.FC<{ title: string; schedule: Record<string, string[]> }> = ({ title, schedule }) => {
  const { t } = useLanguage();
  const headers = [
    t.schedulesPage.table.day,
    t.schedulesPage.table.period1,
    t.schedulesPage.table.period2,
    t.schedulesPage.table.period3,
    t.schedulesPage.table.period4,
    t.schedulesPage.table.period5,
    t.schedulesPage.table.period6,
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-center">
          <thead className="bg-brand-blue-light text-white">
            <tr>
              {headers.map((header, index) => <th key={index} className="p-2">{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([day, subjects]) => (
              <tr key={day} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">{day}</td>
                {subjects.map((subject, index) => (
                  <td key={index} className="p-2">{subject}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const SchedulesPage: React.FC = () => {
  const { t } = useLanguage();
  const s = t.schedulesPage.subjects;
  const d = t.schedulesPage.days;

  const schedule1stGrade = {
    [d.monday]: [s.bel, s.bel, s.math, s.music, s.art, ''],
    [d.tuesday]: [s.bel, s.math, s.world, s.pe, s.tech, ''],
    [d.wednesday]: [s.bel, s.bel, s.math, s.pe, s.classHour, ''],
    [d.thursday]: [s.bel, s.math, s.world, s.music, s.art, ''],
    [d.friday]: [s.bel, s.math, s.pe, s.tech, '', ''],
  };

  const schedule5thGrade = {
    [d.monday]: [s.bel, s.bel, s.math, s.history, s.english, s.geography],
    [d.tuesday]: [s.math, s.bel, s.nature, s.pe, s.music, s.tech],
    [d.wednesday]: [s.bel, s.math, s.english, s.history, s.nature, s.pe],
    [d.thursday]: [s.geography, s.bel, s.math, s.english, s.art, s.classHour],
    [d.friday]: [s.pe, s.math, s.bel, s.nature, s.history, s.music],
  };
  
  return (
    <PageWrapper title={t.schedulesPage.title}>
      <p className="mb-10">{t.schedulesPage.intro}</p>
      
      <ScheduleTable title={t.schedulesPage.grade1.title} schedule={schedule1stGrade} />
      <ScheduleTable title={t.schedulesPage.grade5.title} schedule={schedule5thGrade} />

      <section>
        <h2 className="text-2xl font-semibold text-brand-blue-dark mt-8 mb-4">{t.schedulesPage.consultations.title}</h2>
        <p className="text-gray-700">{t.schedulesPage.consultations.text}</p>
      </section>
    </PageWrapper>
  );
};

export default SchedulesPage;
