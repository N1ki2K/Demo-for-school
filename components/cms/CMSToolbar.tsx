// components/cms/CMSToolbar.tsx
import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { PageManagement } from './PageManagement';

export const CMSToolbar: React.FC = () => {
  const { isEditing, isLoggedIn } = useCMS();
  const { locale } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);
  const [showPageManagement, setShowPageManagement] = useState(false);

  const texts = {
    bg: {
      editModeActive: 'Режим на редактиране активен',
      help: 'Помощ',
      pages: 'Страници',
      cmsHelp: 'CMS Помощ',
      textEditing: 'Редактиране на текст:',
      textEditingDesc: 'Щракнете върху всеки текст със синя пунктирана граница, за да го редактирате директно.',
      imageEditing: 'Редактиране на изображения:',
      imageEditingDesc: 'Щракнете върху изображения, за да промените техния URL. Щракнете върху бутона "Редактирай", който се появява.',
      listEditing: 'Редактиране на списъци:',
      listEditingDesc: 'Щракнете върху бутона "Редактирай списък" на списъците, за да добавяте, премахвате или променяте елементи.',
      keyboardShortcuts: 'Клавиатурни комбинации:',
      enterSave: 'Enter - Запази промените в текста',
      escapeCancel: 'Escape - Отмени промените в текста'
    },
    en: {
      editModeActive: 'Edit Mode Active',
      help: 'Help',
      pages: 'Pages',
      cmsHelp: 'CMS Help',
      textEditing: 'Text Editing:',
      textEditingDesc: 'Click on any text with a blue dashed outline to edit it inline.',
      imageEditing: 'Image Editing:',
      imageEditingDesc: 'Click on images to change their URL. Click the "Edit" button that appears.',
      listEditing: 'List Editing:',
      listEditingDesc: 'Click the "Edit List" button on lists to add, remove, or modify items.',
      keyboardShortcuts: 'Keyboard Shortcuts:',
      enterSave: 'Enter - Save text changes',
      escapeCancel: 'Escape - Cancel text changes'
    }
  };

  const t = texts[locale];

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
            {t.editModeActive}
          </div>
          <button
            onClick={() => setShowPageManagement(!showPageManagement)}
            className="p-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
            title={t.pages}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </button>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            title={t.help}
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
              <h3 className="text-lg font-bold">{t.cmsHelp}</h3>
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
                <h4 className="font-semibold">{t.textEditing}</h4>
                <p>{t.textEditingDesc}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t.imageEditing}</h4>
                <p>{t.imageEditingDesc}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t.listEditing}</h4>
                <p>{t.listEditingDesc}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t.keyboardShortcuts}</h4>
                <ul className="ml-4 list-disc">
                  <li>{t.enterSave}</li>
                  <li>{t.escapeCancel}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPageManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">{t.pages}</h3>
              <button
                onClick={() => setShowPageManagement(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <PageManagement />
            </div>
          </div>
        </div>
      )}
    </>
  );
};