
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const CalendarPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.calendarPage.title}>
      <p className="mb-10">{t.calendarPage.intro}</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.calendarPage.semesters.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.calendarPage.semesters.first}</h3>
              <p className="text-gray-700">{t.calendarPage.semesters.first_dates}</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
              <h3 className="font-bold text-xl text-brand-blue mb-2">{t.calendarPage.semesters.second}</h3>
              <p className="text-gray-700">{t.calendarPage.semesters.second_dates}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.calendarPage.vacations.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">{t.calendarPage.vacations.header.type}</th>
                  <th className="p-3">{t.calendarPage.vacations.header.period}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.autumn.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.autumn.period}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.christmas.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.christmas.period}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.intersession.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.intersession.period}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.spring_1_6.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.spring_1_6.period}</td>
                </tr>
                 <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.spring_7.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.spring_7.period}</td>
                </tr>
                 <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{t.calendarPage.vacations.holidays.type}</td>
                  <td className="p-3">{t.calendarPage.vacations.holidays.period}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.calendarPage.nve.title}</h2>
           <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li><strong>{t.calendarPage.nve.bel7_title}:</strong> {t.calendarPage.nve.bel7_date}</li>
              <li><strong>{t.calendarPage.nve.math7_title}:</strong> {t.calendarPage.nve.math7_date}</li>
              <li><strong>{t.calendarPage.nve.bel4_title}:</strong> {t.calendarPage.nve.bel4_date}</li>
              <li><strong>{t.calendarPage.nve.math4_title}:</strong> {t.calendarPage.nve.math4_date}</li>
            </ul>
        </section>
      </div>
    </PageWrapper>
  );
};

export default CalendarPage;
