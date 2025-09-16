import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

export interface PatronContent extends RowDataPacket {
  id: string;
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
router.get('/', async (req: Request, res: Response) => {
  const { lang = 'bg' } = req.query;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM patron_content WHERE is_active = true ORDER BY position ASC'
    );
    const patronContent = rows as PatronContent[];

    const content = patronContent.map(row => ({
      id: row.id,
      section_key: row.section_key,
      title: lang === 'en' ? row.title_en : row.title_bg,
      content: lang === 'en' ? row.content_en : row.content_bg,
      image_url: row.image_url,
      position: row.position,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    res.json({ success: true, content });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch patron content' });
  }
});

// GET /api/patron/admin - Get all patron content for admin (both languages)
router.get('/admin', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM patron_content ORDER BY position ASC'
    );
    const patronContent = rows as PatronContent[];
    res.json({ success: true, content: patronContent });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch patron content' });
  }
});

// GET /api/patron/:id - Get specific patron content section
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM patron_content WHERE id = ?',
      [id]
    );
    const row = (rows as PatronContent[])[0];
    if (!row) {
      return res.status(404).json({ error: 'Patron content not found' });
    }
    res.json({ success: true, content: row });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch patron content' });
  }
});

// POST /api/patron - Create new patron content
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id, section_key, title_bg, title_en, content_bg, content_en, image_url, position = 0 } = req.body;

  if (!id || !section_key) {
    return res.status(400).json({ error: 'ID and section_key are required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO patron_content 
       (id, section_key, title_bg, title_en, content_bg, content_en, image_url, position, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
      [id, section_key, title_bg, title_en, content_bg, content_en, image_url, position]
    );
    
    const [newRows] = await db.execute(
      'SELECT * FROM patron_content WHERE id = ?',
      [id]
    );
    const newContent = (newRows as PatronContent[])[0];
    
    res.status(201).json({
      success: true,
      message: 'Patron content created successfully',
      content: newContent
    });
  } catch (err: any) {
    console.error('Database error:', err);
    if ((err as any).code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Patron content with this ID already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create patron content' });
    }
  }
});

// PUT /api/patron/:id - Update patron content
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { section_key, title_bg, title_en, content_bg, content_en, image_url, position, is_active } = req.body;

  const updates: string[] = [];
  const values: any[] = [];

  if (section_key !== undefined) {
    updates.push('section_key = ?');
    values.push(section_key);
  }
  if (title_bg !== undefined) {
    updates.push('title_bg = ?');
    values.push(title_bg);
  }
  if (title_en !== undefined) {
    updates.push('title_en = ?');
    values.push(title_en);
  }
  if (content_bg !== undefined) {
    updates.push('content_bg = ?');
    values.push(content_bg);
  }
  if (content_en !== undefined) {
    updates.push('content_en = ?');
    values.push(content_en);
  }
  if (image_url !== undefined) {
    updates.push('image_url = ?');
    values.push(image_url);
  }
  if (position !== undefined) {
    updates.push('position = ?');
    values.push(position);
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(is_active);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  const query = `UPDATE patron_content SET ${updates.join(', ')} WHERE id = ?`;

  try {
    const [result] = await db.execute(query, values);
    
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Patron content not found' });
    }

    const [updatedRows] = await db.execute(
      'SELECT * FROM patron_content WHERE id = ?',
      [id]
    );
    const updatedContent = (updatedRows as PatronContent[])[0];

    res.json({
      success: true,
      message: 'Patron content updated successfully',
      content: updatedContent
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update patron content' });
  }
});

// DELETE /api/patron/:id - Delete patron content
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'UPDATE patron_content SET is_active = false, updated_at = NOW() WHERE id = ?',
      [id]
    );
    
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Patron content not found' });
    }

    res.json({
      success: true,
      message: 'Patron content deleted successfully'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete patron content' });
  }
});

// POST /api/patron/bulk-update - Bulk update patron content positions
router.post('/bulk-update', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array' });
  }

  try {
    await db.beginTransaction();
    
    for (const item of items) {
      if (!item.id || item.position === undefined) {
        await db.rollback();
        return res.status(400).json({ error: 'Each item must have id and position' });
      }
      
      await db.execute(
        'UPDATE patron_content SET position = ?, updated_at = NOW() WHERE id = ?',
        [item.position, item.id]
      );
    }
    
    await db.commit();
    res.json({
      success: true,
      message: 'Patron content positions updated successfully'
    });
  } catch (err) {
    await db.rollback();
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update patron content positions' });
  }
});

export default router;