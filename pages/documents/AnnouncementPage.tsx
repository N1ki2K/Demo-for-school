import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText} from '../../components/cms/EditableText';
import { EditableList } from '../../components/cms/EditableList';   

const AnnouncementCard: React.FC<{ title: string; date: string; children: React.ReactNode; id: string }> = ({ title, date, children, id }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
            <EditableText
              id={`announcement-${id}-title`}
              defaultContent={title}
              tag="h2"
              className="text-2xl font-bold text-brand-blue"
            />
            <EditableText
              id={`announcement-${id}-date`}
              defaultContent={date}
              tag="span"
              className="text-sm font-semibold text-gray-500"
            />
        </div>
        <div className="text-gray-700 space-y-3">
            {children}
        </div>
    </div>
);

const AnnouncementPage: React.FC = () => {
  const { t } = useLanguage();
  const a = t.announcementsPage;
  return (
    <PageWrapper title={a.title}>
      <EditableText
        id="announcements-intro"
        defaultContent={a.intro}
        tag="p"
        className="mb-10"
      />
      
      <AnnouncementCard title={a.announcement1.title} date={a.announcement1.date} id="1">
          <EditableText
            id="announcement-1-p1"
            defaultContent={a.announcement1.p1}
            tag="p"
          />
          <EditableText
            id="announcement-1-p2"
            defaultContent={a.announcement1.p2}
            tag="p"
          />
          <EditableText
            id="announcement-1-agenda-title"
            defaultContent={a.announcement1.agendaTitle}
            tag="p"
            className="font-bold"
          />
          <EditableList
            id="announcement-1-agenda"
            defaultItems={[
              a.announcement1.agenda.i1,
              a.announcement1.agenda.i2,
              a.announcement1.agenda.i3
            ]}
            ordered={true}
            className="list-decimal list-inside ml-4"
          />
          <EditableText
            id="announcement-1-p3"
            defaultContent={a.announcement1.p3}
            tag="p"
          />
          <EditableText
            id="announcement-1-signature"
            defaultContent={a.announcement1.signature}
            tag="p"
            className="font-semibold mt-4"
          />
      </AnnouncementCard>

      <AnnouncementCard title={a.announcement2.title} date={a.announcement2.date} id="2">
          <EditableText
            id="announcement-2-p1"
            defaultContent={a.announcement2.p1}
            tag="p"
          />
          <EditableText
            id="announcement-2-p2"
            defaultContent={a.announcement2.p2}
            tag="p"
          />
          <EditableText
            id="announcement-2-p3"
            defaultContent={a.announcement2.p3}
            tag="p"
          />
           <EditableText
             id="announcement-2-signature"
             defaultContent={a.announcement2.signature}
             tag="p"
             className="font-semibold mt-4"
           />
      </AnnouncementCard>

    </PageWrapper>
  );
};

export default AnnouncementPage;