import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Connect to database
const dbPath = path.join(process.cwd(), 'backend', 'school.db');
const db = new Database(dbPath);

// Get admin credentials from environment or prompt
const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';
const email = process.env.ADMIN_EMAIL || 'admin@school.edu';

console.log('🔐 Creating admin user...');

try {
  // Check if admin already exists
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  
  if (existingUser) {
    console.log('⚠️  Admin user already exists!');
    process.exit(0);
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 12);
  
  // Create admin user
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, 'admin', datetime('now'), datetime('now'))
  `);
  
  const result = stmt.run(username, email, hashedPassword);
  
  console.log('✅ Admin user created successfully!');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Username: ${username}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`🆔 User ID: ${result.lastInsertRowid}`);
  console.log('\n⚠️  Please change the default password after first login!');
  
} catch (error) {
  console.error('❌ Error creating admin user:', error);
  process.exit(1);
} finally {
  db.close();
}