import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateData() {
  let mysqlConnection;
  let sqliteDb;
  
  try {
    // Connect to SQLite
    const sqlitePath = path.join(__dirname, 'backend', 'school.db');
    sqliteDb = new Database(sqlitePath);
    console.log('📂 Connected to SQLite database');

    // Connect to MySQL
    mysqlConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_cms'
    });
    console.log('🔗 Connected to MySQL database');

    // Tables to migrate (in order to respect foreign keys)
    const tablesToMigrate = [
      'users',
      'pages',
      'content_sections',
      'staff_members',
      'schoolstaff',
      'staff_images',
      'media_files',
      'images',
      'news',
      'translations',
      'events',
      'patron_content',
      'useful_links',
      'useful_links_content',
      'navigation_items',
      'school_achievements',
      'school_directors',
      'settings'
    ];

    let totalRecords = 0;

    for (const tableName of tablesToMigrate) {
      try {
        // Check if table exists in SQLite
        const tableInfo = sqliteDb.prepare(
          `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
        ).get(tableName);

        if (!tableInfo) {
          console.log(`⚠️  Table ${tableName} not found in SQLite, skipping...`);
          continue;
        }

        // Get all data from SQLite
        const sqliteData = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
        
        if (sqliteData.length === 0) {
          console.log(`📭 Table ${tableName}: No data to migrate`);
          continue;
        }

        console.log(`🔄 Migrating ${tableName}: ${sqliteData.length} records...`);

        // Clear existing data in MySQL (be careful with this!)
        await mysqlConnection.execute(`DELETE FROM ${tableName}`);

        // Get column info for INSERT statement
        const columns = Object.keys(sqliteData[0]);
        const placeholders = columns.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

        // Insert data in batches
        const batchSize = 100;
        for (let i = 0; i < sqliteData.length; i += batchSize) {
          const batch = sqliteData.slice(i, i + batchSize);
          
          for (const row of batch) {
            const values = columns.map(col => {
              let value = row[col];
              
              // Handle boolean conversion (SQLite uses 0/1, MySQL uses true/false)
              if (columns.includes('is_active') || columns.includes('is_published') || 
                  columns.includes('is_featured') || columns.includes('is_director') || 
                  columns.includes('show_in_menu') || columns.includes('is_public')) {
                if (col.startsWith('is_') || col === 'show_in_menu' || col === 'is_public') {
                  value = value === 1 ? true : false;
                }
              }

              return value;
            });
            
            await mysqlConnection.execute(insertQuery, values);
          }
        }

        totalRecords += sqliteData.length;
        console.log(`✅ Table ${tableName}: ${sqliteData.length} records migrated`);

      } catch (error) {
        console.error(`❌ Error migrating table ${tableName}:`, error.message);
        // Continue with other tables
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Total records migrated: ${totalRecords}`);
    console.log(`\n🔄 Next steps:`);
    console.log(`1. Test the application with MySQL`);
    console.log(`2. Update your hosting provider's database connection`);
    console.log(`3. Backup the SQLite file as fallback`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database connection tips:');
      console.log('1. Make sure MySQL is running');
      console.log('2. Check your .env file for correct MySQL credentials');
      console.log('3. Create the database first if it doesn\'t exist');
    }
    
    process.exit(1);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    if (sqliteDb) {
      sqliteDb.close();
    }
  }
}

// Check if .env file exists and load it
try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: './backend/.env' });
} catch (error) {
  console.log('⚠️  Could not load .env file, using default values');
}

migrateData();