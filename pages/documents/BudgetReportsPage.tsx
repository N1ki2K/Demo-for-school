import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';

const BudgetReportsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper title={t.budgetPage.title}>
      <EditableText
        id="budget-intro"
        defaultContent={t.budgetPage.intro}
        tag="p"
        className="mb-10"
      />

      <div className="space-y-12">

        <section>
          <EditableText
            id="budget-2024-title"
            defaultContent={t.budgetPage.budget2024.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="budget-2024-description"
            defaultContent={t.budgetPage.budget2024.description}
            tag="p"
            className="text-gray-700 mb-6"
          />
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-brand-blue text-white">
                <tr>
                  <th className="p-4 font-semibold">
                    <EditableText
                      id="budget-table-header-item"
                      defaultContent={t.budgetPage.table.header.item}
                      tag="span"
                    />
                  </th>
                  <th className="p-4 font-semibold text-right">
                    <EditableText
                      id="budget-table-header-amount"
                      defaultContent={t.budgetPage.table.header.amount}
                      tag="span"
                    />
                  </th>
                  <th className="p-4 font-semibold text-right">
                    <EditableText
                      id="budget-table-header-share"
                      defaultContent={t.budgetPage.table.header.share}
                      tag="span"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <EditableText
                      id="budget-staff-item"
                      defaultContent={t.budgetPage.table.rows.staff}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-staff-amount"
                      defaultContent="875,000"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-staff-share"
                      defaultContent="70.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <EditableText
                      id="budget-maintenance-item"
                      defaultContent={t.budgetPage.table.rows.maintenance}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-maintenance-amount"
                      defaultContent="150,000"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-maintenance-share"
                      defaultContent="12.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <EditableText
                      id="budget-supplies-item"
                      defaultContent={t.budgetPage.table.rows.supplies}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-supplies-amount"
                      defaultContent="62,500"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-supplies-share"
                      defaultContent="5.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <EditableText
                      id="budget-utilities-item"
                      defaultContent={t.budgetPage.table.rows.utilities}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-utilities-amount"
                      defaultContent="100,000"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-utilities-share"
                      defaultContent="8.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <EditableText
                      id="budget-qualification-item"
                      defaultContent={t.budgetPage.table.rows.qualification}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-qualification-amount"
                      defaultContent="25,000"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-qualification-share"
                      defaultContent="2.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                 <tr className="bg-gray-100 font-bold">
                  <td className="p-4">
                    <EditableText
                      id="budget-total-item"
                      defaultContent={t.budgetPage.table.rows.total}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-total-amount"
                      defaultContent="1,212,500"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-total-share"
                      defaultContent="97.0%"
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="bg-yellow-50 font-semibold">
                  <td className="p-4">
                    <EditableText
                      id="budget-reserve-item"
                      defaultContent={t.budgetPage.table.rows.reserve}
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-reserve-amount"
                      defaultContent="37,500"
                      tag="span"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <EditableText
                      id="budget-reserve-share"
                      defaultContent="3.0%"
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
            id="budget-report-2023-title"
            defaultContent={t.budgetPage.report2023.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="budget-report-2023-description"
            defaultContent={t.budgetPage.report2023.description}
            tag="p"
            className="text-gray-700"
          />
        </section>

      </div>
    </PageWrapper>
  );
};

export default BudgetReportsPage;