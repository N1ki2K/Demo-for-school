import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { ContentSection, AuthRequest } from '../types';

const router = Router();

// Get all content sections
router.get('/', (req: Request, res: Response) => {
  db.all(
    'SELECT * FROM content_sections WHERE is_active = 1 ORDER BY page_id, position',
    (err, sections: ContentSection[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch content sections' });
      }
      res.json(sections);
    }
  );
});

// Get content sections by page
router.get('/page/:pageId', (req, res: Response) => {
  const { pageId } = req.params;
  
  // Handle 'global' and 'home' page filtering
  let query: string;
  let params: any[];
  
  if (pageId === 'global') {
    // Global content includes header, footer, nav sections
    query = `SELECT * FROM content_sections 
             WHERE (id LIKE 'header-%' OR id LIKE 'footer-%' OR id LIKE 'nav-%') 
             AND is_active = 1 ORDER BY position`;
    params = [];
  } else if (pageId === 'home') {
    // Home content includes hero, news, features sections
    query = `SELECT * FROM content_sections 
             WHERE (id LIKE 'hero-%' OR id LIKE 'news-%' OR id LIKE 'features-%' OR id LIKE 'feature-%') 
             AND is_active = 1 ORDER BY position`;
    params = [];
  } else {
    // Other pages: filter by page_id or sections that start with pageId
    // Handle both exact page_id match and section id patterns
    const sectionIdPattern = `${pageId}-%`;
    const alternatePattern = `${pageId.replace(/-/g, '_')}-%`; // Also try underscore version
    
    query = `SELECT * FROM content_sections 
             WHERE (page_id = ? OR id LIKE ? OR id LIKE ?) AND is_active = 1 ORDER BY position`;
    params = [pageId, sectionIdPattern, alternatePattern];
  }
  
  db.all(query, params, (err, sections: ContentSection[]) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch page content' });
    }
    res.json(sections);
  });
});

// Get single content section
router.get('/:id', (req, res: Response) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM content_sections WHERE id = ?',
    [id],
    (err, section: ContentSection) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch content section' });
      }
      
      if (!section) {
        return res.status(404).json({ error: 'Content section not found' });
      }
      
      res.json(section);
    }
  );
});

// Create or update content section
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id, type, label, content, page_id, position } = req.body;
  
  if (!type || !label || content === undefined) {
    return res.status(400).json({ error: 'Type, label, and content are required' });
  }
  
  const sectionId = id || uuidv4();
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  
  // Check if section exists
  db.get('SELECT id FROM content_sections WHERE id = ?', [sectionId], (err, existing) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (existing) {
      // Update existing section
      db.run(
        `UPDATE content_sections 
         SET type = ?, label = ?, content = ?, page_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [type, label, contentString, page_id, position || 0, sectionId],
        function(updateErr) {
          if (updateErr) {
            console.error('Update error:', updateErr);
            return res.status(500).json({ error: 'Failed to update content section' });
          }
          
          res.json({ id: sectionId, message: 'Content section updated successfully' });
        }
      );
    } else {
      // Create new section
      db.run(
        `INSERT INTO content_sections (id, type, label, content, page_id, position) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sectionId, type, label, contentString, page_id, position || 0],
        function(insertErr) {
          if (insertErr) {
            console.error('Insert error:', insertErr);
            return res.status(500).json({ error: 'Failed to create content section' });
          }
          
          res.status(201).json({ id: sectionId, message: 'Content section created successfully' });
        }
      );
    }
  });
});

// Update content section
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, label, content, page_id, position, is_active } = req.body;
  
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  
  db.run(
    `UPDATE content_sections 
     SET type = COALESCE(?, type), 
         label = COALESCE(?, label), 
         content = COALESCE(?, content), 
         page_id = COALESCE(?, page_id), 
         position = COALESCE(?, position),
         is_active = COALESCE(?, is_active),
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [type, label, contentString, page_id, position, is_active, id],
    function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Failed to update content section' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Content section not found' });
      }
      
      res.json({ message: 'Content section updated successfully' });
    }
  );
});

// Delete content section
router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE content_sections SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ error: 'Failed to delete content section' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Content section not found' });
      }
      
      res.json({ message: 'Content section deleted successfully' });
    }
  );
});

// Bulk update content sections (for drag-and-drop reordering)
router.post('/bulk-update', authenticateToken, (req: AuthRequest, res: Response) => {
  const { sections } = req.body;
  
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'Sections must be an array' });
  }
  
  const updatePromises = sections.map((section: any) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE content_sections SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [section.position, section.id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  });
  
  Promise.all(updatePromises)
    .then(() => {
      res.json({ message: 'Content sections updated successfully' });
    })
    .catch((err) => {
      console.error('Bulk update error:', err);
      res.status(500).json({ error: 'Failed to update content sections' });
    });
});

export default router;