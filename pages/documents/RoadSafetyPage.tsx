import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList';

const RoadSafetyPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.roadSafetyPage.title}>
      <EditableText
        id="road-safety-intro"
        defaultContent={t.roadSafetyPage.intro}
        tag="p"
        className="mb-10"
      />
      
      <div className="space-y-12">
        <section>
          <EditableText
            id="road-safety-plan-title"
            defaultContent={t.roadSafetyPage.plan.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="road-safety-plan-description"
            defaultContent={t.roadSafetyPage.plan.description}
            tag="p"
            className="text-gray-700 mb-4"
          />
          <EditableList
            id="road-safety-plan-items"
            defaultItems={[
              `${t.roadSafetyPage.plan.items.i1.title}: ${t.roadSafetyPage.plan.items.i1.text}`,
              `${t.roadSafetyPage.plan.items.i2.title}: ${t.roadSafetyPage.plan.items.i2.text}`,
              `${t.roadSafetyPage.plan.items.i3.title}: ${t.roadSafetyPage.plan.items.i3.text}`,
              `${t.roadSafetyPage.plan.items.i4.title}: ${t.roadSafetyPage.plan.items.i4.text}`
            ]}
            ordered={true}
            className="list-decimal list-inside space-y-2 text-gray-700 pl-4"
          />
        </section>

        <section>
          <EditableText
            id="road-safety-tips-title"
            defaultContent={t.roadSafetyPage.tips.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-50 p-6 rounded-lg">
                <EditableText
                  id="road-safety-students-title"
                  defaultContent={t.roadSafetyPage.tips.students.title}
                  tag="h3"
                  className="font-bold text-xl text-yellow-800 mb-2"
                />
                <EditableList
                  id="road-safety-students-tips"
                  defaultItems={[
                    t.roadSafetyPage.tips.students.s1,
                    t.roadSafetyPage.tips.students.s2,
                    t.roadSafetyPage.tips.students.s3,
                    t.roadSafetyPage.tips.students.s4,
                    t.roadSafetyPage.tips.students.s5
                  ]}
                  className="list-disc list-inside space-y-2 text-yellow-900"
                />
            </div>
             <div className="bg-blue-50 p-6 rounded-lg">
                <EditableText
                  id="road-safety-parents-title"
                  defaultContent={t.roadSafetyPage.tips.parents.title}
                  tag="h3"
                  className="font-bold text-xl text-blue-800 mb-2"
                />
                <EditableList
                  id="road-safety-parents-tips"
                  defaultItems={[
                    t.roadSafetyPage.tips.parents.p1,
                    t.roadSafetyPage.tips.parents.p2,
                    t.roadSafetyPage.tips.parents.p3,
                    t.roadSafetyPage.tips.parents.p4,
                    t.roadSafetyPage.tips.parents.p5
                  ]}
                  className="list-disc list-inside space-y-2 text-blue-900"
                />
            </div>
          </div>
        </section>

        <section>
          <EditableText
            id="road-safety-routes-title"
            defaultContent={t.roadSafetyPage.routes.title}
            tag="h2"
            className="text-2xl font-semibold text-brand-blue-dark mb-4"
          />
          <EditableText
            id="road-safety-routes-text"
            defaultContent={t.roadSafetyPage.routes.text}
            tag="p"
            className="text-gray-700"
          />
        </section>
      </div>
    </PageWrapper>
  );
};

export default RoadSafetyPage;