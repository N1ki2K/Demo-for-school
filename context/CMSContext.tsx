// context/CMSContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { Page } from '../types';

export interface EditableSection {
  id: string;
  type: 'text' | 'image' | 'list' | 'table' | 'staff';
  content: any;
  label: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  isDirector: boolean;
  email?: string;
  phone?: string;
  bio?: string;
}

interface CMSContextType {
  isEditing: boolean;
  isLoggedIn: boolean;
  setIsEditing: (editing: boolean) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateContent: (sectionId: string, content: any) => void;
  getContent: (sectionId: string, defaultContent: any) => any;
  editableSections: Record<string, EditableSection>;
  updateStaff: (staff: StaffMember[]) => void;
  getStaff: () => StaffMember[];
  pages: Page[];
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  getPage: (id: string) => Page | undefined;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorageState('cms_logged_in', {
    defaultValue: false,
  });
  const [editableSections, setEditableSections] = useLocalStorageState<Record<string, EditableSection>>('cms_content', {
    defaultValue: {},
  });
  const [staffData, setStaffData] = useLocalStorageState<StaffMember[]>('cms_staff', {
    defaultValue: [],
  });
  const [pages, setPages] = useLocalStorageState<Page[]>('cms_pages', {
    defaultValue: [],
  });

  const login = (username: string, password: string): boolean => {
    // Simple demo login - in production, use proper authentication
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsEditing(false);
  };

  const updateContent = (sectionId: string, content: any) => {
    setEditableSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content,
        id: sectionId,
        type: 'text', // Default type, can be overridden
        label: sectionId
      }
    }));
  };

  const getContent = (sectionId: string, defaultContent: any) => {
    return editableSections[sectionId]?.content || defaultContent;
  };

  const updateStaff = (staff: StaffMember[]) => {
    setStaffData(staff);
  };

  const getStaff = (): StaffMember[] => {
    return staffData;
  };

  const addPage = (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPage: Page = {
      ...pageData,
      id: `page_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setPages(prev => [...prev, newPage]);
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages(prev => 
      prev.map(page => 
        page.id === id 
          ? { ...page, ...updates, updatedAt: new Date().toISOString() }
          : page
      )
    );
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id));
  };

  const getPage = (id: string): Page | undefined => {
    return pages.find(page => page.id === id);
  };

  const value = {
    isEditing,
    isLoggedIn,
    setIsEditing,
    login,
    logout,
    updateContent,
    getContent,
    editableSections,
    updateStaff,
    getStaff,
    pages,
    addPage,
    updatePage,
    deletePage,
    getPage,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};