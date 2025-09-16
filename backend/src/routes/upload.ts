import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { MediaFile, AuthRequest } from '../types';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Configure multer specifically for images to Pictures folder
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // From backend/dist/routes, go up to project root: ../../../
    const picturesDir = path.join(__dirname, '../../../Pictures');
    console.log('Pictures directory path:', picturesDir);
    console.log('Directory exists:', fs.existsSync(picturesDir));
    
    if (!fs.existsSync(picturesDir)) {
      console.log('Creating Pictures directory...');
      fs.mkdirSync(picturesDir, { recursive: true });
    }
    cb(null, picturesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${sanitizedName.split('.')[0]}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  }
};

const imageFilter = (req: any, file: any, cb: any) => {
  // More permissive extension matching - just check if it ends with valid image extensions
  const allowedExtensions = /\.(jpe?g|png|gif|webp|svg)$/i;
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml',
    'image/pjpeg', // Progressive JPEG
    'application/octet-stream' // Generic binary (browser fallback)
  ];
  
  const extname = allowedExtensions.test(file.originalname);
  const hasImageMime = file.mimetype.startsWith('image/');
  const isGenericBinary = file.mimetype === 'application/octet-stream';
  const mimetypeValid = hasImageMime || (isGenericBinary && extname);

  console.log('=== FILE VALIDATION DEBUG ===');
  console.log('Original filename:', file.originalname);
  console.log('File MIME type:', file.mimetype);
  console.log('Extension test result:', extname);
  console.log('Has image MIME:', hasImageMime);
  console.log('Is generic binary:', isGenericBinary);
  console.log('Final MIME valid:', mimetypeValid);
  console.log('==============================');

  // Accept if: valid image extension AND (image MIME type OR generic binary with image extension)
  if (extname && mimetypeValid) {
    console.log('✅ File accepted');
    return cb(null, true);
  } else {
    console.log('❌ File rejected');
    cb(new Error(`Invalid file type. File: ${file.originalname}, MIME: ${file.mimetype}. Extension valid: ${extname}, MIME valid: ${mimetypeValid}`));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: imageFilter
});

// Get all images from Pictures folder
router.get('/pictures', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const picturesDir = path.join(__dirname, '../../../Pictures');
    
    if (!fs.existsSync(picturesDir)) {
      fs.mkdirSync(picturesDir, { recursive: true });
    }
    
    const files = fs.readdirSync(picturesDir)
      .filter(file => {
        const filePath = path.join(picturesDir, file);
        const isFile = fs.statSync(filePath).isFile();
        const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(file);
        return isFile && isImage;
      })
      .map(file => {
        const filePath = path.join(picturesDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          url: `/Pictures/${file}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime()); // Sort by newest first

    res.json({
      images: files,
      total: files.length
    });
  } catch (error) {
    console.error('Error listing Pictures folder:', error);
    res.status(500).json({ error: 'Failed to list images from Pictures folder' });
  }
});

// Delete image from Pictures folder
router.delete('/pictures/:filename', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    const picturesDir = path.join(__dirname, '../../../Pictures');
    const filePath = path.join(picturesDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`Deleted image: ${filename}`);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Upload image to Pictures folder (Media Manager)
router.post('/image', authenticateToken, async (req: AuthRequest, res: Response) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      console.log('File uploaded successfully to Pictures folder:', req.file);
      
      const filename = req.file.filename;
      const imageUrl = `/Pictures/${filename}`;

      res.status(201).json({
        url: imageUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: 'Image uploaded successfully to Pictures folder'
      });
    } catch (error) {
      console.error('Image upload processing error:', error);
      res.status(500).json({ error: 'Image upload processing failed' });
    }
  });
});

// Upload single file
router.post('/single', authenticateToken, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const fileUrl = `/uploads/${req.file.filename}`;
    const altText = req.body.altText || '';

    // Save file info to database
    try {
      await db.execute(
        `INSERT INTO media_files (id, original_name, filename, mime_type, size, url, alt_text) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fileId, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, fileUrl, altText]
      );

      res.status(201).json({
        id: fileId,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        altText: altText,
        message: 'File uploaded successfully'
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Clean up uploaded file if database insert fails
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
      });
      res.status(500).json({ error: 'Failed to save file information' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', authenticateToken, upload.array('files', 10), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results: any[] = [];
    
    try {
      await db.beginTransaction();
      
      for (const file of files) {
        const fileId = uuidv4();
        const fileUrl = `/uploads/${file.filename}`;
        
        try {
          await db.execute(
            `INSERT INTO media_files (id, original_name, filename, mime_type, size, url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [fileId, file.originalname, file.filename, file.mimetype, file.size, fileUrl]
          );
          
          results.push({
            id: fileId,
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: fileUrl
          });
        } catch (err) {
          // Clean up uploaded file if database insert fails
          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
          });
          throw err;
        }
      }
      
      await db.commit();
      
      res.status(201).json({
        files: results,
        message: `${results.length} files uploaded successfully`
      });
    } catch (error) {
      await db.rollback();
      console.error('Multiple upload error:', error);
      res.status(500).json({ error: 'Some files failed to upload' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get all media files
router.get('/files', authenticateToken, async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  try {
    const [filesRows] = await db.execute(
      'SELECT * FROM media_files ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const files = filesRows;

    // Get total count
    const [countRows] = await db.execute('SELECT COUNT(*) as total FROM media_files');
    const countResult = (countRows as RowDataPacket[])[0];

    res.json({
      files,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
});

// Delete media file
router.delete('/files/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    // First get the file info
    const [selectRows] = await db.execute('SELECT * FROM media_files WHERE id = ?', [id]);
    const file = (selectRows as MediaFile[])[0];
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from database
    await db.execute('DELETE FROM media_files WHERE id = ?', [id]);

    // Delete physical file
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Failed to delete physical file:', unlinkErr);
        // Don't return error here as the database record is already deleted
      }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Update file metadata
router.put('/files/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { altText } = req.body;

  try {
    const [result] = await db.execute('UPDATE media_files SET alt_text = ? WHERE id = ?', [altText, id]);
    
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File metadata updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update file metadata' });
  }
});

// Configure multer specifically for documents to Documents folder
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentsDir = path.join(__dirname, '../../../Documents');
    console.log('Documents directory path:', documentsDir);
    console.log('Directory exists:', fs.existsSync(documentsDir));
    
    if (!fs.existsSync(documentsDir)) {
      console.log('Creating Documents directory...');
      fs.mkdirSync(documentsDir, { recursive: true });
    }
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${sanitizedName.split('.')[0]}-${uniqueSuffix}${extension}`);
  }
});

const documentFilter = (req: any, file: any, cb: any) => {
  const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i;
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/plain', // .txt
    'application/rtf', // .rtf
    'application/octet-stream' // Generic binary (browser fallback)
  ];
  
  const extname = allowedExtensions.test(file.originalname);
  const hasDocumentMime = allowedMimeTypes.includes(file.mimetype);
  const isGenericBinary = file.mimetype === 'application/octet-stream';
  const isPdfFile = file.originalname.toLowerCase().endsWith('.pdf');
  
  // Special handling for PDF files - be more permissive
  const mimetypeValid = hasDocumentMime || (isGenericBinary && extname) || (isPdfFile && file.mimetype.includes('pdf'));

  console.log('=== DOCUMENT VALIDATION DEBUG ===');
  console.log('Original filename:', file.originalname);
  console.log('File MIME type:', file.mimetype);
  console.log('Extension test result:', extname);
  console.log('Has document MIME:', hasDocumentMime);
  console.log('Is generic binary:', isGenericBinary);
  console.log('Is PDF file:', isPdfFile);
  console.log('Final MIME valid:', mimetypeValid);
  console.log('================================');

  if (extname && mimetypeValid) {
    console.log('✅ Document accepted');
    return cb(null, true);
  } else {
    console.log('❌ Document rejected');
    cb(new Error(`Invalid document type. File: ${file.originalname}, MIME: ${file.mimetype}. Extension valid: ${extname}, MIME valid: ${mimetypeValid}`));
  }
};

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
  },
  fileFilter: documentFilter
});

// Get all documents from Documents folder
router.get('/documents', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const documentsDir = path.join(__dirname, '../../../Documents');
    
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(documentsDir)
      .filter(file => {
        const filePath = path.join(documentsDir, file);
        const isFile = fs.statSync(filePath).isFile();
        const isDocument = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i.test(file);
        return isFile && isDocument;
      })
      .map(file => {
        const filePath = path.join(documentsDir, file);
        const stats = fs.statSync(filePath);
        const extension = path.extname(file).toLowerCase();
        
        // Determine document type
        let documentType = 'other';
        if (['.pdf'].includes(extension)) documentType = 'pdf';
        else if (['.doc', '.docx'].includes(extension)) documentType = 'word';
        else if (['.xls', '.xlsx'].includes(extension)) documentType = 'excel';
        else if (['.ppt', '.pptx'].includes(extension)) documentType = 'powerpoint';
        else if (['.txt', '.rtf'].includes(extension)) documentType = 'text';
        
        return {
          filename: file,
          url: `/Documents/${file}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          type: documentType,
          extension: extension
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime()); // Sort by newest first

    res.json({
      documents: files,
      total: files.length
    });
  } catch (error) {
    console.error('Error listing Documents folder:', error);
    res.status(500).json({ error: 'Failed to list documents from Documents folder' });
  }
});

// Delete document from Documents folder
router.delete('/documents/:filename', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    const documentsDir = path.join(__dirname, '../../../Documents');
    const filePath = path.join(documentsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`Deleted document: ${filename}`);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Upload document to Documents folder
router.post('/document', authenticateToken, async (req: AuthRequest, res: Response) => {
  uploadDocument.single('document')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No document uploaded' });
      }

      console.log('Document uploaded successfully to Documents folder:', req.file);
      
      const filename = req.file.filename;
      const documentUrl = `/Documents/${filename}`;

      res.status(201).json({
        url: documentUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: 'Document uploaded successfully to Documents folder'
      });
    } catch (error) {
      console.error('Document upload processing error:', error);
      res.status(500).json({ error: 'Document upload processing failed' });
    }
  });
});

// Configure multer specifically for presentations to Presentations folder
const presentationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const presentationsDir = path.join(__dirname, '../../../Presentations');
    console.log('Presentations directory path:', presentationsDir);
    console.log('Directory exists:', fs.existsSync(presentationsDir));
    
    if (!fs.existsSync(presentationsDir)) {
      console.log('Creating Presentations directory...');
      fs.mkdirSync(presentationsDir, { recursive: true });
    }
    cb(null, presentationsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${sanitizedName.split('.')[0]}-${uniqueSuffix}${extension}`);
  }
});

const presentationFilter = (req: any, file: any, cb: any) => {
  console.log('🔍 Filtering presentation file:', file.originalname, 'MIME:', file.mimetype);
  
  const allowedExtensions = ['.ppt', '.pptx'];
  const allowedMimes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetypeValid = allowedMimes.includes(file.mimetype);
  const extensionValid = allowedExtensions.includes(extname);
  
  console.log(`Extension: ${extname} (valid: ${extensionValid}), MIME: ${file.mimetype} (valid: ${mimetypeValid})`);
  
  if (mimetypeValid && extensionValid) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid presentation type. File: ${file.originalname}, MIME: ${file.mimetype}. Extension valid: ${extensionValid}, MIME valid: ${mimetypeValid}`));
  }
};

const uploadPresentation = multer({
  storage: presentationStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for presentations
  },
  fileFilter: presentationFilter
});

// Get all presentations from Presentations folder
router.get('/presentations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const presentationsDir = path.join(__dirname, '../../../Presentations');
    
    if (!fs.existsSync(presentationsDir)) {
      fs.mkdirSync(presentationsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(presentationsDir)
      .filter(file => {
        const filePath = path.join(presentationsDir, file);
        const isFile = fs.statSync(filePath).isFile();
        const isPresentation = /\.(ppt|pptx)$/i.test(file);
        return isFile && isPresentation;
      })
      .map(file => {
        const filePath = path.join(presentationsDir, file);
        const stats = fs.statSync(filePath);
        const extension = path.extname(file).toLowerCase();
        
        return {
          filename: file,
          url: `/Presentations/${file}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          lastModified: stats.mtime.toISOString(),
          type: 'powerpoint',
          extension: extension
        };
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    console.log(`📊 Found ${files.length} presentations in Presentations folder`);
    res.json({
      presentations: files,
      total: files.length
    });
  } catch (error) {
    console.error('Error listing Presentations folder:', error);
    res.status(500).json({ error: 'Failed to list presentations from Presentations folder' });
  }
});

// Delete presentation from Presentations folder
router.delete('/presentations/:filename', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    const presentationsDir = path.join(__dirname, '../../../Presentations');
    const filePath = path.join(presentationsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`📊 Presentation deleted: ${filename}`);
    
    res.json({ 
      message: 'Presentation deleted successfully',
      filename: filename 
    });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({ error: 'Failed to delete presentation' });
  }
});

// Upload presentation to Presentations folder
router.post('/presentation', authenticateToken, async (req: AuthRequest, res: Response) => {
  uploadPresentation.single('presentation')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No presentation uploaded' });
      }

      console.log('Presentation uploaded successfully to Presentations folder:', req.file);
      
      const filename = req.file.filename;
      const presentationUrl = `/Presentations/${filename}`;

      res.status(201).json({
        url: presentationUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: 'Presentation uploaded successfully to Presentations folder'
      });
    } catch (error) {
      console.error('Presentation upload processing error:', error);
      res.status(500).json({ error: 'Presentation upload processing failed' });
    }
  });
});

// Serve presentations from Presentations folder
router.get('/presentations/:filename', (req, res) => {
  const { filename } = req.params;
  const presentationsDir = path.join(__dirname, '../../../Presentations');
  const filePath = path.join(presentationsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Presentation not found' });
  }
  
  res.sendFile(filePath);
});

export default router;