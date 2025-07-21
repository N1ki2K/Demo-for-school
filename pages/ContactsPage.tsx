
import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';

const ContactsPage: React.FC = () => {
  const { t } = useLanguage();
  const c = t.contactsPage;
  return (
    <PageWrapper title={c.title}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
              <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {c.address.title}
            </h3>
            <p>{c.address.line1}</p>
            <p>{c.address.line2}</p>
          </div>
           <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
                <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {c.phones.title}
            </h3>
            <p><strong>{c.phones.director}:</strong> +359 42 123 456</p>
            <p><strong>{c.phones.office}:</strong> +359 42 123 457</p>
          </div>
           <div>
            <h3 className="text-xl font-semibold text-brand-blue-dark mb-2 flex items-center">
                <svg className="w-6 h-6 mr-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {c.email.title}
            </h3>
            <p><a href="mailto:contact@kganchev-school.bg" className="text-brand-blue-light hover:underline">{c.email.address}</a></p>
          </div>
        </div>
        <div>
           <div className="bg-gray-200 rounded-lg shadow-md h-96 flex items-center justify-center">
                <p className="text-gray-500">{c.map.placeholder}</p>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactsPage;
