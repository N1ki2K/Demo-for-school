// components/cms/EditableImage.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

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
  const { locale } = useLanguage();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  
  // Create language-specific ID for images as well
  const languageSpecificId = `${id}_${locale}`;
  const src = getContent(languageSpecificId, defaultSrc);

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
    if (isEditing) {
      setTempUrl(src);
      setShowUrlInput(true);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(languageSpecificId, tempUrl);
    setShowUrlInput(false);
  };

  return (
    <div className={`relative ${isEditing ? 'cms-editable-image' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={handleClick}
      />
      {isEditing && (
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