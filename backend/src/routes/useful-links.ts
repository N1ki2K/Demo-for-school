import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

export interface UsefulLink extends RowDataPacket {
  id: number;
  link_key: string;
  title_bg: string;
  title_en: string;
  description_bg?: string;
  description_en?: string;
  url: string;
  cta_bg?: string;
  cta_en?: string;
  position: number;
  is_active: boolean;
}

export interface UsefulLinksContent extends RowDataPacket {
  id: number;
  section_key: string;
  title_bg?: string;
  title_en?: string;
  content_bg?: string;
  content_en?: string;
  position: number;
  is_active: boolean;
}

// GET /api/useful-links - Get all useful links and content
router.get('/', async (req: Request, res: Response) => {
  const { lang = 'bg' } = req.query;
  try {
    const [linksRows] = await db.execute(
      'SELECT * FROM useful_links WHERE is_active = true ORDER BY position ASC'
    );
    const [contentRows] = await db.execute(
      'SELECT * FROM useful_links_content WHERE is_active = true ORDER BY position ASC'
    );
    const links = linksRows as UsefulLink[];
    const content = contentRows as UsefulLinksContent[];

    const transformedLinks = links.map(link => ({
      id: link.id,
      link_key: link.link_key,
      title: lang === 'en' ? link.title_en : link.title_bg,
      description: lang === 'en' ? link.description_en : link.description_bg,
      url: link.url,
      cta: lang === 'en' ? link.cta_en : link.cta_bg,
      position: link.position
    }));

    const transformedContent = content.map(item => ({
      id: item.id,
      section_key: item.section_key,
      title: lang === 'en' ? item.title_en : item.title_bg,
      content: lang === 'en' ? item.content_en : item.content_bg,
      position: item.position
    }));

    res.json({ success: true, links: transformedLinks, content: transformedContent });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch useful links' });
  }
});

// GET /api/useful-links/admin - Get all data for admin (both languages)
router.get('/admin', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [linksRows] = await db.execute('SELECT * FROM useful_links ORDER BY position ASC');
    const [contentRows] = await db.execute('SELECT * FROM useful_links_content ORDER BY position ASC');
    const links = linksRows as UsefulLink[];
    const content = contentRows as UsefulLinksContent[];
    res.json({ success: true, links, content });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch useful links data' });
  }
});

// POST /api/useful-links/link - Create new useful link
router.post('/link', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { link_key, title_bg, title_en, url, description_bg, description_en, cta_bg, cta_en, position = 0 } = req.body;

  if (!link_key || !title_bg || !title_en || !url) {
    return res.status(400).json({ error: 'Link key, titles, and URL are required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO useful_links (link_key, title_bg, title_en, description_bg, description_en, url, cta_bg, cta_en, position, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [link_key, title_bg, title_en, description_bg, description_en, url, cta_bg, cta_en, position]
    );
    res.status(201).json({ success: true, message: 'Useful link created successfully', id: (result as OkPacket).insertId });
  } catch (err: any) {
    console.error('Database error:', err);
    if ((err as any).code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Link key already exists' });
    }
    res.status(500).json({ error: 'Failed to create useful link' });
  }
});

// PUT /api/useful-links/link/:id - Update useful link
router.put('/link/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { link_key, title_bg, title_en, url, description_bg, description_en, cta_bg, cta_en, position, is_active } = req.body;

  const fields: string[] = [];
  const values: any[] = [];

  if (link_key !== undefined) { fields.push('link_key = ?'); values.push(link_key); }
  if (title_bg !== undefined) { fields.push('title_bg = ?'); values.push(title_bg); }
  if (title_en !== undefined) { fields.push('title_en = ?'); values.push(title_en); }
  if (url !== undefined) { fields.push('url = ?'); values.push(url); }
  if (description_bg !== undefined) { fields.push('description_bg = ?'); values.push(description_bg); }
  if (description_en !== undefined) { fields.push('description_en = ?'); values.push(description_en); }
  if (cta_bg !== undefined) { fields.push('cta_bg = ?'); values.push(cta_bg); }
  if (cta_en !== undefined) { fields.push('cta_en = ?'); values.push(cta_en); }
  if (position !== undefined) { fields.push('position = ?'); values.push(position); }
  if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  fields.push('updated_at = NOW()');
  values.push(id);

  const query = `UPDATE useful_links SET ${fields.join(', ')} WHERE id = ?`;

  try {
    const [result] = await db.execute(query, values);
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Useful link not found' });
    }
    res.json({ success: true, message: 'Useful link updated successfully' });
  } catch (err: any) {
    console.error('Database error:', err);
    if ((err as any).code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Link key already exists' });
    }
    res.status(500).json({ error: 'Failed to update useful link' });
  }
});

// DELETE /api/useful-links/link/:id - Delete useful link
router.delete('/link/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM useful_links WHERE id = ?', [id]);
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Useful link not found' });
    }
    res.json({ success: true, message: 'Useful link deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete useful link' });
  }
});

// POST /api/useful-links/content - Create new content section
router.post('/content', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { section_key, title_bg, title_en, content_bg, content_en, position = 0 } = req.body;

  if (!section_key) {
    return res.status(400).json({ error: 'Section key is required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO useful_links_content (section_key, title_bg, title_en, content_bg, content_en, position, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [section_key, title_bg, title_en, content_bg, content_en, position]
    );
    res.status(201).json({ success: true, message: 'Content section created successfully', id: (result as OkPacket).insertId });
  } catch (err: any) {
    console.error('Database error:', err);
    if ((err as any).code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Section key already exists' });
    }
    res.status(500).json({ error: 'Failed to create content section' });
  }
});

// PUT /api/useful-links/content/:id - Update content section
router.put('/content/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { section_key, title_bg, title_en, content_bg, content_en, position, is_active } = req.body;

  const fields: string[] = [];
  const values: any[] = [];

  if (section_key !== undefined) { fields.push('section_key = ?'); values.push(section_key); }
  if (title_bg !== undefined) { fields.push('title_bg = ?'); values.push(title_bg); }
  if (title_en !== undefined) { fields.push('title_en = ?'); values.push(title_en); }
  if (content_bg !== undefined) { fields.push('content_bg = ?'); values.push(content_bg); }
  if (content_en !== undefined) { fields.push('content_en = ?'); values.push(content_en); }
  if (position !== undefined) { fields.push('position = ?'); values.push(position); }
  if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  fields.push('updated_at = NOW()');
  values.push(id);

  const query = `UPDATE useful_links_content SET ${fields.join(', ')} WHERE id = ?`;

  try {
    const [result] = await db.execute(query, values);
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    res.json({ success: true, message: 'Content section updated successfully' });
  } catch (err: any) {
    console.error('Database error:', err);
    if ((err as any).code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Section key already exists' });
    }
    res.status(500).json({ error: 'Failed to update content section' });
  }
});

// PUT /api/useful-links/reorder - Reorder links and content
router.put('/reorder', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { links, content } = req.body;

  if (!Array.isArray(links) && !Array.isArray(content)) {
    return res.status(400).json({ error: 'Links or content array is required' });
  }

  try {
    await db.beginTransaction();

    if (links && links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        const item = links[i];
        await db.execute(
          'UPDATE useful_links SET position = ?, updated_at = NOW() WHERE id = ?',
          [i, item.id]
        );
      }
    }

    if (content && content.length > 0) {
      for (let i = 0; i < content.length; i++) {
        const item = content[i];
        await db.execute(
          'UPDATE useful_links_content SET position = ?, updated_at = NOW() WHERE id = ?',
          [i, item.id]
        );
      }
    }

    await db.commit();
    res.json({ success: true, message: 'Items reordered successfully' });

  } catch (err) {
    await db.rollback();
    console.error('Transaction error:', err);
    res.status(500).json({ error: 'Failed to reorder items' });
  }
});

export default router;
