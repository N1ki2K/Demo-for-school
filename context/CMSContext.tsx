// context/CMSContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import useLocalStorageState from 'use-local-storage-state';

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