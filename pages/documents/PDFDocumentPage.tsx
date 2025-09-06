import React from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import InlinePDFViewer from '../../components/InlinePDFViewer';
import { EditableText } from '../../components/cms/EditableText';

const PDFDocumentPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const { getTranslation } = useLanguage();

  if (!filename) {
    return (
      <PageWrapper title={getTranslation('pdfDocument.error', 'Document Error')}>
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            {getTranslation('pdfDocument.noFilename', 'No document specified')}
          </h2>
          <p className="text-gray-600">
            {getTranslation('pdfDocument.noFilenameDesc', 'Please select a valid document to view.')}
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Decode the filename and create a nice title
  const decodedFilename = decodeURIComponent(filename);
  const documentTitle = decodedFilename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
  const pageId = `pdf-document-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <PageWrapper title={documentTitle}>
      {/* Optional introduction text - editable by CMS */}
      <EditableText
        id={`${pageId}-intro`}
        defaultContent=""
        tag="div"
        className="mb-6"
        placeholder={getTranslation('pdfDocument.introPlaceholder', 'Add an introduction to this document...')}
      />

      {/* Embedded PDF Viewer */}
      <InlinePDFViewer 
        filename={decodedFilename}
        title={documentTitle}
        className="mt-6"
      />

      {/* Optional additional content - editable by CMS */}
      <EditableText
        id={`${pageId}-additional`}
        defaultContent=""
        tag="div"
        className="mt-6"
        placeholder={getTranslation('pdfDocument.additionalPlaceholder', 'Add additional information or context...')}
      />
    </PageWrapper>
  );
};

export default PDFDocumentPage;