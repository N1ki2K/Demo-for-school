import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';
import { EditableList } from '../components/cms/EditableList';
import GoogleMap from '../components/GoogleMap';
import UpcomingEventsWidget from '../components/UpcomingEventsWidget';

const ContactsPage: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  const c = t.contactsPage;

  // School coordinates - approximate location for Stara Zagora
  const schoolLocation = { lat: 42.4258, lng: 25.6342 };
  
  const mapMarkers = [
    {
      position: schoolLocation,
      title: c.title,
      info: `
        <div style="padding: 8px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #0A2E55; font-weight: bold;">${c.title}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>${c.address.title}:</strong> ${c.address.line1}, ${c.address.line2}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>${c.phones.title}:</strong> ${c.phones.director} ${getTranslation('footer.contacts.phone', 'тел.')}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>${c.email.title}:</strong> ${c.email.address}</p>
        </div>
      `
    }
  ];

  return (
    <PageWrapper title={c.title}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
              <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {c.address.title}
            </h3>
            <EditableText id="address-line1" defaultContent={c.address.line1} tag="p" />
            <EditableText id="address-line2" defaultContent={c.address.line2} tag="p" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
                <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {c.phones.title}
            </h3>
            <p><strong>{c.phones.director}:</strong> <EditableText id="director-phone" defaultContent="+359 42 123 456" tag="span" /></p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
                <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {c.email.title}
            </h3>
            <p><a href={`mailto:${c.email.address}`} className="text-brand-blue-light hover:underline">
              <EditableText id="contact-email" defaultContent={c.email.address} tag="span" />
            </a></p>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
              <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {c.workTime.title}
            </h3>
            <div className="text-gray-700">
              <p>
                <strong>{c.workTime.weekdaysLabel}:</strong> 
                <EditableText id="worktime-weekdays" defaultContent={c.workTime.weekdays} tag="span" />
              </p>
              <p>
                <strong>{c.workTime.weekendLabel}:</strong> 
                <EditableText id="worktime-weekend" defaultContent={c.workTime.weekend} tag="span" />
              </p>
              <EditableText 
                id="worktime-note" 
                defaultContent={c.workTime.note} 
                tag="p" 
                className="text-sm text-gray-600 mt-2"
              />
            </div>
          </div>

          {/* Transportation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-brand-blue-dark mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v0a2 2 0 01-2-2H8z"></path></svg>
              {c.transport.title}
            </h4>
            <EditableList
              id="transport-lines"
              defaultItems={c.transport.lines}
              className="text-sm text-gray-700 space-y-1"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7"></path></svg>
              {c.location.title}
            </h3>
            <div className="bg-gray-100 rounded-lg shadow-md h-96 overflow-hidden">
              <GoogleMap
                className="w-full h-full"
                center={schoolLocation}
                zoom={16}
                markers={mapMarkers}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {c.location.info}
            </p>
          </div>

          {/* Upcoming Events */}
          <UpcomingEventsWidget 
            limit={4} 
            className="shadow-md" 
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactsPage;
