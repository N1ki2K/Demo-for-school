import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableImage';
import { EditableList } from '../../components/cms/EditableList';

const HistoryPage: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  return (
    <PageWrapper title={getTranslation('historyPage.title', 'История')}>
      <div className="space-y-6">
        <EditableText
          id="history-p1"
          defaultContent={getTranslation('historyPage.p1', 'Нашето училище има богата история...')}
          tag="p"
          className="text-lg leading-relaxed"
        />
        <EditableText
          id="history-p2"
          defaultContent={getTranslation('historyPage.p2', 'През годините училището се развива...')}
          tag="p"
          className="text-lg leading-relaxed"
        />
        
        <figure className="my-8">
            <EditableImage
              id="history-main-image"
              defaultSrc="https://picsum.photos/1200/400?random=10"
              alt={getTranslation('historyPage.imageAlt', 'Училищна сграда')}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
            />
            <figcaption className="text-center text-sm text-gray-500 mt-2">
                <EditableText
                  id="history-image-caption"
                  defaultContent={getTranslation('historyPage.imageCaption', 'Сградата на училището')}
                  tag="span"
                />
            </figcaption>
        </figure>
        
        <EditableText
          id="history-p3"
          defaultContent={getTranslation('historyPage.p3', 'Нашите учители са отдадени...')}
          tag="p"
          className="text-lg leading-relaxed"
        />
        <EditableText
          id="history-p4"
          defaultContent={getTranslation('historyPage.p4', 'Училището продължава да се развива...')}
          tag="p"
          className="text-lg leading-relaxed"
        />

        {/* Achievements Section */}
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <EditableText
              id="achievements-title"
              defaultContent={getTranslation('historyPage.achievements.title', 'Наши постижения')}
              tag="h2"
              className="text-2xl font-bold text-blue-900 mb-4"
            />
            <EditableList
              id="achievements-list"
              defaultItems={['Първо място в математическа олимпиада', 'Най-добра училищна библиотека', 'Награда за екологични инициативи']}
              className="space-y-2"
            />
        </div>

        {/* Directors Section */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <EditableText
              id="directors-title"
              defaultContent={getTranslation('historyPage.directors.title', 'Директори')}
              tag="h2"
              className="text-2xl font-bold text-gray-900 mb-4"
            />
            <EditableList
              id="directors-list"
              defaultItems={['Иван Петров (1985-2000)', 'Мария Георгиева (2000-2015)', 'Стоян Димитров (2015-настояще)']}
              className="space-y-2"
            />
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;