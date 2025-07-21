
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">{t.footer.schoolName}</h3>
            <p className="text-gray-300">{t.footer.motto}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">{t.footer.contacts.title}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="font-semibold">{t.footer.contacts.addressLabel}:</span> {t.footer.contacts.address}
              </li>
              <li>
                <span className="font-semibold">{t.footer.contacts.phoneLabel}:</span> {t.footer.contacts.phone}
              </li>
              <li>
                <span className="font-semibold">{t.footer.contacts.emailLabel}:</span> {t.footer.contacts.email}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">{t.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li><Link to="/contacts" className="text-gray-300 hover:text-brand-gold-light transition-colors">{t.footer.quickLinks.contacts}</Link></li>
              <li><Link to="/documents/admissions" className="text-gray-300 hover:text-brand-gold-light transition-colors">{t.footer.quickLinks.admissions}</Link></li>
              <li><Link to="/useful-links" className="text-gray-300 hover:text-brand-gold-light transition-colors">{t.footer.quickLinks.usefulLinks}</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-brand-gold-light transition-colors">{t.footer.quickLinks.gallery}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
          <p className="text-sm mt-1">{t.footer.design}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
