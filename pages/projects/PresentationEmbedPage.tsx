import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const PresentationEmbedPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const { getTranslation } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [presentationUrl, setPresentationUrl] = useState<string>('');

  useEffect(() => {
    if (!filename) {
      setError('No presentation file specified');
      setLoading(false);
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const url = `${apiBaseUrl}/Presentations/${filename}`;

    // Set URL directly - the server will handle 404s if file doesn't exist
    setPresentationUrl(url);
    setLoading(false);
  }, [filename]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 m-6">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-800 mb-2">Presentation Not Available</h2>
          <p className="text-red-700 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-3xl mr-3">📊</span>
              Presentation
            </h1>
            <p className="text-gray-600">{filename}</p>
          </div>
          
          <div className="flex space-x-3">
            <a
              href={presentationUrl}
              download
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </a>
            <button
              onClick={() => window.open(`/projects/presentations/view/${filename}`, '_blank')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Full Screen
            </button>
          </div>
        </div>
        
        <div className="border-b border-gray-200"></div>
      </div>

      {/* Presentation Preview/Download */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PowerPoint Presentation</h3>
            <p className="text-gray-600 mb-6">
              This presentation is ready to view. Download it to your device for the best experience.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={presentationUrl}
              download
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download & View
            </a>
            <button
              onClick={() => window.open(`#/projects/presentations/view/${filename}`, '_blank')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Full Screen
            </button>
          </div>
        </div>
        
        {/* Fallback iframe attempt */}
        <div className="border-t border-gray-200 p-4">
          <details className="cursor-pointer">
            <summary className="text-sm text-gray-600 hover:text-gray-800">Try online preview (may not work on localhost)</summary>
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(presentationUrl)}`}
                className="w-full h-full border border-gray-200 rounded"
                allowFullScreen
                title={`Presentation: ${filename}`}
              />
            </div>
          </details>
        </div>
      </div>

      {/* Alternative viewing options */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Viewing Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-lg p-2 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Download & View Offline</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download the presentation to your device for the best viewing experience and offline access.
                </p>
                <a
                  href={presentationUrl}
                  download
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Download Now
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-2 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Full Screen Viewer</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Open the presentation in a dedicated full-screen viewer for better presentation experience.
                </p>
                <button
                  onClick={() => window.open(`#/projects/presentations/view/${filename}`, '_blank')}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Open Full Screen
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Note:</p>
              <p>This embedded viewer requires an internet connection. For offline viewing or editing, please download the file.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEmbedPage;