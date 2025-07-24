// components/cms/EditableList.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

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
  const { locale } = useLanguage();
  const [isEditable, setIsEditable] = useState(false);
  const items = getContent(id, defaultItems);
  const [tempItems, setTempItems] = useState<string[]>([]);

  const texts = {
    bg: {
      editList: 'Редактирай списък',
      addItem: 'Добави елемент',
      remove: 'Премахни',
      save: 'Запази',
      cancel: 'Отказ',
      placeholder: 'Елемент от списъка...'
    },
    en: {
      editList: 'Edit List',
      addItem: 'Add Item',
      remove: 'Remove',
      save: 'Save',
      cancel: 'Cancel',
      placeholder: 'List item...'
    }
  };

  const t = texts[locale];

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
                placeholder={t.placeholder}
              />
              <button
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                {t.remove}
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <button
              onClick={addItem}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              {t.addItem}
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              {t.save}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
            >
              {t.cancel}
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
          {t.editList}
        </button>
      )}
    </div>
  );
};