const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./database/cms.db');

const pages = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    parent_id: null,
    position: 0,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school',
    name: 'School',
    path: '/school',
    parent_id: null,
    position: 1,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school-history',
    name: 'History',
    path: '/school/history',
    parent_id: 'school',
    position: 0,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school-patron',
    name: 'Patron',
    path: '/school/patron',
    parent_id: 'school',
    position: 1,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school-team',
    name: 'Team',
    path: '/school/team',
    parent_id: 'school',
    position: 2,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school-council',
    name: 'Council',
    path: '/school/council',
    parent_id: 'school',
    position: 3,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'school-news',
    name: 'News',
    path: '/news',
    parent_id: 'school',
    position: 4,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'documents',
    name: 'Documents',
    path: '/documents',
    parent_id: null,
    position: 2,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'useful-links',
    name: 'Useful Links',
    path: '/useful-links',
    parent_id: null,
    position: 3,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'gallery',
    name: 'Gallery',
    path: '/gallery',
    parent_id: null,
    position: 4,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'projects',
    name: 'Projects',
    path: '/projects',
    parent_id: null,
    position: 5,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'projects-your-hour',
    name: 'Your Hour',
    path: '/your-hour',
    parent_id: 'projects',
    position: 0,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'contacts',
    name: 'Contacts',
    path: '/contacts',
    parent_id: null,
    position: 6,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'info-access',
    name: 'Info Access',
    path: '/info-access',
    parent_id: null,
    position: 7,
    is_active: true,
    show_in_menu: true
  },
  {
    id: 'global',
    name: 'Global (Header/Footer)',
    path: 'global',
    parent_id: null,
    position: 99,
    is_active: true,
    show_in_menu: false
  }
];

async function migratePages() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting pages migration...');
    
    // First, clear existing pages
    db.run('DELETE FROM pages', (err) => {
      if (err) {
        console.error('Error clearing pages:', err);
        reject(err);
        return;
      }
      
      console.log('🗑️  Cleared existing pages');
      
      let inserted = 0;
      const total = pages.length;
      
      // Insert each page
      pages.forEach((page, index) => {
        db.run(
          `INSERT INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            page.id,
            page.name, 
            page.path,
            page.parent_id,
            page.position,
            page.is_active ? 1 : 0,
            page.show_in_menu ? 1 : 0
          ],
          function(err) {
            if (err) {
              console.error(`Error inserting page ${page.name}:`, err);
              reject(err);
              return;
            }
            
            inserted++;
            console.log(`✅ Inserted: ${page.name} (${page.path})`);
            
            if (inserted === total) {
              console.log(`🎉 Successfully migrated ${total} pages!`);
              resolve();
            }
          }
        );
      });
    });
  });
}

migratePages()
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