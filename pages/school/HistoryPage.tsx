import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableImage';
import { EditableList } from '../../components/cms/EditableList';

const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.historyPage.title}>
      <div className="space-y-6">
        <EditableText
          id="history-p1"
          defaultContent={t.historyPage.p1}
          tag="p"
          className="text-lg leading-relaxed"
        />
        <EditableText
          id="history-p2"
          defaultContent={t.historyPage.p2}
          tag="p"
          className="text-lg leading-relaxed"
        />
        
        <figure className="my-8">
            <EditableImage
              id="history-main-image"
              defaultSrc="https://picsum.photos/1200/400?random=10"
              alt={t.historyPage.imageAlt}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
            />
            <figcaption className="text-center text-sm text-gray-500 mt-2">
                <EditableText
                  id="history-image-caption"
                  defaultContent={t.historyPage.imageCaption}
                  tag="span"
                />
            </figcaption>
        </figure>
        
        <EditableText
          id="history-p3"
          defaultContent={t.historyPage.p3}
          tag="p"
          className="text-lg leading-relaxed"
        />
        <EditableText
          id="history-p4"
          defaultContent={t.historyPage.p4}
          tag="p"
          className="text-lg leading-relaxed"
        />

        {/* Achievements Section */}
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <EditableText
              id="achievements-title"
              defaultContent={t.historyPage.achievements.title}
              tag="h2"
              className="text-2xl font-bold text-blue-900 mb-4"
            />
            <EditableList
              id="achievements-list"
              defaultItems={t.historyPage.achievements.list}
              className="space-y-2"
            />
        </div>

        {/* Directors Section */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <EditableText
              id="directors-title"
              defaultContent={t.historyPage.directors.title}
              tag="h2"
              className="text-2xl font-bold text-gray-900 mb-4"
            />
            <EditableList
              id="directors-list"
              defaultItems={t.historyPage.directors.list}
              className="space-y-2"
            />
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;