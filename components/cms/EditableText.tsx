// components/cms/EditableText.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';

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
  const { isEditing, getContent, updateContent, contentLoaded } = useCMS();
  
  // Enable inline editing in CMS mode
  const forceReadOnly = false;
  const { locale } = useLanguage();
  const location = useLocation();
  const [isEditable, setIsEditable] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  
  // Create language-specific ID
  const languageSpecificId = `${id}_${locale}`;
  const [displayContent, setDisplayContent] = useState<string>('');
  
  // Get content and update display when language changes OR when content is loaded
  useEffect(() => {
    if (!contentLoaded) {
      // If content isn't loaded yet, show default content temporarily
      console.log(`⏳ Content not loaded yet for ${languageSpecificId}, showing default`);
      setDisplayContent(defaultContent);
      return;
    }
    
    const content = getContent(languageSpecificId, defaultContent);
    console.log(`📄 Loading content for ${languageSpecificId}:`, {
      content,
      defaultContent,
      isDefault: content === defaultContent,
      contentLoaded
    });
    setDisplayContent(content);
  }, [languageSpecificId, defaultContent, contentLoaded]); // Added contentLoaded dependency
  
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
  
  // Debug logging
  console.log('EditableText Debug:', {
    id,
    locale,
    languageSpecificId,
    displayContent,
    defaultContent,
    hasContent: displayContent !== defaultContent
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

  // Update DOM content when displayContent changes
  useEffect(() => {
    if (!isEditable && textRef.current) {
      console.log('Updating DOM text content:', {
        languageSpecificId,
        displayContent,
        defaultContent,
        isEditable
      });
      textRef.current.textContent = displayContent;
    }
  }, [displayContent, isEditable, languageSpecificId, defaultContent]);

  // Update content when global edit mode changes
  useEffect(() => {
    if (!isEditing && !isEditable && textRef.current) {
      console.log('Updating content due to edit mode change:', {
        isEditing,
        isEditable,
        languageSpecificId,
        displayContent,
        currentText: textRef.current.textContent
      });
      textRef.current.textContent = displayContent;
    }
  }, [isEditing, isEditable, languageSpecificId, displayContent]);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing && !isEditable && !forceReadOnly) {
      e.preventDefault(); // Prevent any default behavior (like following links)
      e.stopPropagation(); // Stop event from bubbling up
      setIsEditable(true);
    }
  };

  const handleBlur = async () => {
    if (isEditable) {
      const newContent = textRef.current?.textContent || '';
      try {
        // Include page context in the content update
        await updateContent(languageSpecificId, newContent, 'text', `${id} (${locale})`, currentPageId);
        console.log('Content saved successfully:', languageSpecificId, newContent, 'Page:', currentPageId);
        
        // Force update the text content to ensure it persists
        if (textRef.current) {
          textRef.current.textContent = newContent;
        }
      } catch (error) {
        console.error('Failed to save content:', error);
        // Revert to previous content on error
        if (textRef.current) {
          textRef.current.textContent = displayContent;
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
        textRef.current.textContent = displayContent;
      }
    }
  };

  // Determine what content to display
  const getDisplayContent = () => {
    // Always prioritize displayContent if it exists and isn't empty
    if (displayContent && displayContent.trim() !== '') {
      return displayContent;
    }
    
    // If we're in editing mode and no content, show placeholder
    if (isEditing && (!displayContent || displayContent.trim() === '')) {
      return finalPlaceholder;
    }
    
    // Fall back to default content only if no CMS content exists
    return defaultContent;
  };

  return (
    <Tag
      ref={textRef as any}
      className={`${className} ${isEditing && !forceReadOnly ? 'cms-editable' : ''} ${isEditable ? 'cms-editing' : ''}`}
      onClick={handleClick}
      contentEditable={isEditable && !forceReadOnly}
      suppressContentEditableWarning={isEditable}
      onBlur={isEditable ? handleBlur : undefined}
      onKeyDown={isEditable ? handleKeyDown : undefined}
      data-tooltip={isEditing ? t.clickToEdit : undefined}
      style={isEditing ? {
        '--tooltip-text': `"${t.clickToEdit}"`
      } as React.CSSProperties : undefined}
    >
      {getDisplayContent()}
    </Tag>
  );
};