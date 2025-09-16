# 🗄️ MySQL Database Setup Guide

## 🔄 Migration from SQLite to MySQL

Your School CMS has been converted to use MySQL instead of SQLite for better hosting compatibility.

## 📋 Quick Setup Steps

### 1. **Install MySQL**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (with Homebrew)
brew install mysql

# Start MySQL service
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS
```

### 2. **Configure MySQL Database**
```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE school_cms;
CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON school_cms.* TO 'school_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. **Update Environment Variables**
Edit `backend/.env` file:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=school_cms
DB_USER=school_user
DB_PASSWORD=your_secure_password
```

### 4. **Run Migration** (If you have existing SQLite data)
```bash
npm run migrate-to-mysql
```

### 5. **Initialize Database**
```bash
npm run production  # This will create all tables
npm run create-admin  # Create admin user
```

## 🌐 Hosting Provider Setup

### **For cPanel Hosting:**
1. **Create MySQL Database** in cPanel
2. **Note the connection details:**
   - Database Host (usually localhost)
   - Database Name
   - Username
   - Password

3. **Update .env for production:**
```env
DB_HOST=your_host
DB_PORT=3306
DB_NAME=your_db_name
DB_USER=your_username
DB_PASSWORD=your_password
```

### **For Cloud Hosting (AWS RDS, Google Cloud SQL, etc.):**
1. **Create MySQL instance**
2. **Configure security groups** to allow connections
3. **Update .env with provided connection string**

## 📊 Database Schema

The MySQL version includes all the same tables as SQLite:

- **users** - Admin authentication
- **content_sections** - Page content management
- **staff_members** - Staff directory
- **schoolstaff** - School-specific staff
- **pages** - Navigation and page structure
- **news** - News articles (bilingual)
- **events** - School calendar events
- **patron_content** - Patron page content
- **useful_links** - External links management
- **translations** - Translation strings
- **navigation_items** - Menu structure
- **school_achievements** - Achievement records
- **school_directors** - Director history
- **media_files** - File management
- **images** - Image mapping
- **settings** - System configuration

## 🔧 Key Differences from SQLite

### **Data Types:**
- `INTEGER` → `INT`
- `TEXT` → `VARCHAR(255)` / `TEXT` / `LONGTEXT`
- `BOOLEAN` → `BOOLEAN` (true/false instead of 1/0)
- `DATETIME` → `TIMESTAMP` / `DATETIME`

### **Functions:**
- `datetime('now')` → `NOW()`
- `CURRENT_TIMESTAMP` → `NOW()`

### **Boolean Values:**
- SQLite: `1`/`0`
- MySQL: `true`/`false`

## 🛠️ Commands Reference

| Command | Description |
|---------|-------------|
| `npm run migrate-to-mysql` | Migrate data from SQLite to MySQL |
| `npm run create-admin` | Create admin user in MySQL |
| `npm run production` | Start backend with MySQL |
| `npm start` | Start frontend server |

## 🔍 Troubleshooting

### **Connection Issues:**
```bash
# Test MySQL connection
mysql -u school_user -p school_cms

# Check if MySQL is running
sudo systemctl status mysql
```

### **Permission Issues:**
```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON school_cms.* TO 'school_user'@'%';
FLUSH PRIVILEGES;
```

### **Character Set Issues:**
```sql
-- Set UTF8 encoding
ALTER DATABASE school_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📁 File Structure Changes

```
backend/
├── src/
│   ├── database/
│   │   ├── init.ts           # ❌ Old SQLite version
│   │   └── init-mysql.ts     # ✅ New MySQL version
│   └── routes/               # ✅ Updated for MySQL2
├── create-admin.js           # ❌ Old SQLite script
├── create-admin-mysql.js     # ✅ New MySQL script
└── school.db                 # ❌ Old SQLite file (backup)

migrate-to-mysql.js           # ✅ Migration script
```

## 🔐 Security Notes

1. **Change default passwords** immediately
2. **Use strong database passwords**
3. **Limit database user permissions**
4. **Enable SSL** for remote connections
5. **Regular backups** of MySQL database

## 📈 Performance Tips

1. **Add indexes** for frequently queried columns
2. **Use connection pooling** in production
3. **Monitor query performance**
4. **Regular OPTIMIZE TABLE** maintenance

Your School CMS is now ready for any hosting provider that supports MySQL! 🚀