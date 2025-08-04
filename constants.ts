
import { NavItem } from './types';

// The navLinks export is now a function that takes the translation object (t)
// and returns the navigation links in the currently selected language.
export const getNavLinks = (t: any): NavItem[] => [
  { label: t.nav.home, path: '/' },
  {
    label: t.nav.school.title,
    path: '/school',
    children: [
      { label: t.nav.school.history, path: '/history' },
      { label: t.nav.school.patron, path: '/patron' },
      { label: t.nav.school.team, path: '/team' },
      { label: t.nav.school.council, path: '/council' },
    ],
  },
  {
    label: t.nav.documents.title,
    path: '/documents',
    children: [
      { label: t.nav.documents.calendar, path: '/calendar' },
      { label: t.nav.documents.schedules, path: '/schedules' },
      { label: t.nav.documents.budget, path: '/budget' },
      { label: t.nav.documents.rules, path: '/rules' },
      { label: t.nav.documents.ethics, path: '/ethics' },
      { label: t.nav.documents.adminServices, path: '/admin-services' },
      { label: t.nav.documents.admissions, path: '/admissions' },
      { label: t.nav.documents.roadSafety, path: '/road-safety' },
      { label: t.nav.documents.ores, path: '/ores' },
      { label: t.nav.documents.continuingEducation, path: '/continuing-education' },
      { label: t.nav.documents.faq, path: '/faq' },
      { label: t.nav.documents.announcement, path: '/announcement' },
      { label: t.nav.documents.students, path: '/students' },
      { label: t.nav.documents.olympiads, path: '/olympiads' },
    ],
  },
  { label: t.nav.usefulLinks, path: '/useful-links' },
  { label: t.nav.gallery, path: '/gallery' },
  {
    label: t.nav.projects.title,
    path: '/projects',
    children: [
      { label: t.nav.projects.yourHour, path: '/your-hour' },
      { label: t.nav.projects.supportForSuccess, path: '/support-for-success' },
      { label: t.nav.projects.educationForTomorrow, path: '/education-for-tomorrow' },
    ],
  },
  { label: t.nav.contacts, path: '/contacts' },
  { label: t.nav.infoAccess, path: '/info-access' },
  { label: t.nav.createPost, path: '/create' }
];
