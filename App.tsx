import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CMSProvider } from './context/CMSContext';
import Layout from './components/Layout';

// Import Page Components
import HomePage from './pages/HomePage';
import HistoryPage from './pages/school/HistoryPage';
import PatronPage from './pages/school/PatronPage';
import TeamPage from './pages/school/TeamPage';
import CouncilPage from './pages/school/CouncilPage';
import CalendarPage from './pages/documents/CalendarPage';
import SchedulesPage from './pages/documents/SchedulesPage';
import BudgetReportsPage from './pages/documents/BudgetReportsPage';
import RulesPage from './pages/documents/RulesPage';
import EthicsCodePage from './pages/documents/EthicsCodePage';
import AdminServicesPage from './pages/documents/AdminServicesPage';
import AdmissionsPage from './pages/documents/AdmissionsPage';
import RoadSafetyPage from './pages/documents/RoadSafetyPage';
import OresPage from './pages/documents/OresPage';
import ContinuingEducationPage from './pages/documents/ContinuingEducationPage';
import FaqPage from './pages/documents/FaqPage';
import AnnouncementPage from './pages/documents/AnnouncementPage';
import StudentsPage from './pages/documents/StudentsPage';
import OlympiadsPage from './pages/documents/OlympiadsPage';
import UsefulLinksPage from './pages/UsefulLinksPage';
import GalleryPage from './pages/GalleryPage';
import YourHourPage from './pages/projects/YourHourPage';
import SupportSuccessPage from './pages/projects/SupportSuccessPage';
import EducationTomorrowPage from './pages/projects/EducationTomorrowPage';
import ContactsPage from './pages/ContactsPage';
import InfoAccessPage from './pages/InfoAccessPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DynamicPage from './pages/DynamicPage';
// import Home from './pages/Home';
// import CreatePost from './pages/CreatePost';


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CMSProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              {/* Училището */}
              <Route path="/school/history" element={<HistoryPage />} />
              <Route path="/school/patron" element={<PatronPage />} />
              <Route path="/school/team" element={<TeamPage />} />
              <Route path="/school/council" element={<CouncilPage />} />

              {/* Документи */}
              <Route path="/documents/calendar" element={<CalendarPage />} />
              <Route path="/documents/schedules" element={<SchedulesPage />} />
              <Route path="/documents/budget" element={<BudgetReportsPage />} />
              <Route path="/documents/rules" element={<RulesPage />} />
              <Route path="/documents/ethics" element={<EthicsCodePage />} />
              <Route path="/documents/admin-services" element={<AdminServicesPage />} />
              <Route path="/documents/admissions" element={<AdmissionsPage />} />
              <Route path="/documents/road-safety" element={<RoadSafetyPage />} />
              <Route path="/documents/ores" element={<OresPage />} />
              <Route path="/documents/continuing-education" element={<ContinuingEducationPage />} />
              <Route path="/documents/faq" element={<FaqPage />} />
              <Route path="/documents/announcement" element={<AnnouncementPage />} />
              <Route path="/documents/students" element={<StudentsPage />} />
              <Route path="/documents/olympiads" element={<OlympiadsPage />} />

              {/* Работа по проекти */}
              <Route path="/projects/your-hour" element={<YourHourPage />} />
              <Route path="/projects/support-for-success" element={<SupportSuccessPage />} />
              <Route path="/projects/education-for-tomorrow" element={<EducationTomorrowPage />} />

              {/* Other main links */}
              <Route path="/useful-links" element={<UsefulLinksPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/info-access" element={<InfoAccessPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              {/* DB */}
              {/* <Route path="/create" element={<CreatePost />} /> */}

              {/* Dynamic pages - catch-all for CMS-created pages */}
              <Route path="*" element={<DynamicPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </CMSProvider>
    </LanguageProvider>
    
  );
};

export default App;