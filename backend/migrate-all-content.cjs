const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./database/cms.db');

// Define all pages with their content structure
const pagesWithContent = [
  // Main pages
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

  // School pages
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
      { id: 'directors-title_en', type: 'text', content: 'Former Directors', label: 'Directors Title (en)' },
      { id: 'directors-title_bg', type: 'text', content: 'Предишни директори', label: 'Directors Title (bg)' }
    ]
  },

  {
    id: 'school-patron',
    name: 'Patron',
    path: '/school/patron',
    parent_id: 'school',
    position: 1,
    sections: [
      { id: 'patron-title_en', type: 'text', content: 'Our Patron - Kolyo Ganchev', label: 'Patron Title (en)' },
      { id: 'patron-title_bg', type: 'text', content: 'Нашият патрон - Кольо Ганчев', label: 'Patron Title (bg)' },
      { id: 'patron-bio_en', type: 'text', content: 'Learn about the life and legacy of our school patron.', label: 'Patron Biography (en)' },
      { id: 'patron-bio_bg', type: 'text', content: 'Научете за живота и наследството на патрона на нашето училище.', label: 'Patron Biography (bg)' }
    ]
  },

  {
    id: 'school-team',
    name: 'Team',
    path: '/school/team',
    parent_id: 'school',
    position: 2,
    sections: [
      { id: 'team-intro_en', type: 'text', content: 'Meet our dedicated team of educators and staff members who work tirelessly to provide quality education.', label: 'Team Introduction (en)' },
      { id: 'team-intro_bg', type: 'text', content: 'Запознайте се с нашия отдаден екип от педагози и служители, които работят неуморно за предоставяне на качествено образование.', label: 'Team Introduction (bg)' },
      { id: 'team-photo-title_en', type: 'text', content: 'Our Team', label: 'Team Photo Title (en)' },
      { id: 'team-photo-title_bg', type: 'text', content: 'Нашият екип', label: 'Team Photo Title (bg)' },
      { id: 'team-group-photo', type: 'image', content: 'https://picsum.photos/1200/600?random=100', label: 'Team Group Photo' },
      { id: 'team-photo-caption_en', type: 'text', content: 'Our dedicated teaching staff and administration team.', label: 'Team Photo Caption (en)' },
      { id: 'team-photo-caption_bg', type: 'text', content: 'Нашият отдаден преподавателски състав и административен екип.', label: 'Team Photo Caption (bg)' },
      { id: 'leadership-title_en', type: 'text', content: 'School Leadership', label: 'Leadership Title (en)' },
      { id: 'leadership-title_bg', type: 'text', content: 'Училищно ръководство', label: 'Leadership Title (bg)' },
      { id: 'teachers-title_en', type: 'text', content: 'Our Teachers', label: 'Teachers Title (en)' },
      { id: 'teachers-title_bg', type: 'text', content: 'Нашите учители', label: 'Teachers Title (bg)' },
      { id: 'teachers-description_en', type: 'text', content: 'Our experienced and dedicated teachers are committed to helping every student reach their full potential.', label: 'Teachers Description (en)' },
      { id: 'teachers-description_bg', type: 'text', content: 'Нашите опитни и отдадени учители са ангажирани да помогнат на всеки ученик да достигне пълния си потенциал.', label: 'Teachers Description (bg)' },
      { id: 'director-badge_en', type: 'text', content: 'Director', label: 'Director Badge (en)' },
      { id: 'director-badge_bg', type: 'text', content: 'Директор', label: 'Director Badge (bg)' }
    ]
  },

  {
    id: 'school-council',
    name: 'Council',
    path: '/school/council',
    parent_id: 'school',
    position: 3,
    sections: [
      { id: 'council-title_en', type: 'text', content: 'School Council', label: 'Council Title (en)' },
      { id: 'council-title_bg', type: 'text', content: 'Училищно настоятелство', label: 'Council Title (bg)' },
      { id: 'council-intro_en', type: 'text', content: 'Information about our school council members and their roles.', label: 'Council Introduction (en)' },
      { id: 'council-intro_bg', type: 'text', content: 'Информация за членовете на училищното настоятелство и техните роли.', label: 'Council Introduction (bg)' }
    ]
  },

  // Documents pages
  {
    id: 'documents-calendar',
    name: 'Calendar',
    path: '/documents/calendar',
    parent_id: 'documents',
    position: 0,
    sections: [
      { id: 'calendar-title_en', type: 'text', content: 'School Calendar', label: 'Calendar Title (en)' },
      { id: 'calendar-title_bg', type: 'text', content: 'Училищен календар', label: 'Calendar Title (bg)' }
    ]
  },

  {
    id: 'documents-schedules',
    name: 'Schedules',
    path: '/documents/schedules',
    parent_id: 'documents',
    position: 1,
    sections: [
      { id: 'schedules-title_en', type: 'text', content: 'Class Schedules', label: 'Schedules Title (en)' },
      { id: 'schedules-title_bg', type: 'text', content: 'Разписания', label: 'Schedules Title (bg)' }
    ]
  },

  // Projects pages
  {
    id: 'projects-your-hour',
    name: 'Your Hour',
    path: '/projects/your-hour',
    parent_id: 'projects',
    position: 0,
    sections: [
      { id: 'your-hour-title_en', type: 'text', content: 'Your Hour Project', label: 'Your Hour Title (en)' },
      { id: 'your-hour-title_bg', type: 'text', content: 'Проект "Твоя час"', label: 'Your Hour Title (bg)' }
    ]
  },

  // Other main pages
  {
    id: 'contacts',
    name: 'Contacts',
    path: '/contacts',
    parent_id: null,
    position: 6,
    sections: [
      { id: 'contacts-title_en', type: 'text', content: 'Contact Information', label: 'Contacts Title (en)' },
      { id: 'contacts-title_bg', type: 'text', content: 'Контактна информация', label: 'Contacts Title (bg)' },
      { id: 'contacts-address_en', type: 'text', content: 'School Address', label: 'Address (en)' },
      { id: 'contacts-address_bg', type: 'text', content: 'Адрес на училището', label: 'Address (bg)' },
      { id: 'contacts-phone_en', type: 'text', content: 'Phone: +359 XX XXX XXX', label: 'Phone (en)' },
      { id: 'contacts-phone_bg', type: 'text', content: 'Телефон: +359 XX XXX XXX', label: 'Phone (bg)' },
      { id: 'contacts-email_en', type: 'text', content: 'Email: info@school.com', label: 'Email (en)' },
      { id: 'contacts-email_bg', type: 'text', content: 'Имейл: info@school.com', label: 'Email (bg)' }
    ]
  },

  {
    id: 'gallery',
    name: 'Gallery',
    path: '/gallery',
    parent_id: null,
    position: 4,
    sections: [
      { id: 'gallery-title_en', type: 'text', content: 'Photo Gallery', label: 'Gallery Title (en)' },
      { id: 'gallery-title_bg', type: 'text', content: 'Фотогалерия', label: 'Gallery Title (bg)' }
    ]
  },

  {
    id: 'useful-links',
    name: 'Useful Links',
    path: '/useful-links',
    parent_id: null,
    position: 3,
    sections: [
      { id: 'links-title_en', type: 'text', content: 'Useful Links', label: 'Links Title (en)' },
      { id: 'links-title_bg', type: 'text', content: 'Полезни връзки', label: 'Links Title (bg)' }
    ]
  },

  {
    id: 'info-access',
    name: 'Info Access',
    path: '/info-access',
    parent_id: null,
    position: 7,
    sections: [
      { id: 'info-title_en', type: 'text', content: 'Information Access', label: 'Info Title (en)' },
      { id: 'info-title_bg', type: 'text', content: 'Достъп до информация', label: 'Info Title (bg)' }
    ]
  }
];

async function migrateAllContent() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting comprehensive content migration...');
    
    // First, clear existing data
    console.log('🗑️  Clearing existing data...');
    db.serialize(() => {
      db.run('DELETE FROM content_sections');
      db.run('DELETE FROM pages', (err) => {
        if (err) {
          console.error('Error clearing data:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Cleared existing data');
        
        // Insert pages and content
        let pagesInserted = 0;
        let sectionsInserted = 0;
        const totalPages = pagesWithContent.length;
        const totalSections = pagesWithContent.reduce((sum, page) => sum + (page.sections ? page.sections.length : 0), 0);
        
        pagesWithContent.forEach((page) => {
          // Insert page
          db.run(
            `INSERT INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) 
             VALUES (?, ?, ?, ?, ?, 1, 1)`,
            [page.id, page.name, page.path, page.parent_id, page.position],
            function(pageErr) {
              if (pageErr) {
                console.error(`Error inserting page ${page.name}:`, pageErr);
                reject(pageErr);
                return;
              }
              
              pagesInserted++;
              console.log(`📄 Inserted page: ${page.name}`);
              
              // Insert sections for this page
              if (page.sections) {
                page.sections.forEach((section) => {
                  db.run(
                    `INSERT INTO content_sections (id, type, label, content, page_id, is_active) 
                     VALUES (?, ?, ?, ?, ?, 1)`,
                    [section.id, section.type, section.label, section.content, page.id],
                    function(sectionErr) {
                      if (sectionErr) {
                        console.error(`Error inserting section ${section.id}:`, sectionErr);
                        reject(sectionErr);
                        return;
                      }
                      
                      sectionsInserted++;
                      console.log(`  📝 Inserted section: ${section.label}`);
                      
                      // Check if we're done
                      if (pagesInserted === totalPages && sectionsInserted === totalSections) {
                        console.log(`🎉 Migration completed successfully!`);
                        console.log(`📊 Stats: ${pagesInserted} pages, ${sectionsInserted} content sections`);
                        resolve();
                      }
                    }
                  );
                });
              } else {
                // No sections for this page, check if we're done
                if (pagesInserted === totalPages && sectionsInserted === totalSections) {
                  console.log(`🎉 Migration completed successfully!`);
                  console.log(`📊 Stats: ${pagesInserted} pages, ${sectionsInserted} content sections`);
                  resolve();
                }
              }
            }
          );
        });
      });
    });
  });
}

migrateAllContent()
  .then(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('📚 Database connection closed');
      }
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });