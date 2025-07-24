import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList';

const OlympiadsPage: React.FC = () => {
  const { t } = useLanguage();
  const o = t.olympiadsPage;
  return (
    <PageWrapper title={o.title}>
      <EditableText
        id="olympiads-intro"
        defaultContent={o.intro}
        tag="p"
        className="mb-10"
      />
      
      <div className="space-y-12">
        <section>
          <EditableText
            id="olympiads-schedule-title"
            defaultContent={o.schedule.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-brand-blue-light text-white">
                <tr>
                  <th className="p-3">
                    <EditableText
                      id="olympiads-table-competition"
                      defaultContent={o.schedule.header.competition}
                      tag="span"
                    />
                  </th>
                  <th className="p-3">
                    <EditableText
                      id="olympiads-table-date"
                      defaultContent={o.schedule.header.date}
                      tag="span"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="olympiads-bel-name"
                      defaultContent={o.schedule.rows.bel.name}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="olympiads-bel-date"
                      defaultContent={o.schedule.rows.bel.date}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="olympiads-math-name"
                      defaultContent={o.schedule.rows.math.name}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="olympiads-math-date"
                      defaultContent={o.schedule.rows.math.date}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="olympiads-history-name"
                      defaultContent={o.schedule.rows.history.name}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="olympiads-history-date"
                      defaultContent={o.schedule.rows.history.date}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="olympiads-geography-name"
                      defaultContent={o.schedule.rows.geography.name}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="olympiads-geography-date"
                      defaultContent={o.schedule.rows.geography.date}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <EditableText
                      id="olympiads-knowcan-name"
                      defaultContent={o.schedule.rows.knowAndCan.name}
                      tag="span"
                    />
                  </td>
                  <td className="p-3">
                    <EditableText
                      id="olympiads-knowcan-date"
                      defaultContent={o.schedule.rows.knowAndCan.date}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <EditableText
              id="olympiads-schedule-note"
              defaultContent={o.schedule.note}
              tag="p"
              className="text-sm text-gray-600 mt-2"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="olympiads-successes-title"
            defaultContent={o.successes.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <EditableText
              id="olympiads-successes-subtitle"
              defaultContent={o.successes.subtitle}
              tag="h3"
              className="font-bold text-xl text-yellow-800 mb-3"
            />
            <EditableText
              id="olympiads-successes-p1"
              defaultContent={o.successes.p1}
              tag="p"
              className="text-yellow-900"
            />
            <EditableList
              id="olympiads-successes-results"
              defaultItems={[
                `${o.successes.results.r1.name} - ${o.successes.results.r1.result}`,
                `${o.successes.results.r2.name} - ${o.successes.results.r2.result}`,
                `${o.successes.results.r3.name} - ${o.successes.results.r3.result}`
              ]}
              className="list-disc list-inside space-y-2 mt-2 pl-4 text-yellow-900"
            />
            <EditableText
              id="olympiads-successes-p2"
              defaultContent={o.successes.p2}
              tag="p"
              className="mt-4 font-semibold"
            />
          </div>
        </section>

        <section>
          <EditableText
            id="olympiads-internal-title"
            defaultContent={o.internal.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="olympiads-internal-p1"
            defaultContent={o.internal.p1}
            tag="p"
            className="text-gray-700 mb-4"
          />
          <EditableList
            id="olympiads-internal-competitions"
            defaultItems={[
              o.internal.competitions.c1,
              o.internal.competitions.c2,
              o.internal.competitions.c3
            ]}
            className="list-disc list-inside space-y-2 mt-2 pl-4 mb-4"
          />
          <EditableText
            id="olympiads-internal-p2"
            defaultContent={o.internal.p2}
            tag="p"
            className="text-gray-700"
          />
        </section>
      </div>
    </PageWrapper>
  );
};

export default OlympiadsPage;