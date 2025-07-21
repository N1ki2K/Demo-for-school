
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const RoadSafetyPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.roadSafetyPage.title}>
      <p className="mb-10">{t.roadSafetyPage.intro}</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.roadSafetyPage.plan.title}</h2>
          <p className="text-gray-700 mb-4">{t.roadSafetyPage.plan.description}</p>
          <ul className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
            <li><strong>{t.roadSafetyPage.plan.items.i1.title}:</strong> {t.roadSafetyPage.plan.items.i1.text}</li>
            <li><strong>{t.roadSafetyPage.plan.items.i2.title}:</strong> {t.roadSafetyPage.plan.items.i2.text}</li>
            <li><strong>{t.roadSafetyPage.plan.items.i3.title}:</strong> {t.roadSafetyPage.plan.items.i3.text}</li>
            <li><strong>{t.roadSafetyPage.plan.items.i4.title}:</strong> {t.roadSafetyPage.plan.items.i4.text}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.roadSafetyPage.tips.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-yellow-800 mb-2">{t.roadSafetyPage.tips.students.title}</h3>
                <ul className="list-disc list-inside space-y-2 text-yellow-900">
                    <li>{t.roadSafetyPage.tips.students.s1}</li>
                    <li>{t.roadSafetyPage.tips.students.s2}</li>
                    <li>{t.roadSafetyPage.tips.students.s3}</li>
                    <li>{t.roadSafetyPage.tips.students.s4}</li>
                    <li>{t.roadSafetyPage.tips.students.s5}</li>
                </ul>
            </div>
             <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-blue-800 mb-2">{t.roadSafetyPage.tips.parents.title}</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-900">
                    <li>{t.roadSafetyPage.tips.parents.p1}</li>
                    <li>{t.roadSafetyPage.tips.parents.p2}</li>
                    <li>{t.roadSafetyPage.tips.parents.p3}</li>
                    <li>{t.roadSafetyPage.tips.parents.p4}</li>
                    <li>{t.roadSafetyPage.tips.parents.p5}</li>
                </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand-blue-dark mb-4">{t.roadSafetyPage.routes.title}</h2>
          <p className="text-gray-700">{t.roadSafetyPage.routes.text}</p>
        </section>
      </div>
    </PageWrapper>
  );
};

export default RoadSafetyPage;
