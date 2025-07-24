import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from '../components/cms/EditableText';

const LinkCard: React.FC<{ 
  id: string;
  title: string; 
  url: string; 
  description: string; 
  cta: string 
}> = ({ id, title, url, description, cta }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-brand-gold transition-all duration-300 group">
        <EditableText
          id={`link-${id}-title`}
          defaultContent={title}
          tag="h3"
          className="text-xl font-bold text-brand-blue mb-2"
        />
        <EditableText
          id={`link-${id}-description`}
          defaultContent={description}
          tag="p"
          className="text-gray-600 mb-3"
        />
        <span className="text-brand-blue-light font-semibold group-hover:text-brand-gold transition-colors">
          <EditableText
            id={`link-${id}-cta`}
            defaultContent={cta}
            tag="span"
          />
          {' '}&rarr;
        </span>
    </a>
)

const UsefulLinksPage: React.FC = () => {
    const { t } = useLanguage();
    const l = t.usefulLinksPage;

    const links = [
        { id: 'mon', title: l.links.l1.title, url: 'https://www.mon.bg/', description: l.links.l1.description },
        { id: 'ruo', title: l.links.l2.title, url: 'https://ruo-stz.bg/', description: l.links.l2.description },
        { id: 'portal', title: l.links.l3.title, url: 'https://neispuo.mon.bg/', description: l.links.l3.description },
        { id: 'nio', title: l.links.l4.title, url: 'https://www.nio.bg/', description: l.links.l4.description },
        { id: 'sacp', title: l.links.l5.title, url: 'https://sacp.government.bg/', description: l.links.l5.description },
        { id: 'safenet', title: l.links.l6.title, url: 'https://www.safenet.bg/', description: l.links.l6.description },
    ];

  return (
    <PageWrapper title={l.title}>
      <EditableText
        id="useful-links-intro"
        defaultContent={l.intro}
        tag="p"
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map(link => <LinkCard key={link.id} {...link} cta={l.cta} />)}
      </div>
    </PageWrapper>
  );
};

export default UsefulLinksPage;