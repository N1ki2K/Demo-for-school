import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface PatronContent {
  id: number;
  section_key: string;
  title_bg?: string;
  title_en?: string;
  content_bg?: string;
  content_en?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PatronManagerTab: React.FC = () => {
  const { t, locale } = useLanguage();
  const [patronContent, setPatronContent] = useState<PatronContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    title?: string;
    content?: string;
    image_url?: string;
  }>({});
  const [isSaving, setIsSaving] = useState<number | null>(null);

  useEffect(() => {
    loadPatronContent();
  }, []);

  const loadPatronContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPatronContentForAdmin();
      setPatronContent(response.content);
    } catch (err) {
      console.error('Failed to load patron content:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load patron content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: PatronContent) => {
    setEditingSection(section.id);
    setEditData({
      title: locale === 'en' ? section.title_en : section.title_bg,
      content: locale === 'en' ? section.content_en : section.content_bg,
      image_url: section.image_url,
    });
  };

  const handleSave = async (sectionId: number) => {
    try {
      setIsSaving(sectionId);
      
      const updateData: any = {};
      if (locale === 'en') {
        if (editData.title !== undefined) updateData.title_en = editData.title;
        if (editData.content !== undefined) updateData.content_en = editData.content;
      } else {
        if (editData.title !== undefined) updateData.title_bg = editData.title;
        if (editData.content !== undefined) updateData.content_bg = editData.content;
      }
      if (editData.image_url !== undefined) updateData.image_url = editData.image_url;
      
      await apiService.updatePatronContent(sectionId.toString(), updateData);
      
      // Reload content to get updated data
      await loadPatronContent();
      
      setEditingSection(null);
      setEditData({});
    } catch (err) {
      console.error('Failed to save section:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(null);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditData({});
  };

  const getSectionDisplayName = (sectionKey: string): string => {
    const nameMap: Record<string, string> = {
      'quote': 'Patron Quote',
      'biography_p1': 'Early Years',
      'biography_p2': 'Education',
      'biography_p3': 'Career',
      'biography_p4': 'Contribution',
      'biography_p5': 'Recognition',
      'legacy_title': 'Legacy Section Title',
      'legacy_content': 'Legacy Content',
      'image_main': 'Main Image',
      'image_caption': 'Image Caption'
    };
    
    return nameMap[sectionKey] || sectionKey;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading patron content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadPatronContent}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patron Page Management</h2>
        <p className="text-gray-600">Manage content for the school patron page (Kolyo Ganchev).</p>
      </div>

      <div className="space-y-6">
        {patronContent.map((section) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getSectionDisplayName(section.section_key)}
                </h3>
                <p className="text-sm text-gray-500">
                  Key: {section.section_key} | Position: {section.position} | Language: {locale}
                </p>
              </div>
              
              {editingSection !== section.id && (
                <button
                  onClick={() => handleEdit(section)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingSection === section.id ? (
              <div className="space-y-4">
                {section.section_key === 'image_main' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={editData.image_url || ''}
                      onChange={(e) => setEditData({...editData, image_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {editData.image_url && (
                      <div className="mt-2">
                        <img 
                          src={editData.image_url} 
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show title field for sections that have titles */}
                    {['biography_p1', 'biography_p2', 'biography_p3', 'biography_p4', 'biography_p5', 'legacy_title'].includes(section.section_key) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title ({locale.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={editData.title || ''}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter title..."
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content ({locale.toUpperCase()})
                      </label>
                      <textarea
                        value={editData.content || ''}
                        onChange={(e) => setEditData({...editData, content: e.target.value})}
                        rows={section.section_key.includes('legacy') || section.section_key.includes('quote') ? 6 : 3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter content..."
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSave(section.id)}
                    disabled={isSaving === section.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isSaving === section.id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving === section.id}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                {section.section_key === 'image_main' ? (
                  section.image_url ? (
                    <img 
                      src={section.image_url}
                      alt="Patron"
                      className="w-48 h-auto rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )
                ) : (
                  <div>
                    {/* Show title if available */}
                    {(locale === 'en' ? section.title_en : section.title_bg) && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-600 uppercase">{locale} Title:</strong>
                        <p className="text-gray-900 font-medium">
                          {locale === 'en' ? section.title_en : section.title_bg}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <strong className="text-sm text-gray-600 uppercase">{locale} Content:</strong>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {(locale === 'en' ? section.content_en : section.content_bg) || 
                         <span className="text-gray-500 italic">No content</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {patronContent.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No patron content found.</p>
            <button
              onClick={loadPatronContent}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatronManagerTab;