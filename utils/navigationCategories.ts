import { getNavLinks } from '../constants';

export interface NavigationCategory {
  id: string;
  label: string;
  path: string;
  parentId?: string;
  hasChildren: boolean;
}

// Function to extract navigation categories from the header structure
export const getNavigationCategories = (t: any): NavigationCategory[] => {
  const navLinks = getNavLinks(t);
  const categories: NavigationCategory[] = [];

  // Add root/main category for top-level pages
  categories.push({
    id: 'main',
    label: t.pageCategories?.main || 'Main Pages',
    path: '/',
    hasChildren: false
  });

  navLinks.forEach(navItem => {
    // Add main category
    const mainCategoryId = navItem.path.split('/')[1] || 'home';
    const existingCategory = categories.find(cat => cat.id === mainCategoryId);
    
    if (!existingCategory) {
      categories.push({
        id: mainCategoryId,
        label: navItem.label,
        path: navItem.path,
        hasChildren: !!(navItem.children && navItem.children.length > 0)
      });
    }

    // Add subcategories if they exist
    if (navItem.children) {
      navItem.children.forEach(child => {
        const subCategoryId = `${mainCategoryId}${child.path}`.replace(/\//g, '-').replace(/^-/, '');
        categories.push({
          id: subCategoryId,
          label: child.label,
          path: navItem.path + child.path,
          parentId: mainCategoryId,
          hasChildren: false
        });
      });
    }
  });

  return categories;
};

// Get available categories for page creation (excludes subcategories for simplicity)
export const getMainNavigationCategories = (t: any): NavigationCategory[] => {
  const categories = getNavigationCategories(t);
  return categories.filter(cat => !cat.parentId);
};

// Function to determine the best category for a given path
export const getCategoryForPath = (path: string, categories: NavigationCategory[]): string => {
  // Find exact match first
  const exactMatch = categories.find(cat => cat.path === path);
  if (exactMatch) return exactMatch.id;

  // Find parent category match
  const pathSegments = path.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const parentPath = `/${pathSegments[0]}`;
    const parentMatch = categories.find(cat => cat.path === parentPath);
    if (parentMatch) return parentMatch.id;
  }

  // Default to main
  return 'main';
};

// Check if a path already exists in the navigation
export const isPathInNavigation = (path: string, t: any): boolean => {
  const categories = getNavigationCategories(t);
  return categories.some(cat => cat.path === path);
};