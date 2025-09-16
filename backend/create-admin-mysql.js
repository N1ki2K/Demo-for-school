import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Get admin credentials from environment or use defaults
const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';
const email = process.env.ADMIN_EMAIL || 'admin@school.edu';

async function createAdmin() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_cms'
    });

    console.log('🔐 Creating admin user...');

    // Check if admin already exists
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('👤 Username: admin');
      console.log('🔑 Default password: admin123');
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 12);
    
    // Create admin user
    const [result] = await connection.execute(
      `INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, 'admin', NOW(), NOW())`,
      [username, email, hashedPassword]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🆔 User ID: ${result.insertId}`);
    console.log('\n⚠️  Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Tips:');
      console.log('1. Make sure MySQL is running');
      console.log('2. Check DB_USER and DB_PASSWORD in .env file');
      console.log('3. Make sure the database exists');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();