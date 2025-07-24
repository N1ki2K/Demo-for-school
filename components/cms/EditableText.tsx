// components/cms/EditableText.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

interface EditableTextProps {
  id: string;
  defaultContent: string;
  className?: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  id, 
  defaultContent, 
  className = '', 
  tag: Tag = 'p',
  placeholder = 'Click to edit...' 
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  const [isEditable, setIsEditable] = useState(false);
  const [tempContent, setTempContent] = useState('');
  const textRef = useRef<HTMLElement>(null);
  const content = getContent(id, defaultContent);

  useEffect(() => {
    if (isEditable && textRef.current) {
      textRef.current.focus();
      // Select all text when starting to edit
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditable]);

  const handleClick = () => {
    if (isEditing && !isEditable) {
      setIsEditable(true);
      setTempContent(content);
    }
  };

  const handleBlur = () => {
    if (isEditable) {
      const newContent = textRef.current?.textContent || '';
      updateContent(id, newContent);
      setIsEditable(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditable(false);
      if (textRef.current) {
        textRef.current.textContent = content;
      }
    }
  };

  const editableProps = isEditable ? {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  } : {};

  return (
    <Tag
      ref={textRef as any}
      className={`${className} ${isEditing ? 'cms-editable' : ''} ${isEditable ? 'cms-editing' : ''}`}
      onClick={handleClick}
      {...editableProps}
    >
      {content || (isEditing ? placeholder : defaultContent)}
    </Tag>
  );
};

// components/cms/EditableImage.tsx
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

// components/cms/EditableList.tsx
interface EditableListProps {
  id: string;
  defaultItems: string[];
  className?: string;
  ordered?: boolean;
}

export const EditableList: React.FC<EditableListProps> = ({ 
  id, 
  defaultItems, 
  className = '', 
  ordered = false 
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  const [isEditable, setIsEditable] = useState(false);
  const items = getContent(id, defaultItems);
  const [tempItems, setTempItems] = useState<string[]>([]);

  const handleEdit = () => {
    if (isEditing) {
      setTempItems([...items]);
      setIsEditable(true);
    }
  };

  const handleSave = () => {
    updateContent(id, tempItems);
    setIsEditable(false);
  };

  const handleCancel = () => {
    setTempItems([]);
    setIsEditable(false);
  };

  const addItem = () => {
    setTempItems([...tempItems, '']);
  };

  const removeItem = (index: number) => {
    setTempItems(tempItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...tempItems];
    newItems[index] = value;
    setTempItems(newItems);
  };

  if (isEditable) {
    return (
      <div className={`${className} cms-editing`}>
        <div className="border-2 border-blue-300 p-4 rounded">
          {tempItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="List item..."
              />
              <button
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <button
              onClick={addItem}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add Item
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <div className={`relative ${isEditing ? 'cms-editable' : ''}`}>
      <ListTag className={className}>
        {items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
      {isEditing && (
        <button
          onClick={handleEdit}
          className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          Edit List
        </button>
      )}
    </div>
  );
};