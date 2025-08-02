import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from './cms/EditableText';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-blue-dark text-white font-medium">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <EditableText
              id="footer-school-name"
              defaultContent={t.footer.schoolName}
              tag="h3"
              className="text-lg font-bold text-brand-gold-light mb-4"
            />
            <EditableText
              id="footer-motto"
              defaultContent={t.footer.motto}
              tag="p"
              className="text-gray-300"
            />
          </div>
          <div>
            <EditableText
              id="footer-contacts-title"
              defaultContent={t.footer.contacts.title}
              tag="h3"
              className="text-lg font-bold text-brand-gold-light mb-4"
            />
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-address-label"
                    defaultContent={t.footer.contacts.addressLabel}
                    tag="span"
                  />
                  :
                </span>{' '}
                <EditableText
                  id="footer-address"
                  defaultContent={t.footer.contacts.address}
                  tag="span"
                />
              </li>
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-phone-label"
                    defaultContent={t.footer.contacts.phoneLabel}
                    tag="span"
                  />
                  :
                </span>{' '}
                <EditableText
                  id="footer-phone"
                  defaultContent={t.footer.contacts.phone}
                  tag="span"
                />
              </li>
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-email-label"
                    defaultContent={t.footer.contacts.emailLabel}
                    tag="span"
                  />
                  :
                </span>{' '}
                <EditableText
                  id="footer-email"
                  defaultContent={t.footer.contacts.email}
                  tag="span"
                />
              </li>
            </ul>
          </div>
          <div>
            <EditableText
              id="footer-quicklinks-title"
              defaultContent={t.footer.quickLinks.title}
              tag="h3"
              className="text-lg font-bold text-brand-gold-light mb-4"
            />
            <ul className="space-y-2">
              <li>
                <Link to="/contacts" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-contacts"
                    defaultContent={t.footer.quickLinks.contacts}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/documents/admissions" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-admissions"
                    defaultContent={t.footer.quickLinks.admissions}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/useful-links" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-useful"
                    defaultContent={t.footer.quickLinks.usefulLinks}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-gallery"
                    defaultContent={t.footer.quickLinks.gallery}
                    tag="span"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <EditableText
              id="footer-copyright"
              defaultContent={t.footer.copyright}
              tag="span"
            />
          </p>
          <EditableText
            id="footer-design"
            defaultContent={t.footer.design}
            tag="p"
            className="text-sm mt-1"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;