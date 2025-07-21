import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const YourHourPage: React.FC = () => {
  const { t } = useLanguage();
  const p = t.yourHourPage;

  return (
    <PageWrapper title={p.title}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{p.subtitle}</h2>
            <p className="text-blue-100 text-sm mb-4">{p.projectCode}</p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="block font-semibold">Стойност</span>
                <span>{p.projectInfo.budget.amount}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="block font-semibold">Период</span>
                <span>{p.projectInfo.duration.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Image */}
        <figure className="text-center">
          <img 
            className="w-full max-w-4xl mx-auto rounded-xl shadow-lg" 
            src="https://picsum.photos/1200/400?random=30" 
            alt={p.title}
          />
          <figcaption className="text-center text-sm text-gray-500 mt-3">
            Проект "Твоят час" - развитие на способностите на учениците
          </figcaption>
        </figure>

        {/* Introduction */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-lg leading-relaxed text-gray-700">{p.intro}</p>
        </div>

        {/* Overview */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{p.overview.title}</h2>
          <p className="text-lg mb-6 text-gray-700">{p.overview.mainGoal}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {p.overview.goals.map((goal, index) => (
              <div key={index} className="flex items-start bg-blue-50 p-4 rounded-lg">
                <span className="text-blue-600 mr-3 text-xl">•</span>
                <span className="text-gray-700">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Group */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {p.projectInfo.targetGroup.title}
          </h3>
          <p className="text-gray-600">{p.projectInfo.targetGroup.description}</p>
        </div>

        {/* Specific Goals */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{p.specificGoals.title}</h2>
          <div className="space-y-4">
            {p.specificGoals.goals.map((goal, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-3 bg-gray-50">
                <span className="text-gray-700">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* School Programs */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{p.schoolPrograms.title}</h2>
          <p className="text-gray-700 mb-6">{p.schoolPrograms.description}</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {p.schoolPrograms.activities.title}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.schoolPrograms.activities.list.map((activity, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-3">{p.platform.title}</h3>
          <p className="text-gray-700 mb-4">{p.platform.description}</p>
          <a 
            href={p.platform.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Посети платформата</span>
            <span className="ml-2">→</span>
          </a>
        </div>

        {/* Council */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-xl font-semibold text-yellow-800 mb-3">{p.council.title}</h3>
          <p className="text-gray-700">{p.council.description}</p>
        </div>

        {/* Expected Results */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{p.expectedResults.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {p.expectedResults.results.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{p.implementation.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{p.implementation.description}</p>
        </div>

        {/* EU Funding Notice */}
        <div className="bg-blue-900 text-white p-6 rounded-lg text-center">
          <p className="text-sm">
            Този проект се осъществява с финансовата подкрепа на Европейския съюз чрез 
            Европейските структурни и инвестиционни фондове в рамките на 
            Оперативна програма "Наука и образование за интелигентен растеж" 2014-2020.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default YourHourPage;