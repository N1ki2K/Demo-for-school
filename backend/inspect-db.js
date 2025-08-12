const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Inspecting CMS Database...\n');

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error fetching tables:', err);
    return;
  }
  
  console.log('📋 Tables in database:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
  
  console.log('\n👤 Checking users table:');
  db.all("SELECT id, username, email, role, created_at FROM users", (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return;
    }
    
    console.log(`   Found ${users.length} user(s):`);
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    console.log('\n📝 Checking content_sections table:');
    db.all("SELECT COUNT(*) as count FROM content_sections", (err, result) => {
      if (err) {
        console.error('Error counting content sections:', err);
        return;
      }
      console.log(`   Found ${result[0].count} content section(s)`);
      
      console.log('\n👥 Checking staff_members table:');
      db.all("SELECT COUNT(*) as count FROM staff_members", (err, result) => {
        if (err) {
          console.error('Error counting staff members:', err);
          return;
        }
        console.log(`   Found ${result[0].count} staff member(s)`);
        
        console.log('\n🖼️ Checking media_files table:');
        db.all("SELECT COUNT(*) as count FROM media_files", (err, result) => {
          if (err) {
            console.error('Error counting media files:', err);
            return;
          }
          console.log(`   Found ${result[0].count} media file(s)`);
          
          console.log('\n✅ Database inspection complete!');
          db.close();
        });
      });
    });
  });
});