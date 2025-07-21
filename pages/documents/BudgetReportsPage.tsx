
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const BudgetReportsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageWrapper title={t.budgetPage.title}>
      <p className="mb-10">{t.budgetPage.intro}</p>

      <div className="space-y-12">

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.budgetPage.budget2024.title}</h2>
          <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t.budgetPage.budget2024.description }}/>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-brand-blue text-white">
                <tr>
                  <th className="p-4 font-semibold">{t.budgetPage.table.header.item}</th>
                  <th className="p-4 font-semibold text-right">{t.budgetPage.table.header.amount}</th>
                  <th className="p-4 font-semibold text-right">{t.budgetPage.table.header.share}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.budgetPage.table.rows.staff}</td>
                  <td className="p-4 text-right">875,000</td>
                  <td className="p-4 text-right">70.0%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.budgetPage.table.rows.maintenance}</td>
                  <td className="p-4 text-right">150,000</td>
                  <td className="p-4 text-right">12.0%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.budgetPage.table.rows.supplies}</td>
                  <td className="p-4 text-right">62,500</td>
                  <td className="p-4 text-right">5.0%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.budgetPage.table.rows.utilities}</td>
                  <td className="p-4 text-right">100,000</td>
                  <td className="p-4 text-right">8.0%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.budgetPage.table.rows.qualification}</td>
                  <td className="p-4 text-right">25,000</td>
                  <td className="p-4 text-right">2.0%</td>
                </tr>
                 <tr className="bg-gray-100 font-bold">
                  <td className="p-4">{t.budgetPage.table.rows.total}</td>
                  <td className="p-4 text-right">1,212,500</td>
                  <td className="p-4 text-right">97.0%</td>
                </tr>
                <tr className="bg-yellow-50 font-semibold">
                  <td className="p-4">{t.budgetPage.table.rows.reserve}</td>
                  <td className="p-4 text-right">37,500</td>
                  <td className="p-4 text-right">3.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.budgetPage.report2023.title}</h2>
          <p className="text-gray-700">{t.budgetPage.report2023.description}</p>
        </section>

      </div>
    </PageWrapper>
  );
};

export default BudgetReportsPage;
