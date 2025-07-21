
import React from 'react';
import GenericProjectPage from './GenericProjectPage';
import { useLanguage } from '../../context/LanguageContext';

const YourHourPage: React.FC = () => {
  const { t } = useLanguage();
  const p = t.yourHourPage;
  return (
    <GenericProjectPage 
      title={p.title}
      imageUrl='https://picsum.photos/1200/400?random=30'
      imageAlt={p.title}
    >
      <p>{p.p1}</p>
      <h2 className="text-2xl font-semibold text-brand-blue-dark pt-4">{p.goalsTitle}</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>{p.goals.g1}</li>
        <li>{p.goals.g2}</li>
        <li>{p.goals.g3}</li>
      </ul>
      <p>{p.p2}</p>
    </GenericProjectPage>
  );
};

export default YourHourPage;
