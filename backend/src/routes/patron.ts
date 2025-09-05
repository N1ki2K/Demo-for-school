import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

export interface PatronContent {
  id: number;
  section_key: string;
  title_bg?: string;
  title_en?: string;
  content_bg?: string;
  content_en?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/patron - Get all patron content
router.get('/', (req: Request, res: Response) => {
  const { lang = 'bg' } = req.query;
  
  db.all(
    'SELECT * FROM patron_content WHERE is_active = 1 ORDER BY position ASC',
    (err, rows: PatronContent[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch patron content' });
      }
      
      // Transform content based on language
      const content = rows.map(row => ({
        id: row.id,
        section_key: row.section_key,
        title: lang === 'en' ? row.title_en : row.title_bg,
        content: lang === 'en' ? row.content_en : row.content_bg,
        image_url: row.image_url,
        position: row.position,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
      
      res.json({
        success: true,
        content
      });
    }
  );
});

// GET /api/patron/admin - Get all patron content for admin (both languages)
router.get('/admin', authenticateToken, (req: AuthRequest, res: Response) => {
  db.all(
    'SELECT * FROM patron_content ORDER BY position ASC',
    (err, rows: PatronContent[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch patron content' });
      }
      
      res.json({
        success: true,
        content: rows
      });
    }
  );
});

// GET /api/patron/:id - Get specific patron content section
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM patron_content WHERE id = ?',
    [id],
    (err, row: PatronContent) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch patron content' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Patron content not found' });
      }
      
      res.json({
        success: true,
        content: row
      });
    }
  );
});

// POST /api/patron - Create new patron content section
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const { 
    section_key, 
    title_bg, 
    title_en, 
    content_bg, 
    content_en, 
    image_url, 
    position = 0 
  } = req.body;
  
  if (!section_key) {
    return res.status(400).json({ error: 'Section key is required' });
  }
  
  db.run(
    `INSERT INTO patron_content 
     (section_key, title_bg, title_en, content_bg, content_en, image_url, position, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [section_key, title_bg, title_en, content_bg, content_en, image_url, position],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Section key already exists' });
        }
        return res.status(500).json({ error: 'Failed to create patron content' });
      }
      
      res.status(201).json({
        success: true,
        message: 'Patron content created successfully',
        id: this.lastID
      });
    }
  );
});

// PUT /api/patron/:id - Update patron content section
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { 
    section_key, 
    title_bg, 
    title_en, 
    content_bg, 
    content_en, 
    image_url, 
    position,
    is_active 
  } = req.body;
  
  // Build dynamic query based on provided fields
  const fields: string[] = [];
  const values: any[] = [];
  
  if (section_key !== undefined) {
    fields.push('section_key = ?');
    values.push(section_key);
  }
  if (title_bg !== undefined) {
    fields.push('title_bg = ?');
    values.push(title_bg);
  }
  if (title_en !== undefined) {
    fields.push('title_en = ?');
    values.push(title_en);
  }
  if (content_bg !== undefined) {
    fields.push('content_bg = ?');
    values.push(content_bg);
  }
  if (content_en !== undefined) {
    fields.push('content_en = ?');
    values.push(content_en);
  }
  if (image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(image_url);
  }
  if (position !== undefined) {
    fields.push('position = ?');
    values.push(position);
  }
  if (is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(is_active);
  }
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  if (fields.length === 1) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  const query = `UPDATE patron_content SET ${fields.join(', ')} WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Section key already exists' });
      }
      return res.status(500).json({ error: 'Failed to update patron content' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Patron content not found' });
    }
    
    res.json({
      success: true,
      message: 'Patron content updated successfully'
    });
  });
});

// DELETE /api/patron/:id - Delete patron content section
router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  db.run(
    'DELETE FROM patron_content WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete patron content' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Patron content not found' });
      }
      
      res.json({
        success: true,
        message: 'Patron content deleted successfully'
      });
    }
  );
});

// PUT /api/patron/reorder - Reorder patron content sections
router.put('/reorder', authenticateToken, (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  
  if (!Array.isArray(content)) {
    return res.status(400).json({ error: 'Content array is required' });
  }
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    let hasError = false;
    let completed = 0;
    
    content.forEach((item, index) => {
      db.run(
        'UPDATE patron_content SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [index, item.id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            hasError = true;
          }
          
          completed++;
          
          if (completed === content.length) {
            if (hasError) {
              db.run('ROLLBACK');
              res.status(500).json({ error: 'Failed to reorder patron content' });
            } else {
              db.run('COMMIT');
              res.json({
                success: true,
                message: 'Patron content reordered successfully'
              });
            }
          }
        }
      );
    });
  });
});

export default router;