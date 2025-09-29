import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const PresentationViewerPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Presentation Not Found</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">📊 Presentation Viewer</h1>
              <p className="text-sm text-gray-400">{filename}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={presentationUrl}
              download
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Presentation Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            
            {/* Main Download Section */}
            <div className="p-12 text-center">
              <div className="mb-8">
                <div className="bg-blue-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-6xl">📊</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">PowerPoint Presentation</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Ready to view! Download the presentation for the best experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={presentationUrl}
                  download
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl font-medium shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download & View
                </a>
                <button
                  onClick={() => window.open(presentationUrl, '_blank')}
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xl font-medium shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Direct Link
                </button>
              </div>
            </div>

            {/* Fallback iframe section */}
            <div className="border-t border-gray-200 p-6">
              <details className="cursor-pointer">
                <summary className="text-lg font-medium text-gray-700 hover:text-gray-900 mb-4">
                  🔧 Try Online Preview (Advanced - May not work on localhost)
                </summary>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Online preview requires the presentation to be accessible from the internet. 
                    On localhost, this typically won't work. Download the file instead.
                  </p>
                </div>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(presentationUrl)}`}
                    className="w-full h-full border border-gray-300 rounded-lg"
                    allowFullScreen
                    title={`Presentation: ${filename}`}
                  />
                </div>
              </details>
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Presentation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">File Name:</span>
                <p className="text-gray-900">{filename}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <p className="text-gray-900">PowerPoint Presentation</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Viewing Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use the controls in the embedded viewer to navigate slides</li>
                    <li>Click the fullscreen button for a better viewing experience</li>
                    <li>Download the file if you need to edit or present offline</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewerPage;