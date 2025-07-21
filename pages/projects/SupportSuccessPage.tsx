
import React from 'react';
import GenericProjectPage from './GenericProjectPage';
import { useLanguage } from '../../context/LanguageContext';

const SupportSuccessPage: React.FC = () => {
  const { t } = useLanguage();
  const p = t.supportSuccessPage;
  return (
    <GenericProjectPage 
      title={p.title}
      imageUrl='https://picsum.photos/1200/400?random=31'
      imageAlt={p.title}
    >
        <p>{p.p1}</p>
        <p>{p.p2}</p>
        <h2 className="text-2xl font-semibold text-brand-blue-dark pt-4">{p.activitiesTitle}</h2>
        <ul className="list-disc list-inside space-y-2">
            <li>{p.activities.a1}</li>
            <li>{p.activities.a2}</li>
            <li>{p.activities.a3}</li>
            <li>{p.activities.a4}</li>
        </ul>
    </GenericProjectPage>
  );
};

export default SupportSuccessPage;
