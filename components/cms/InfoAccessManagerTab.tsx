import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface InfoAccessContent {
  'info-access-intro': string;
  'info-access-rules-title': string;
  'info-access-rules-p1': string;
  'info-access-principles-title': string;
  'info-access-principles': string[];
  'info-access-howto-title': string;
  'info-access-howto-p1': string;
  'info-access-methods': string[];
  'info-access-howto-p2': string;
  'info-access-report-title': string;
  'info-access-report-p1': string;
  'info-access-stats': string[];
  'info-access-report-p2': string;
}

const InfoAccessManagerTab: React.FC = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState<InfoAccessContent>({
    'info-access-intro': '',
    'info-access-rules-title': '',
    'info-access-rules-p1': '',
    'info-access-principles-title': '',
    'info-access-principles': [],
    'info-access-howto-title': '',
    'info-access-howto-p1': '',
    'info-access-methods': [],
    'info-access-howto-p2': '',
    'info-access-report-title': '',
    'info-access-report-p1': '',
    'info-access-stats': [],
    'info-access-report-p2': ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        
        // Load all info access related content sections
        const contentSections = await apiService.getContentSections();
        const infoAccessSections = contentSections.filter((section: any) => 
          [
            'info-access-intro', 'info-access-rules-title', 'info-access-rules-p1',
            'info-access-principles-title', 'info-access-principles',
            'info-access-howto-title', 'info-access-howto-p1', 'info-access-methods',
            'info-access-howto-p2', 'info-access-report-title', 'info-access-report-p1',
            'info-access-stats', 'info-access-report-p2'
          ].includes(section.id)
        );

        const loadedContent: Partial<InfoAccessContent> = {};
        infoAccessSections.forEach((section: any) => {
          if (['info-access-principles', 'info-access-methods', 'info-access-stats'].includes(section.id) && section.type === 'list') {
            loadedContent[section.id] = section.items || [];
          } else {
            loadedContent[section.id] = section.content || '';
          }
        });

        setContent(prev => ({ ...prev, ...loadedContent }));
      } catch (error) {
        console.error('Failed to load info access content:', error);
        setMessage({
          type: 'error',
          text: t.cms.infoAccessManager.messages.loadError
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [t]);

  const handleInputChange = (field: keyof InfoAccessContent, value: string | string[]) => {
    setContent(prev => ({ ...prev, [field]: value }));
    // Clear any existing messages when user starts editing
    if (message) {
      setMessage(null);
    }
  };

  const saveContent = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Prepare content sections for bulk update
      const contentSections = Object.entries(content).map(([key, value]) => {
        if (['info-access-principles', 'info-access-methods', 'info-access-stats'].includes(key)) {
          return {
            id: key,
            type: 'list',
            content: '',
            items: value as string[]
          };
        } else {
          return {
            id: key,
            type: 'text',
            content: value as string,
            items: []
          };
        }
      });

      await apiService.bulkUpdateContentSections(contentSections);

      setMessage({
        type: 'success',
        text: t.cms.infoAccessManager.messages.updateSuccess
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save info access content:', error);
      setMessage({
        type: 'error',
        text: t.cms.infoAccessManager.messages.updateError.replace('{error}', error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t.cms.common.loading}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.cms.infoAccessManager.title}
          </h2>
          <p className="text-gray-600">
            {t.cms.infoAccessManager.description}
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.infoAccessManager.sections.intro}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.cms.infoAccessManager.fields.intro}
              </label>
              <textarea
                value={content['info-access-intro']}
                onChange={(e) => handleInputChange('info-access-intro', e.target.value)}
                placeholder={t.cms.infoAccessManager.placeholders.intro}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rules & Principles Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.infoAccessManager.sections.rules}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.rulesTitle}
                </label>
                <input
                  type="text"
                  value={content['info-access-rules-title']}
                  onChange={(e) => handleInputChange('info-access-rules-title', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.rulesTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.rulesContent}
                </label>
                <textarea
                  value={content['info-access-rules-p1']}
                  onChange={(e) => handleInputChange('info-access-rules-p1', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.rulesContent}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.principlesTitle}
                </label>
                <input
                  type="text"
                  value={content['info-access-principles-title']}
                  onChange={(e) => handleInputChange('info-access-principles-title', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.principlesTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.principles}
                </label>
                <ListEditor
                  items={content['info-access-principles']}
                  onChange={(items) => handleInputChange('info-access-principles', items)}
                  placeholder={t.cms.infoAccessManager.placeholders.principleItem}
                />
              </div>
            </div>
          </div>

          {/* How to Request Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.infoAccessManager.sections.howTo}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.howToTitle}
                </label>
                <input
                  type="text"
                  value={content['info-access-howto-title']}
                  onChange={(e) => handleInputChange('info-access-howto-title', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.howToTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.howToIntro}
                </label>
                <textarea
                  value={content['info-access-howto-p1']}
                  onChange={(e) => handleInputChange('info-access-howto-p1', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.howToIntro}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.methods}
                </label>
                <ListEditor
                  items={content['info-access-methods']}
                  onChange={(items) => handleInputChange('info-access-methods', items)}
                  placeholder={t.cms.infoAccessManager.placeholders.methodItem}
                  ordered={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.howToNote}
                </label>
                <textarea
                  value={content['info-access-howto-p2']}
                  onChange={(e) => handleInputChange('info-access-howto-p2', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.howToNote}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Annual Report Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.infoAccessManager.sections.report}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.reportTitle}
                </label>
                <input
                  type="text"
                  value={content['info-access-report-title']}
                  onChange={(e) => handleInputChange('info-access-report-title', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.reportTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.reportIntro}
                </label>
                <textarea
                  value={content['info-access-report-p1']}
                  onChange={(e) => handleInputChange('info-access-report-p1', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.reportIntro}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.stats}
                </label>
                <ListEditor
                  items={content['info-access-stats']}
                  onChange={(items) => handleInputChange('info-access-stats', items)}
                  placeholder={t.cms.infoAccessManager.placeholders.statItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.reportNote}
                </label>
                <textarea
                  value={content['info-access-report-p2']}
                  onChange={(e) => handleInputChange('info-access-report-p2', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.reportNote}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 mx-6 mb-6 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={saveContent}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.cms.common.saving}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.cms.common.save}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// List Editor Component
interface ListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  ordered?: boolean;
}

const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, placeholder, ordered = false }) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 w-6">
            {ordered ? `${index + 1}.` : '•'}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => removeItem(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            title="Remove item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 w-6">
          {ordered ? `${items.length + 1}.` : '•'}
        </span>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addItem}
          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
          title="Add item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InfoAccessManagerTab;