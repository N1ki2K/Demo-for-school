
import React from 'react';
import GenericProjectPage from './GenericProjectPage';
import { useLanguage } from '../../context/LanguageContext';

const EducationTomorrowPage: React.FC = () => {
  const { t } = useLanguage();
  const p = t.educationTomorrowPage;
  return (
    <GenericProjectPage 
      title={p.title}
      imageUrl='https://picsum.photos/1200/400?random=32'
      imageAlt={p.title}
    >
      <p>{p.p1}</p>
      <p>{p.p2}</p>
      <h2 className="text-2xl font-semibold text-brand-blue-dark pt-4">{p.goalsTitle}</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>{p.goals.g1}</li>
        <li>{p.goals.g2}</li>
        <li>{p.goals.g3}</li>
        <li>{p.goals.g4}</li>
      </ul>
      <p>{p.p3}</p>
    </GenericProjectPage>
  );
};

export default EducationTomorrowPage;
