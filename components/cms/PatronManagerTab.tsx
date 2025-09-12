import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

// Import ImagePicker component
interface ImagePickerProps {
  onImageSelect: (imageUrl: string, filename: string) => void;
  currentImage?: string;
  onClose: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, currentImage, onClose }) => {
  const { t } = useLanguage();
  const [picturesImages, setPicturesImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPicturesImages();
  }, []);

  const loadPicturesImages = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPicturesImages();
      setPicturesImages(response.images || []);
    } catch (error) {
      console.error('❌ Failed to load Pictures folder images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = picturesImages.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📁 Select Image from Pictures</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading images...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {filteredImages.map((image) => {
              const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${image.url}`;
              const isSelected = currentImage === imageUrl || currentImage === image.url;
              
              return (
                <div 
                  key={image.filename} 
                  className={`border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => onImageSelect(imageUrl, image.filename)}
                >
                  <div className="aspect-square mb-2 bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={imageUrl}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 truncate font-medium" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {filteredImages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No images found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [showImagePicker, setShowImagePicker] = useState(false);

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

  const handleImageSelect = (imageUrl: string, filename: string) => {
    setEditData({...editData, image_url: imageUrl});
    setShowImagePicker(false);
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patron Image
                      </label>
                      <div className="flex gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => setShowImagePicker(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          📁 Choose from Pictures
                        </button>
                        {editData.image_url && (
                          <button
                            type="button"
                            onClick={() => setEditData({...editData, image_url: ''})}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={editData.image_url || ''}
                        onChange={(e) => setEditData({...editData, image_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Or enter image URL manually: https://example.com/image.jpg"
                      />
                    </div>
                    {editData.image_url && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img 
                          src={editData.image_url} 
                          alt="Patron preview"
                          className="w-48 h-auto rounded-md border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"%3E%3Crect width="200" height="100" fill="%23f3f4f6"/%3E%3Ctext x="100" y="50" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2 break-all">
                          URL: {editData.image_url}
                        </p>
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

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImage={editData.image_url}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
};

export default PatronManagerTab;