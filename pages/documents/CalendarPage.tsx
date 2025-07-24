import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';

const CalendarPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.calendarPage.title}>
      <EditableText
        id="calendar-intro"
        defaultContent={t.calendarPage.intro}
        tag="p"
        className="mb-10"
      />
      
      <div className="space-y-12">
        <section>
          <EditableText
            id="calendar-semesters-title"
            defaultContent={t.calendarPage.semesters.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <EditableText
                id="calendar-first-semester"
                defaultContent={t.calendarPage.semesters.first}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="calendar-first-dates"
                defaultContent={t.calendarPage.semesters.first_dates}
                tag="p"
                className="text-gray-700"
              />
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
              <EditableText
                id="calendar-second-semester"
                defaultContent={t.calendarPage.semesters.second}
                tag="h3"
                className="font-bold text-xl text-brand-blue mb-2"
              />
              <EditableText
                id="calendar-second-dates"
                defaultContent={t.calendarPage.semesters.second_dates}
                tag="p"
                className="text-gray-700"
              />
            </div>
          </div>
        </section>

        <section>
          <EditableText
            id="calendar-vacations-title"
            defaultContent={t.calendarPage.vacations.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">
                    <EditableText
                      id="calendar-table-type"
                      defaultContent={t.calendarPage.vacations.header.type}
                      tag="span"
                    />
                  </th>
                  <th className="p-3">
                    <EditableText
                      id="calendar-table-period"
                      defaultContent={t.calendarPage.vacations.header.period}
                      tag="span"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-autumn-type"
                      defaultContent={t.calendarPage.vacations.autumn.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-autumn-period"
                      defaultContent={t.calendarPage.vacations.autumn.period}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-christmas-type"
                      defaultContent={t.calendarPage.vacations.christmas.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-christmas-period"
                      defaultContent={t.calendarPage.vacations.christmas.period}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-intersession-type"
                      defaultContent={t.calendarPage.vacations.intersession.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-intersession-period"
                      defaultContent={t.calendarPage.vacations.intersession.period}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-spring16-type"
                      defaultContent={t.calendarPage.vacations.spring_1_6.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-spring16-period"
                      defaultContent={t.calendarPage.vacations.spring_1_6.period}
                      tag="span"
                    />
                  </td>
                </tr>
                 <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-spring7-type"
                      defaultContent={t.calendarPage.vacations.spring_7.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-spring7-period"
                      defaultContent={t.calendarPage.vacations.spring_7.period}
                      tag="span"
                    />
                  </td>
                </tr>
                 <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="calendar-holidays-type"
                      defaultContent={t.calendarPage.vacations.holidays.type}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="calendar-holidays-period"
                      defaultContent={t.calendarPage.vacations.holidays.period}
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
            id="calendar-nve-title"
            defaultContent={t.calendarPage.nve.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
           <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li>
                <strong>
                  <EditableText
                    id="calendar-bel7-title"
                    defaultContent={t.calendarPage.nve.bel7_title}
                    tag="span"
                  />
                </strong>{' '}
                <EditableText
                  id="calendar-bel7-date"
                  defaultContent={t.calendarPage.nve.bel7_date}
                  tag="span"
                />
              </li>
              <li>
                <strong>
                  <EditableText
                    id="calendar-math7-title"
                    defaultContent={t.calendarPage.nve.math7_title}
                    tag="span"
                  />
                </strong>{' '}
                <EditableText
                  id="calendar-math7-date"
                  defaultContent={t.calendarPage.nve.math7_date}
                  tag="span"
                />
              </li>
              <li>
                <strong>
                  <EditableText
                    id="calendar-bel4-title"
                    defaultContent={t.calendarPage.nve.bel4_title}
                    tag="span"
                  />
                </strong>{' '}
                <EditableText
                  id="calendar-bel4-date"
                  defaultContent={t.calendarPage.nve.bel4_date}
                  tag="span"
                />
              </li>
              <li>
                <strong>
                  <EditableText
                    id="calendar-math4-title"
                    defaultContent={t.calendarPage.nve.math4_title}
                    tag="span"
                  />
                </strong>{' '}
                <EditableText
                  id="calendar-math4-date"
                  defaultContent={t.calendarPage.nve.math4_date}
                  tag="span"
                />
              </li>
            </ul>
        </section>
      </div>
    </PageWrapper>
  );
};

export default CalendarPage;