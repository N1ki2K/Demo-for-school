# 🏠 Local Production Hosting Guide

## Quick Start

### Option A: Simple Setup (Recommended)
```bash
# 1. Start the application
npm run production

# 2. In another terminal, start the frontend
npm start
```

Your application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

### Option B: Using Nginx (Advanced)
1. Install Nginx: `sudo apt install nginx`
2. Copy nginx.conf to `/etc/nginx/sites-available/school-cms`
3. Enable site: `sudo ln -s /etc/nginx/sites-available/school-cms /etc/nginx/sites-enabled/`
4. Start backend: `npm run production`
5. Restart Nginx: `sudo systemctl restart nginx`

## 📋 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run production` | Start backend in production mode |
| `npm start` | Start frontend server (port 8080) |
| `npm run create-admin` | Create admin user (admin/admin123) |
| `npm run stop` | Stop backend |
| `npm run restart` | Restart backend |
| `npm run logs` | View backend logs |
| `npm run status` | Check backend status |

## 🗄️ Database Location

Your SQLite database is stored at: `backend/school.db`

**Backup your database regularly:**
```bash
cp backend/school.db backup/school.db.$(date +%Y%m%d_%H%M%S)
```

## 📁 Important Directories

- `dist/` - Built frontend files
- `backend/uploads/` - User uploaded files
- `backend/school.db` - SQLite database
- `logs/` - Application logs

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
APP_KEY=school-system-active
UPLOAD_PATH=./uploads
```

### Network Access

To access from other devices on your network:
1. Find your IP: `ip addr show | grep inet`
2. Update nginx.conf or server.js to bind to 0.0.0.0
3. Access via: `http://YOUR_IP:8080`

## 🔐 Security Recommendations

1. **Change default secrets** in backend/.env
2. **Set up firewall** if exposing to network
3. **Regular backups** of database and uploads
4. **Monitor logs** for unusual activity

## 🚀 Performance Tips

1. **SSD storage** recommended for database
2. **Regular database maintenance**: `VACUUM` command
3. **Monitor disk space** for uploads directory
4. **Use process monitoring** (PM2 handles this)

## 🛠️ Troubleshooting

### Backend won't start:
```bash
cd backend
npm run dev  # Check for errors
```

### Frontend not loading:
```bash
npm run build  # Rebuild frontend
npm start      # Restart frontend server
```

### Database issues:
```bash
# Check database file permissions
ls -la backend/school.db

# Reset database (WARNING: loses all data)
rm backend/school.db
cd backend && npm run dev  # Will recreate tables
```

### Port conflicts:
```bash
# Check what's using ports
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :8080

# Change ports in:
# - ecosystem.config.js (backend)
# - server.js (frontend)
```

## 📈 Monitoring

View real-time monitoring:
```bash
cd backend && npx pm2 monit
```

## 🔄 Updates

To update the application:
```bash
git pull origin main
npm run build
npm run restart
```