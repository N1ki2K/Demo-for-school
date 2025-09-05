import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';
import { EditableImage } from '../components/cms/EditableImage';
import { EditableList } from '../components/cms/EditableList';

const DynamicPage: React.FC = () => {
  const { '*': path } = useParams();
  const { getContentByPage } = useCMS();
  const { locale } = useLanguage();
  const [pageContent, setPageContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert path to page ID - handle both /path and path formats
  const normalizedPath = path?.startsWith('/') ? path : `/${path}`;
  let pageId = normalizedPath?.replace(/^\//, '').replace(/\/$/, '') || 'home';
  
  // Map URL paths to the correct page IDs from migration data
  const pathMappings: Record<string, string> = {
    'school/history': 'school-history',
    'school/patron': 'school-patron', 
    'school/team': 'school-team',
    'school/council': 'school-council',
    'documents/calendar': 'documents-calendar',
    'documents/schedules': 'documents-schedules',
    'projects/your-hour': 'projects-your-hour',
    'useful-links': 'useful-links',
    'info-access': 'info-access'
  };
  
  // Apply path mapping if it exists
  if (pathMappings[pageId]) {
    pageId = pathMappings[pageId];
  }

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get content for this page
        const content = await getContentByPage(pageId, locale);
        setPageContent(content);
        
        // If no content found, try some common page ID variations
        if (content.length === 0) {
          const variations = [
            pageId.replace(/\//g, '-'),
            pageId.replace(/\//g, '_'),
            pageId.split('/').pop() || pageId
          ];
          
          for (const variation of variations) {
            const varContent = await getContentByPage(variation, locale);
            if (varContent.length > 0) {
              setPageContent(varContent);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Error loading page content:', err);
        // Show the actual error message from the backend
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load page content');
        }
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      loadPageContent();
    }
  }, [pageId, locale, getContentByPage]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-600">Loading page content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If no content found, show a placeholder page
  if (pageContent.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {pageId.charAt(0).toUpperCase() + pageId.slice(1).replace(/[-_]/g, ' ')}
            </h1>
            <p className="text-gray-600 mb-6">
              This page has been created but doesn't have any content yet.
            </p>
            <div className="bg-white rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">To add content to this page:</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-1">
                <li>Log in to the CMS</li>
                <li>Go to the CMS Dashboard</li>
                <li>Select "Pages & Sections" tab</li>
                <li>Switch to "Manage Sections" tab</li>
                <li>Select this page from the dropdown</li>
                <li>Add content sections like titles, text, images, etc.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to render content based on type
  const renderContentSection = (section: any) => {
    const { id, type, content, label } = section;
    
    switch (type) {
      case 'text':
        return (
          <EditableText
            key={id}
            id={id}
            defaultContent={content}
            tag="div"
            className="text-gray-700 leading-relaxed"
          />
        );
      case 'image':
        return (
          <EditableImage
            key={id}
            id={id}
            defaultSrc={content}
            alt={label}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        );
      case 'list':
        return (
          <EditableList
            key={id}
            id={id}
            defaultItems={content ? content.split('\n').filter(item => item.trim()) : []}
            className="space-y-2"
          />
        );
      default:
        return (
          <div key={id} className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600">Unknown content type: {type}</p>
            <pre className="text-sm mt-2">{JSON.stringify(section, null, 2)}</pre>
          </div>
        );
    }
  };

  // Render the page with its content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {pageContent.map((section) => renderContentSection(section))}
      </div>
    </div>
  );
};

export default DynamicPage;