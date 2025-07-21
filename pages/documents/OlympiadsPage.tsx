
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const OlympiadsPage: React.FC = () => {
  const { t } = useLanguage();
  const o = t.olympiadsPage;
  return (
    <PageWrapper title={o.title}>
      <p className="mb-10">{o.intro}</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{o.schedule.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">{o.schedule.header.competition}</th>
                  <th className="p-3">{o.schedule.header.date}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.schedule.rows.bel.name}</td>
                  <td className="p-3">{o.schedule.rows.bel.date}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.schedule.rows.math.name}</td>
                  <td className="p-3">{o.schedule.rows.math.date}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.schedule.rows.history.name}</td>
                  <td className="p-3">{o.schedule.rows.history.date}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.schedule.rows.geography.name}</td>
                  <td className="p-3">{o.schedule.rows.geography.date}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.schedule.rows.knowAndCan.name}</td>
                  <td className="p-3">{o.schedule.rows.knowAndCan.date}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-600 mt-2">{o.schedule.note}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{o.successes.title}</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h3 className="font-bold text-xl text-yellow-800 mb-3">{o.successes.subtitle}</h3>
            <p className="text-yellow-900">{o.successes.p1}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4 text-yellow-900">
              <li><strong>{o.successes.results.r1.name}</strong> - {o.successes.results.r1.result}</li>
              <li><strong>{o.successes.results.r2.name}</strong> - {o.successes.results.r2.result}</li>
              <li><strong>{o.successes.results.r3.name}</strong> - {o.successes.results.r3.result}</li>
            </ul>
            <p className="mt-4 font-semibold">{o.successes.p2}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{o.internal.title}</h2>
          <p className="text-gray-700">{o.internal.p1}
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>{o.internal.competitions.c1}</li>
                <li>{o.internal.competitions.c2}</li>
                <li>{o.internal.competitions.c3}</li>
            </ul>
            {o.internal.p2}
          </p>
        </section>
      </div>
    </PageWrapper>
  );
};

export default OlympiadsPage;
