// components/cms/ContentManagementDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface ContentSection {
  id: string;
  type: string;
  label: string;
  content: string;
  page_id?: string;
}

interface Page {
  id: string;
  name: string;
  path: string;
}

const ContentManagementDashboard: React.FC = () => {
  const { updateContent, isLoading } = useCMS();
  const { locale } = useLanguage();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [pageSections, setPageSections] = useState<ContentSection[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  // Define available pages
  const pages: Page[] = [
    { id: 'home', name: 'Home Page', path: '/' },
    { id: 'school', name: 'My School', path: '/school' },
    { id: 'academics', name: 'Academics', path: '/academics' },
    { id: 'admissions', name: 'Admissions', path: '/admissions' },
    { id: 'contacts', name: 'Contacts', path: '/contacts' },
    { id: 'global', name: 'Global (Header/Footer)', path: 'global' }
  ];

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' }
  ];

  // Load content for selected page and language
  const loadPageContent = async () => {
    try {
      setLoadingContent(true);
      const content = await apiService.getContentByPageAndLanguage(selectedPage, selectedLanguage);
      setPageSections(content);
    } catch (error) {
      console.error('Failed to load page content:', error);
      setPageSections([]);
    } finally {
      setLoadingContent(false);
    }
  };

  // Load content when page or language changes
  useEffect(() => {
    loadPageContent();
  }, [selectedPage, selectedLanguage]);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;
    
    try {
      await updateContent(editingSection, editContent, 'text', editingSection);
      setEditingSection(null);
      setEditContent('');
      // Reload content to show updated data
      loadPageContent();
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditContent('');
  };

  const createNewSection = async () => {
    const sectionName = prompt('Enter section name (e.g., "about-title"):');
    if (!sectionName) return;
    
    const sectionId = `${sectionName}_${selectedLanguage}`;
    const sectionLabel = `${sectionName} (${selectedLanguage})`;
    
    try {
      await updateContent(sectionId, 'New content', 'text', sectionLabel);
      // Reload content to show new section
      loadPageContent();
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Page and Language Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Language
            </label>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Content Sections - {pages.find(p => p.id === selectedPage)?.name} ({selectedLanguage.toUpperCase()})
          </h3>
          <button
            onClick={createNewSection}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            + Add New Section
          </button>
        </div>

        {loadingContent ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading content...</div>
          </div>
        ) : pageSections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              No content sections found for this page and language.
            </div>
            <button
              onClick={createNewSection}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pageSections.map(section => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{section.label}</h4>
                    <p className="text-sm text-gray-500">ID: {section.id}</p>
                  </div>
                  <button
                    onClick={() => handleEditSection(section)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {editingSection === section.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Enter content..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveSection}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="text-sm text-gray-700">
                      {section.content || <em className="text-gray-400">No content</em>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementDashboard;