// components/cms/EditableImage.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const src = getContent(id, defaultSrc);

  const handleClick = () => {
    if (isEditing) {
      setTempUrl(src);
      setShowUrlInput(true);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(id, tempUrl);
    setShowUrlInput(false);
  };

  return (
    <div className={`relative ${isEditing ? 'cms-editable' : ''}`}>
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
            Edit
          </button>
        </div>
      )}
      {showUrlInput && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleUrlSubmit} className="bg-white p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">Image URL:</label>
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-3"
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};