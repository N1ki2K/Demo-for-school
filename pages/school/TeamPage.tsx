import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  isDirector?: boolean;
}

const TeamCard: React.FC<TeamMember> = ({ name, role, imageUrl, isDirector = false }) => (
  <div className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border ${isDirector ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-100 hover:border-blue-200'}`}>
    <div className="text-center">
      <div className="relative inline-block mb-6">
        <img
          className={`w-28 h-28 rounded-full object-cover border-4 ${isDirector ? 'border-blue-600' : 'border-gray-200'} shadow-md`}
          src={imageUrl}
          alt={name}
        />
        {isDirector && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              Директор
            </span>
          </div>
        )}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isDirector ? 'text-blue-800' : 'text-gray-800'}`}>
        {name}
      </h3>
      <p className="text-gray-600 text-sm font-medium">{role}</p>
    </div>
  </div>
);

const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Create director as separate member
  const director = {
    name: t.teamPage.director.name,
    role: t.teamPage.director.title,
    imageUrl: 'https://picsum.photos/400/400?random=20',
    isDirector: true
  };

  // Create teachers array with random images
  const teachers = t.teamPage.teachers.list.map((teacher, index) => ({
    name: teacher.name,
    role: teacher.role,
    imageUrl: `https://picsum.photos/400/400?random=${21 + index}`,
    isDirector: false
  }));

  return (
    <PageWrapper title={t.teamPage.title}>
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12 border border-blue-100">
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
          {t.teamPage.intro}
        </p>
      </div>
      
      {/* Team Photo Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Нашият екип</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <figure className="text-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-2">
            <img 
              className="w-full max-w-5xl mx-auto rounded-xl" 
              src="https://picsum.photos/1200/600?random=100" 
              alt="Колективна снимка на училищния екип" 
            />
          </div>
          <figcaption className="text-center text-gray-500 mt-4 font-medium">
            Колективна снимка на училищния екип на ОУ "Кольо Ганчев"
          </figcaption>
        </figure>
      </div>

      {/* Director Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Ръководство</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <TeamCard {...director} />
          </div>
        </div>
      </div>

      {/* Teachers Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {t.teamPage.teachers.title}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Нашият преподавателски екип се състои от опитни и отдадени специалисти, 
            които работят с любов и професионализъм за развитието на всяко дете.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teachers.map((teacher, index) => (
            <TeamCard key={`${teacher.name}-${index}`} {...teacher} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default TeamPage;