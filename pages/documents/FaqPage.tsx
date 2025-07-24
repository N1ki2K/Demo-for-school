import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';

interface FaqItemProps {
  question: string;
  children: React.ReactNode;
  id: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, children, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-brand-blue-dark"
      >
        <EditableText
          id={`faq-${id}-question`}
          defaultContent={question}
          tag="span"
        />
        <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <div className="text-gray-700 space-y-2">
            {children}
        </div>
      </div>
    </div>
  );
}

const FaqPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.faqPage.title}>
      <EditableText
        id="faq-intro"
        defaultContent={t.faqPage.intro}
        tag="p"
        className="mb-8"
      />
      <div className="space-y-4">
        <FaqItem question={t.faqPage.faqs.q1} id="1">
          <EditableText
            id="faq-1-answer"
            defaultContent={t.faqPage.faqs.a1}
            tag="p"
          />
        </FaqItem>
        <FaqItem question={t.faqPage.faqs.q2} id="2">
          <EditableText
            id="faq-2-answer"
            defaultContent={t.faqPage.faqs.a2}
            tag="p"
          />
        </FaqItem>
        <FaqItem question={t.faqPage.faqs.q3} id="3">
          <EditableText
            id="faq-3-answer"
            defaultContent={t.faqPage.faqs.a3}
            tag="p"
          />
        </FaqItem>
        <FaqItem question={t.faqPage.faqs.q4} id="4">
          <EditableText
            id="faq-4-answer"
            defaultContent={t.faqPage.faqs.a4}
            tag="p"
          />
        </FaqItem>
      </div>
    </PageWrapper>
  );
};

export default FaqPage;