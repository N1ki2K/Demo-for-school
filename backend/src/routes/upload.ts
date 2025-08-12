import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload single file
router.post('/single', authenticateToken, upload.single('file'), (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const fileUrl = `/uploads/${req.file.filename}`;
    const altText = req.body.altText || '';

    // Save file info to database
    db.run(
      `INSERT INTO media_files (id, original_name, filename, mime_type, size, url, alt_text) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fileId, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, fileUrl, altText],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          // Clean up uploaded file if database insert fails
          fs.unlink(req.file!.path, (unlinkErr) => {
            if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
          });
          return res.status(500).json({ error: 'Failed to save file information' });
        }

        res.status(201).json({
          id: fileId,
          originalName: req.file!.originalname,
          filename: req.file!.filename,
          mimeType: req.file!.mimetype,
          size: req.file!.size,
          url: fileUrl,
          altText: altText,
          message: 'File uploaded successfully'
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', authenticateToken, upload.array('files', 10), (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const fileId = uuidv4();
        const fileUrl = `/uploads/${file.filename}`;
        
        db.run(
          `INSERT INTO media_files (id, original_name, filename, mime_type, size, url) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [fileId, file.originalname, file.filename, file.mimetype, file.size, fileUrl],
          function(err) {
            if (err) {
              // Clean up uploaded file if database insert fails
              fs.unlink(file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete file:', unlinkErr);
              });
              reject(err);
            } else {
              resolve({
                id: fileId,
                originalName: file.originalname,
                filename: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                url: fileUrl
              });
            }
          }
        );
      });
    });

    Promise.all(uploadPromises)
      .then((results) => {
        res.status(201).json({
          files: results,
          message: `${results.length} files uploaded successfully`
        });
      })
      .catch((error) => {
        console.error('Multiple upload error:', error);
        res.status(500).json({ error: 'Some files failed to upload' });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get all media files
router.get('/files', authenticateToken, (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  db.all(
    'SELECT * FROM media_files ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, files: MediaFile[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch media files' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM media_files', (countErr, result: any) => {
        if (countErr) {
          console.error('Count error:', countErr);
          return res.status(500).json({ error: 'Failed to get file count' });
        }

        res.json({
          files,
          pagination: {
            page,
            limit,
            total: result.total,
            pages: Math.ceil(result.total / limit)
          }
        });
      });
    }
  );
});

// Delete media file
router.delete('/files/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // First get the file info
  db.get('SELECT * FROM media_files WHERE id = ?', [id], (err, file: MediaFile) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch file' });
    }

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from database
    db.run('DELETE FROM media_files WHERE id = ?', [id], function(deleteErr) {
      if (deleteErr) {
        console.error('Delete error:', deleteErr);
        return res.status(500).json({ error: 'Failed to delete file from database' });
      }

      // Delete physical file
      const filePath = path.join(__dirname, '../../uploads', file.filename);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Failed to delete physical file:', unlinkErr);
          // Don't return error here as the database record is already deleted
        }
      });

      res.json({ message: 'File deleted successfully' });
    });
  });
});

// Update file metadata
router.put('/files/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { altText } = req.body;

  db.run(
    'UPDATE media_files SET alt_text = ? WHERE id = ?',
    [altText, id],
    function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Failed to update file metadata' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json({ message: 'File metadata updated successfully' });
    }
  );
});

export default router;