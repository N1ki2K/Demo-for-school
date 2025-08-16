// components/cms/EditableImage.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';

interface EditableImageProps {
  id: string;
  defaultSrc: string;
  alt: string;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ 
  id, 
  defaultSrc, 
  alt, 
  className = '' 
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  
  // Force read-only mode - disable inline editing
  const forceReadOnly = true;
  const { locale } = useLanguage();
  const location = useLocation();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  
  // Create language-specific ID for images as well
  const languageSpecificId = `${id}_${locale}`;
  const src = getContent(languageSpecificId, defaultSrc);
  
  // Helper function to map URL path to page ID
  const getPageIdFromPath = (path: string): string => {
    if (path === '/') return 'home';
    if (path === '/contacts') return 'contacts';
    if (path === '/gallery') return 'gallery';
    if (path === '/info-access') return 'info-access';
    if (path === '/useful-links') return 'useful-links';
    if (path.startsWith('/school/')) return `school-${path.split('/').pop()}`;
    if (path.startsWith('/documents/')) return `documents-${path.split('/').pop()}`;
    if (path.startsWith('/projects/')) return `projects-${path.split('/').pop()}`;
    return 'unknown';
  };
  
  const currentPageId = getPageIdFromPath(location.pathname);

  const texts = {
    bg: {
      edit: 'Редактирай',
      imageUrl: 'URL на изображението:',
      save: 'Запази',
      cancel: 'Отказ',
      placeholder: 'https://example.com/image.jpg'
    },
    en: {
      edit: 'Edit',
      imageUrl: 'Image URL:',
      save: 'Save',
      cancel: 'Cancel',
      placeholder: 'https://example.com/image.jpg'
    }
  };

  const t = texts[locale];

  const handleClick = () => {
    if (isEditing && !forceReadOnly) {
      setTempUrl(src);
      setShowUrlInput(true);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(languageSpecificId, tempUrl, 'image', `${id} (${locale})`, currentPageId);
    setShowUrlInput(false);
  };

  return (
    <div className={`relative ${isEditing && !forceReadOnly ? 'cms-editable-image' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={handleClick}
      />
      {isEditing && !forceReadOnly && (
        <div className="absolute top-2 right-2">
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            {t.edit}
          </button>
        </div>
      )}
      {showUrlInput && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleUrlSubmit} className="bg-white p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">{t.imageUrl}</label>
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-3"
              placeholder={t.placeholder}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {t.save}
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};