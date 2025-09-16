import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { ContentSection, AuthRequest } from '../types';

const router = Router();

// Get all content sections
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM content_sections WHERE is_active = true ORDER BY page_id, position');
    const sections = rows;
    res.json(sections);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch content sections' });
  }
});

// Get content sections by page
router.get('/page/:pageId', async (req: Request, res: Response) => {
  const { pageId } = req.params;
  
  try {
    let stmt;
    let sections;
    
    if (pageId === 'global') {
      // Global content includes header, footer, nav sections
      const [globalRows] = await db.execute(`SELECT * FROM content_sections 
               WHERE (id LIKE 'header-%' OR id LIKE 'footer-%' OR id LIKE 'nav-%') 
               AND is_active = true ORDER BY position`);
      sections = globalRows;
    } else if (pageId === 'home') {
      // Home content includes hero, news, features sections
      const [homeRows] = await db.execute(`SELECT * FROM content_sections 
               WHERE (id LIKE 'hero-%' OR id LIKE 'news-%' OR id LIKE 'features-%' OR id LIKE 'feature-%') 
               AND is_active = true ORDER BY position`);
      sections = homeRows;
    } else {
      // Other pages: filter by page_id or sections that start with pageId
      // Handle both exact page_id match and section id patterns
      const sectionIdPattern = `${pageId}-%`;
      const alternatePattern = `${pageId.replace(/-/g, '_')}-%`; // Also try underscore version
      
      const [pageRows] = await db.execute(`SELECT * FROM content_sections 
               WHERE (page_id = ? OR id LIKE ? OR id LIKE ?) AND is_active = true ORDER BY position`,
               [pageId, sectionIdPattern, alternatePattern]);
      sections = pageRows;
    }
    
    res.json(sections);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Get single content section
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.execute('SELECT * FROM content_sections WHERE id = ?', [id]);
    const section = (rows as ContentSection[])[0];
    
    if (!section) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    
    res.json(section);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch content section' });
  }
});

// Create or update content section
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id, type, label, content, page_id, position } = req.body;
  
  if (!type || !label || content === undefined) {
    return res.status(400).json({ error: 'Type, label, and content are required' });
  }
  
  const sectionId = id || uuidv4();
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  
  try {
    // Check if section exists
    const [checkRows] = await db.execute('SELECT id FROM content_sections WHERE id = ?', [sectionId]);
    const existing = (checkRows as RowDataPacket[])[0];
    
    if (existing) {
      // Update existing section
      await db.execute(
        `UPDATE content_sections 
         SET type = ?, label = ?, content = ?, page_id = ?, position = ?, updated_at = NOW() 
         WHERE id = ?`,
        [type, label, contentString, page_id, position || 0, sectionId]
      );
      
      res.json({ id: sectionId, message: 'Content section updated successfully' });
    } else {
      // Create new section
      await db.execute(
        `INSERT INTO content_sections (id, type, label, content, page_id, position) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sectionId, type, label, contentString, page_id, position || 0]
      );
      
      res.status(201).json({ id: sectionId, message: 'Content section created successfully' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to process content section' });
  }
});

// Update content section
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, label, content, page_id, position, is_active } = req.body;
  
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  
  try {
    const [result] = await db.execute(
      `UPDATE content_sections 
       SET type = COALESCE(?, type), 
           label = COALESCE(?, label), 
           content = COALESCE(?, content), 
           page_id = COALESCE(?, page_id), 
           position = COALESCE(?, position),
           is_active = COALESCE(?, is_active),
           updated_at = NOW() 
       WHERE id = ?`,
      [type, label, contentString, page_id, position, is_active, id]
    );
    
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    
    res.json({ message: 'Content section updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update content section' });
  }
});

// Delete content section
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.execute(
      'UPDATE content_sections SET is_active = false, updated_at = NOW() WHERE id = ?',
      [id]
    );
    
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    
    res.json({ message: 'Content section deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete content section' });
  }
});

// Bulk update content sections (for drag-and-drop reordering)
router.post('/bulk-update', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { sections } = req.body;
  
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'Sections must be an array' });
  }
  
  try {
    await db.beginTransaction();
    
    for (const section of sections) {
      await db.execute(
        'UPDATE content_sections SET position = ?, updated_at = NOW() WHERE id = ?',
        [section.position, section.id]
      );
    }
    
    await db.commit();
    res.json({ message: 'Content sections updated successfully' });
  } catch (err) {
    await db.rollback();
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Failed to update content sections' });
  }
});

export default router;