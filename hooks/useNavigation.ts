// hooks/useNavigation.ts
import { useState, useEffect } from 'react';
import { apiService } from '../src/services/api';
import { NavItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PageData {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  position: number;
  is_active: boolean;
  show_in_menu: boolean;
  children?: PageData[];
}

// Fallback navigation for when API fails or is loading
const getFallbackNavigation = (t: any): NavItem[] => [
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
];

export const useNavigation = () => {
  const { t } = useLanguage();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformPageToNavItem = (page: PageData): NavItem => {
    // Map database page names to translated labels
    const getTranslatedLabel = (pageId: string, pageName: string): string => {
      const labelMap: Record<string, string> = {
        'home': t.nav.home,
        'school': t.nav.school.title,
        'school-history': t.nav.school.history,
        'school-patron': t.nav.school.patron,
        'school-team': t.nav.school.team,
        'school-council': t.nav.school.council,
        'documents': t.nav.documents.title,
        'documents-calendar': t.nav.documents.calendar,
        'documents-schedules': t.nav.documents.schedules,
        'projects': t.nav.projects.title,
        'projects-your-hour': t.nav.projects.yourHour,
        'useful-links': t.nav.usefulLinks,
        'gallery': t.nav.gallery,
        'contacts': t.nav.contacts,
        'info-access': t.nav.infoAccess
      };
      
      return labelMap[pageId] || pageName;
    };

    return {
      label: getTranslatedLabel(page.id, page.name),
      path: page.path,
      children: page.children ? page.children.map(transformPageToNavItem) : undefined,
    };
  };

  const loadNavigation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pages = await apiService.getPages();
      const navItems = pages.map(transformPageToNavItem);
      
      setNavItems(navItems);
    } catch (err) {
      console.warn('Failed to load dynamic navigation, using fallback:', err);
      setError('Failed to load navigation');
      setNavItems(getFallbackNavigation(t));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNavigation();
  }, [t]); // Reload when language changes

  return {
    navItems: navItems.length > 0 ? navItems : getFallbackNavigation(t),
    isLoading,
    error,
    reloadNavigation: loadNavigation,
  };
};