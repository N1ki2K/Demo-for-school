// components/cms/EditableText.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

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
  placeholder 
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  const { locale } = useLanguage();
  const [isEditable, setIsEditable] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  
  // Create language-specific ID
  const languageSpecificId = `${id}_${locale}`;
  const content = getContent(languageSpecificId, defaultContent);

  const texts = {
    bg: {
      clickToEdit: 'Редактирай'
    },
    en: {
      clickToEdit: 'Click to edit'
    }
  };

  const t = texts[locale];
  const finalPlaceholder = placeholder || t.clickToEdit;

  useEffect(() => {
    if (isEditable && textRef.current) {
      textRef.current.focus();
      
      // Select all text when starting to edit
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isEditable]);

  // Update content when language changes (only if not currently editing)
  useEffect(() => {
    if (!isEditable && textRef.current) {
      const newContent = getContent(languageSpecificId, defaultContent);
      textRef.current.textContent = newContent;
    }
  }, [locale, languageSpecificId, defaultContent, isEditable, getContent]);

  const handleClick = () => {
    if (isEditing && !isEditable) {
      setIsEditable(true);
    }
  };

  const handleBlur = () => {
    if (isEditable) {
      const newContent = textRef.current?.textContent || '';
      updateContent(languageSpecificId, newContent);
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

  // Determine what content to display
  const displayContent = () => {
    if (content && content !== defaultContent) {
      return content;
    }
    
    if (isEditing && (!content || content === defaultContent)) {
      return finalPlaceholder;
    }
    
    return defaultContent;
  };

  return (
    <Tag
      ref={textRef as any}
      className={`${className} ${isEditing ? 'cms-editable' : ''} ${isEditable ? 'cms-editing' : ''}`}
      onClick={handleClick}
      contentEditable={isEditable}
      suppressContentEditableWarning={isEditable}
      onBlur={isEditable ? handleBlur : undefined}
      onKeyDown={isEditable ? handleKeyDown : undefined}
      data-tooltip={isEditing ? t.clickToEdit : undefined}
      style={isEditing ? {
        '--tooltip-text': `"${t.clickToEdit}"`
      } as React.CSSProperties : undefined}
    >
      {displayContent()}
    </Tag>
  );
};