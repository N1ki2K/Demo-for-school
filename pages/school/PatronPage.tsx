import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import {EditableImage } from '../../components/cms/EditableImage';

const PatronPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.patronPage.title}>
      <div className="space-y-6">
        {/* Hero Quote */}
        <div className="text-center bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <blockquote className="text-xl font-semibold text-blue-900 italic">
            <EditableText
              id="patron-quote"
              defaultContent={t.patronPage.quote}
              tag="span"
            />
          </blockquote>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:w-2/3 space-y-6">
            <EditableText
              id="patron-p1"
              defaultContent={t.patronPage.p1}
              tag="p"
              className="text-lg leading-relaxed"
            />
            <EditableText
              id="patron-p2"
              defaultContent={t.patronPage.p2}
              tag="p"
              className="text-lg leading-relaxed"
            />
            <EditableText
              id="patron-p3"
              defaultContent={t.patronPage.p3}
              tag="p"
              className="text-lg leading-relaxed"
            />
            <EditableText
              id="patron-p4"
              defaultContent={t.patronPage.p4}
              tag="p"
              className="text-lg leading-relaxed"
            />
            <EditableText
              id="patron-p5"
              defaultContent={t.patronPage.p5}
              tag="p"
              className="text-lg leading-relaxed"
            />
            
            {/* Legacy section */}
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <EditableText
                id="patron-legacy-title"
                defaultContent="Наследство"
                tag="h2"
                className="text-xl font-bold text-gray-900 mb-3"
              />
              <EditableText
                id="patron-legacy"
                defaultContent={t.patronPage.legacy}
                tag="p"
                className="text-gray-700"
              />
            </div>
          </div>

          <div className="lg:w-1/3">
            <figure className="sticky top-8">
              <EditableImage
                id="patron-image"
                defaultSrc="https://picsum.photos/400/500?random=11"
                alt={t.patronPage.imageAlt}
                className="w-full h-auto rounded-lg shadow-md"
              />
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                <EditableText
                  id="patron-image-caption"
                  defaultContent={t.patronPage.imageCaption}
                  tag="span"
                />
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PatronPage;