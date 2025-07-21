
import React from 'react';
import PageWrapper from '../../components/PageWrapper';

interface GenericProjectPageProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  children: React.ReactNode;
}

const GenericProjectPage: React.FC<GenericProjectPageProps> = ({ title, imageUrl, imageAlt, children }) => {
  return (
    <PageWrapper title={title}>
      <div className="space-y-6">
        <img className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md mb-8" src={imageUrl} alt={imageAlt} />
        <div className="text-gray-700 space-y-4">
            {children}
        </div>
      </div>
    </PageWrapper>
  );
};

export default GenericProjectPage;
