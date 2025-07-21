
import { bg } from '../locales/bg';
import { en } from '../locales/en';

interface SearchablePage {
    path: string;
    title: {
        bg: string;
        en: string;
    };
    content: {
        bg: string;
        en: string;
    };
}

// This function helps to combine text content from nested objects for indexing
const extractText = (obj: any): string => {
    let text = '';
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            text += obj[key] + ' ';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            text += extractText(obj[key]) + ' ';
        }
    }
    return text.replace(/<[^>]*>/g, ' '); // Strip HTML tags
};

export const searchData: SearchablePage[] = [
    {
        path: '/',
        title: { bg: bg.nav.home, en: en.nav.home },
        content: {
            bg: extractText(bg.homePage),
            en: extractText(en.homePage),
        },
    },
    {
        path: '/school/history',
        title: { bg: bg.historyPage.title, en: en.historyPage.title },
        content: {
            bg: extractText(bg.historyPage),
            en: extractText(en.historyPage),
        },
    },
    {
        path: '/school/patron',
        title: { bg: bg.patronPage.title, en: en.patronPage.title },
        content: {
            bg: extractText(bg.patronPage),
            en: extractText(en.patronPage),
        },
    },
    {
        path: '/school/team',
        title: { bg: bg.teamPage.title, en: en.teamPage.title },
        content: {
            bg: extractText(bg.teamPage),
            en: extractText(en.teamPage),
        },
    },
    {
        path: '/school/council',
        title: { bg: bg.councilPage.title, en: en.councilPage.title },
        content: {
            bg: extractText(bg.councilPage),
            en: extractText(en.councilPage),
        },
    },
    {
        path: '/documents/calendar',
        title: { bg: bg.calendarPage.title, en: en.calendarPage.title },
        content: {
            bg: extractText(bg.calendarPage),
            en: extractText(en.calendarPage),
        },
    },
    {
        path: '/documents/schedules',
        title: { bg: bg.schedulesPage.title, en: en.schedulesPage.title },
        content: {
            bg: extractText(bg.schedulesPage),
            en: extractText(en.schedulesPage),
        },
    },
    {
        path: '/documents/budget',
        title: { bg: bg.budgetPage.title, en: en.budgetPage.title },
        content: {
            bg: extractText(bg.budgetPage),
            en: extractText(en.budgetPage),
        },
    },
    {
        path: '/documents/rules',
        title: { bg: bg.rulesPage.title, en: en.rulesPage.title },
        content: {
            bg: extractText(bg.rulesPage),
            en: extractText(en.rulesPage),
        },
    },
    {
        path: '/documents/ethics',
        title: { bg: bg.ethicsPage.title, en: en.ethicsPage.title },
        content: {
            bg: extractText(bg.ethicsPage),
            en: extractText(en.ethicsPage),
        },
    },
    {
        path: '/documents/admin-services',
        title: { bg: bg.adminServicesPage.title, en: en.adminServicesPage.title },
        content: {
            bg: extractText(bg.adminServicesPage),
            en: extractText(en.adminServicesPage),
        },
    },
    {
        path: '/documents/admissions',
        title: { bg: bg.admissionsPage.title, en: en.admissionsPage.title },
        content: {
            bg: extractText(bg.admissionsPage),
            en: extractText(en.admissionsPage),
        },
    },
    {
        path: '/documents/road-safety',
        title: { bg: bg.roadSafetyPage.title, en: en.roadSafetyPage.title },
        content: {
            bg: extractText(bg.roadSafetyPage),
            en: extractText(en.roadSafetyPage),
        },
    },
     {
        path: '/documents/ores',
        title: { bg: bg.oresPage.title, en: en.oresPage.title },
        content: {
            bg: extractText(bg.oresPage),
            en: extractText(en.oresPage),
        },
    },
    {
        path: '/documents/continuing-education',
        title: { bg: bg.continuingEducationPage.title, en: en.continuingEducationPage.title },
        content: {
            bg: extractText(bg.continuingEducationPage),
            en: extractText(en.continuingEducationPage),
        },
    },
    {
        path: '/documents/faq',
        title: { bg: bg.faqPage.title, en: en.faqPage.title },
        content: {
            bg: extractText(bg.faqPage),
            en: extractText(en.faqPage),
        },
    },
    {
        path: '/documents/announcement',
        title: { bg: bg.announcementsPage.title, en: en.announcementsPage.title },
        content: {
            bg: extractText(bg.announcementsPage),
            en: extractText(en.announcementsPage),
        },
    },
    {
        path: '/documents/students',
        title: { bg: bg.studentsPage.title, en: en.studentsPage.title },
        content: {
            bg: extractText(bg.studentsPage),
            en: extractText(en.studentsPage),
        },
    },
    {
        path: '/documents/olympiads',
        title: { bg: bg.olympiadsPage.title, en: en.olympiadsPage.title },
        content: {
            bg: extractText(bg.olympiadsPage),
            en: extractText(en.olympiadsPage),
        },
    },
    {
        path: '/useful-links',
        title: { bg: bg.usefulLinksPage.title, en: en.usefulLinksPage.title },
        content: {
            bg: extractText(bg.usefulLinksPage),
            en: extractText(en.usefulLinksPage),
        },
    },
    {
        path: '/gallery',
        title: { bg: bg.galleryPage.title, en: en.galleryPage.title },
        content: {
            bg: extractText(bg.galleryPage),
            en: extractText(en.galleryPage),
        },
    },
    {
        path: '/projects/your-hour',
        title: { bg: bg.yourHourPage.title, en: en.yourHourPage.title },
        content: {
            bg: extractText(bg.yourHourPage),
            en: extractText(en.yourHourPage),
        },
    },
    {
        path: '/projects/support-for-success',
        title: { bg: bg.supportSuccessPage.title, en: en.supportSuccessPage.title },
        content: {
            bg: extractText(bg.supportSuccessPage),
            en: extractText(en.supportSuccessPage),
        },
    },
    {
        path: '/projects/education-for-tomorrow',
        title: { bg: bg.educationTomorrowPage.title, en: en.educationTomorrowPage.title },
        content: {
            bg: extractText(bg.educationTomorrowPage),
            en: extractText(en.educationTomorrowPage),
        },
    },
    {
        path: '/contacts',
        title: { bg: bg.contactsPage.title, en: en.contactsPage.title },
        content: {
            bg: extractText(bg.contactsPage),
            en: extractText(en.contactsPage),
        },
    },
    {
        path: '/info-access',
        title: { bg: bg.infoAccessPage.title, en: en.infoAccessPage.title },
        content: {
            bg: extractText(bg.infoAccessPage),
            en: extractText(en.infoAccessPage),
        },
    },
];
