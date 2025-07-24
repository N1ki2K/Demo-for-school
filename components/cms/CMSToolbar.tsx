// components/cms/CMSToolbar.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export const CMSToolbar: React.FC = () => {
  const { isEditing, isLoggedIn } = useCMS();
  const [showHelp, setShowHelp] = useState(false);

  if (!isLoggedIn || !isEditing) {
    return null;
  }

  return (
    <>
      <div className="cms-toolbar">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Mode Active
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            title="Help"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[300]">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">CMS Help</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Text Editing:</h4>
                <p>Click on any text with a blue dashed outline to edit it inline.</p>
              </div>
              <div>
                <h4 className="font-semibold">Image Editing:</h4>
                <p>Click on images to change their URL. Click the "Edit" button that appears.</p>
              </div>
              <div>
                <h4 className="font-semibold">List Editing:</h4>
                <p>Click the "Edit List" button on lists to add, remove, or modify items.</p>
              </div>
              <div>
                <h4 className="font-semibold">Keyboard Shortcuts:</h4>
                <ul className="ml-4 list-disc">
                  <li>Enter - Save text changes</li>
                  <li>Escape - Cancel text changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};