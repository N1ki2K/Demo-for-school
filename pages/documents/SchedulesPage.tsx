import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';

const ScheduleTable: React.FC<{ title: string; schedule: Record<string, string[]>; tableId: string }> = ({ title, schedule, tableId }) => {
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
      <EditableText
        id={`schedule-${tableId}-title`}
        defaultContent={title}
        tag="h2"
        className="text-2xl font-semibold text-brand-blue-dark mb-4"
      />
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-center">
          <thead className="bg-brand-blue-light text-white">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="p-2">
                  <EditableText
                    id={`schedule-header-${index}`}
                    defaultContent={header}
                    tag="span"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([day, subjects], dayIndex) => (
              <tr key={day} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">
                  <EditableText
                    id={`schedule-${tableId}-day-${dayIndex}`}
                    defaultContent={day}
                    tag="span"
                  />
                </td>
                {subjects.map((subject, subjectIndex) => (
                  <td key={subjectIndex} className="p-2">
                    <EditableText
                      id={`schedule-${tableId}-${dayIndex}-${subjectIndex}`}
                      defaultContent={subject}
                      tag="span"
                    />
                  </td>
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
      <EditableText
        id="schedules-intro"
        defaultContent={t.schedulesPage.intro}
        tag="p"
        className="mb-10"
      />
      
      <ScheduleTable 
        title={t.schedulesPage.grade1.title} 
        schedule={schedule1stGrade}
        tableId="grade1"
      />
      <ScheduleTable 
        title={t.schedulesPage.grade5.title} 
        schedule={schedule5thGrade}
        tableId="grade5"
      />

      <section>
        <EditableText
          id="schedules-consultations-title"
          defaultContent={t.schedulesPage.consultations.title}
          tag="h2"
          className="text-2xl font-semibold text-brand-blue-dark mt-8 mb-4"
        />
        <EditableText
          id="schedules-consultations-text"
          defaultContent={t.schedulesPage.consultations.text}
          tag="p"
          className="text-gray-700"
        />
      </section>
    </PageWrapper>
  );
};

export default SchedulesPage;