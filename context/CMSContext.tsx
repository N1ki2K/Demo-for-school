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
  contentLoaded: boolean;
  setIsEditing: (editing: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateContent: (sectionId: string, content: any, type?: string, label?: string, pageId?: string) => Promise<void>;
  getContent: (sectionId: string, defaultContent: any) => any;
  getContentByPage: (pageId: string, language: string) => Promise<EditableSection[]>;
  editableSections: Record<string, EditableSection>;
  updateStaff: (staff: StaffMember[]) => Promise<void>;
  getStaff: () => StaffMember[];
  loadContent: () => Promise<void>;
  loadStaff: () => Promise<void>;
  clearError: () => void;
  // School Staff methods
  getSchoolStaff: () => StaffMember[];
  loadSchoolStaff: () => Promise<void>;
  updateSchoolStaff: (staff: StaffMember[]) => Promise<void>;
  createSchoolStaffMember: (member: StaffMember) => Promise<void>;
  updateSchoolStaffMember: (id: string, member: StaffMember) => Promise<void>;
  deleteSchoolStaffMember: (id: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editableSections, setEditableSections] = useState<Record<string, EditableSection>>({});
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [schoolStaffData, setSchoolStaffData] = useState<StaffMember[]>([]);
  const [contentLoaded, setContentLoaded] = useState(false);

  // Load content on initial mount
  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    // Load content when login status changes
    // Always load content, regardless of login status
    // Only editing requires authentication, but content should always be displayed
    loadContent();
    loadSchoolStaff(); // Always load school staff for display
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
      // Redirect to home page
      window.location.hash = '#/';
    }
  };

  const loadContent = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting to load content from API...');
      const sections = await apiService.getContentSections();
      console.log('📦 Raw API response - sections:', sections);
      console.log('📊 Number of sections loaded:', sections.length);
      
      const sectionsMap: Record<string, EditableSection> = {};
      sections.forEach((section: any) => {
        console.log('⚙️ Processing section:', section.id, 'Content:', section.content);
        sectionsMap[section.id] = {
          ...section,
          content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
        };
      });
      console.log('✅ Final sections map:', sectionsMap);
      console.log('🗝️ Section IDs in map:', Object.keys(sectionsMap));
      
      // Check specifically for history content
      const historyKeys = Object.keys(sectionsMap).filter(key => key.includes('history'));
      console.log('📚 History sections found:', historyKeys);
      historyKeys.forEach(key => {
        console.log(`📝 ${key}:`, sectionsMap[key].content);
      });
      
      setEditableSections(sectionsMap);
      setContentLoaded(true);
      console.log('💾 Content sections set in state');
    } catch (error) {
      console.error('❌ Error loading content:', error);
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

  const updateContent = async (sectionId: string, content: any, type: string = 'text', label: string = sectionId, pageId?: string) => {
    try {
      setIsLoading(true);
      const section = {
        id: sectionId,
        type,
        label,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        page_id: pageId || null,
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
            page_id: pageId,
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
    const section = editableSections[sectionId];
    
    console.log(`🔍 Getting content for: ${sectionId}`);
    console.log(`📋 Available sections:`, Object.keys(editableSections));
    console.log(`🎯 Found section:`, section);
    console.log(`💭 Default content:`, defaultContent);
    
    // If we have a section with content, use it (even if it matches default)
    if (section?.content !== undefined && section.content !== null) {
      console.log(`✅ Returning CMS content for ${sectionId}:`, section.content);
      return section.content;
    }
    
    // Otherwise, use default content
    console.log(`⚠️ Using default content for ${sectionId}:`, defaultContent);
    return defaultContent;
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
      
      // Reload staff data from API to ensure consistency with database
      await loadStaff();
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

  const getContentByPage = async (pageId: string, language: string): Promise<EditableSection[]> => {
    try {
      const content = await apiService.getContentByPageAndLanguage(pageId, language);
      return content;
    } catch (error) {
      console.error('Error getting content by page:', error);
      return [];
    }
  };

  const clearError = () => {
    setError(null);
  };

  // School Staff methods
  const loadSchoolStaff = async () => {
    try {
      console.log('🔄 Loading school staff from API...');
      const staff = await apiService.getSchoolStaff();
      console.log('📋 Retrieved school staff:', staff);
      setSchoolStaffData(staff);
    } catch (error) {
      console.error('❌ Error loading school staff:', error);
      // Don't show error to users when not logged in - just silently use defaults
      if (isLoggedIn) {
        if (error instanceof ApiError) {
          setError(`Failed to load school staff: ${error.message}`);
        } else {
          setError('Failed to load school staff');
        }
      }
    }
  };

  const getSchoolStaff = (): StaffMember[] => {
    return schoolStaffData;
  };

  const createSchoolStaffMember = async (member: StaffMember) => {
    try {
      setIsLoading(true);
      console.log('✅ Creating school staff member:', member);
      const createdMember = await apiService.createSchoolStaffMember(member);
      console.log('📝 Created school staff member:', createdMember);
      
      // Add to local state
      setSchoolStaffData(prev => [...prev, createdMember].sort((a, b) => (a.position || 0) - (b.position || 0)));
    } catch (error) {
      console.error('❌ Error creating school staff member:', error);
      if (error instanceof ApiError) {
        setError(`Failed to create school staff member: ${error.message}`);
      } else {
        setError('Failed to create school staff member');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchoolStaffMember = async (id: string, member: StaffMember) => {
    try {
      setIsLoading(true);
      console.log('📝 Updating school staff member:', id, member);
      const updatedMember = await apiService.updateSchoolStaffMember(id, member);
      console.log('✅ Updated school staff member:', updatedMember);
      
      // Update local state
      setSchoolStaffData(prev => 
        prev.map(m => m.id === id ? updatedMember : m)
           .sort((a, b) => (a.position || 0) - (b.position || 0))
      );
    } catch (error) {
      console.error('❌ Error updating school staff member:', error);
      if (error instanceof ApiError) {
        setError(`Failed to update school staff member: ${error.message}`);
      } else {
        setError('Failed to update school staff member');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchoolStaffMember = async (id: string) => {
    try {
      setIsLoading(true);
      console.log('🗑️ Deleting school staff member:', id);
      await apiService.deleteSchoolStaffMember(id);
      console.log('✅ Deleted school staff member');
      
      // Remove from local state
      setSchoolStaffData(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('❌ Error deleting school staff member:', error);
      if (error instanceof ApiError) {
        setError(`Failed to delete school staff member: ${error.message}`);
      } else {
        setError('Failed to delete school staff member');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchoolStaff = async (staff: StaffMember[]) => {
    try {
      setIsLoading(true);
      console.log('🔄 Bulk updating school staff:', staff);
      await apiService.bulkUpdateSchoolStaff(staff);
      console.log('✅ Bulk updated school staff');
      
      // Update local state
      setSchoolStaffData(staff.sort((a, b) => (a.position || 0) - (b.position || 0)));
    } catch (error) {
      console.error('❌ Error bulk updating school staff:', error);
      if (error instanceof ApiError) {
        setError(`Failed to update school staff: ${error.message}`);
      } else {
        setError('Failed to update school staff');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isEditing,
    isLoggedIn,
    isLoading,
    error,
    contentLoaded,
    setIsEditing,
    login,
    logout,
    updateContent,
    getContent,
    getContentByPage,
    editableSections,
    updateStaff,
    getStaff,
    loadContent,
    loadStaff,
    clearError,
    // School Staff methods
    getSchoolStaff,
    loadSchoolStaff,
    updateSchoolStaff,
    createSchoolStaffMember,
    updateSchoolStaffMember,
    deleteSchoolStaffMember,
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