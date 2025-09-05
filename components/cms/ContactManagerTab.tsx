import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';
import { EditableList } from './EditableList';

const ContactManagerTab: React.FC = () => {
  const { t, locale } = useLanguage();
  const { getContent, updateContent, contentLoaded } = useCMS();
  const [formData, setFormData] = useState({
    'address-line1': '',
    'address-line2': '',
    'director-phone': '',
    'office-phone': '',
    'contact-email': '',
    'worktime-weekdays': '',
    'worktime-weekend': '',
    'worktime-note': ''
  });

  // Load content when component mounts or language changes
  useEffect(() => {
    if (!contentLoaded) return;
    
    const newFormData = {
      'address-line1': getContent(`address-line1_${locale}`, t.contactsPage.address.line1),
      'address-line2': getContent(`address-line2_${locale}`, t.contactsPage.address.line2),
      'director-phone': getContent(`director-phone_${locale}`, '+359 42 123 456'),
      'office-phone': getContent(`office-phone_${locale}`, '+359 42 123 457'),
      'contact-email': getContent(`contact-email_${locale}`, t.contactsPage.email.address),
      'worktime-weekdays': getContent(`worktime-weekdays_${locale}`, t.contactsPage.workTime.weekdays),
      'worktime-weekend': getContent(`worktime-weekend_${locale}`, t.contactsPage.workTime.weekend),
      'worktime-note': getContent(`worktime-note_${locale}`, t.contactsPage.workTime.note)
    };
    
    setFormData(newFormData);
  }, [contentLoaded, locale, getContent, t]);

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update content immediately
    try {
      await updateContent(`${field}_${locale}`, value, 'text', `${field} (${locale})`, 'contacts');
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.cms.contactManager.title}
          </h2>
          <p className="text-gray-600">
            {t.cms.contactManager.description}
          </p>
        </div>

        <div className="p-6 space-y-8">
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
                  value={formData['address-line1']}
                  onChange={(e) => handleInputChange('address-line1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.cms.contactManager.placeholders.addressLine1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.addressLine2}
                </label>
                <input
                  type="text"
                  value={formData['address-line2']}
                  onChange={(e) => handleInputChange('address-line2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.cms.contactManager.placeholders.addressLine2}
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
                  value={formData['director-phone']}
                  onChange={(e) => handleInputChange('director-phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.cms.contactManager.placeholders.directorPhone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.officePhone}
                </label>
                <input
                  type="tel"
                  value={formData['office-phone']}
                  onChange={(e) => handleInputChange('office-phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.cms.contactManager.placeholders.officePhone}
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
                value={formData['contact-email']}
                onChange={(e) => handleInputChange('contact-email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.cms.contactManager.placeholders.contactEmail}
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
                    value={formData['worktime-weekdays']}
                    onChange={(e) => handleInputChange('worktime-weekdays', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.cms.contactManager.placeholders.weekdaysHours}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.cms.contactManager.fields.weekendHours}
                  </label>
                  <input
                    type="text"
                    value={formData['worktime-weekend']}
                    onChange={(e) => handleInputChange('worktime-weekend', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.cms.contactManager.placeholders.weekendHours}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.cms.contactManager.fields.workTimeNote}
                </label>
                <textarea
                  value={formData['worktime-note']}
                  onChange={(e) => handleInputChange('worktime-note', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.cms.contactManager.placeholders.workTimeNote}
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
              <EditableList
                id="transport-lines"
                defaultItems={t.contactsPage.transport.lines}
                className="text-sm text-gray-700 space-y-1"
                placeholder={t.cms.contactManager.placeholders.transportLines}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactManagerTab;