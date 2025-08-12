// context/CMSContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiService, ApiError } from '../src/services/api';

export interface EditableSection {
  id: string;
  type: 'text' | 'image' | 'list' | 'table' | 'staff' | 'rich_text';
  content: any;
  label: string;
  page_id?: string;
  position?: number;
  is_active?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  is_director: boolean;
  email?: string;
  phone?: string;
  bio?: string;
  position?: number;
  is_active?: boolean;
}

interface CMSContextType {
  isEditing: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setIsEditing: (editing: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateContent: (sectionId: string, content: any, type?: string, label?: string) => Promise<void>;
  getContent: (sectionId: string, defaultContent: any) => any;
  editableSections: Record<string, EditableSection>;
  updateStaff: (staff: StaffMember[]) => Promise<void>;
  getStaff: () => StaffMember[];
  loadContent: () => Promise<void>;
  loadStaff: () => Promise<void>;
  clearError: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editableSections, setEditableSections] = useState<Record<string, EditableSection>>({});
  const [staffData, setStaffData] = useState<StaffMember[]>([]);

  // Load content on initial mount
  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    // Load content when login status changes
    // Always load content, regardless of login status
    // Only editing requires authentication, but content should always be displayed
    loadContent();
    if (isLoggedIn) {
      loadStaff();
    }
  }, [isLoggedIn]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await apiService.login(username, password);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Login failed');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setIsEditing(false);
      // Don't clear editableSections - keep content visible after logout
      // setEditableSections({}); 
      setStaffData([]); // Staff data can be cleared as it's admin-only
      setIsLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load content from API...');
      const sections = await apiService.getContentSections();
      console.log('Raw API response - sections:', sections);
      console.log('Number of sections loaded:', sections.length);
      
      const sectionsMap: Record<string, EditableSection> = {};
      sections.forEach((section: any) => {
        console.log('Processing section:', section.id, section);
        sectionsMap[section.id] = {
          ...section,
          content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
        };
      });
      console.log('Final sections map:', sectionsMap);
      console.log('Section IDs in map:', Object.keys(sectionsMap));
      setEditableSections(sectionsMap);
      console.log('Content sections set in state');
    } catch (error) {
      console.error('Error loading content:', error);
      // Don't show error to users when not logged in - just silently use defaults
      if (isLoggedIn) {
        if (error instanceof ApiError) {
          setError(`Failed to load content: ${error.message}`);
        } else {
          setError('Failed to load content');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const staff = await apiService.getStaffMembers();
      setStaffData(staff);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(`Failed to load staff: ${error.message}`);
      } else {
        setError('Failed to load staff');
      }
    }
  };

  const updateContent = async (sectionId: string, content: any, type: string = 'text', label: string = sectionId) => {
    try {
      setIsLoading(true);
      const section = {
        id: sectionId,
        type,
        label,
        content: typeof content === 'string' ? content : JSON.stringify(content),
      };
      
      console.log('Saving content section:', section);
      await apiService.saveContentSection(section);
      console.log('Content section saved successfully');
      
      // Update local state immediately after successful save
      setEditableSections(prev => {
        const updated = {
          ...prev,
          [sectionId]: {
            id: sectionId,
            type: type as any,
            label,
            content,
          }
        };
        console.log('Updated editableSections:', updated);
        return updated;
      });
    } catch (error) {
      console.error('Error updating content:', error);
      if (error instanceof ApiError) {
        setError(`Failed to update content: ${error.message}`);
      } else {
        setError('Failed to update content');
      }
      throw error; // Re-throw so the component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const getContent = (sectionId: string, defaultContent: any) => {
    const content = editableSections[sectionId]?.content || defaultContent;
    console.log('Getting content for:', sectionId, 'Content:', content, 'Has section:', !!editableSections[sectionId]);
    return content;
  };

  const updateStaff = async (staff: StaffMember[]) => {
    try {
      setIsLoading(true);
      // For now, we'll update each staff member individually
      // In a more sophisticated implementation, you might want a bulk update API
      for (let i = 0; i < staff.length; i++) {
        const member = staff[i];
        if (staffData.find(s => s.id === member.id)) {
          await apiService.updateStaffMember(member.id, { ...member, position: i });
        } else {
          await apiService.createStaffMember({ ...member, position: i });
        }
      }
      setStaffData(staff);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(`Failed to update staff: ${error.message}`);
      } else {
        setError('Failed to update staff');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStaff = (): StaffMember[] => {
    return staffData;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isEditing,
    isLoggedIn,
    isLoading,
    error,
    setIsEditing,
    login,
    logout,
    updateContent,
    getContent,
    editableSections,
    updateStaff,
    getStaff,
    loadContent,
    loadStaff,
    clearError,
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