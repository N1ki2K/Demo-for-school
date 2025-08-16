const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./backend/database/cms.db');

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
      { id: 'history-title_en', type: 'text', content: 'Our History', label: 'History Title (en)' },
      { id: 'history-title_bg', type: 'text', content: 'Нашата история', label: 'History Title (bg)' },
      { id: 'history-intro_en', type: 'text', content: 'Learn about our school\'s rich heritage and educational journey.', label: 'History Intro (en)' },
      { id: 'history-intro_bg', type: 'text', content: 'Научете за богатото наследство и образователния път на нашето училище.', label: 'History Intro (bg)' }
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
      { id: 'team-intro_en', type: 'text', content: 'Meet our dedicated team of educators and staff members.', label: 'Team Introduction (en)' },
      { id: 'team-intro_bg', type: 'text', content: 'Запознайте се с нашия отдаден екип от педагози и служители.', label: 'Team Introduction (bg)' }
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