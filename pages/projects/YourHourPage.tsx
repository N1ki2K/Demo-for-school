import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableImage';
import { EditableList } from '../../components/cms/EditableList';

const YourHourPage: React.FC = () => {
  const { t } = useLanguage();
  const p = t.yourHourPage;

  return (
    <PageWrapper title={p.title}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl">
          <div className="text-center">
            <EditableText
              id="yourHour_subtitle"
              defaultContent={p.subtitle}
              tag="h2"
              className="text-2xl font-bold mb-2"
            />
            <EditableText
              id="yourHour_projectCode"
              defaultContent={p.projectCode}
              className="text-blue-100 text-sm mb-4"
            />
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="block font-semibold">
                  {p.projectInfo.budget.label}
                </span>
                <EditableText
                  id="yourHour_budgetAmount"
                  defaultContent={p.projectInfo.budget.amount}
                />
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="block font-semibold">
                  {p.projectInfo.duration.label}
                </span>
                <EditableText
                  id="yourHour_durationPeriod"
                  defaultContent={p.projectInfo.duration.period}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Image */}
        <figure className="text-center">
          <EditableImage
            id="yourHour_mainImage"
            defaultSrc="https://picsum.photos/1200/400?random=30"
            alt={p.title}
            className="w-full max-w-4xl mx-auto rounded-xl shadow-lg"
          />
          <figcaption className="text-center text-sm text-gray-500 mt-3">
            {p.title} - {p.subtitle}
          </figcaption>
        </figure>

        {/* Introduction */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <EditableText
            id="yourHour_intro"
            defaultContent={p.intro}
            className="text-lg leading-relaxed text-gray-700"
          />
        </div>

        {/* Overview */}
        <div>
          <EditableText
            id="yourHour_overviewTitle"
            defaultContent={p.overview.title}
            tag="h2"
            className="text-3xl font-bold text-gray-800 mb-4"
          />
          <EditableText
            id="yourHour_overviewMainGoal"
            defaultContent={p.overview.mainGoal}
            className="text-lg mb-6 text-gray-700"
          />
          <EditableList
            id="yourHour_overviewGoals"
            defaultItems={p.overview.goals}
            className="grid md:grid-cols-2 gap-4"
          />
        </div>

        {/* Target Group */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <EditableText
            id="yourHour_targetGroupTitle"
            defaultContent={p.projectInfo.targetGroup.title}
            tag="h3"
            className="text-xl font-semibold text-gray-800 mb-3"
          />
          <EditableText
            id="yourHour_targetGroupDescription"
            defaultContent={p.projectInfo.targetGroup.description}
            className="text-gray-600"
          />
        </div>

        {/* Specific Goals */}
        <div>
          <EditableText
            id="yourHour_specificGoalsTitle"
            defaultContent={p.specificGoals.title}
            tag="h2"
            className="text-3xl font-bold text-gray-800 mb-6"
          />
          <EditableList
            id="yourHour_specificGoalsList"
            defaultItems={p.specificGoals.goals}
            className="space-y-4"
          />
        </div>

        {/* Council */}
        <div>
          <EditableText
            id="yourHour_councilTitle"
            defaultContent={p.council.title}
            tag="h3"
            className="text-2xl font-bold mb-4"
          />
          <EditableText
            id="yourHour_councilDescription"
            defaultContent={p.council.description}
            className="text-gray-700"
          />
        </div>

        {/* Expected Results */}
        <div>
          <EditableText
            id="yourHour_expectedResultsTitle"
            defaultContent={p.expectedResults.title}
            tag="h2"
            className="text-3xl font-bold text-gray-800 mb-6"
          />
          <EditableList
            id="yourHour_expectedResultsList"
            defaultItems={p.expectedResults.results}
            className="grid md:grid-cols-2 gap-6"
          />
        </div>

        {/* Implementation */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-xl">
          <EditableText
            id="yourHour_implementationTitle"
            defaultContent={p.implementation.title}
            tag="h2"
            className="text-3xl font-bold text-gray-800 mb-4"
          />
          <EditableText
            id="yourHour_implementationDescription"
            defaultContent={p.implementation.description}
            className="text-lg text-gray-700 leading-relaxed"
          />
        </div>

        {/* EU Funding Notice */}
        <div className="bg-blue-900 text-white p-6 rounded-lg text-center">
          <EditableText
            id="yourHour_euFundingNotice"
            defaultContent={`Този проект се осъществява с финансовата подкрепа на Европейския съюз чрез Европейските структурни и инвестиционни фондове в рамките на Оперативна програма "Наука и образование за интелигентен растеж" 2014-2020.`}
            className="text-sm"
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default YourHourPage;
