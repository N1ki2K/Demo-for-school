# School Website CMS

A complete Content Management System (CMS) for the school website with backend API, database, and admin interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
```

4. **Start the backend server:**
```bash
npm run dev
```

The backend will start on `http://localhost:3001`

### Frontend Setup

1. **Navigate to the root directory:**
```bash
cd ..
```

2. **Setup environment:**
```bash
cp .env.example .env
```

3. **Start the frontend:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 📋 Features

### Content Management
- ✅ Text content editing
- ✅ Rich text support  
- ✅ Image management
- ✅ List content
- ✅ Dynamic content sections
- ✅ Page-specific content
- ✅ Content versioning

### Staff Management
- ✅ Add/Edit/Remove staff members
- ✅ Staff photos upload
- ✅ Role management
- ✅ Director designation
- ✅ Contact information
- ✅ Bio/description
- ✅ Drag-and-drop reordering

### Media Management
- ✅ File upload (images, documents)
- ✅ Drag-and-drop upload
- ✅ File organization
- ✅ Image preview
- ✅ File size optimization
- ✅ Alt text for accessibility

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ Session management
- ✅ Role-based access control
- ✅ API security middleware

### Database
- ✅ SQLite database (development)
- ✅ Automatic table creation
- ✅ Data migration support
- ✅ Backup & restore functionality

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── index.ts          # Main server file
│   ├── database/         # Database setup and migrations
│   ├── middleware/       # Authentication & security
│   ├── routes/          # API endpoints
│   │   ├── auth.ts      # Authentication routes
│   │   ├── content.ts   # Content management
│   │   ├── staff.ts     # Staff management
│   │   └── upload.ts    # File upload
│   └── types/           # TypeScript definitions
├── uploads/             # File storage
├── database/            # SQLite database
└── package.json
```

### Frontend (React + TypeScript)
```
src/
├── services/
│   └── api.ts           # Backend API service
├── context/
│   └── CMSContext.tsx   # CMS state management
└── components/cms/      # CMS components
    ├── CMSDashboard.tsx # Main admin dashboard
    ├── ContentEditor.tsx # Content editing
    ├── StaffManagement.tsx # Staff CRUD
    ├── MediaManager.tsx # File management
    └── LoginButton.tsx  # Authentication UI
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Content Management
- `GET /api/content` - Get all content sections
- `GET /api/content/page/:pageId` - Get page content
- `POST /api/content` - Create/update content
- `PUT /api/content/:id` - Update specific content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/bulk-update` - Bulk update positions

### Staff Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member
- `POST /api/staff/reorder` - Reorder staff members

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/files` - Get media files (paginated)
- `DELETE /api/upload/files/:id` - Delete media file
- `PUT /api/upload/files/:id` - Update file metadata

## 🎨 Usage Guide

### 1. Accessing the CMS
1. Open the website in your browser
2. Click the "Login" button in the top-right corner
3. Enter admin credentials (admin/admin123)
4. Click "Edit" to enter edit mode

### 2. Managing Content
1. In edit mode, click on any editable content
2. Make your changes in the popup editor
3. Click "Save" to store changes in the database
4. Changes are immediately visible on the website

### 3. Managing Staff
1. Login to CMS and enter edit mode
2. Go to staff-related pages
3. Use the staff management interface to:
   - Add new staff members
   - Upload photos
   - Edit contact information
   - Reorder staff members

### 4. Managing Media
1. Access the CMS Dashboard
2. Go to the "Media" tab
3. Upload files by dragging and dropping
4. Organize and manage your media library

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt for secure password storage  
- **CORS Protection:** Configured for specific origins
- **File Upload Security:** File type validation and size limits
- **SQL Injection Protection:** Parameterized queries
- **XSS Protection:** Content sanitization

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables:
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret
DB_PATH=./database/cms.db
```

2. Build and start:
```bash
npm run build
npm start
```

### Frontend Deployment
1. Set production API URL:
```env
VITE_API_URL=https://your-api-domain.com/api
```

2. Build:
```bash
npm run build
```

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd ..
npm test
```

### Database Management
```bash
# View database in CLI
sqlite3 backend/database/cms.db

# Backup database
cp backend/database/cms.db backup/cms-backup-$(date +%Y%m%d).db
```

## 🆘 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if port 3001 is available
   - Verify environment variables in `.env`
   - Check database permissions

2. **Frontend can't connect to backend:**
   - Verify `VITE_API_URL` in frontend `.env`
   - Check CORS settings in backend
   - Ensure backend is running

3. **Login issues:**
   - Verify JWT_SECRET is set
   - Check database user table
   - Reset to default admin/admin123

4. **File upload fails:**
   - Check upload directory permissions
   - Verify file size limits
   - Check allowed file types

### Getting Help
- Check the browser console for error messages
- Review backend logs in the terminal
- Verify all environment variables are set correctly

## 📈 Future Enhancements

- [ ] Multi-language content management
- [ ] Advanced rich text editor (WYSIWYG)
- [ ] Image resizing and optimization
- [ ] Content scheduling/publishing
- [ ] User roles and permissions
- [ ] Audit logs and version history
- [ ] Email notifications
- [ ] Database backup automation
- [ ] CDN integration for media files
- [ ] SEO meta tag management

## 📄 License

This project is licensed under the MIT License.