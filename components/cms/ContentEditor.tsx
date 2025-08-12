import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MediaManager } from './MediaManager';

interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'list' | 'rich_text';
  label: string;
  content: any;
  page_id?: string;
  position?: number;
}

export const ContentEditor: React.FC = () => {
  const { editableSections, updateContent, isLoading } = useCMS();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<ContentSection>>({});

  useEffect(() => {
    const sectionArray = Object.values(editableSections);
    setSections(sectionArray);
  }, [editableSections]);

  const handleCreateSection = () => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type: 'text',
      label: 'New Section',
      content: '',
      position: sections.length,
    };
    setSelectedSection(newSection);
    setEditingSection(newSection);
  };

  const handleSaveSection = async () => {
    if (!editingSection.id || !editingSection.label) return;

    await updateContent(
      editingSection.id,
      editingSection.content,
      editingSection.type,
      editingSection.label
    );

    setSelectedSection(null);
    setEditingSection({});
  };

  const handleSelectImage = (imageUrl: string) => {
    setEditingSection({
      ...editingSection,
      content: imageUrl,
    });
    setShowMediaManager(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Content Management</h3>
        <button
          onClick={handleCreateSection}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          + New Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sections List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-medium mb-4">Content Sections</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedSection?.id === section.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedSection(section);
                  setEditingSection(section);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{section.label}</h5>
                    <p className="text-sm text-gray-500 capitalize">{section.type}</p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {section.page_id || 'Global'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Editor */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedSection ? (
            <div className="space-y-4">
              <h4 className="font-medium">Edit Section</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={editingSection.label || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={editingSection.type || 'text'}
                  onChange={(e) => setEditingSection({ 
                    ...editingSection, 
                    type: e.target.value as 'text' | 'image' | 'list' | 'rich_text'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="rich_text">Rich Text</option>
                  <option value="image">Image</option>
                  <option value="list">List</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Page ID (optional)</label>
                <input
                  type="text"
                  value={editingSection.page_id || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, page_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty for global content"
                />
              </div>

              {/* Content Editor based on type */}
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                
                {editingSection.type === 'text' && (
                  <textarea
                    value={typeof editingSection.content === 'string' ? editingSection.content : ''}
                    onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {editingSection.type === 'rich_text' && (
                  <textarea
                    value={typeof editingSection.content === 'string' ? editingSection.content : ''}
                    onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="HTML content allowed"
                  />
                )}

                {editingSection.type === 'image' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={typeof editingSection.content === 'string' ? editingSection.content : ''}
                      onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Image URL"
                    />
                    <button
                      onClick={() => setShowMediaManager(true)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Choose from Media
                    </button>
                    {editingSection.content && (
                      <img
                        src={`http://localhost:3001${editingSection.content}`}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                )}

                {editingSection.type === 'list' && (
                  <textarea
                    value={typeof editingSection.content === 'string' ? editingSection.content : JSON.stringify(editingSection.content, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setEditingSection({ ...editingSection, content: parsed });
                      } catch {
                        setEditingSection({ ...editingSection, content: e.target.value });
                      }
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="JSON array format: ['Item 1', 'Item 2']"
                  />
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSaveSection}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Section'}
                </button>
                <button
                  onClick={() => {
                    setSelectedSection(null);
                    setEditingSection({});
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
              </svg>
              <p>Select a section to edit, or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Manager Modal */}
      {showMediaManager && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Image</h3>
              <button
                onClick={() => setShowMediaManager(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[calc(80vh-80px)] overflow-y-auto">
              <MediaManager onSelectImage={handleSelectImage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};