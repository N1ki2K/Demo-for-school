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
const getFallbackNavigation = (getTranslation: (key: string, fallback?: string) => string): NavItem[] => [
  { label: getTranslation('nav.home', 'Home'), path: '/' },
  {
    label: getTranslation('nav.school.title', 'School'),
    path: '/school',
    children: [
      { label: getTranslation('nav.school.history', 'History'), path: '/school/history' },
      { label: getTranslation('nav.school.patron', 'Patron'), path: '/school/patron' },
      { label: getTranslation('nav.school.team', 'Team'), path: '/school/team' },
      { label: getTranslation('nav.school.council', 'Council'), path: '/school/council' },
    ],
  },
  {
    label: getTranslation('nav.documents.title', 'Documents'),
    path: '/documents',
    children: [], // Empty dropdown as requested
  },
  { label: getTranslation('nav.gallery', 'Gallery'), path: '/gallery' },
  { label: getTranslation('nav.usefulLinks', 'Useful Links'), path: '/useful-links' },
  {
    label: getTranslation('nav.projects.title', 'Projects'),
    path: '/projects',
    children: [], // Empty dropdown as requested
  },
  { label: getTranslation('nav.contacts', 'Contacts'), path: '/contacts' },
  { label: getTranslation('nav.infoAccess', 'Info Access'), path: '/info-access' },
];

export const useNavigation = () => {
  const { t, getTranslation } = useLanguage();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTranslatedLabel = (pageId: string, pageName: string): string => {
    const labelMap: Record<string, string> = {
      'home': getTranslation('nav.home', 'Home'),
      'school': getTranslation('nav.school.title', 'School'),
      'school-history': getTranslation('nav.school.history', 'History'),
      'school-patron': getTranslation('nav.school.patron', 'Patron'),
      'school-team': getTranslation('nav.school.team', 'Team'),
      'school-council': getTranslation('nav.school.council', 'Council'),
      'documents': getTranslation('nav.documents.title', 'Documents'),
      'documents-calendar': getTranslation('nav.documents.calendar', 'Calendar'),
      'documents-schedules': getTranslation('nav.documents.schedules', 'Schedules'),
      'projects': getTranslation('nav.projects.title', 'Projects'),
      'projects-your-hour': getTranslation('nav.projects.yourHour', 'Your Hour'),
      'useful-links': getTranslation('nav.usefulLinks', 'Useful Links'),
      'gallery': getTranslation('nav.gallery', 'Gallery'),
      'contacts': getTranslation('nav.contacts', 'Contacts'),
      'info-access': getTranslation('nav.infoAccess', 'Info Access')
    };
    
    return labelMap[pageId] || pageName;
  };

  const transformPageToNavItem = (page: PageData): NavItem => {
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
      
      // Build navigation structure using the already-structured data from backend
      const buildNavigation = (pages: PageData[]): NavItem[] => {
        const navStructure: NavItem[] = [];
        
        // Define the desired order of top-level pages
        const pageOrder = ['home', 'school', 'documents', 'gallery', 'useful-links', 'projects', 'contacts', 'info-access'];
        
        // Process each page in the desired order
        pageOrder.forEach(pageId => {
          const page = pages.find(p => p.id === pageId && p.show_in_menu && (!p.parent_id || p.parent_id === null));
          if (page) {
            let navItem: NavItem;
            
            if (pageId === 'documents' || pageId === 'projects') {
              // Special handling for empty dropdowns
              navItem = {
                label: getTranslatedLabel(page.id, page.name),
                path: page.path,
                children: [], // Empty dropdown as requested
              };
            } else {
              // Use the already-structured children from backend
              navItem = transformPageToNavItem(page);
              
              // If this is school, make sure children are properly handled
              if (pageId === 'school' && page.children && page.children.length > 0) {
                navItem.children = page.children.map(transformPageToNavItem);
              }
            }
            
            navStructure.push(navItem);
          }
        });
        
        return navStructure;
      };
      
      const navItems = buildNavigation(pages);
      setNavItems(navItems);
    } catch (err) {
      console.warn('Failed to load dynamic navigation, using fallback:', err);
      setError('Failed to load navigation');
      setNavItems(getFallbackNavigation(getTranslation));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNavigation();
  }, [t]); // Reload when language changes

  const finalNavItems = navItems.length > 0 ? navItems : getFallbackNavigation(getTranslation);
  
  // Debug logging
  console.log('🧭 Navigation Debug:', {
    navItemsFromDB: navItems.length,
    finalNavItems: finalNavItems.length,
    samplePaths: finalNavItems.slice(0, 3).map(item => ({ label: item.label, path: item.path }))
  });

  return {
    navItems: finalNavItems,
    isLoading,
    error,
    reloadNavigation: loadNavigation,
  };
};