import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DB_PATH || './database/cms.db';
const dbDir = path.dirname(dbPath);

export let db: sqlite3.Database;

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('📊 Connected to SQLite database');
        createTables().then(resolve).catch(reject);
      }
    });
  });
};

const createTables = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Users table for authentication
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Content sections table
      `CREATE TABLE IF NOT EXISTS content_sections (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN ('text', 'image', 'list', 'table', 'rich_text')),
        label TEXT NOT NULL,
        content TEXT NOT NULL,
        page_id TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Staff members table
      `CREATE TABLE IF NOT EXISTS staff_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        bio TEXT,
        image_url TEXT,
        is_director BOOLEAN DEFAULT 0,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Pages table for navigation management
      `CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT UNIQUE NOT NULL,
        parent_id TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        show_in_menu BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES pages (id) ON DELETE CASCADE
      )`,

      // Media files table
      `CREATE TABLE IF NOT EXISTS media_files (
        id TEXT PRIMARY KEY,
        original_name TEXT NOT NULL,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        url TEXT NOT NULL,
        alt_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Settings table for site configuration
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'string',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // School staff table (separate from staff_members)
      `CREATE TABLE IF NOT EXISTS schoolstaff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        bio TEXT,
        image_url TEXT,
        is_director BOOLEAN DEFAULT 0,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Images mapping table
      `CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT,
        url TEXT NOT NULL,
        alt_text TEXT,
        page_id TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Staff profile images table
      `CREATE TABLE IF NOT EXISTS staff_images (
        staff_id TEXT PRIMARY KEY,
        image_filename TEXT NOT NULL,
        image_url TEXT NOT NULL,
        alt_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES schoolstaff (id) ON DELETE CASCADE
      )`,

      // News articles table
      `CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title_bg TEXT NOT NULL,
        title_en TEXT NOT NULL,
        excerpt_bg TEXT NOT NULL,
        excerpt_en TEXT NOT NULL,
        content_bg TEXT,
        content_en TEXT,
        featured_image_url TEXT,
        featured_image_alt TEXT,
        is_published BOOLEAN DEFAULT 1,
        is_featured BOOLEAN DEFAULT 0,
        published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Translatable text content table
      `CREATE TABLE IF NOT EXISTS translations (
        id TEXT PRIMARY KEY,
        key_path TEXT NOT NULL UNIQUE,
        text_bg TEXT,
        text_en TEXT,
        description TEXT,
        category TEXT DEFAULT 'general',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Events table for calendar functionality
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_bg TEXT NOT NULL,
        title_en TEXT NOT NULL,
        description_bg TEXT,
        description_en TEXT,
        start_date DATETIME NOT NULL,
        end_date DATETIME,
        location TEXT,
        is_public BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Patron content table
      `CREATE TABLE IF NOT EXISTS patron_content (
        id TEXT PRIMARY KEY,
        section_key TEXT NOT NULL,
        title_bg TEXT,
        title_en TEXT,
        content_bg TEXT,
        content_en TEXT,
        image_url TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Useful links table
      `CREATE TABLE IF NOT EXISTS useful_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_key TEXT NOT NULL UNIQUE,
        title_bg TEXT NOT NULL,
        title_en TEXT NOT NULL,
        description_bg TEXT,
        description_en TEXT,
        url TEXT NOT NULL,
        cta_bg TEXT,
        cta_en TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Useful links content sections table
      `CREATE TABLE IF NOT EXISTS useful_links_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_key TEXT NOT NULL UNIQUE,
        title_bg TEXT,
        title_en TEXT,
        content_bg TEXT,
        content_en TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    let completed = 0;
    const total = tables.length;

    tables.forEach((sql) => {
      db.run(sql, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
        } else {
          completed++;
          if (completed === total) {
            seedInitialData().then(resolve).catch(reject);
          }
        }
      });
    });
  });
};

const seedInitialData = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if admin user already exists
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        console.error('Error checking for admin user:', err);
        reject(err);
      } else if (!row) {
        console.log('⚠️  No admin user found. Please create one using the backend admin setup.');
        console.log('   Set environment variables: ADMIN_USERNAME and ADMIN_PASSWORD');
      } else {
        console.log('✅ Database initialized');
      }
      
      // Seed default pages
      seedPages().then(resolve).catch(reject);
    });
  });
};

const seedPages = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const defaultPages = [
      { id: 'home', name: 'Home', path: '/', parent_id: null, position: 0, is_active: 1, show_in_menu: 1 },
      { id: 'school', name: 'School', path: '/school', parent_id: null, position: 1, is_active: 1, show_in_menu: 1 },
      { id: 'school-history', name: 'History', path: '/history', parent_id: 'school', position: 0, is_active: 1, show_in_menu: 1 },
      { id: 'school-patron', name: 'Patron', path: '/patron', parent_id: 'school', position: 1, is_active: 1, show_in_menu: 1 },
      { id: 'school-team', name: 'Team', path: '/team', parent_id: 'school', position: 2, is_active: 1, show_in_menu: 1 },
      { id: 'school-council', name: 'Council', path: '/council', parent_id: 'school', position: 3, is_active: 1, show_in_menu: 1 },
      { id: 'documents', name: 'Documents', path: '/documents', parent_id: null, position: 2, is_active: 1, show_in_menu: 1 },
      { id: 'documents-calendar', name: 'Calendar', path: '/calendar', parent_id: 'documents', position: 0, is_active: 1, show_in_menu: 1 },
      { id: 'documents-schedules', name: 'Schedules', path: '/schedules', parent_id: 'documents', position: 1, is_active: 1, show_in_menu: 1 },
      { id: 'useful-links', name: 'Useful Links', path: '/useful-links', parent_id: null, position: 3, is_active: 1, show_in_menu: 1 },
      { id: 'gallery', name: 'Gallery', path: '/gallery', parent_id: null, position: 4, is_active: 1, show_in_menu: 1 },
      { id: 'projects', name: 'Projects', path: '/projects', parent_id: null, position: 5, is_active: 1, show_in_menu: 1 },
      { id: 'projects-your-hour', name: 'Your Hour', path: '/your-hour', parent_id: 'projects', position: 0, is_active: 1, show_in_menu: 1 },
      { id: 'contacts', name: 'Contacts', path: '/contacts', parent_id: null, position: 6, is_active: 1, show_in_menu: 1 },
      { id: 'info-access', name: 'Info Access', path: '/info-access', parent_id: null, position: 7, is_active: 1, show_in_menu: 1 },
      { id: 'global', name: 'Global (Header/Footer)', path: 'global', parent_id: null, position: 99, is_active: 1, show_in_menu: 0 }
    ];

    let inserted = 0;
    const total = defaultPages.length;

    defaultPages.forEach((page) => {
      db.run(
        'INSERT OR IGNORE INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [page.id, page.name, page.path, page.parent_id, page.position, page.is_active, page.show_in_menu],
        function(err) {
          if (err) {
            console.error(`Error seeding page ${page.name}:`, err);
            reject(err);
          } else {
            inserted++;
            if (inserted === total) {
              console.log('📄 Default pages seeded successfully');
              resolve();
            }
          }
        }
      );
    });
  });
};