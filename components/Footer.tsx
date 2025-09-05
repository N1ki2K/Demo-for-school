import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from './cms/EditableText';

const Footer: React.FC = () => {
  const { t, getTranslation } = useLanguage();

  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <EditableText
              id="footer-school-name"
              defaultContent={getTranslation('footer.schoolName', 'Kolyo Ganchev Elementary School')}
              tag="h3"
              className="text-lg font-semibold text-brand-gold mb-4"
            />
            <EditableText
              id="footer-motto"
              defaultContent={getTranslation('footer.motto', 'Education with care for the future.')}
              tag="p"
              className="text-gray-300"
            />
          </div>
          <div>
            <EditableText
              id="footer-contacts-title"
              defaultContent={getTranslation('footer.contacts.title', 'Contacts')}
              tag="h3"
              className="text-lg font-semibold text-brand-gold mb-4"
            />
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-address-label"
                    defaultContent={getTranslation('footer.contacts.addressLabel', 'Address')}
                    tag="span"
                  />
                  :
                </span>{' '}
                <div className="inline">
                  <EditableText
                    id="address-line1"
                    defaultContent={getTranslation('contactsPage.address.line1', '26 Armeyska St')}
                    tag="span"
                  />
                  <br />
                  <EditableText
                    id="address-line2"
                    defaultContent={getTranslation('contactsPage.address.line2', '6003 Kazanski, Stara Zagora')}
                    tag="span"
                  />
                </div>
              </li>
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-phone-label"
                    defaultContent={getTranslation('footer.contacts.phoneLabel', 'Phone')}
                    tag="span"
                  />
                  :
                </span>{' '}
                <EditableText
                  id="director-phone"
                  defaultContent="+359 42 123 456"
                  tag="span"
                />
              </li>
              <li>
                <span className="font-semibold">
                  <EditableText
                    id="footer-email-label"
                    defaultContent={getTranslation('footer.contacts.emailLabel', 'Email')}
                    tag="span"
                  />
                  :
                </span>{' '}
                <EditableText
                  id="contact-email"
                  defaultContent={getTranslation('contactsPage.email.address', 'contact@kganchev-school.bg')}
                  tag="span"
                />
              </li>
            </ul>
          </div>
          <div>
            <EditableText
              id="footer-quicklinks-title"
              defaultContent={getTranslation('footer.quickLinks.title', 'Quick Links')}
              tag="h3"
              className="text-lg font-semibold text-brand-gold mb-4"
            />
            <ul className="space-y-2">
              <li>
                <Link to="/contacts" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-contacts"
                    defaultContent={getTranslation('footer.quickLinks.contacts', 'Contacts')}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/documents/admissions" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-admissions"
                    defaultContent={getTranslation('footer.quickLinks.admissions', 'Admissions')}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/useful-links" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-useful"
                    defaultContent={getTranslation('footer.quickLinks.usefulLinks', 'Useful Links')}
                    tag="span"
                  />
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-brand-gold-light transition-colors">
                  <EditableText
                    id="footer-link-gallery"
                    defaultContent={getTranslation('footer.quickLinks.gallery', 'Gallery')}
                    tag="span"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()}{' '}
            <EditableText
              id="footer-copyright"
              defaultContent={getTranslation('footer.copyright', 'All rights reserved.')}
              tag="span"
            />
          </p>
          <EditableText
            id="footer-design"
            defaultContent={getTranslation('footer.design', 'Design and development by a talented team.')}
            tag="p"
            className="text-xs sm:text-sm mt-1"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;