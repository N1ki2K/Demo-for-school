import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

export let db: Database.Database;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Connect to SQLite database
    const dbPath = path.join(process.cwd(), 'school.db');
    db = new Database(dbPath);
    
    console.log('🔗 Connected to SQLite database');
    
    createTables();
    seedInitialData();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

const createTables = (): void => {
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
      type TEXT CHECK (type IN ('text', 'image', 'list', 'table', 'rich_text')) NOT NULL,
      label TEXT NOT NULL,
      content TEXT NOT NULL,
      page_id TEXT,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
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
      is_director INTEGER DEFAULT 0,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
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
      is_active INTEGER DEFAULT 1,
      show_in_menu INTEGER DEFAULT 1,
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
      is_director INTEGER DEFAULT 0,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
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
      is_published INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
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
      is_active INTEGER DEFAULT 1,
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
      is_public INTEGER DEFAULT 1,
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
      is_active INTEGER DEFAULT 1,
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
      is_active INTEGER DEFAULT 1,
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
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Navigation menu items table
    `CREATE TABLE IF NOT EXISTS navigation_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      path TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      parent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES navigation_items(id) ON DELETE CASCADE
    )`,

    // School achievements table
    `CREATE TABLE IF NOT EXISTS school_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      year INTEGER,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // School directors table
    `CREATE TABLE IF NOT EXISTS school_directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tenure_start DATETIME,
      tenure_end DATETIME,
      description TEXT,
      position INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of tables) {
    try {
      db.exec(sql);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }
  
  console.log('📋 Database tables created successfully');
};

const seedInitialData = (): void => {
  try {
    // Check if admin user already exists
    const rows = db.prepare('SELECT id FROM users WHERE username = ?').all('admin');
    
    if (rows.length === 0) {
      console.log('⚠️  No admin user found. Please create one using the backend admin setup.');
      console.log('   Set environment variables: ADMIN_USERNAME and ADMIN_PASSWORD');
    } else {
      console.log('✅ Admin user exists');
    }
    
    // Seed default pages and navigation
    seedPages();
    seedNavigationItems();
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
};

const seedPages = (): void => {
  const defaultPages = [
    { id: 'home', name: 'Home', path: '/', parent_id: null, position: 0, is_active: 1, show_in_menu: 1 },
    { id: 'school', name: 'School', path: '/school', parent_id: null, position: 1, is_active: 1, show_in_menu: 1 },
    { id: 'school-history', name: 'History', path: '/school/history', parent_id: 'school', position: 0, is_active: 1, show_in_menu: 1 },
    { id: 'school-patron', name: 'Patron', path: '/school/patron', parent_id: 'school', position: 1, is_active: 1, show_in_menu: 1 },
    { id: 'school-team', name: 'Team', path: '/school/team', parent_id: 'school', position: 2, is_active: 1, show_in_menu: 1 },
    { id: 'school-council', name: 'Council', path: '/school/council', parent_id: 'school', position: 3, is_active: 1, show_in_menu: 1 },
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

  const insertPage = db.prepare(
    `INSERT OR IGNORE INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  for (const page of defaultPages) {
    try {
      insertPage.run(page.id, page.name, page.path, page.parent_id, page.position, page.is_active, page.show_in_menu);
    } catch (error) {
      console.error(`Error seeding page ${page.name}:`, error);
    }
  }
  
  console.log('📄 Default pages seeded successfully');
};

const seedNavigationItems = (): void => {
  const defaultNavItems = [
    { id: 'documents', title: 'Documents', path: '/documents', position: 0, is_active: 1, parent_id: null },
    { id: 'projects', title: 'Projects', path: '/projects', position: 1, is_active: 1, parent_id: null }
  ];

  const now = new Date().toISOString();
  const insertNavItem = db.prepare(
    `INSERT OR IGNORE INTO navigation_items (id, title, path, position, is_active, parent_id, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  
  for (const item of defaultNavItems) {
    try {
      insertNavItem.run(item.id, item.title, item.path, item.position, item.is_active, item.parent_id, now, now);
    } catch (error) {
      console.error(`Error seeding navigation item ${item.title}:`, error);
    }
  }
  
  console.log('🧭 Default navigation items seeded successfully');
};