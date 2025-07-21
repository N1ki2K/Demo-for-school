
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const TeamCard: React.FC<TeamMember> = ({ name, role, imageUrl }) => (
  <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <img
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-brand-gold"
      src={imageUrl}
      alt={name}
    />
    <h3 className="text-xl font-bold text-brand-blue">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);


const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const teamMembers = [
      { name: 'Инж. Мариана Пенчева', role: t.teamPage.roles.director, imageUrl: 'https://picsum.photos/400/400?random=20' },
      { name: 'Гергана Иванова', role: t.teamPage.roles.deputyDirector, imageUrl: 'https://picsum.photos/400/400?random=21' },
      { name: 'Петър Димитров', role: t.teamPage.roles.belTeacher, imageUrl: 'https://picsum.photos/400/400?random=22' },
      { name: 'Елена Василева', role: t.teamPage.roles.mathTeacher, imageUrl: 'https://picsum.photos/400/400?random=23' },
      { name: 'Иван Тодоров', role: t.teamPage.roles.englishTeacher, imageUrl: 'https://picsum.photos/400/400?random=24' },
      { name: 'Светла Николова', role: t.teamPage.roles.primaryTeacher, imageUrl: 'https://picsum.photos/400/400?random=25' },
      { name: 'Георги Стоянов', role: t.teamPage.roles.peTeacher, imageUrl: 'https://picsum.photos/400/400?random=26' },
      { name: 'Мария Георгиева', role: t.teamPage.roles.counselor, imageUrl: 'https://picsum.photos/400/400?random=27' },
  ];
  return (
    <PageWrapper title={t.teamPage.title}>
      <p className="mb-12">{t.teamPage.intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default TeamPage;
