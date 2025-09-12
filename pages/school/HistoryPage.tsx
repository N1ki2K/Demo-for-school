import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableImage';
import { EditableList } from '../../components/cms/EditableList';
import { apiService } from '../../src/services/api';

interface Achievement {
  id: number;
  title: string;
  description?: string;
  year?: number;
  position: number;
}

interface Director {
  id: number;
  name: string;
  tenure_start?: string;
  tenure_end?: string;
  description?: string;
  position: number;
}

const HistoryPage: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading achievements and directors...');
        
        const [achievementsData, directorsData] = await Promise.all([
          apiService.getAchievements().catch((err) => {
            console.error('❌ Error loading achievements:', err);
            return [];
          }),
          apiService.getDirectors().catch((err) => {
            console.error('❌ Error loading directors:', err);
            return [];
          })
        ]);
        
        console.log('📊 Achievements loaded:', achievementsData);
        console.log('👨‍💼 Directors loaded:', directorsData);
        
        setAchievements(achievementsData || []);
        setDirectors(directorsData || []);
      } catch (error) {
        console.error('💥 Error loading history data:', error);
      } finally {
        setLoading(false);
        console.log('✅ Loading complete');
      }
    };

    loadData();
  }, []);

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

        {/* Achievements Section - Database Driven */}
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <EditableText
              id="achievements-title"
              defaultContent={getTranslation('historyPage.achievements.title', 'Наши постижения')}
              tag="h2"
              className="text-2xl font-bold text-blue-900 mb-4"
            />
            {loading ? (
              <div className="text-center py-4">
                <p className="text-blue-600">{getTranslation('achievements.loading', 'Loading achievements...')}</p>
              </div>
            ) : achievements.length > 0 ? (
              <ul className="space-y-3">
                {achievements.map((achievement) => {
                  // Try to get translated title, fallback to original
                  const translatedTitle = getTranslation(`achievements.${achievement.id}.title`, achievement.title);
                  
                  return (
                    <li key={achievement.id} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{translatedTitle}</h3>
                      {achievement.description && (
                        <p className="text-gray-600 mb-2">{achievement.description}</p>
                      )}
                      {achievement.year && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {achievement.year}
                        </span>
                      )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-blue-600 text-lg">{getTranslation('achievements.noAchievements.title', 'No achievements added yet.')}</p>
                <p className="text-blue-500 text-sm">{getTranslation('achievements.noAchievements.subtitle', 'Use the CMS Dashboard to add achievements.')}</p>
              </div>
            )}
        </div>

        {/* Directors Section - Database Driven */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <EditableText
              id="directors-title"
              defaultContent={getTranslation('historyPage.directors.title', 'Директори')}
              tag="h2"
              className="text-2xl font-bold text-gray-900 mb-4"
            />
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">{getTranslation('directors.loading', 'Loading directors...')}</p>
              </div>
            ) : directors.length > 0 ? (
              <div className="space-y-4">
                {directors.map((director) => {
                  // Try to get translated name/description, fallback to original
                  const translatedName = getTranslation(`directors.${director.id}.name`, director.name);
                  const translatedDescription = director.description ? 
                    getTranslation(`directors.${director.id}.description`, director.description) : 
                    director.description;
                  
                  return (
                    <div key={director.id} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        👨‍💼
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{translatedName}</h3>
                      {translatedDescription && (
                        <p className="text-gray-600 mb-2">{translatedDescription}</p>
                      )}
                      {(director.tenure_start || director.tenure_end) && (
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            📅 {director.tenure_start || 'Unknown'} - {director.tenure_end || 'Present'}
                          </span>
                        </div>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👨‍💼</div>
                <p className="text-gray-600 text-lg">{getTranslation('directors.noDirectors.title', 'No directors added yet.')}</p>
                <p className="text-gray-500 text-sm">{getTranslation('directors.noDirectors.subtitle', 'Information about our school directors will be displayed here.')}</p>
              </div>
            )}
            
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;