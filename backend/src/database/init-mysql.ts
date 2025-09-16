import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export let db: mysql.Connection;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // First, connect to MySQL server to create database if needed
    const serverConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'school_cms';
    await serverConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await serverConnection.end();

    // Now connect to the specific database
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      charset: 'utf8mb4',
      timezone: 'Z'
    });

    console.log('🔗 Connected to MySQL database');
    
    await createTables();
    await seedInitialData();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  const tables = [
    // Users table for authentication
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Content sections table
    `CREATE TABLE IF NOT EXISTS content_sections (
      id VARCHAR(255) PRIMARY KEY,
      type ENUM('text', 'image', 'list', 'table', 'rich_text') NOT NULL,
      label VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      page_id VARCHAR(255),
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Staff members table
    `CREATE TABLE IF NOT EXISTS staff_members (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      role VARCHAR(500) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      bio TEXT,
      image_url TEXT,
      is_director BOOLEAN DEFAULT false,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Pages table for navigation management
    `CREATE TABLE IF NOT EXISTS pages (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      path VARCHAR(500) UNIQUE NOT NULL,
      parent_id VARCHAR(255),
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      show_in_menu BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES pages (id) ON DELETE CASCADE
    )`,

    // Media files table
    `CREATE TABLE IF NOT EXISTS media_files (
      id VARCHAR(255) PRIMARY KEY,
      original_name VARCHAR(500) NOT NULL,
      filename VARCHAR(500) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size BIGINT NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Settings table for site configuration
    `CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(255) PRIMARY KEY,
      value TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'string',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // School staff table (separate from staff_members)
    `CREATE TABLE IF NOT EXISTS schoolstaff (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      role VARCHAR(500) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      bio TEXT,
      image_url TEXT,
      is_director BOOLEAN DEFAULT false,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Images mapping table
    `CREATE TABLE IF NOT EXISTS images (
      id VARCHAR(255) PRIMARY KEY,
      filename VARCHAR(500) NOT NULL,
      original_name VARCHAR(500),
      url TEXT NOT NULL,
      alt_text TEXT,
      page_id VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Staff profile images table
    `CREATE TABLE IF NOT EXISTS staff_images (
      staff_id VARCHAR(255) PRIMARY KEY,
      image_filename VARCHAR(500) NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (staff_id) REFERENCES schoolstaff (id) ON DELETE CASCADE
    )`,

    // News articles table
    `CREATE TABLE IF NOT EXISTS news (
      id VARCHAR(255) PRIMARY KEY,
      title_bg VARCHAR(1000) NOT NULL,
      title_en VARCHAR(1000) NOT NULL,
      excerpt_bg TEXT NOT NULL,
      excerpt_en TEXT NOT NULL,
      content_bg LONGTEXT,
      content_en LONGTEXT,
      featured_image_url TEXT,
      featured_image_alt TEXT,
      is_published BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Translatable text content table
    `CREATE TABLE IF NOT EXISTS translations (
      id VARCHAR(255) PRIMARY KEY,
      key_path VARCHAR(500) NOT NULL UNIQUE,
      text_bg TEXT,
      text_en TEXT,
      description TEXT,
      category VARCHAR(100) DEFAULT 'general',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Events table for calendar functionality
    `CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title_bg VARCHAR(1000) NOT NULL,
      title_en VARCHAR(1000) NOT NULL,
      description_bg TEXT,
      description_en TEXT,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      location VARCHAR(500),
      is_public BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Patron content table
    `CREATE TABLE IF NOT EXISTS patron_content (
      id VARCHAR(255) PRIMARY KEY,
      section_key VARCHAR(255) NOT NULL,
      title_bg VARCHAR(1000),
      title_en VARCHAR(1000),
      content_bg LONGTEXT,
      content_en LONGTEXT,
      image_url TEXT,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Useful links table
    `CREATE TABLE IF NOT EXISTS useful_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      link_key VARCHAR(255) NOT NULL UNIQUE,
      title_bg VARCHAR(1000) NOT NULL,
      title_en VARCHAR(1000) NOT NULL,
      description_bg TEXT,
      description_en TEXT,
      url TEXT NOT NULL,
      cta_bg VARCHAR(255),
      cta_en VARCHAR(255),
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Useful links content sections table
    `CREATE TABLE IF NOT EXISTS useful_links_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(255) NOT NULL UNIQUE,
      title_bg VARCHAR(1000),
      title_en VARCHAR(1000),
      content_bg LONGTEXT,
      content_en LONGTEXT,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Navigation menu items table
    `CREATE TABLE IF NOT EXISTS navigation_items (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      path VARCHAR(500) NOT NULL,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      parent_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES navigation_items(id) ON DELETE CASCADE
    )`,

    // School achievements table
    `CREATE TABLE IF NOT EXISTS school_achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(1000) NOT NULL,
      description TEXT,
      year INT,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // School directors table
    `CREATE TABLE IF NOT EXISTS school_directors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      tenure_start DATETIME,
      tenure_end DATETIME,
      description TEXT,
      position INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of tables) {
    try {
      await db.execute(sql);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }
  
  console.log('📋 Database tables created successfully');
};

const seedInitialData = async (): Promise<void> => {
  try {
    // Check if admin user already exists
    const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if ((rows as any[]).length === 0) {
      console.log('⚠️  No admin user found. Please create one using the backend admin setup.');
      console.log('   Set environment variables: ADMIN_USERNAME and ADMIN_PASSWORD');
    } else {
      console.log('✅ Admin user exists');
    }
    
    // Seed default pages and navigation
    await Promise.all([seedPages(), seedNavigationItems()]);
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
};

const seedPages = async (): Promise<void> => {
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

  for (const page of defaultPages) {
    try {
      await db.execute(
        `INSERT IGNORE INTO pages (id, name, path, parent_id, position, is_active, show_in_menu) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [page.id, page.name, page.path, page.parent_id, page.position, page.is_active, page.show_in_menu]
      );
    } catch (error) {
      console.error(`Error seeding page ${page.name}:`, error);
    }
  }
  
  console.log('📄 Default pages seeded successfully');
};

const seedNavigationItems = async (): Promise<void> => {
  const defaultNavItems = [
    { id: 'documents', title: 'Documents', path: '/documents', position: 0, is_active: 1, parent_id: null },
    { id: 'projects', title: 'Projects', path: '/projects', position: 1, is_active: 1, parent_id: null }
  ];

  const now = new Date();
  
  for (const item of defaultNavItems) {
    try {
      await db.execute(
        `INSERT IGNORE INTO navigation_items (id, title, path, position, is_active, parent_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.title, item.path, item.position, item.is_active, item.parent_id, now, now]
      );
    } catch (error) {
      console.error(`Error seeding navigation item ${item.title}:`, error);
    }
  }
  
  console.log('🧭 Default navigation items seeded successfully');
};