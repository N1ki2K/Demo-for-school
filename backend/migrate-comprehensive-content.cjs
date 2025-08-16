const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/cms.db');

// Comprehensive content structure for all pages
const contentStructure = [
  // Home page
  {
    id: 'home',
    name: 'Home',
    path: '/',
    parent_id: null,
    position: 0,
    sections: [
      { id: 'hero-title_en', type: 'text', content: 'Welcome to Kolyo Ganchev Elementary School', label: 'Hero Title (en)' },
      { id: 'hero-title_bg', type: 'text', content: 'Добре дошли в ОУ "Кольо Ганчев"', label: 'Hero Title (bg)' },
      { id: 'hero-subtitle_en', type: 'text', content: 'Educating tomorrow\'s leaders with excellence and innovation', label: 'Hero Subtitle (en)' },
      { id: 'hero-subtitle_bg', type: 'text', content: 'Образоваме лидерите на утрешния ден с високо качество и иновации', label: 'Hero Subtitle (bg)' },
      { id: 'hero-background', type: 'image', content: 'https://picsum.photos/1600/900?random=1', label: 'Hero Background' },
      { id: 'news-title_en', type: 'text', content: 'Latest News', label: 'News Title (en)' },
      { id: 'news-title_bg', type: 'text', content: 'Последни новини', label: 'News Title (bg)' }
    ]
  },

  // Contacts page
  {
    id: 'contacts',
    name: 'Contacts',
    path: '/contacts',
    parent_id: null,
    position: 1,
    sections: [
      { id: 'address-line1_en', type: 'text', content: 'Kolyo Ganchev Elementary School', label: 'Address Line 1 (en)' },
      { id: 'address-line1_bg', type: 'text', content: 'ОУ "Кольо Ганчев"', label: 'Address Line 1 (bg)' },
      { id: 'address-line2_en', type: 'text', content: '123 Education Street, Sofia, Bulgaria', label: 'Address Line 2 (en)' },
      { id: 'address-line2_bg', type: 'text', content: 'ул. "Образование" 123, София, България', label: 'Address Line 2 (bg)' },
      { id: 'director-phone_en', type: 'text', content: '+359 42 123 456', label: 'Director Phone (en)' },
      { id: 'director-phone_bg', type: 'text', content: '+359 42 123 456', label: 'Director Phone (bg)' },
      { id: 'office-phone_en', type: 'text', content: '+359 42 123 457', label: 'Office Phone (en)' },
      { id: 'office-phone_bg', type: 'text', content: '+359 42 123 457', label: 'Office Phone (bg)' },
      { id: 'contact-email_en', type: 'text', content: 'info@kolyoganchev.edu.bg', label: 'Contact Email (en)' },
      { id: 'contact-email_bg', type: 'text', content: 'info@kolyoganchev.edu.bg', label: 'Contact Email (bg)' },
      { id: 'worktime-weekdays_en', type: 'text', content: 'Monday - Friday: 8:00 AM - 5:00 PM', label: 'Work Time Weekdays (en)' },
      { id: 'worktime-weekdays_bg', type: 'text', content: 'Понеделник - Петък: 8:00 - 17:00', label: 'Work Time Weekdays (bg)' },
      { id: 'worktime-weekend_en', type: 'text', content: 'Saturday - Sunday: Closed', label: 'Work Time Weekend (en)' },
      { id: 'worktime-weekend_bg', type: 'text', content: 'Събота - Неделя: Затворено', label: 'Work Time Weekend (bg)' },
      { id: 'worktime-note_en', type: 'text', content: 'During school holidays, office hours may vary.', label: 'Work Time Note (en)' },
      { id: 'worktime-note_bg', type: 'text', content: 'По време на училищни ваканции работното време може да варира.', label: 'Work Time Note (bg)' },
      { id: 'transport-lines_en', type: 'list', content: '["Bus line 9", "Bus line 15", "Metro station University", "Tram line 12"]', label: 'Transport Lines (en)' },
      { id: 'transport-lines_bg', type: 'list', content: '["Автобусна линия 9", "Автобусна линия 15", "Метростанция Университет", "Трамвайна линия 12"]', label: 'Transport Lines (bg)' }
    ]
  },

  // School section
  {
    id: 'school',
    name: 'School',
    path: '/school',
    parent_id: null,
    position: 2
  },

  // School History
  {
    id: 'school-history',
    name: 'History',
    path: '/school/history',
    parent_id: 'school',
    position: 0,
    sections: [
      { id: 'history-p1_en', type: 'text', content: 'Our school has a rich history dating back to its founding. We have been serving the educational needs of our community for decades.', label: 'History Paragraph 1 (en)' },
      { id: 'history-p1_bg', type: 'text', content: 'Нашето училище има богата история, която се простира от основаването му. Ние служим на образователните нужди на нашата общност от десетилетия.', label: 'History Paragraph 1 (bg)' },
      { id: 'history-p2_en', type: 'text', content: 'Throughout the years, we have maintained our commitment to academic excellence and character development.', label: 'History Paragraph 2 (en)' },
      { id: 'history-p2_bg', type: 'text', content: 'През годините запазихме нашия ангажимент към академическо превъзходство и развитие на характера.', label: 'History Paragraph 2 (bg)' },
      { id: 'history-main-image', type: 'image', content: 'https://picsum.photos/1200/400?random=10', label: 'History Main Image' },
      { id: 'history-image-caption_en', type: 'text', content: 'Our historic school building that has served generations of students.', label: 'History Image Caption (en)' },
      { id: 'history-image-caption_bg', type: 'text', content: 'Нашата историческа училищна сграда, която е служила на поколения ученици.', label: 'History Image Caption (bg)' },
      { id: 'history-p3_en', type: 'text', content: 'Our educational approach has evolved with the times while preserving traditional values.', label: 'History Paragraph 3 (en)' },
      { id: 'history-p3_bg', type: 'text', content: 'Нашият образователен подход се е развивал с времето, като запазва традиционните ценности.', label: 'History Paragraph 3 (bg)' },
      { id: 'history-p4_en', type: 'text', content: 'Today, we continue to build upon our legacy of educational excellence.', label: 'History Paragraph 4 (en)' },
      { id: 'history-p4_bg', type: 'text', content: 'Днес продължаваме да изграждаме върху нашето наследство от образователно превъзходство.', label: 'History Paragraph 4 (bg)' },
      { id: 'achievements-title_en', type: 'text', content: 'Our Achievements', label: 'Achievements Title (en)' },
      { id: 'achievements-title_bg', type: 'text', content: 'Нашите постижения', label: 'Achievements Title (bg)' },
      { id: 'achievements-list_en', type: 'list', content: '["Award for Educational Excellence 2020", "Best Elementary School in District 2019", "Innovation in Teaching Award 2018"]', label: 'Achievements List (en)' },
      { id: 'achievements-list_bg', type: 'list', content: '["Награда за образователно превъзходство 2020", "Най-добро основно училище в района 2019", "Награда за иновации в преподаването 2018"]', label: 'Achievements List (bg)' },
      { id: 'directors-title_en', type: 'text', content: 'Former Directors', label: 'Directors Title (en)' },
      { id: 'directors-title_bg', type: 'text', content: 'Предишни директори', label: 'Directors Title (bg)' },
      { id: 'directors-list_en', type: 'list', content: '["Maria Petrova (1990-2000)", "Ivan Georgiev (2000-2010)", "Elena Dimitrova (2010-2020)"]', label: 'Directors List (en)' },
      { id: 'directors-list_bg', type: 'list', content: '["Мария Петрова (1990-2000)", "Иван Георгиев (2000-2010)", "Елена Димитрова (2010-2020)"]', label: 'Directors List (bg)' }
    ]
  },

  // School Patron
  {
    id: 'school-patron',
    name: 'Patron',
    path: '/school/patron',
    parent_id: 'school',
    position: 1,
    sections: [
      { id: 'patron-quote_en', type: 'text', content: '"Education is the most powerful weapon which you can use to change the world."', label: 'Patron Quote (en)' },
      { id: 'patron-quote_bg', type: 'text', content: '"Образованието е най-мощното оръжие, което можете да използвате, за да промените света."', label: 'Patron Quote (bg)' },
      { id: 'patron-p1_en', type: 'text', content: 'Kolyo Ganchev (1850-1925) was a prominent Bulgarian educator and writer who dedicated his life to education.', label: 'Patron Biography 1 (en)' },
      { id: 'patron-p1_bg', type: 'text', content: 'Кольо Ганчев (1850-1925) беше видни български просветител и писател, който посвети живота си на образованието.', label: 'Patron Biography 1 (bg)' },
      { id: 'patron-p2_en', type: 'text', content: 'Born in a small village, he understood the transformative power of education and worked tirelessly to establish schools.', label: 'Patron Biography 2 (en)' },
      { id: 'patron-p2_bg', type: 'text', content: 'Роден в малко село, той разбираше трансформиращата сила на образованието и работеше неуморно за създаването на училища.', label: 'Patron Biography 2 (bg)' },
      { id: 'patron-p3_en', type: 'text', content: 'His innovative teaching methods and dedication to student welfare made him a beloved figure in Bulgarian education.', label: 'Patron Biography 3 (en)' },
      { id: 'patron-p3_bg', type: 'text', content: 'Неговите иновативни методи на преподаване и отдадеността към благосъстоянието на учениците го направиха обичана фигура в българското образование.', label: 'Patron Biography 3 (bg)' },
      { id: 'patron-p4_en', type: 'text', content: 'He believed that every child deserves access to quality education, regardless of their social background.', label: 'Patron Biography 4 (en)' },
      { id: 'patron-p4_bg', type: 'text', content: 'Той вярваше, че всяко дете заслужава достъп до качествено образование, независимо от социалния си произход.', label: 'Patron Biography 4 (bg)' },
      { id: 'patron-p5_en', type: 'text', content: 'Today, our school continues his mission of providing excellent education to all students.', label: 'Patron Biography 5 (en)' },
      { id: 'patron-p5_bg', type: 'text', content: 'Днес нашето училище продължава неговата мисия за предоставяне на отлично образование на всички ученици.', label: 'Patron Biography 5 (bg)' },
      { id: 'patron-legacy-title_en', type: 'text', content: 'His Educational Legacy', label: 'Patron Legacy Title (en)' },
      { id: 'patron-legacy-title_bg', type: 'text', content: 'Неговото образователно наследство', label: 'Patron Legacy Title (bg)' },
      { id: 'patron-legacy_en', type: 'text', content: 'Kolyo Ganchev\'s educational philosophy emphasized critical thinking, moral development, and practical skills. His methods are still relevant in modern education.', label: 'Patron Legacy (en)' },
      { id: 'patron-legacy_bg', type: 'text', content: 'Образователната философия на Кольо Ганчев подчертаваше критическото мислене, моралното развитие и практическите умения. Методите му са все още актуални в съвременното образование.', label: 'Patron Legacy (bg)' },
      { id: 'patron-image', type: 'image', content: 'https://picsum.photos/600/800?random=2', label: 'Patron Image' },
      { id: 'patron-image-caption_en', type: 'text', content: 'Kolyo Ganchev (1850-1925), educator and patron of our school', label: 'Patron Image Caption (en)' },
      { id: 'patron-image-caption_bg', type: 'text', content: 'Кольо Ганчев (1850-1925), просветител и патрон на нашето училище', label: 'Patron Image Caption (bg)' }
    ]
  },

  // School Team
  {
    id: 'school-team',
    name: 'Team',
    path: '/school/team',
    parent_id: 'school',
    position: 2,
    sections: [
      { id: 'director-badge_en', type: 'text', content: 'Director', label: 'Director Badge (en)' },
      { id: 'director-badge_bg', type: 'text', content: 'Директор', label: 'Director Badge (bg)' },
      { id: 'team-intro_en', type: 'text', content: 'Meet our dedicated team of educators and staff members who work tirelessly to provide quality education and support to our students.', label: 'Team Introduction (en)' },
      { id: 'team-intro_bg', type: 'text', content: 'Запознайте се с нашия отдаден екип от педагози и служители, които работят неуморно за предоставяне на качествено образование и подкрепа на нашите ученици.', label: 'Team Introduction (bg)' },
      { id: 'team-photo-title_en', type: 'text', content: 'Our Team', label: 'Team Photo Title (en)' },
      { id: 'team-photo-title_bg', type: 'text', content: 'Нашият екип', label: 'Team Photo Title (bg)' },
      { id: 'team-group-photo', type: 'image', content: 'https://picsum.photos/1200/600?random=100', label: 'Team Group Photo' },
      { id: 'team-photo-caption_en', type: 'text', content: 'Our dedicated teaching staff and administration team working together for educational excellence.', label: 'Team Photo Caption (en)' },
      { id: 'team-photo-caption_bg', type: 'text', content: 'Нашият отдаден преподавателски състав и административен екип работят заедно за образователно превъзходство.', label: 'Team Photo Caption (bg)' },
      { id: 'leadership-title_en', type: 'text', content: 'School Leadership', label: 'Leadership Title (en)' },
      { id: 'leadership-title_bg', type: 'text', content: 'Училищно ръководство', label: 'Leadership Title (bg)' },
      { id: 'teachers-title_en', type: 'text', content: 'Our Teachers', label: 'Teachers Title (en)' },
      { id: 'teachers-title_bg', type: 'text', content: 'Нашите учители', label: 'Teachers Title (bg)' },
      { id: 'teachers-description_en', type: 'text', content: 'Our experienced and dedicated teachers are committed to helping every student reach their full potential through innovative teaching methods and personalized attention.', label: 'Teachers Description (en)' },
      { id: 'teachers-description_bg', type: 'text', content: 'Нашите опитни и отдадени учители са ангажирани да помогнат на всеки ученик да достигне пълния си потенциал чрез иновативни методи на преподаване и персонализирано внимание.', label: 'Teachers Description (bg)' }
    ]
  },

  // School Council
  {
    id: 'school-council',
    name: 'Council',
    path: '/school/council',
    parent_id: 'school',
    position: 3,
    sections: [
      { id: 'council-intro_en', type: 'text', content: 'The School Council is a governing body that ensures the quality of education and represents the interests of students, parents, and the community.', label: 'Council Introduction (en)' },
      { id: 'council-intro_bg', type: 'text', content: 'Училищното настоятелство е управляващ орган, който осигурява качеството на образованието и представлява интересите на учениците, родителите и общността.', label: 'Council Introduction (bg)' },
      { id: 'council-functions-title_en', type: 'text', content: 'Council Functions', label: 'Council Functions Title (en)' },
      { id: 'council-functions-title_bg', type: 'text', content: 'Функции на настоятелството', label: 'Council Functions Title (bg)' },
      { id: 'council-functions_en', type: 'list', content: '["Oversight of educational programs", "Budget approval and monitoring", "Strategic planning and policy development", "Community engagement and partnerships", "Quality assurance and evaluation"]', label: 'Council Functions (en)' },
      { id: 'council-functions_bg', type: 'list', content: '["Надзор на образователните програми", "Одобрение и мониторинг на бюджета", "Стратегическо планиране и разработка на политики", "Обществено ангажиране и партньорства", "Осигуряване на качество и оценяване"]', label: 'Council Functions (bg)' },
      { id: 'council-members-title_en', type: 'text', content: 'Council Members', label: 'Council Members Title (en)' },
      { id: 'council-members-title_bg', type: 'text', content: 'Членове на настоятелството', label: 'Council Members Title (bg)' },
      { id: 'council-chairman-role_en', type: 'text', content: 'Chairman', label: 'Council Chairman Role (en)' },
      { id: 'council-chairman-role_bg', type: 'text', content: 'Председател', label: 'Council Chairman Role (bg)' },
      { id: 'council-chairman-name_en', type: 'text', content: 'Dr. Petko Petrov', label: 'Council Chairman Name (en)' },
      { id: 'council-chairman-name_bg', type: 'text', content: 'Д-р Петко Петров', label: 'Council Chairman Name (bg)' },
      { id: 'council-members-role_en', type: 'text', content: 'Council Members', label: 'Council Members Role (en)' },
      { id: 'council-members-role_bg', type: 'text', content: 'Членове на настоятелството', label: 'Council Members Role (bg)' },
      { id: 'council-members-list_en', type: 'list', content: '["Maria Ivanova - Parent Representative", "Georgi Stoev - Community Leader", "Ana Nikolova - Teacher Representative", "Stefan Popov - Local Government", "Elena Dimitrova - Former Principal"]', label: 'Council Members List (en)' },
      { id: 'council-members-list_bg', type: 'list', content: '["Мария Иванова - Представител на родителите", "Георги Стоев - Лидер на общността", "Ана Николова - Представител на учителите", "Стефан Попов - Местна власт", "Елена Димитрова - Бивш директор"]', label: 'Council Members List (bg)' },
      { id: 'council-contact_en', type: 'text', content: 'For questions or suggestions, please contact the School Council at council@kolyoganchev.edu.bg', label: 'Council Contact (en)' },
      { id: 'council-contact_bg', type: 'text', content: 'За въпроси или предложения, моля свържете се с Училищното настоятелство на council@kolyoganchev.edu.bg', label: 'Council Contact (bg)' }
    ]
  },

  // Documents section
  {
    id: 'documents',
    name: 'Documents',
    path: '/documents',
    parent_id: null,
    position: 3
  },

  // Documents - Schedules
  {
    id: 'documents-schedules',
    name: 'Schedules',
    path: '/documents/schedules',
    parent_id: 'documents',
    position: 0,
    sections: [
      { id: 'schedules-intro_en', type: 'text', content: 'Find all important schedules and timetables for our school activities, classes, and events.', label: 'Schedules Introduction (en)' },
      { id: 'schedules-intro_bg', type: 'text', content: 'Намерете всички важни разписания и програми за училищните ни дейности, часове и събития.', label: 'Schedules Introduction (bg)' },
      { id: 'schedules-consultations-title_en', type: 'text', content: 'Teacher Consultations', label: 'Consultations Title (en)' },
      { id: 'schedules-consultations-title_bg', type: 'text', content: 'Учителски консултации', label: 'Consultations Title (bg)' },
      { id: 'schedules-consultations-text_en', type: 'text', content: 'Individual consultations with teachers are available during designated hours. Please schedule in advance.', label: 'Consultations Text (en)' },
      { id: 'schedules-consultations-text_bg', type: 'text', content: 'Индивидуални консултации с учители са налични през определени часове. Моля, уговорете предварително.', label: 'Consultations Text (bg)' }
    ]
  },

  // Documents - Rules
  {
    id: 'documents-rules',
    name: 'Rules',
    path: '/documents/rules',
    parent_id: 'documents',
    position: 1,
    sections: [
      { id: 'rules-intro_en', type: 'text', content: 'Our school operates according to established rules and regulations that ensure a safe and productive learning environment.', label: 'Rules Introduction (en)' },
      { id: 'rules-intro_bg', type: 'text', content: 'Нашето училище работи според установени правила и разпоредби, които осигуряват безопасна и продуктивна учебна среда.', label: 'Rules Introduction (bg)' },
      { id: 'rules-strategy-title_en', type: 'text', content: 'Strategic Development', label: 'Strategy Title (en)' },
      { id: 'rules-strategy-title_bg', type: 'text', content: 'Стратегическо развитие', label: 'Strategy Title (bg)' },
      { id: 'rules-mission-title_en', type: 'text', content: 'Our Mission', label: 'Mission Title (en)' },
      { id: 'rules-mission-title_bg', type: 'text', content: 'Нашата мисия', label: 'Mission Title (bg)' },
      { id: 'rules-mission-text_en', type: 'text', content: 'To provide quality education that develops critical thinking, creativity, and moral values in every student.', label: 'Mission Text (en)' },
      { id: 'rules-mission-text_bg', type: 'text', content: 'Да предоставяме качествено образование, което развива критическо мислене, творчество и морални ценности у всеки ученик.', label: 'Mission Text (bg)' },
      { id: 'rules-vision-title_en', type: 'text', content: 'Our Vision', label: 'Vision Title (en)' },
      { id: 'rules-vision-title_bg', type: 'text', content: 'Нашата визия', label: 'Vision Title (bg)' },
      { id: 'rules-vision-text_en', type: 'text', content: 'To be a leading educational institution that prepares students for success in the modern world.', label: 'Vision Text (en)' },
      { id: 'rules-vision-text_bg', type: 'text', content: 'Да бъдем водеща образователна институция, която подготвя учениците за успех в съвременния свят.', label: 'Vision Text (bg)' },
      { id: 'rules-regulations-title_en', type: 'text', content: 'School Regulations', label: 'Regulations Title (en)' },
      { id: 'rules-regulations-title_bg', type: 'text', content: 'Училищни разпоредби', label: 'Regulations Title (bg)' },
      { id: 'rules-rights-title_en', type: 'text', content: 'Student Rights', label: 'Rights Title (en)' },
      { id: 'rules-rights-title_bg', type: 'text', content: 'Права на учениците', label: 'Rights Title (bg)' },
      { id: 'rules-rights-list_en', type: 'list', content: '["Right to quality education", "Right to express opinions", "Right to participate in school activities", "Right to fair evaluation", "Right to safe learning environment"]', label: 'Rights List (en)' },
      { id: 'rules-rights-list_bg', type: 'list', content: '["Право на качествено образование", "Право да изразяват мнения", "Право да участват в училищни дейности", "Право на справедлива оценка", "Право на безопасна учебна среда"]', label: 'Rights List (bg)' },
      { id: 'rules-duties-title_en', type: 'text', content: 'Student Duties', label: 'Duties Title (en)' },
      { id: 'rules-duties-title_bg', type: 'text', content: 'Задължения на учениците', label: 'Duties Title (bg)' },
      { id: 'rules-duties-list_en', type: 'list', content: '["Attend classes regularly", "Complete assignments on time", "Respect teachers and peers", "Follow school rules", "Take care of school property"]', label: 'Duties List (en)' },
      { id: 'rules-duties-list_bg', type: 'list', content: '["Редовно посещават часовете", "Изпълняват задания навреме", "Уважават учители и съученици", "Спазват училищните правила", "Пазят училищната собственост"]', label: 'Duties List (bg)' },
      { id: 'rules-annual-plan-title_en', type: 'text', content: 'Annual Development Plan', label: 'Annual Plan Title (en)' },
      { id: 'rules-annual-plan-title_bg', type: 'text', content: 'Годишен план за развитие', label: 'Annual Plan Title (bg)' },
      { id: 'rules-priorities-list_en', type: 'list', content: '["Improve teaching methodologies", "Enhance digital literacy", "Strengthen parent-school partnerships", "Expand extracurricular activities", "Modernize facilities"]', label: 'Priorities List (en)' },
      { id: 'rules-priorities-list_bg', type: 'list', content: '["Подобряване на методиките на преподаване", "Повишаване на цифровата грамотност", "Укрепване на партньорствата родители-училище", "Разширяване на извънкласните дейности", "Модернизиране на съоръженията"]', label: 'Priorities List (bg)' }
    ]
  },

  // Documents - FAQ
  {
    id: 'documents-faq',
    name: 'FAQ',
    path: '/documents/faq',
    parent_id: 'documents',
    position: 2,
    sections: [
      { id: 'faq-intro_en', type: 'text', content: 'Find answers to frequently asked questions about our school, enrollment, programs, and policies.', label: 'FAQ Introduction (en)' },
      { id: 'faq-intro_bg', type: 'text', content: 'Намерете отговори на често задавани въпроси за нашето училище, записване, програми и политики.', label: 'FAQ Introduction (bg)' },
      { id: 'faq-1-answer_en', type: 'text', content: 'Enrollment typically opens in March for the following academic year. Please contact our office for specific dates and requirements.', label: 'FAQ Answer 1 (en)' },
      { id: 'faq-1-answer_bg', type: 'text', content: 'Записването обикновено започва през март за следващата учебна година. Моля, свържете се с нашия офис за конкретни дати и изисквания.', label: 'FAQ Answer 1 (bg)' },
      { id: 'faq-2-answer_en', type: 'text', content: 'We offer a comprehensive curriculum including Bulgarian language, mathematics, science, history, geography, arts, and physical education.', label: 'FAQ Answer 2 (en)' },
      { id: 'faq-2-answer_bg', type: 'text', content: 'Предлагаме всестранна учебна програма, включваща български език, математика, наука, история, география, изкуства и физическо възпитание.', label: 'FAQ Answer 2 (bg)' },
      { id: 'faq-3-answer_en', type: 'text', content: 'Yes, we provide after-school care and various extracurricular activities including sports, music, and academic clubs.', label: 'FAQ Answer 3 (en)' },
      { id: 'faq-3-answer_bg', type: 'text', content: 'Да, предоставяме следучилищни грижи и различни извънкласни дейности, включително спорт, музика и академични клубове.', label: 'FAQ Answer 3 (bg)' },
      { id: 'faq-4-answer_en', type: 'text', content: 'Please contact our main office at +359 42 123 456 or email us at info@kolyoganchev.edu.bg for all inquiries.', label: 'FAQ Answer 4 (en)' },
      { id: 'faq-4-answer_bg', type: 'text', content: 'Моля, свържете се с нашия главен офис на +359 42 123 456 или ни изпратете имейл на info@kolyoganchev.edu.bg за всички запитвания.', label: 'FAQ Answer 4 (bg)' }
    ]
  },

  // Documents - Road Safety
  {
    id: 'documents-road-safety',
    name: 'Road Safety',
    path: '/documents/road-safety',
    parent_id: 'documents',
    position: 3,
    sections: [
      { id: 'road-safety-intro_en', type: 'text', content: 'Road safety is a priority at our school. We provide comprehensive education and guidelines to keep our students safe.', label: 'Road Safety Introduction (en)' },
      { id: 'road-safety-intro_bg', type: 'text', content: 'Пътната безопасност е приоритет в нашето училище. Предоставяме цялостно обучение и указания за безопасността на нашите ученици.', label: 'Road Safety Introduction (bg)' },
      { id: 'road-safety-plan-title_en', type: 'text', content: 'Safety Plan', label: 'Safety Plan Title (en)' },
      { id: 'road-safety-plan-title_bg', type: 'text', content: 'План за безопасност', label: 'Safety Plan Title (bg)' },
      { id: 'road-safety-plan-description_en', type: 'text', content: 'Our comprehensive road safety plan includes education, awareness campaigns, and practical safety measures.', label: 'Safety Plan Description (en)' },
      { id: 'road-safety-plan-description_bg', type: 'text', content: 'Нашият цялостен план за пътна безопасност включва образование, кампании за повишаване на осведомеността и практически мерки за безопасност.', label: 'Safety Plan Description (bg)' },
      { id: 'road-safety-plan-items_en', type: 'list', content: '["Regular safety education classes", "Traffic sign recognition training", "Pedestrian crossing practice", "Bicycle safety workshops", "Emergency response procedures"]', label: 'Safety Plan Items (en)' },
      { id: 'road-safety-plan-items_bg', type: 'list', content: '["Редовни часове по безопасност", "Обучение за разпознаване на пътни знаци", "Практика за преминаване на пешеходни пътеки", "Работилници за безопасност с велосипеди", "Процедури за спешно реагиране"]', label: 'Safety Plan Items (bg)' },
      { id: 'road-safety-tips-title_en', type: 'text', content: 'Safety Tips', label: 'Safety Tips Title (en)' },
      { id: 'road-safety-tips-title_bg', type: 'text', content: 'Съвети за безопасност', label: 'Safety Tips Title (bg)' },
      { id: 'road-safety-students-title_en', type: 'text', content: 'For Students', label: 'Students Safety Title (en)' },
      { id: 'road-safety-students-title_bg', type: 'text', content: 'За учениците', label: 'Students Safety Title (bg)' },
      { id: 'road-safety-students-tips_en', type: 'list', content: '["Always use crosswalks", "Look both ways before crossing", "Wear bright colors", "Never run into the street", "Follow traffic signals"]', label: 'Students Safety Tips (en)' },
      { id: 'road-safety-students-tips_bg', type: 'list', content: '["Винаги използвайте пешеходни пътеки", "Гледайте в двете посоки преди преминаване", "Носете ярки цветове", "Никога не тичайте по улицата", "Следвайте светофарните сигнали"]', label: 'Students Safety Tips (bg)' },
      { id: 'road-safety-parents-title_en', type: 'text', content: 'For Parents', label: 'Parents Safety Title (en)' },
      { id: 'road-safety-parents-title_bg', type: 'text', content: 'За родителите', label: 'Parents Safety Title (bg)' },
      { id: 'road-safety-parents-tips_en', type: 'list', content: '["Practice road safety with children", "Use car seats and seatbelts", "Avoid dropping off in no-parking zones", "Be a good role model", "Report safety concerns"]', label: 'Parents Safety Tips (en)' },
      { id: 'road-safety-parents-tips_bg', type:'list', content: '["Упражнявайте пътна безопасност с децата", "Използвайте детски столчета и колани", "Избягвайте спиране в зони без паркиране", "Бъдете добър пример", "Съобщавайте за проблеми с безопасността"]', label: 'Parents Safety Tips (bg)' },
      { id: 'road-safety-routes-title_en', type: 'text', content: 'Safe Routes', label: 'Safe Routes Title (en)' },
      { id: 'road-safety-routes-title_bg', type: 'text', content: 'Безопасни маршрути', label: 'Safe Routes Title (bg)' },
      { id: 'road-safety-routes-text_en', type: 'text', content: 'We have identified the safest routes to school and provide maps and guidance to families.', label: 'Safe Routes Text (en)' },
      { id: 'road-safety-routes-text_bg', type: 'text', content: 'Идентифицирахме най-безопасните маршрути до училището и предоставяме карти и указания на семействата.', label: 'Safe Routes Text (bg)' }
    ]
  },

  // Useful Links
  {
    id: 'useful-links',
    name: 'Useful Links',
    path: '/useful-links',
    parent_id: null,
    position: 4,
    sections: [
      { id: 'useful-links-intro_en', type: 'text', content: 'Find helpful resources, educational websites, and important links for students, parents, and educators.', label: 'Useful Links Introduction (en)' },
      { id: 'useful-links-intro_bg', type: 'text', content: 'Намерете полезни ресурси, образователни уебсайтове и важни връзки за ученици, родители и педагози.', label: 'Useful Links Introduction (bg)' }
    ]
  },

  // Gallery
  {
    id: 'gallery',
    name: 'Gallery',
    path: '/gallery',
    parent_id: null,
    position: 5,
    sections: [
      { id: 'gallery-title_en', type: 'text', content: 'School Gallery', label: 'Gallery Title (en)' },
      { id: 'gallery-title_bg', type: 'text', content: 'Училищна галерия', label: 'Gallery Title (bg)' }
    ]
  },

  // Info Access
  {
    id: 'info-access',
    name: 'Info Access',
    path: '/info-access',
    parent_id: null,
    position: 6,
    sections: [
      { id: 'info-title_en', type: 'text', content: 'Public Information Access', label: 'Info Title (en)' },
      { id: 'info-title_bg', type: 'text', content: 'Достъп до обществена информация', label: 'Info Title (bg)' }
    ]
  },

  // Documents - Announcements
  {
    id: 'documents-announcement',
    name: 'Announcements',
    path: '/documents/announcement',
    parent_id: 'documents',
    position: 4,
    sections: [
      { id: 'announcements-intro_en', type: 'text', content: 'Stay informed with the latest announcements and news from our school administration.', label: 'Announcements Introduction (en)' },
      { id: 'announcements-intro_bg', type: 'text', content: 'Бъдете информирани за най-новите обявления и новини от администрацията на училището.', label: 'Announcements Introduction (bg)' },
      { id: 'announcement-1-p1_en', type: 'text', content: 'We are pleased to announce our upcoming Parent-Teacher Conference scheduled for next month.', label: 'Announcement 1 Paragraph 1 (en)' },
      { id: 'announcement-1-p1_bg', type: 'text', content: 'С удовлствие обявяваме предстоящата ни среща родители-учители, планирана за следващия месец.', label: 'Announcement 1 Paragraph 1 (bg)' },
      { id: 'announcement-1-p2_en', type: 'text', content: 'This conference provides an excellent opportunity to discuss your child\'s progress and development.', label: 'Announcement 1 Paragraph 2 (en)' },
      { id: 'announcement-1-p2_bg', type: 'text', content: 'Тази конференция предоставя отлична възможност да обсъдите напредъка и развитието на вашето дете.', label: 'Announcement 1 Paragraph 2 (bg)' },
      { id: 'announcement-1-agenda-title_en', type: 'text', content: 'Conference Agenda', label: 'Announcement 1 Agenda Title (en)' },
      { id: 'announcement-1-agenda-title_bg', type: 'text', content: 'Дневен ред на конференцията', label: 'Announcement 1 Agenda Title (bg)' },
      { id: 'announcement-1-agenda_en', type: 'list', content: '["Individual consultations", "Academic progress reviews", "Upcoming events discussion", "Q&A session"]', label: 'Announcement 1 Agenda (en)' },
      { id: 'announcement-1-agenda_bg', type: 'list', content: '["Индивидуални консултации", "Преглед на академичния напредък", "Обсъждане на предстоящи събития", "Сесия въпроси и отговори"]', label: 'Announcement 1 Agenda (bg)' },
      { id: 'announcement-1-p3_en', type: 'text', content: 'Please contact the office to schedule your appointment.', label: 'Announcement 1 Paragraph 3 (en)' },
      { id: 'announcement-1-p3_bg', type: 'text', content: 'Моля, свържете се с офиса, за да насрочите своята среща.', label: 'Announcement 1 Paragraph 3 (bg)' },
      { id: 'announcement-1-signature_en', type: 'text', content: 'Principal Maria Dimitrova', label: 'Announcement 1 Signature (en)' },
      { id: 'announcement-1-signature_bg', type: 'text', content: 'Директор Мария Димитрова', label: 'Announcement 1 Signature (bg)' }
    ]
  },

  // Documents - Olympiads
  {
    id: 'documents-olympiads',
    name: 'Olympiads',
    path: '/documents/olympiads',
    parent_id: 'documents',
    position: 5,
    sections: [
      { id: 'olympiads-intro_en', type: 'text', content: 'Our school actively participates in academic olympiads and competitions, showcasing our students\' talents and knowledge.', label: 'Olympiads Introduction (en)' },
      { id: 'olympiads-intro_bg', type: 'text', content: 'Нашето училище активно участва в академични олимпиади и състезания, показвайки таланта и знанията на нашите ученици.', label: 'Olympiads Introduction (bg)' },
      { id: 'olympiads-schedule-title_en', type: 'text', content: 'Competition Schedule', label: 'Olympiads Schedule Title (en)' },
      { id: 'olympiads-schedule-title_bg', type: 'text', content: 'Програма на състезанията', label: 'Olympiads Schedule Title (bg)' },
      { id: 'olympiads-table-competition_en', type: 'text', content: 'Competition', label: 'Olympiads Table Competition (en)' },
      { id: 'olympiads-table-competition_bg', type: 'text', content: 'Състезание', label: 'Olympiads Table Competition (bg)' },
      { id: 'olympiads-table-date_en', type: 'text', content: 'Date', label: 'Olympiads Table Date (en)' },
      { id: 'olympiads-table-date_bg', type: 'text', content: 'Дата', label: 'Olympiads Table Date (bg)' },
      { id: 'olympiads-bel-name_en', type: 'text', content: 'Bulgarian Language', label: 'Bulgarian Language Olympiad (en)' },
      { id: 'olympiads-bel-name_bg', type: 'text', content: 'Български език', label: 'Bulgarian Language Olympiad (bg)' },
      { id: 'olympiads-bel-date_en', type: 'text', content: 'March 15, 2024', label: 'Bulgarian Language Date (en)' },
      { id: 'olympiads-bel-date_bg', type: 'text', content: '15 март 2024', label: 'Bulgarian Language Date (bg)' },
      { id: 'olympiads-math-name_en', type: 'text', content: 'Mathematics', label: 'Mathematics Olympiad (en)' },
      { id: 'olympiads-math-name_bg', type: 'text', content: 'Математика', label: 'Mathematics Olympiad (bg)' },
      { id: 'olympiads-math-date_en', type: 'text', content: 'March 22, 2024', label: 'Mathematics Date (en)' },
      { id: 'olympiads-math-date_bg', type: 'text', content: '22 март 2024', label: 'Mathematics Date (bg)' },
      { id: 'olympiads-successes-title_en', type: 'text', content: 'Our Achievements', label: 'Olympiads Successes Title (en)' },
      { id: 'olympiads-successes-title_bg', type: 'text', content: 'Нашите постижения', label: 'Olympiads Successes Title (bg)' },
      { id: 'olympiads-successes-p1_en', type: 'text', content: 'We are proud of our students\' outstanding performance in national competitions.', label: 'Olympiads Successes P1 (en)' },
      { id: 'olympiads-successes-p1_bg', type: 'text', content: 'Гордеем се с выдающия представянето на нашите ученици в националните състезания.', label: 'Olympiads Successes P1 (bg)' },
      { id: 'olympiads-internal-title_en', type: 'text', content: 'Internal Competitions', label: 'Internal Competitions Title (en)' },
      { id: 'olympiads-internal-title_bg', type: 'text', content: 'Вътрешни състезания', label: 'Internal Competitions Title (bg)' },
      { id: 'olympiads-internal-p1_en', type: 'text', content: 'We organize internal competitions to prepare students and identify talents.', label: 'Internal Competitions P1 (en)' },
      { id: 'olympiads-internal-p1_bg', type: 'text', content: 'Организираме вътрешни състезания, за да подготвим учениците и да идентифицираме таланти.', label: 'Internal Competitions P1 (bg)' }
    ]
  },

  // Documents - ORES (Regional Education Authority)
  {
    id: 'documents-ores',
    name: 'ORES',
    path: '/documents/ores',
    parent_id: 'documents',
    position: 6,
    sections: [
      { id: 'ores-intro_en', type: 'text', content: 'Information about Regional Education Authority (ORES) regulations and guidelines.', label: 'ORES Introduction (en)' },
      { id: 'ores-intro_bg', type: 'text', content: 'Информация за разпоредбите и указанията на Регионалното управление на образованието (РУО).', label: 'ORES Introduction (bg)' },
      { id: 'ores-rules-title_en', type: 'text', content: 'ORES Regulations', label: 'ORES Rules Title (en)' },
      { id: 'ores-rules-title_bg', type: 'text', content: 'Разпоредби на РУО', label: 'ORES Rules Title (bg)' },
      { id: 'ores-rules-p1_en', type: 'text', content: 'All schools must comply with ORES regulations and standards.', label: 'ORES Rules P1 (en)' },
      { id: 'ores-rules-p1_bg', type: 'text', content: 'Всички училища трябва да спазват разпоредбите и стандартите на РУО.', label: 'ORES Rules P1 (bg)' },
      { id: 'ores-guide-title_en', type: 'text', content: 'Compliance Guide', label: 'ORES Guide Title (en)' },
      { id: 'ores-guide-title_bg', type: 'text', content: 'Ръководство за съответствие', label: 'ORES Guide Title (bg)' },
      { id: 'ores-guide-p1_en', type: 'text', content: 'This guide helps schools understand and implement ORES requirements.', label: 'ORES Guide P1 (en)' },
      { id: 'ores-guide-p1_bg', type: 'text', content: 'Това ръководство помага на училищата да разберат и приложат изискванията на РУО.', label: 'ORES Guide P1 (bg)' }
    ]
  },

  // Projects section
  {
    id: 'projects',
    name: 'Projects',
    path: '/projects',
    parent_id: null,
    position: 7
  },

  // Projects - Your Hour
  {
    id: 'projects-your-hour',
    name: 'Your Hour',
    path: '/projects/your-hour',
    parent_id: 'projects',
    position: 0,
    sections: [
      { id: 'your-hour-title_en', type: 'text', content: 'Your Hour Project', label: 'Your Hour Title (en)' },
      { id: 'your-hour-title_bg', type: 'text', content: 'Проект "Твоят час"', label: 'Your Hour Title (bg)' },
      { id: 'your-hour-intro_en', type: 'text', content: 'The "Your Hour" project is an innovative educational initiative that provides personalized learning opportunities for our students.', label: 'Your Hour Introduction (en)' },
      { id: 'your-hour-intro_bg', type: 'text', content: 'Проектът "Твоят час" е иновативна образователна инициатива, която предоставя персонализирани възможности за учене на нашите ученици.', label: 'Your Hour Introduction (bg)' },
      { id: 'your-hour-description_en', type: 'text', content: 'This program allows students to explore their interests and develop skills in areas they are passionate about.', label: 'Your Hour Description (en)' },
      { id: 'your-hour-description_bg', type: 'text', content: 'Тази програма позволява на учениците да изследват своите интереси и да развиват умения в области, за които се увлекават.', label: 'Your Hour Description (bg)' },
      { id: 'your-hour-benefits_en', type: 'list', content: '["Individualized learning paths", "Creative expression opportunities", "Skill development workshops", "Mentorship programs", "Project-based learning"]', label: 'Your Hour Benefits (en)' },
      { id: 'your-hour-benefits_bg', type: 'list', content: '["Индивидуализирани пътища за учене", "Възможности за творческо изразяване", "Работилници за развитие на умения", "Програми за менторство", "Проектно базирано учене"]', label: 'Your Hour Benefits (bg)' }
    ]
  },

  // Documents - Calendar
  {
    id: 'documents-calendar',
    name: 'Calendar',
    path: '/documents/calendar',
    parent_id: 'documents',
    position: 7,
    sections: [
      { id: 'calendar-title_en', type: 'text', content: 'School Calendar', label: 'Calendar Title (en)' },
      { id: 'calendar-title_bg', type: 'text', content: 'Училищен календар', label: 'Calendar Title (bg)' },
      { id: 'calendar-intro_en', type: 'text', content: 'View important dates, holidays, and school events throughout the academic year.', label: 'Calendar Introduction (en)' },
      { id: 'calendar-intro_bg', type: 'text', content: 'Вижте важни дати, празници и училищни събития през учебната година.', label: 'Calendar Introduction (bg)' }
    ]
  },

  // Documents - Admin Services  
  {
    id: 'documents-admin-services',
    name: 'Administrative Services',
    path: '/documents/admin-services',
    parent_id: 'documents',
    position: 8,
    sections: [
      { id: 'admissions-intro_en', type: 'text', content: 'Information about administrative services, enrollment procedures, and important deadlines.', label: 'Admin Services Introduction (en)' },
      { id: 'admissions-intro_bg', type: 'text', content: 'Информация за административните услуги, процедурите за записване и важните крайни срокове.', label: 'Admin Services Introduction (bg)' },
      { id: 'admissions-rules-title_en', type: 'text', content: 'Enrollment Rules', label: 'Enrollment Rules Title (en)' },
      { id: 'admissions-rules-title_bg', type: 'text', content: 'Правила за записване', label: 'Enrollment Rules Title (bg)' },
      { id: 'admissions-rules-p1_en', type: 'text', content: 'All enrollment must follow the established procedures and requirements set by the Ministry of Education.', label: 'Enrollment Rules P1 (en)' },
      { id: 'admissions-rules-p1_bg', type: 'text', content: 'Всяко записване трябва да следва установените процедури и изисквания, определени от Министерството на образованието.', label: 'Enrollment Rules P1 (bg)' },
      { id: 'admissions-criteria-title_en', type: 'text', content: 'Admission Criteria', label: 'Admission Criteria Title (en)' },
      { id: 'admissions-criteria-title_bg', type: 'text', content: 'Критерии за прием', label: 'Admission Criteria Title (bg)' },
      { id: 'admissions-criteria_en', type: 'list', content: '["Age requirements", "Residential address verification", "Health certificate", "Previous school records", "Parent/guardian documentation"]', label: 'Admission Criteria (en)' },
      { id: 'admissions-criteria_bg', type: 'list', content: '["Възрастови изисквания", "Удостоверяване на адреса на пребиваване", "Здравно удостоверение", "Документи от предишно училище", "Документация на родител/настойник"]', label: 'Admission Criteria (bg)' },
      { id: 'admissions-schedule-title_en', type: 'text', content: 'Important Deadlines', label: 'Admission Schedule Title (en)' },
      { id: 'admissions-schedule-title_bg', type: 'text', content: 'Важни крайни срокове', label: 'Admission Schedule Title (bg)' }
    ]
  }

  // Add more pages as needed...
];

async function migrateComprehensiveContent() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting comprehensive content migration...');
    
    db.serialize(async () => {
      try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await new Promise((res, rej) => {
          db.run('DELETE FROM content_sections', (err) => {
            if (err) rej(err);
            else res();
          });
        });
        
        await new Promise((res, rej) => {
          db.run('DELETE FROM pages', (err) => {
            if (err) rej(err);
            else res();
          });
        });
        
        console.log('✅ Cleared existing data');

        // Insert pages and content sections
        for (const pageData of contentStructure) {
          // Insert page
          await new Promise((res, rej) => {
            db.run(
              'INSERT INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [pageData.id, pageData.name, pageData.path, pageData.parent_id, pageData.position, 1, 1],
              function(err) {
                if (err) rej(err);
                else {
                  console.log(`📄 Inserted page: ${pageData.name}`);
                  res();
                }
              }
            );
          });

          // Insert content sections if they exist
          if (pageData.sections) {
            for (const section of pageData.sections) {
              await new Promise((res, rej) => {
                db.run(
                  'INSERT INTO content_sections (id, type, label, content, page_id, position, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  [section.id, section.type, section.label, section.content, pageData.id, 0, 1],
                  function(err) {
                    if (err) rej(err);
                    else {
                      console.log(`  📝 Inserted section: ${section.label}`);
                      res();
                    }
                  }
                );
              });
            }
          }
        }

        console.log('🎉 Comprehensive migration completed successfully!');
        const totalPages = contentStructure.length;
        const totalSections = contentStructure.reduce((sum, page) => sum + (page.sections ? page.sections.length : 0), 0);
        console.log(`📊 Stats: ${totalPages} pages, ${totalSections} content sections`);
        
        resolve();
      } catch (error) {
        console.error('❌ Migration failed:', error);
        reject(error);
      }
    });
  });
}

// Run migration and close database
migrateComprehensiveContent()
  .then(() => {
    console.log('📚 Database connection closed');
    db.close();
  })
  .catch((error) => {
    console.error('❌ Migration error:', error);
    db.close();
    process.exit(1);
  });