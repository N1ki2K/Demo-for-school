
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, title }) => {
  return (
    <div className="bg-white animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-8 border-b-4 border-brand-gold pb-4">{title}</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
            {children}
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
