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
  
  // Debug logging
  console.log('EditableText Debug:', {
    id,
    locale,
    languageSpecificId,
    content,
    defaultContent,
    hasContent: content !== defaultContent
  });

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
      console.log('Updating text content due to language/content change:', {
        languageSpecificId,
        newContent,
        defaultContent,
        isEditable
      });
      textRef.current.textContent = newContent;
    }
  }, [locale, languageSpecificId, defaultContent, isEditable, getContent]);

  // Update content when global edit mode changes
  useEffect(() => {
    if (!isEditing && !isEditable && textRef.current) {
      const newContent = getContent(languageSpecificId, defaultContent);
      console.log('Updating content due to edit mode change:', {
        isEditing,
        isEditable,
        languageSpecificId,
        newContent,
        currentText: textRef.current.textContent
      });
      textRef.current.textContent = newContent;
    }
  }, [isEditing, isEditable, languageSpecificId, defaultContent, getContent]);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing && !isEditable) {
      e.preventDefault(); // Prevent any default behavior (like following links)
      e.stopPropagation(); // Stop event from bubbling up
      setIsEditable(true);
    }
  };

  const handleBlur = async () => {
    if (isEditable) {
      const newContent = textRef.current?.textContent || '';
      try {
        await updateContent(languageSpecificId, newContent, 'text', `${id} (${locale})`);
        console.log('Content saved successfully:', languageSpecificId, newContent);
        
        // Force update the text content to ensure it persists
        if (textRef.current) {
          textRef.current.textContent = newContent;
        }
      } catch (error) {
        console.error('Failed to save content:', error);
        // Revert to previous content on error
        if (textRef.current) {
          textRef.current.textContent = content;
        }
      }
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