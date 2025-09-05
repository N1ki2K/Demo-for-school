import React, { useEffect, useState, useMemo } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableImage';
import { StaffMember } from '../../components/cms/StaffManagement';
import { useCMS } from '../../context/CMSContext';
import { apiService } from '../../src/services/api';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  isDirector?: boolean;
  id: string;
}

const TeamCard: React.FC<TeamMember & { email?: string; phone?: string; bio?: string }> = ({
  name,
  role,
  imageUrl,
  isDirector = false,
  id,
  email,
  phone,
  bio
}) => {
  const { t } = useLanguage();
  return (
    <div className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border ${isDirector ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-100 hover:border-blue-200'}`}>
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <EditableImage
            id={`team-${id}-image`}
            defaultSrc={imageUrl}
            alt={name}
            className={`w-28 h-28 rounded-full object-cover border-4 ${isDirector ? 'border-blue-600' : 'border-gray-200'} shadow-md`}
          />
          {isDirector && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                <EditableText
                  id="director-badge"
                  defaultContent={t.teamPage.director.title}
                  tag="span"
                />
              </span>
            </div>
          )}
        </div>
        <EditableText
          id={`team-${id}-name`}
          defaultContent={name}
          tag="h3"
          className={`text-lg font-semibold mb-2 ${isDirector ? 'text-blue-800' : 'text-gray-800'}`}
        />
        <EditableText
          id={`team-${id}-role`}
          defaultContent={role}
          tag="p"
          className="text-gray-600 text-sm font-medium"
        />

        {(email || phone) && (
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            {email && (
              <p>
                <EditableText id={`team-${id}-email`} defaultContent={email} tag="span" />
              </p>
            )}
            {phone && (
              <p>
                <EditableText id={`team-${id}-phone`} defaultContent={phone} tag="span" />
              </p>
            )}
          </div>
        )}

        {bio && (
          <div className="mt-3 text-xs text-gray-600">
            <EditableText id={`team-${id}-bio`} defaultContent={bio} tag="p" />
          </div>
        )}
      </div>
    </div>
  );
};

const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const { getSchoolStaff, loadSchoolStaff } = useCMS();
  const [staffImages, setStaffImages] = useState<{[key: string]: any}>({});
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const [hasLoadedStaff, setHasLoadedStaff] = useState(false);

  // Load school staff data when component mounts (only once)
  useEffect(() => {
    const initializeStaff = async () => {
      if (!hasLoadedStaff) {
        await loadSchoolStaff();
        setHasLoadedStaff(true);
      }
    };
    
    initializeStaff();
  }, []); // Only run once

  const customStaff = getSchoolStaff();

  // Load staff profile images from database (only run after staff is loaded)
  useEffect(() => {
    console.log('🔍 Image loading effect triggered:', { hasLoadedStaff, staffLength: customStaff.length });
    
    if (!hasLoadedStaff || customStaff.length === 0) {
      console.log('⏳ Skipping image load - staff not ready yet');
      setIsLoadingImages(false);
      return;
    }

    let isCancelled = false;

    const loadStaffImages = async () => {
      try {
        console.log('🚀 Starting to load images for staff:', customStaff.map(s => s.name));
        setIsLoadingImages(true);
        const imagePromises = customStaff.map(async (member) => {
          try {
            console.log(`🖼️ Loading image for ${member.name} (${member.id})`);
            const imageData = await apiService.getStaffImage(member.id);
            console.log(`✅ Image found for ${member.name}:`, imageData);
            return { staffId: member.id, imageData };
          } catch (error) {
            console.log(`❌ No image found for ${member.name} (${member.id}):`, error);
            return { staffId: member.id, imageData: null };
          }
        });

        const results = await Promise.all(imagePromises);
        
        if (!isCancelled) {
          const imageMap: {[key: string]: any} = {};
          
          results.forEach(({ staffId, imageData }) => {
            imageMap[staffId] = imageData;
            if (imageData) {
              console.log(`📋 Mapped image for ${staffId}:`, imageData.image_url);
            }
          });
          
          setStaffImages(imageMap);
          console.log('📸 Final staff images map:', imageMap);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('❌ Failed to load staff images:', error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingImages(false);
        }
      }
    };

    loadStaffImages();

    // Cleanup function to cancel ongoing requests
    return () => {
      isCancelled = true;
    };
  }, [hasLoadedStaff, customStaff.length]); // Run when staff loading is complete or count changes

  // Debug logging
  console.log('🏫 School Team Page - customStaff:', customStaff);
  console.log('🖼️ Staff images loaded:', staffImages);
  console.log('📊 Loading state:', { isLoadingImages, hasLoadedStaff });

  const defaultStaff: StaffMember[] = [
    {
      id: 'director',
      name: t.teamPage.director.name,
      role: t.teamPage.director.title,
      imageUrl: 'https://picsum.photos/400/400?random=20',
      isDirector: true
    },
    ...t.teamPage.teachers.list.map((teacher, index) => ({
      id: `teacher-${index}`,
      name: teacher.name,
      role: teacher.role,
      imageUrl: `https://picsum.photos/400/400?random=${21 + index}`,
      isDirector: false
    }))
  ];

  // Map database fields to component props and sort by position
  const mappedCustomStaff = customStaff
    .filter(member => member.is_active !== false) // Only show active members
    .map(member => {
      // Get profile image from database or fallback
      const profileImage = staffImages[member.id];
      const imageUrl = profileImage 
        ? profileImage.image_url // Use the full URL directly from the database
        : 'https://picsum.photos/400/400?random=50';
      
      const result = {
        ...member,
        imageUrl,
        isDirector: Boolean(member.is_director)
      };
      
      console.log(`🔍 Staff member ${member.name} (${member.id}) - Image URL: ${imageUrl}`);
      return result;
    })
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const allStaff = mappedCustomStaff.length > 0 ? mappedCustomStaff : defaultStaff;
  const directors = allStaff.filter(member => member.isDirector || member.is_director);
  const teachers = allStaff.filter(member => !member.isDirector && !member.is_director);

  return (
    <PageWrapper title={t.teamPage.title}>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12 border border-blue-100">
        <EditableText
          id="team-intro"
          defaultContent={t.teamPage.intro}
          tag="p"
          className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto"
        />
      </div>

      {/* Loading state for images */}
      {isLoadingImages && customStaff.length > 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading team member photos...</p>
        </div>
      )}

      {/* Team Photo Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <EditableText
            id="team-photo-title"
            defaultContent={t.teamPage.photoTitle}
            tag="h2"
            className="text-3xl font-bold text-gray-800 mb-3"
          />
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <figure className="text-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-2">
            <EditableImage
              id="team-group-photo"
              defaultSrc="https://picsum.photos/1200/600?random=100"
              alt={t.teamPage.photoCaption}
              className="w-full max-w-5xl mx-auto rounded-xl"
            />
          </div>
          <figcaption className="text-center text-gray-500 mt-4 font-medium">
            <EditableText
              id="team-photo-caption"
              defaultContent={t.teamPage.photoCaption}
              tag="span"
            />
          </figcaption>
        </figure>
      </div>

      {/* Directors Section */}
      {directors.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <EditableText
              id="leadership-title"
              defaultContent={t.teamPage.leadershipTitle}
              tag="h2"
              className="text-3xl font-bold text-gray-800 mb-3"
            />
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {directors.map((director) => (
              <div key={director.id} className="w-full max-w-sm">
                <TeamCard 
                  {...director} 
                  email={director.email}
                  phone={director.phone}
                  bio={director.bio}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teachers Section */}
      {teachers.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <EditableText
              id="teachers-title"
              defaultContent={t.teamPage.teachers.title}
              tag="h2"
              className="text-3xl font-bold text-gray-800 mb-3"
            />
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <EditableText
              id="teachers-description"
              defaultContent={t.teamPage.teachers.description}
              tag="p"
              className="text-gray-600 max-w-2xl mx-auto"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teachers.map((teacher) => (
              <TeamCard 
                key={teacher.id} 
                {...teacher}
                email={teacher.email}
                phone={teacher.phone}
                bio={teacher.bio}
              />
            ))}
          </div>
        </div>
      )}

      {allStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No staff members added yet. Use the "Add Staff Member" button above to get started.
          </p>
        </div>
      )}
    </PageWrapper>
  );
};

export default TeamPage;
