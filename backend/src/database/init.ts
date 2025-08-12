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

      // Pages table for dynamic page management
      `CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        meta_description TEXT,
        is_published BOOLEAN DEFAULT 1,
        template TEXT DEFAULT 'default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    // Create default admin user
    const defaultPassword = 'admin123';
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
    
    db.run(
      'INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@school.com', hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Error seeding admin user:', err);
          reject(err);
        } else {
          console.log('✅ Database initialized with default admin user');
          console.log('📝 Default login: admin / admin123');
          resolve();
        }
      }
    );
  });
};