import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { initializeDatabase } from './database/init-mysql';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import staffRoutes from './routes/staff';
import schoolstaffRoutes from './routes/schoolstaff';
import uploadRoutes from './routes/upload';
import pagesRoutes from './routes/pages';
import imagesRoutes from './routes/images';
import newsRoutes from './routes/news';
import eventsRoutes from './routes/events';
import patronRoutes from './routes/patron';
import usefulLinksRoutes from './routes/useful-links';
import translationsRoutes from './routes/translations';
import navigationRoutes from './routes/navigation';
import healthRoutes from './routes/health';
import achievementsRoutes from './routes/achievements';
import directorsRoutes from './routes/directors';
import migrateRoutes from './routes/migrate';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'self'"],
      frameAncestors: ["'self'", "http://localhost:5173", "http://localhost:3000"],
      frameSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourschool.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve Pictures folder for CMS images
const picturesDir = path.join(__dirname, '../../Pictures');
if (!fs.existsSync(picturesDir)) {
  fs.mkdirSync(picturesDir, { recursive: true });
}
app.use('/Pictures', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(picturesDir));

// Serve Documents folder for CMS documents
const documentsDir = path.join(__dirname, '../../Documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}
app.use('/Documents', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(documentsDir));

// Serve Presentations folder for CMS presentations
const presentationsDir = path.join(__dirname, '../../Presentations');
if (!fs.existsSync(presentationsDir)) {
  fs.mkdirSync(presentationsDir, { recursive: true });
}
app.use('/Presentations', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(presentationsDir));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/schoolstaff', schoolstaffRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/patron', patronRoutes);
app.use('/api/useful-links', usefulLinksRoutes);
app.use('/api/translations', translationsRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/directors', directorsRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api', healthRoutes);

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${uploadsDir}`);
      console.log(`📸 Pictures directory: ${picturesDir}`);
      console.log(`📄 Documents directory: ${documentsDir}`);
      console.log(`📊 Presentations directory: ${presentationsDir}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();