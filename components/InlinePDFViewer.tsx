import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface InlinePDFViewerProps {
  filename: string;
  title?: string;
  className?: string;
  height?: string;
}

const InlinePDFViewer: React.FC<InlinePDFViewerProps> = ({ 
  filename, 
  title = 'Document',
  className = '',
  height = '80vh'
}) => {
  const { getTranslation } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [embedMethod, setEmbedMethod] = useState<'object' | 'iframe' | 'fallback'>('object');

  useEffect(() => {
    if (!filename) {
      setError(getTranslation('pdfViewer.noFilename', 'No PDF file specified'));
      setIsLoading(false);
      return;
    }

    // Construct the PDF URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const url = `${baseUrl}/Documents/${encodeURIComponent(filename)}`;
    
    // Check if the PDF exists
    checkPdfExists(url);
  }, [filename, getTranslation]);

  const checkPdfExists = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        setPdfUrl(url);
        setError(null);
      } else {
        setError(getTranslation('pdfViewer.fileNotFound', 'PDF file not found'));
      }
    } catch (err) {
      console.error('Error checking PDF:', err);
      setError(getTranslation('pdfViewer.loadError', 'Error loading PDF file'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename || 'document.pdf';
      link.click();
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{getTranslation('pdfViewer.loading', 'Loading PDF...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          {getTranslation('pdfViewer.errorTitle', 'Cannot Load PDF')}
        </h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => checkPdfExists(pdfUrl || '')}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          {getTranslation('pdfViewer.retry', 'Try Again')}
        </button>
      </div>
    );
  }

  const decodedFilename = filename ? decodeURIComponent(filename) : 'Document';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* PDF Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">📄</span>
            <h3 className="text-lg font-semibold text-gray-800 truncate max-w-md">
              {title || decodedFilename}
            </h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{getTranslation('pdfViewer.download', 'Download')}</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>{getTranslation('pdfViewer.print', 'Print')}</span>
            </button>
            
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>{getTranslation('pdfViewer.openNewTab', 'New Tab')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
        <div className="relative" style={{ height: height }}>
          {embedMethod === 'object' && (
            <object
              data={`${pdfUrl}#zoom=FitH&view=FitH`}
              type="application/pdf"
              className="w-full h-full"
              style={{ minHeight: '600px' }}
              onError={() => setEmbedMethod('iframe')}
            >
              {/* This content shows while object loads or if it fails */}
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            </object>
          )}
          
          {embedMethod === 'iframe' && (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=FitH&view=FitH`}
              title={`PDF Viewer - ${decodedFilename}`}
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
              onError={() => setEmbedMethod('fallback')}
            />
          )}
          
          {embedMethod === 'fallback' && (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {getTranslation('pdfViewer.embedBlocked', 'PDF Cannot Be Embedded')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getTranslation('pdfViewer.cspBlocked', 'Due to security settings, this PDF cannot be displayed inline. Please use the options below.')}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {getTranslation('pdfViewer.downloadNow', 'Download PDF')}
                  </button>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                  >
                    {getTranslation('pdfViewer.openNewTab', 'Open in New Tab')}
                  </a>
                  <button
                    onClick={() => setEmbedMethod('object')}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    {getTranslation('pdfViewer.tryAgain', 'Try Again')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-600 text-center">
        <p>{getTranslation('pdfViewer.helpText', 'Use your browser controls to zoom, navigate, and interact with the PDF document.')}</p>
      </div>
    </div>
  );
};

export default InlinePDFViewer;