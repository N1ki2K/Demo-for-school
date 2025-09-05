const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/cms.db');

const parentPages = [
  { id: 'school', name: 'School', path: '/school', position: 1 },
  { id: 'documents', name: 'Documents', path: '/documents', position: 2 },
  { id: 'projects', name: 'Projects', path: '/projects', position: 5 }
];

async function addParentPages() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Adding missing parent pages...');
    
    let inserted = 0;
    const total = parentPages.length;
    
    parentPages.forEach((page) => {
      db.run(
        'INSERT OR IGNORE INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) VALUES (?, ?, ?, null, ?, 1, 1)',
        [page.id, page.name, page.path, page.position],
        function(err) {
          if (err) {
            console.error(`Error inserting page ${page.name}:`, err);
            reject(err);
            return;
          }
          
          inserted++;
          console.log(`✅ Added parent page: ${page.name}`);
          
          if (inserted === total) {
            console.log('🎉 All parent pages added successfully!');
            resolve();
          }
        }
      );
    });
  });
}

addParentPages()
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
    console.error('❌ Failed to add parent pages:', error);
    process.exit(1);
  });