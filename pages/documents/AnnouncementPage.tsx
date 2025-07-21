
import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';

const AnnouncementCard: React.FC<{ title: string; date: string; children: React.ReactNode }> = ({ title, date, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-2xl font-bold text-brand-blue">{title}</h2>
            <span className="text-sm font-semibold text-gray-500">{date}</span>
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
      <p className="mb-10">{a.intro}</p>
      
      <AnnouncementCard title={a.announcement1.title} date={a.announcement1.date}>
          <p>{a.announcement1.p1}</p>
          <p dangerouslySetInnerHTML={{ __html: a.announcement1.p2 }} />
          <p><strong>{a.announcement1.agendaTitle}</strong></p>
          <ol className="list-decimal list-inside ml-4">
              <li>{a.announcement1.agenda.i1}</li>
              <li>{a.announcement1.agenda.i2}</li>
              <li>{a.announcement1.agenda.i3}</li>
          </ol>
          <p>{a.announcement1.p3}</p>
          <p className="font-semibold mt-4">{a.announcement1.signature}</p>
      </AnnouncementCard>

      <AnnouncementCard title={a.announcement2.title} date={a.announcement2.date}>
          <p>{a.announcement2.p1}</p>
          <p dangerouslySetInnerHTML={{ __html: a.announcement2.p2 }} />
          <p>{a.announcement2.p3}</p>
           <p className="font-semibold mt-4">{a.announcement2.signature}</p>
      </AnnouncementCard>

    </PageWrapper>
  );
};

export default AnnouncementPage;
