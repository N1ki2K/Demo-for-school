
import { NavItem } from './types';

// The navLinks export is now a function that takes the getTranslation function
// and returns the navigation links in the currently selected language.
export const getNavLinks = (getTranslation: (key: string, fallback?: string) => string): NavItem[] => [
  { label: getTranslation('nav.home', 'Начало'), path: '/' },
  {
    label: getTranslation('nav.school.title', 'Училището'),
    path: '/school',
    children: [
      { label: getTranslation('nav.school.history', 'История'), path: '/history' },
      { label: getTranslation('nav.school.patron', 'Патрон'), path: '/patron' },
      { label: getTranslation('nav.school.team', 'Екип'), path: '/team' },
      { label: getTranslation('nav.school.council', 'Съвет'), path: '/council' },
    ],
  },
  {
    label: getTranslation('nav.documents.title', 'Документи'),
    path: '/documents',
    children: [
      { label: getTranslation('nav.documents.calendar', 'Календар'), path: '/calendar' },
      { label: getTranslation('nav.documents.schedules', 'Разписания'), path: '/schedules' },
      { label: getTranslation('nav.documents.budget', 'Бюджет'), path: '/budget' },
      { label: getTranslation('nav.documents.rules', 'Правилници'), path: '/rules' },
      { label: getTranslation('nav.documents.ethics', 'Етика'), path: '/ethics' },
      { label: getTranslation('nav.documents.adminServices', 'Административни услуги'), path: '/admin-services' },
      { label: getTranslation('nav.documents.admissions', 'Прием'), path: '/admissions' },
      { label: getTranslation('nav.documents.roadSafety', 'Пътна безопасност'), path: '/road-safety' },
      { label: getTranslation('nav.documents.ores', 'ОРЕС'), path: '/ores' },
      { label: getTranslation('nav.documents.continuingEducation', 'Продължаващо образование'), path: '/continuing-education' },
      { label: getTranslation('nav.documents.faq', 'ЧЗВ'), path: '/faq' },
      { label: getTranslation('nav.documents.announcement', 'Обявление'), path: '/announcement' },
      { label: getTranslation('nav.documents.students', 'Ученици'), path: '/students' },
      { label: getTranslation('nav.documents.olympiads', 'Олимпиади'), path: '/olympiads' },
    ],
  },
  { label: getTranslation('nav.usefulLinks', 'Полезни връзки'), path: '/useful-links' },
  { label: getTranslation('nav.gallery', 'Галерия'), path: '/gallery' },
  {
    label: getTranslation('nav.projects.title', 'Проекти'),
    path: '/projects',
    children: [
      { label: getTranslation('nav.projects.yourHour', 'Твоят час'), path: '/your-hour' },
      { label: getTranslation('nav.projects.supportForSuccess', 'Подкрепа за успех'), path: '/support-for-success' },
      { label: getTranslation('nav.projects.educationForTomorrow', 'Образование за утре'), path: '/education-for-tomorrow' },
    ],
  },
  { label: getTranslation('nav.contacts', 'Контакти'), path: '/contacts' },
  { label: getTranslation('nav.infoAccess', 'Достъп до информация'), path: '/info-access' },
];
