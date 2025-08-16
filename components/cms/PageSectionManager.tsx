// components/cms/PageSectionManager.tsx
import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface PageDefinition {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  position: number;
  is_active: boolean;
  show_in_menu: boolean;
  children?: PageDefinition[];
}

interface SectionDefinition {
  id: string;
  label: string;
  type: 'text' | 'image' | 'list';
  pageId: string;
  language: string;
  isActive: boolean;
}

const PageSectionManager: React.FC = () => {
  const { updateContent, isEditing, isLoading } = useCMS();
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pages' | 'sections'>('pages');
  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [pages, setPages] = useState<PageDefinition[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);

  // Form states
  const [pageForm, setPageForm] = useState({
    name: '',
    path: '',
    parent_id: '',
    show_in_menu: true,
  });

  const [sectionForm, setSectionForm] = useState({
    label: '',
    type: 'text' as 'text' | 'image' | 'list',
    defaultContent: '',
  });

  // Load pages from API
  const loadPages = async () => {
    try {
      setLoadingPages(true);
      const allPages = await apiService.getAllPages();
      setPages(allPages);
    } catch (error) {
      console.error('Failed to load pages:', error);
      // Set fallback pages if API fails
      setPages([
        { id: 'home', name: 'Home Page', path: '/', parent_id: null, position: 0, is_active: true, show_in_menu: true },
        { id: 'contacts', name: 'Contacts', path: '/contacts', parent_id: null, position: 1, is_active: true, show_in_menu: true },
        { id: 'global', name: 'Global (Header/Footer)', path: 'global', parent_id: null, position: 99, is_active: true, show_in_menu: false },
      ]);
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  if (!isEditing) return null;

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.name || !pageForm.path) return;

    try {
      const newPageData = {
        name: pageForm.name,
        path: pageForm.path,
        parent_id: pageForm.parent_id || null,
        position: pages.length,
        show_in_menu: pageForm.show_in_menu,
      };

      await apiService.createPage(newPageData);
      await loadPages(); // Reload pages to get the new structure
      setPageForm({ name: '', path: '', parent_id: '', show_in_menu: true });
      setShowAddPageForm(false);
    } catch (error) {
      console.error('Failed to create page:', error);
      alert('Failed to create page. Please try again.');
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.label || !selectedPage) return;

    const sectionId = `${sectionForm.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}_${locale}`;
    
    try {
      await updateContent(
        sectionId,
        sectionForm.defaultContent || 'New content',
        sectionForm.type,
        `${sectionForm.label} (${locale})`,
        selectedPage
      );
      
      setSectionForm({
        label: '',
        type: 'text',
        defaultContent: '',
      });
      setShowAddSectionForm(false);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleRemovePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    if (confirm(`Are you sure you want to deactivate the page "${page.name}"? This will hide it from the menu but won't delete existing content.`)) {
      try {
        await apiService.updatePage(pageId, { is_active: false });
        await loadPages();
      } catch (error) {
        console.error('Failed to deactivate page:', error);
        alert('Failed to deactivate page. Please try again.');
      }
    }
  };

  const handleRestorePage = async (pageId: string) => {
    try {
      await apiService.updatePage(pageId, { is_active: true });
      await loadPages();
    } catch (error) {
      console.error('Failed to restore page:', error);
      alert('Failed to restore page. Please try again.');
    }
  };

  const handlePermanentDeletePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    if (confirm(`PERMANENT DELETE: Are you sure you want to permanently delete "${page.name}"? This will permanently remove the page and ALL its content. This action cannot be undone!`)) {
      try {
        await apiService.deletePage(pageId, true); // true = permanent delete
        await loadPages();
      } catch (error) {
        console.error('Failed to permanently delete page:', error);
        alert('Failed to permanently delete page. Please try again.');
      }
    }
  };

  const activePage = pages.find(p => p.id === selectedPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Page & Section Manager</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'pages'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📄 Manage Pages
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'sections'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🧩 Manage Sections
        </button>
      </div>

      <div className="space-y-6">
          {activeTab === 'pages' && (
            <div className="space-y-6">
              {/* Add Page Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Website Pages</h3>
                <button
                  onClick={() => setShowAddPageForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add New Page
                </button>
              </div>

              {/* Add Page Form */}
              {showAddPageForm && (
                <div className="bg-blue-50 p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold mb-4">Add New Page</h4>
                  <form onSubmit={handleAddPage} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Page Name</label>
                        <input
                          type="text"
                          value={pageForm.name}
                          onChange={(e) => setPageForm({ ...pageForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., About Us"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Page Path</label>
                        <input
                          type="text"
                          value={pageForm.path}
                          onChange={(e) => setPageForm({ ...pageForm, path: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., /about-us"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Parent Page (Optional)</label>
                        <select
                          value={pageForm.parent_id}
                          onChange={(e) => setPageForm({ ...pageForm, parent_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- No Parent (Top Level) --</option>
                          {pages.filter(p => p.is_active && !p.parent_id).map(page => (
                            <option key={page.id} value={page.id}>{page.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={pageForm.show_in_menu}
                            onChange={(e) => setPageForm({ ...pageForm, show_in_menu: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">Show in Navigation Menu</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add Page
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddPageForm(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Pages List */}
              <div className="grid gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Active Pages */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-green-700">Active Pages</h4>
                    <div className="space-y-2">
                      {loadingPages ? (
                        <div className="text-center py-4">Loading pages...</div>
                      ) : (
                        pages.filter(page => page.is_active).map(page => (
                          <div key={page.id} className={`flex items-center justify-between p-3 rounded border-l-4 ${
                            page.parent_id ? 'bg-blue-50 border-blue-400 ml-4' : 'bg-green-50 border-green-400'
                          }`}>
                            <div>
                              <div className="flex items-center gap-2">
                                {page.parent_id && <span className="text-gray-400">↳</span>}
                                <h5 className="font-semibold">{page.name}</h5>
                                {!page.show_in_menu && (
                                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">Hidden from menu</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{page.path}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRemovePage(page.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                              >
                                Hide
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Inactive Pages */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Hidden Pages</h4>
                    <div className="space-y-2">
                      {pages.filter(page => !page.is_active).map(page => (
                        <div key={page.id} className={`flex items-center justify-between p-3 rounded border-l-4 ${
                          page.parent_id ? 'bg-gray-100 border-gray-500 ml-4' : 'bg-gray-50 border-gray-400'
                        }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              {page.parent_id && <span className="text-gray-400">↳</span>}
                              <h5 className="font-semibold text-gray-600">{page.name}</h5>
                              {!page.show_in_menu && (
                                <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">Hidden from menu</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{page.path}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRestorePage(page.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handlePermanentDeletePage(page.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete Forever
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6">
              {/* Section Management Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Content Sections</h3>
                <button
                  onClick={() => setShowAddSectionForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add New Section
                </button>
              </div>

              {/* Page Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Page to Manage</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {pages.filter(page => page.is_active).map(page => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                  ))}
                </select>
              </div>

              {/* Add Section Form */}
              {showAddSectionForm && (
                <div className="bg-green-50 p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold mb-4">
                    Add New Section to {activePage?.name} ({locale.toUpperCase()})
                  </h4>
                  <form onSubmit={handleAddSection} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Section Label</label>
                        <input
                          type="text"
                          value={sectionForm.label}
                          onChange={(e) => setSectionForm({ ...sectionForm, label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Main Title, Hero Image, etc."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Section Type</label>
                        <select
                          value={sectionForm.type}
                          onChange={(e) => setSectionForm({ ...sectionForm, type: e.target.value as 'text' | 'image' | 'list' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text">Text Content</option>
                          <option value="image">Image</option>
                          <option value="list">List</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Content</label>
                      <textarea
                        value={sectionForm.defaultContent}
                        onChange={(e) => setSectionForm({ ...sectionForm, defaultContent: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter default content for this section..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add Section'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddSectionForm(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">How to Use Sections</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Create sections with descriptive names like "hero-title", "about-intro", etc.</li>
                  <li>• Sections are automatically language-specific (e.g., "hero-title_en", "hero-title_bg")</li>
                  <li>• Use the CMS Dashboard to edit existing sections by page and language</li>
                  <li>• Sections can be edited directly on pages when in edit mode</li>
                </ul>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default PageSectionManager;