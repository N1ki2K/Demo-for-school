import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

export interface UsefulLink {
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
  created_at: string;
  updated_at: string;
}

export interface UsefulLinksContent {
  id: number;
  section_key: string;
  title_bg?: string;
  title_en?: string;
  content_bg?: string;
  content_en?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/useful-links - Get all useful links and content
router.get('/', (req: Request, res: Response) => {
  const { lang = 'bg' } = req.query;
  
  // Get both links and content
  const getLinks = new Promise<UsefulLink[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM useful_links WHERE is_active = 1 ORDER BY position ASC',
      (err, rows: UsefulLink[]) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  const getContent = new Promise<UsefulLinksContent[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM useful_links_content WHERE is_active = 1 ORDER BY position ASC',
      (err, rows: UsefulLinksContent[]) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  Promise.all([getLinks, getContent])
    .then(([links, content]) => {
      // Transform links based on language
      const transformedLinks = links.map(link => ({
        id: link.id,
        link_key: link.link_key,
        title: lang === 'en' ? link.title_en : link.title_bg,
        description: lang === 'en' ? link.description_en : link.description_bg,
        url: link.url,
        cta: lang === 'en' ? link.cta_en : link.cta_bg,
        position: link.position
      }));

      // Transform content based on language
      const transformedContent = content.map(item => ({
        id: item.id,
        section_key: item.section_key,
        title: lang === 'en' ? item.title_en : item.title_bg,
        content: lang === 'en' ? item.content_en : item.content_bg,
        position: item.position
      }));

      res.json({
        success: true,
        links: transformedLinks,
        content: transformedContent
      });
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to fetch useful links' });
    });
});

// GET /api/useful-links/admin - Get all data for admin (both languages)
router.get('/admin', authenticateToken, (req: AuthRequest, res: Response) => {
  const getLinks = new Promise<UsefulLink[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM useful_links ORDER BY position ASC',
      (err, rows: UsefulLink[]) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  const getContent = new Promise<UsefulLinksContent[]>((resolve, reject) => {
    db.all(
      'SELECT * FROM useful_links_content ORDER BY position ASC',
      (err, rows: UsefulLinksContent[]) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  Promise.all([getLinks, getContent])
    .then(([links, content]) => {
      res.json({
        success: true,
        links,
        content
      });
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to fetch useful links' });
    });
});

// POST /api/useful-links/link - Create new useful link
router.post('/link', authenticateToken, (req: AuthRequest, res: Response) => {
  const {
    link_key,
    title_bg,
    title_en,
    description_bg,
    description_en,
    url,
    cta_bg,
    cta_en,
    position = 0
  } = req.body;

  if (!link_key || !title_bg || !title_en || !url) {
    return res.status(400).json({ error: 'Link key, titles, and URL are required' });
  }

  db.run(
    `INSERT INTO useful_links 
     (link_key, title_bg, title_en, description_bg, description_en, url, cta_bg, cta_en, position, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [link_key, title_bg, title_en, description_bg, description_en, url, cta_bg, cta_en, position],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Link key already exists' });
        }
        return res.status(500).json({ error: 'Failed to create useful link' });
      }

      res.status(201).json({
        success: true,
        message: 'Useful link created successfully',
        id: this.lastID
      });
    }
  );
});

// PUT /api/useful-links/link/:id - Update useful link
router.put('/link/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    link_key,
    title_bg,
    title_en,
    description_bg,
    description_en,
    url,
    cta_bg,
    cta_en,
    position,
    is_active
  } = req.body;

  // Build dynamic query
  const fields: string[] = [];
  const values: any[] = [];

  if (link_key !== undefined) {
    fields.push('link_key = ?');
    values.push(link_key);
  }
  if (title_bg !== undefined) {
    fields.push('title_bg = ?');
    values.push(title_bg);
  }
  if (title_en !== undefined) {
    fields.push('title_en = ?');
    values.push(title_en);
  }
  if (description_bg !== undefined) {
    fields.push('description_bg = ?');
    values.push(description_bg);
  }
  if (description_en !== undefined) {
    fields.push('description_en = ?');
    values.push(description_en);
  }
  if (url !== undefined) {
    fields.push('url = ?');
    values.push(url);
  }
  if (cta_bg !== undefined) {
    fields.push('cta_bg = ?');
    values.push(cta_bg);
  }
  if (cta_en !== undefined) {
    fields.push('cta_en = ?');
    values.push(cta_en);
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

  const query = `UPDATE useful_links SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Link key already exists' });
      }
      return res.status(500).json({ error: 'Failed to update useful link' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Useful link not found' });
    }

    res.json({
      success: true,
      message: 'Useful link updated successfully'
    });
  });
});

// DELETE /api/useful-links/link/:id - Delete useful link
router.delete('/link/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM useful_links WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete useful link' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Useful link not found' });
      }

      res.json({
        success: true,
        message: 'Useful link deleted successfully'
      });
    }
  );
});

// POST /api/useful-links/content - Create new content section
router.post('/content', authenticateToken, (req: AuthRequest, res: Response) => {
  const {
    section_key,
    title_bg,
    title_en,
    content_bg,
    content_en,
    position = 0
  } = req.body;

  if (!section_key) {
    return res.status(400).json({ error: 'Section key is required' });
  }

  db.run(
    `INSERT INTO useful_links_content 
     (section_key, title_bg, title_en, content_bg, content_en, position, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [section_key, title_bg, title_en, content_bg, content_en, position],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Section key already exists' });
        }
        return res.status(500).json({ error: 'Failed to create content section' });
      }

      res.status(201).json({
        success: true,
        message: 'Content section created successfully',
        id: this.lastID
      });
    }
  );
});

// PUT /api/useful-links/content/:id - Update content section
router.put('/content/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    section_key,
    title_bg,
    title_en,
    content_bg,
    content_en,
    position,
    is_active
  } = req.body;

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

  const query = `UPDATE useful_links_content SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Section key already exists' });
      }
      return res.status(500).json({ error: 'Failed to update content section' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }

    res.json({
      success: true,
      message: 'Content section updated successfully'
    });
  });
});

// PUT /api/useful-links/reorder - Reorder links and content
router.put('/reorder', authenticateToken, (req: AuthRequest, res: Response) => {
  const { links, content } = req.body;

  if (!Array.isArray(links) && !Array.isArray(content)) {
    return res.status(400).json({ error: 'Links or content array is required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    let hasError = false;
    let completed = 0;
    const totalOperations = (links?.length || 0) + (content?.length || 0);

    const completeOperation = () => {
      completed++;
      if (completed === totalOperations) {
        if (hasError) {
          db.run('ROLLBACK');
          res.status(500).json({ error: 'Failed to reorder items' });
        } else {
          db.run('COMMIT');
          res.json({
            success: true,
            message: 'Items reordered successfully'
          });
        }
      }
    };

    // Reorder links
    if (links && links.length > 0) {
      links.forEach((item: any, index: number) => {
        db.run(
          'UPDATE useful_links SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [index, item.id],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              hasError = true;
            }
            completeOperation();
          }
        );
      });
    }

    // Reorder content
    if (content && content.length > 0) {
      content.forEach((item: any, index: number) => {
        db.run(
          'UPDATE useful_links_content SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [index, item.id],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              hasError = true;
            }
            completeOperation();
          }
        );
      });
    }

    if (totalOperations === 0) {
      db.run('ROLLBACK');
      res.status(400).json({ error: 'No items to reorder' });
    }
  });
});

export default router;