import { getNavLinks } from '../constants';
import { NavItem, Page } from '../types';

// Function to extend navigation with custom pages
export const getExtendedNavLinks = (t: any, customPages: Page[]): NavItem[] => {
  const baseNavLinks = getNavLinks(t);
  
  // Group custom pages by category
  const pagesByCategory = customPages
    .filter(page => page.isPublished)
    .reduce((acc, page) => {
      if (!acc[page.category]) {
        acc[page.category] = [];
      }
      acc[page.category].push({
        label: page.title,
        path: page.path
      });
      return acc;
    }, {} as Record<string, NavItem[]>);

  // Extend existing navigation sections with custom pages
  const extendedNavLinks = baseNavLinks.map(navItem => {
    const categoryId = navItem.path.split('/')[1] || 'home';
    const customPagesForCategory = pagesByCategory[categoryId] || [];
    
    if (customPagesForCategory.length > 0) {
      return {
        ...navItem,
        children: [
          ...(navItem.children || []),
          ...customPagesForCategory
        ]
      };
    }
    
    return navItem;
  });

  // Add standalone custom pages (not belonging to existing categories)
  const customCategoryPages = pagesByCategory['custom'] || [];
  if (customCategoryPages.length > 0) {
    // Add as individual top-level items or group them
    customCategoryPages.forEach(customPage => {
      extendedNavLinks.push(customPage);
    });
  }

  return extendedNavLinks;
};

// Function to check if a page should be shown in navigation
export const shouldShowInNavigation = (page: Page): boolean => {
  return page.isPublished && page.category !== 'main'; // Main pages typically don't need to be added to nav
};

// Function to get breadcrumb for a custom page
export const getPageBreadcrumb = (page: Page, t: any): Array<{label: string, path?: string}> => {
  const breadcrumb = [{ label: t.nav.home, path: '/' }];
  
  // Find parent category
  const navigationCategories = getNavLinks(t);
  const parentCategory = navigationCategories.find(nav => {
    if (page.category === 'custom') return false;
    return nav.path === `/${page.category}` || nav.path.split('/')[1] === page.category;
  });
  
  if (parentCategory) {
    breadcrumb.push({ label: parentCategory.label, path: parentCategory.path });
  }
  
  breadcrumb.push({ label: page.title });
  
  return breadcrumb;
};