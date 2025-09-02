import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../src/services/api';

interface ContactInfo {
  'address-line1': string;
  'address-line2': string;
  'director-phone': string;
  'office-phone': string;
  'contact-email': string;
  'worktime-weekdays': string;
  'worktime-weekend': string;
  'worktime-note': string;
  'transport-lines': string[];
}

const ContactManagerTab: React.FC = () => {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    'address-line1': '',
    'address-line2': '',
    'director-phone': '',
    'office-phone': '',
    'contact-email': '',
    'worktime-weekdays': '',
    'worktime-weekend': '',
    'worktime-note': '',
    'transport-lines': []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing contact information
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setIsLoading(true);
        
        // Load all contact-related content sections
        const contentSections = await apiService.getContentSections();
        const contactSections = contentSections.filter((section: any) => 
          ['address-line1', 'address-line2', 'director-phone', 'office-phone', 
           'contact-email', 'worktime-weekdays', 'worktime-weekend', 'worktime-note',
           'transport-lines'].includes(section.id)
        );

        const loadedInfo: Partial<ContactInfo> = {};
        contactSections.forEach((section: any) => {
          if (section.id === 'transport-lines' && section.type === 'list') {
            loadedInfo[section.id] = section.items || [];
          } else {
            loadedInfo[section.id] = section.content || '';
          }
        });

        setContactInfo(prev => ({ ...prev, ...loadedInfo }));
      } catch (error) {
        console.error('Failed to load contact information:', error);
        setMessage({
          type: 'error',
          text: t.cms.contactManager.messages.loadError
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContactInfo();
  }, [t]);

  const handleInputChange = (field: keyof ContactInfo, value: string | string[]) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    // Clear any existing messages when user starts editing
    if (message) {
      setMessage(null);
    }
  };

  const handleTransportLinesChange = (lines: string[]) => {
    setContactInfo(prev => ({ ...prev, 'transport-lines': lines }));
    if (message) {
      setMessage(null);
    }
  };

  const saveContactInfo = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Prepare content sections for bulk update
      const contentSections = Object.entries(contactInfo).map(([key, value]) => {
        if (key === 'transport-lines') {
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
        text: t.cms.contactManager.messages.updateSuccess
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save contact information:', error);
      setMessage({
        type: 'error',
        text: t.cms.contactManager.messages.updateError.replace('{error}', error instanceof Error ? error.message : 'Unknown error')
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.cms.contactManager.title}
        </h2>
        <p className="text-gray-600">
          {t.cms.contactManager.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Edit Contact Information</h3>
          </div>
          <div className="p-6 space-y-6">
          {/* Address Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.contactManager.sections.address}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.addressLine1}
                </label>
                <input
                  type="text"
                  value={contactInfo['address-line1']}
                  onChange={(e) => handleInputChange('address-line1', e.target.value)}
                  placeholder={t.cms.contactManager.placeholders.addressLine1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.addressLine2}
                </label>
                <input
                  type="text"
                  value={contactInfo['address-line2']}
                  onChange={(e) => handleInputChange('address-line2', e.target.value)}
                  placeholder={t.cms.contactManager.placeholders.addressLine2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Phone Numbers Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.contactManager.sections.phones}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.directorPhone}
                </label>
                <input
                  type="tel"
                  value={contactInfo['director-phone']}
                  onChange={(e) => handleInputChange('director-phone', e.target.value)}
                  placeholder={t.cms.contactManager.placeholders.directorPhone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.officePhone}
                </label>
                <input
                  type="tel"
                  value={contactInfo['office-phone']}
                  onChange={(e) => handleInputChange('office-phone', e.target.value)}
                  placeholder={t.cms.contactManager.placeholders.officePhone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.contactManager.sections.email}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.cms.contactManager.fields.contactEmail}
              </label>
              <input
                type="email"
                value={contactInfo['contact-email']}
                onChange={(e) => handleInputChange('contact-email', e.target.value)}
                placeholder={t.cms.contactManager.placeholders.contactEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Working Hours Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.contactManager.sections.workTime}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.cms.contactManager.fields.weekdaysHours}
                  </label>
                  <input
                    type="text"
                    value={contactInfo['worktime-weekdays']}
                    onChange={(e) => handleInputChange('worktime-weekdays', e.target.value)}
                    placeholder={t.cms.contactManager.placeholders.weekdaysHours}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.cms.contactManager.fields.weekendHours}
                  </label>
                  <input
                    type="text"
                    value={contactInfo['worktime-weekend']}
                    onChange={(e) => handleInputChange('worktime-weekend', e.target.value)}
                    placeholder={t.cms.contactManager.placeholders.weekendHours}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.workTimeNote}
                </label>
                <textarea
                  value={contactInfo['worktime-note']}
                  onChange={(e) => handleInputChange('worktime-note', e.target.value)}
                  placeholder={t.cms.contactManager.placeholders.workTimeNote}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Transportation Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t.cms.contactManager.sections.transport}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.cms.contactManager.fields.transportLines}
              </label>
              <TransportLinesEditor
                lines={contactInfo['transport-lines']}
                onChange={handleTransportLinesChange}
                placeholder={t.cms.contactManager.placeholders.transportLines}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-end">
              <button
                onClick={saveContactInfo}
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

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-600">See how your changes will appear on the contact page</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Preview Address */}
              <div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Address
                </h4>
                <p className="text-gray-700">{contactInfo['address-line1'] || 'Address Line 1'}</p>
                <p className="text-gray-700">{contactInfo['address-line2'] || 'Address Line 2'}</p>
              </div>

              {/* Preview Phones */}
              <div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Phones
                </h4>
                <p className="text-gray-700">
                  <strong>Principal:</strong> {contactInfo['director-phone'] || '+359 42 123 456'}
                </p>
                <p className="text-gray-700">
                  <strong>Office:</strong> {contactInfo['office-phone'] || '+359 42 123 457'}
                </p>
              </div>

              {/* Preview Email */}
              <div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email
                </h4>
                <p>
                  <a href={`mailto:${contactInfo['contact-email']}`} className="text-blue-600 hover:underline">
                    {contactInfo['contact-email'] || 'info@school.bg'}
                  </a>
                </p>
              </div>

              {/* Preview Working Hours */}
              <div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Working Hours
                </h4>
                <div className="text-gray-700">
                  <p>
                    <strong>Monday - Friday:</strong> {contactInfo['worktime-weekdays'] || '07:30 - 17:30'}
                  </p>
                  <p>
                    <strong>Saturday - Sunday:</strong> {contactInfo['worktime-weekend'] || 'Closed'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {contactInfo['worktime-note'] || '* For visits outside working hours, please contact us in advance'}
                  </p>
                </div>
              </div>

              {/* Preview Transportation */}
              <div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v0a2 2 0 01-2-2H8z"></path>
                  </svg>
                  Transport
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {contactInfo['transport-lines'].length > 0 ? (
                    <ul className="text-sm text-gray-700 space-y-1">
                      {contactInfo['transport-lines'].map((line, index) => (
                        <li key={index}>• {line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No transport lines added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-6 p-4 rounded-md ${
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
    </div>
  );
};

// Transport Lines Editor Component
interface TransportLinesEditorProps {
  lines: string[];
  onChange: (lines: string[]) => void;
  placeholder: string;
}

const TransportLinesEditor: React.FC<TransportLinesEditorProps> = ({ lines, onChange, placeholder }) => {
  const [newLine, setNewLine] = useState('');

  const addLine = () => {
    if (newLine.trim()) {
      onChange([...lines, newLine.trim()]);
      setNewLine('');
    }
  };

  const removeLine = (index: number) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, value: string) => {
    const updatedLines = [...lines];
    updatedLines[index] = value;
    onChange(updatedLines);
  };

  return (
    <div className="space-y-2">
      {lines.map((line, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={line}
            onChange={(e) => updateLine(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => removeLine(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            title="Remove line"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newLine}
          onChange={(e) => setNewLine(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addLine()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addLine}
          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
          title="Add line"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContactManagerTab;