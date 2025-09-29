import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../src/services/api';
import { useLanguage } from './LanguageContext';

interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

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

interface NavigationContextType {
  navItems: NavItem[];
  isLoading: boolean;
  error: string | null;
  reloadNavigation: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const { t, getTranslation } = useLanguage();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        { label: getTranslation('nav.school.news', 'News'), path: '/school/news' },
      ],
    },
    {
      label: getTranslation('nav.documents.title', 'Documents'),
      path: '/documents',
      children: [
        { label: getTranslation('nav.documents.calendar', 'Calendar'), path: '/documents/calendar' },
        { label: getTranslation('nav.documents.schedules', 'Schedules'), path: '/documents/schedules' },
        { label: getTranslation('nav.documents.budget', 'Budget Reports'), path: '/documents/budget' },
        { label: getTranslation('nav.documents.rules', 'Rules'), path: '/documents/rules' },
        { label: getTranslation('nav.documents.ethics', 'Ethics Code'), path: '/documents/ethics' },
        { label: getTranslation('nav.documents.adminServices', 'Admin Services'), path: '/documents/admin-services' },
        { label: getTranslation('nav.documents.admissions', 'Admissions'), path: '/documents/admissions' },
        { label: getTranslation('nav.documents.roadSafety', 'Road Safety'), path: '/documents/road-safety' },
        { label: getTranslation('nav.documents.ores', 'ORES'), path: '/documents/ores' },
        { label: getTranslation('nav.documents.continuingEducation', 'Continuing Education'), path: '/documents/continuing-education' },
        { label: getTranslation('nav.documents.faq', 'FAQ'), path: '/documents/faq' },
        { label: getTranslation('nav.documents.announcement', 'Announcements'), path: '/documents/announcement' },
        { label: getTranslation('nav.documents.students', 'Students'), path: '/documents/students' },
        { label: getTranslation('nav.documents.olympiads', 'Olympiads'), path: '/documents/olympiads' },
      ],
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

  const getTranslatedLabel = (pageId: string, pageName: string): string => {
    const labelMap: Record<string, string> = {
      'home': getTranslation('nav.home', 'Home'),
      'school': getTranslation('nav.school.title', 'School'),
      'school-history': getTranslation('nav.school.history', 'History'),
      'school-patron': getTranslation('nav.school.patron', 'Patron'),
      'school-team': getTranslation('nav.school.team', 'Team'),
      'school-council': getTranslation('nav.school.council', 'Council'),
      'school-news': getTranslation('nav.school.news', 'News'),
      'documents': getTranslation('nav.documents.title', 'Documents'),
      'documents-calendar': getTranslation('nav.documents.calendar', 'Calendar'),
      'documents-schedules': getTranslation('nav.documents.schedules', 'Schedules'),
      'documents-budget': getTranslation('nav.documents.budget', 'Budget Reports'),
      'documents-rules': getTranslation('nav.documents.rules', 'Rules'),
      'documents-ethics': getTranslation('nav.documents.ethics', 'Ethics Code'),
      'documents-admin-services': getTranslation('nav.documents.adminServices', 'Admin Services'),
      'documents-admissions': getTranslation('nav.documents.admissions', 'Admissions'),
      'documents-road-safety': getTranslation('nav.documents.roadSafety', 'Road Safety'),
      'documents-ores': getTranslation('nav.documents.ores', 'ORES'),
      'documents-continuing-education': getTranslation('nav.documents.continuingEducation', 'Continuing Education'),
      'documents-faq': getTranslation('nav.documents.faq', 'FAQ'),
      'documents-announcement': getTranslation('nav.documents.announcement', 'Announcements'),
      'documents-students': getTranslation('nav.documents.students', 'Students'),
      'documents-olympiads': getTranslation('nav.documents.olympiads', 'Olympiads'),
      'projects': getTranslation('nav.projects.title', 'Projects'),
      'projects-your-hour': getTranslation('nav.projects.yourHour', 'Project "Your Hour"'),
      'projects-support-success': getTranslation('nav.projects.supportForSuccess', 'Project "Support for Success"'),
      'projects-education-tomorrow': getTranslation('nav.projects.educationForTomorrow', 'Project "Education for Tomorrow"'),
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
      
      // Load pages and dynamic navigation items
      const [pages, headerNav] = await Promise.all([
        apiService.getPages(),
        apiService.getHeaderNavigation()
      ]);
      
      // Build navigation structure combining pages with dynamic navigation items
      const buildNavigation = (pages: PageData[], dynamicNavItems: any[]): NavItem[] => {
        const navStructure: NavItem[] = [];
        
        // Define the desired order of top-level pages
        const pageOrder = ['home', 'school', 'documents', 'gallery', 'useful-links', 'projects', 'contacts', 'info-access'];
        
        // Process each page in the desired order
        pageOrder.forEach(pageId => {
          const page = pages.find(p => p.id === pageId && p.show_in_menu && (!p.parent_id || p.parent_id === null));
          if (page) {
            let navItem: NavItem;
            
            if (pageId === 'documents') {
              // Use dynamic navigation items for documents
              const documentsNav = dynamicNavItems.find(item => item.id === 'documents');
              navItem = {
                label: getTranslatedLabel(page.id, page.name),
                path: page.path,
                children: documentsNav?.children || []
              };
            } else if (pageId === 'projects') {
              // Use dynamic navigation items for projects
              const projectsNav = dynamicNavItems.find(item => item.id === 'projects');
              navItem = {
                label: getTranslatedLabel(page.id, page.name),
                path: page.path,
                children: projectsNav?.children || []
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
      
      const navItems = buildNavigation(pages, headerNav.navigation);
      setNavItems(navItems);
    } catch (err) {
      console.warn('Failed to load dynamic navigation, using fallback:', err);
      setError('Failed to load navigation');
      setNavItems(getFallbackNavigation(getTranslation));
    } finally {
      setIsLoading(false);
    }
  };

  const reloadNavigation = async () => {
    await loadNavigation();
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

  const contextValue: NavigationContextType = {
    navItems: finalNavItems,
    isLoading,
    error,
    reloadNavigation,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};