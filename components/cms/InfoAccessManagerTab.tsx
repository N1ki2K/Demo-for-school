import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';
import { EditableList } from './EditableList';

const InfoAccessManagerTab: React.FC = () => {
  const { t, locale } = useLanguage();
  const { getContent, updateContent, contentLoaded } = useCMS();
  const [formData, setFormData] = useState({
    'info-access-intro': '',
    'info-access-rules-title': '',
    'info-access-rules-p1': '',
    'info-access-principles-title': '',
    'info-access-howto-title': '',
    'info-access-howto-p1': '',
    'info-access-howto-p2': '',
    'info-access-report-title': '',
    'info-access-report-p1': '',
    'info-access-report-p2': ''
  });

  // Load content when component mounts or language changes
  useEffect(() => {
    if (!contentLoaded) return;
    
    const i = t.infoAccessPage;
    const newFormData = {
      'info-access-intro': getContent(`info-access-intro_${locale}`, i?.intro || ''),
      'info-access-rules-title': getContent(`info-access-rules-title_${locale}`, i?.rules?.title || ''),
      'info-access-rules-p1': getContent(`info-access-rules-p1_${locale}`, i?.rules?.p1 || ''),
      'info-access-principles-title': getContent(`info-access-principles-title_${locale}`, i?.rules?.principlesTitle || ''),
      'info-access-howto-title': getContent(`info-access-howto-title_${locale}`, i?.howTo?.title || ''),
      'info-access-howto-p1': getContent(`info-access-howto-p1_${locale}`, i?.howTo?.p1 || ''),
      'info-access-howto-p2': getContent(`info-access-howto-p2_${locale}`, i?.howTo?.p2 || ''),
      'info-access-report-title': getContent(`info-access-report-title_${locale}`, i?.report?.title || ''),
      'info-access-report-p1': getContent(`info-access-report-p1_${locale}`, i?.report?.p1 || ''),
      'info-access-report-p2': getContent(`info-access-report-p2_${locale}`, i?.report?.p2 || '')
    };
    
    setFormData(newFormData);
  }, [contentLoaded, locale, getContent, t]);

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update content immediately
    try {
      await updateContent(`${field}_${locale}`, value, 'text', `${field} (${locale})`, 'info-access');
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

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
                value={formData['info-access-intro']}
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
                  value={formData['info-access-rules-title']}
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
                  value={formData['info-access-rules-p1']}
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
                  value={formData['info-access-principles-title']}
                  onChange={(e) => handleInputChange('info-access-principles-title', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.principlesTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.principles}
                </label>
                <EditableList
                  id="info-access-principles"
                  defaultItems={[
                    t.infoAccessPage?.rules?.principles?.p1 || '',
                    t.infoAccessPage?.rules?.principles?.p2 || '',
                    t.infoAccessPage?.rules?.principles?.p3 || ''
                  ].filter(Boolean)}
                  className="text-sm text-gray-700 space-y-1"
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
                  value={formData['info-access-howto-title']}
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
                  value={formData['info-access-howto-p1']}
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
                <EditableList
                  id="info-access-methods"
                  defaultItems={[
                    t.infoAccessPage?.howTo?.methods?.m1 || '',
                    t.infoAccessPage?.howTo?.methods?.m2 || '',
                    t.infoAccessPage?.howTo?.methods?.m3 || ''
                  ].filter(Boolean)}
                  className="text-sm text-gray-700 space-y-1"
                  placeholder={t.cms.infoAccessManager.placeholders.methodItem}
                  ordered={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.howToNote}
                </label>
                <textarea
                  value={formData['info-access-howto-p2']}
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
                  value={formData['info-access-report-title']}
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
                  value={formData['info-access-report-p1']}
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
                <EditableList
                  id="info-access-stats"
                  defaultItems={[
                    t.infoAccessPage?.report?.stats?.s1 || '',
                    t.infoAccessPage?.report?.stats?.s2 || '',
                    t.infoAccessPage?.report?.stats?.s3 || ''
                  ].filter(Boolean)}
                  className="text-sm text-gray-700 space-y-1"
                  placeholder={t.cms.infoAccessManager.placeholders.statItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.infoAccessManager.fields.reportNote}
                </label>
                <textarea
                  value={formData['info-access-report-p2']}
                  onChange={(e) => handleInputChange('info-access-report-p2', e.target.value)}
                  placeholder={t.cms.infoAccessManager.placeholders.reportNote}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoAccessManagerTab;