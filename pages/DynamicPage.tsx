import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import PageWrapper from '../components/PageWrapper';
import NotFoundPage from './NotFoundPage';
import { EditableText } from '../components/cms/EditableText';

const DynamicPage: React.FC = () => {
  const location = useLocation();
  const { pages } = useCMS();
  
  // Find the page by path
  const page = pages.find(p => p.path === location.pathname && p.isPublished);
  
  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <PageWrapper title={page.title}>
      <div className="prose max-w-none">
        <div 
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </PageWrapper>
  );
};

export default DynamicPage;