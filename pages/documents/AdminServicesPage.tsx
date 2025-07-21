
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const ServiceItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-brand-gold transition-all duration-300">
        <h3 className="text-xl font-bold text-brand-blue mb-3">{title}</h3>
        <div className="text-gray-700 space-y-2">
            {children}
        </div>
    </div>
);

const AdminServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const s = t.adminServicesPage.services;
  return (
    <PageWrapper title={t.adminServicesPage.title}>
      <p className="mb-10">{t.adminServicesPage.intro}</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <ServiceItem title={s.cert.title}>
            <p><strong>{s.common.description}:</strong> {s.cert.desc}</p>
            <p><strong>{s.common.documents}:</strong> {s.cert.docs}</p>
            <p><strong>{s.common.term}:</strong> {s.cert.term}</p>
        </ServiceItem>

        <ServiceItem title={s.duplicate.title}>
            <p><strong>{s.common.description}:</strong> {s.duplicate.desc}</p>
            <p><strong>{s.common.documents}:</strong> {s.duplicate.docs}</p>
            <p><strong>{s.common.term}:</strong> {s.duplicate.term}</p>
        </ServiceItem>

        <ServiceItem title={s.transfer.title}>
            <p><strong>{s.common.description}:</strong> {s.transfer.desc}</p>
            <p><strong>{s.common.documents}:</strong> {s.transfer.docs}</p>
            <p><strong>{s.common.term}:</strong> {s.transfer.term}</p>
        </ServiceItem>

        <ServiceItem title={s.absence.title}>
            <p><strong>{s.common.description}:</strong> {s.absence.desc}</p>
            <p><strong>{s.common.documents}:</strong> {s.absence.docs}</p>
            <p><strong>{s.common.term}:</strong> {s.absence.term}</p>
        </ServiceItem>
      </div>
    </PageWrapper>
  );
};

export default AdminServicesPage;
