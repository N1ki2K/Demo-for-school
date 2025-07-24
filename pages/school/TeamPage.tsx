import React, { useMemo } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableImage } from '../../components/cms/EditableText';
import { StaffManagement, StaffMember } from '../../components/cms/StaffManagement';
import { useCMS } from '../../context/CMSContext';

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
}) => (
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
                defaultContent="Директор"
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
      
      {/* Contact Information */}
      {(email || phone) && (
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          {email && (
            <p>
              <EditableText
                id={`team-${id}-email`}
                defaultContent={email}
                tag="span"
              />
            </p>
          )}
          {phone && (
            <p>
              <EditableText
                id={`team-${id}-phone`}
                defaultContent={phone}
                tag="span"
              />
            </p>
          )}
        </div>
      )}
      
      {/* Bio */}
      {bio && (
        <div className="mt-3 text-xs text-gray-600">
          <EditableText
            id={`team-${id}-bio`}
            defaultContent={bio}
            tag="p"
          />
        </div>
      )}
    </div>
  </div>
);

const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const { getStaff, updateStaff } = useCMS();
  
  // Get custom staff from CMS or use default data
  const customStaff = getStaff();
  
  // Default staff data as fallback
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

  // Use custom staff if available, otherwise use default
  const allStaff = customStaff.length > 0 ? customStaff : defaultStaff;
  
  // Separate directors and regular staff
  const directors = allStaff.filter(member => member.isDirector);
  const teachers = allStaff.filter(member => !member.isDirector);

  return (
    <PageWrapper title={t.teamPage.title}>
      {/* Staff Management Component */}
      <StaffManagement 
        staffList={allStaff}
        onStaffUpdate={updateStaff}
      />

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12 border border-blue-100">
        <EditableText
          id="team-intro"
          defaultContent={t.teamPage.intro}
          tag="p"
          className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto"
        />
      </div>
      
      {/* Team Photo Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <EditableText
            id="team-photo-title"
            defaultContent="Нашият екип"
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
              alt="Колективна снимка на училищния екип"
              className="w-full max-w-5xl mx-auto rounded-xl"
            />
          </div>
          <figcaption className="text-center text-gray-500 mt-4 font-medium">
            <EditableText
              id="team-photo-caption"
              defaultContent="Колективна снимка на училищния екип на ОУ \Кольо Ганчев\"
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
              defaultContent="Ръководство"
              tag="h2"
              className="text-3xl font-bold text-gray-800 mb-3"
            />
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {directors.map((director) => (
              <div key={director.id} className="w-full max-w-sm">
                <TeamCard {...director} />
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
              defaultContent="Нашият преподавателски екип се състои от опитни и отдадени специалисти, които работят с любов и професионализъм за развитието на всяко дете."
              tag="p"
              className="text-gray-600 max-w-2xl mx-auto"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teachers.map((teacher) => (
              <TeamCard key={teacher.id} {...teacher} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no staff */}
      {allStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No staff members added yet. Use the "Add Staff Member" button above to get started.</p>
        </div>
      )}
    </PageWrapper>
  );
};

export default TeamPage;
