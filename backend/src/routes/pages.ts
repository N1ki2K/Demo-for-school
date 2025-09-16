import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init-mysql';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

export interface PageData {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  position: number;
  is_active: boolean;
  show_in_menu: boolean;
  created_at: string;
  updated_at: string;
}

// Get all pages (including inactive ones for admin)
router.get('/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pages ORDER BY parent_id ASC, position ASC');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get active pages for navigation
router.get('/', async (req, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM pages WHERE is_active = 1 AND show_in_menu = 1 ORDER BY parent_id ASC, position ASC'
    );
    const pages = rows as PageData[];
    
    // Transform flat array into nested structure
    const pageMap = new Map();
    const rootPages: any[] = [];
    
    // First pass: create all pages
    pages.forEach(page => {
      pageMap.set(page.id, {
        ...page,
        children: []
      });
    });
    
    // Second pass: build hierarchy
    pages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id);
      if (page.parent_id) {
        const parent = pageMap.get(page.parent_id);
        if (parent) {
          parent.children.push(pageWithChildren);
        }
      } else {
        rootPages.push(pageWithChildren);
      }
    });
    
    // Third pass: remove empty children arrays
    const cleanupChildren = (page: any) => {
      if (page.children && page.children.length === 0) {
        delete page.children;
      } else if (page.children && page.children.length > 0) {
        page.children.forEach(cleanupChildren);
      }
    };
    
    rootPages.forEach(cleanupChildren);
    
    res.json(rootPages);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get single page
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM pages WHERE id = ?', [id]);
    const page = (rows as any[])[0];

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Create new page
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { name, path, parent_id, position, show_in_menu = true } = req.body;

  if (!name || !path) {
    return res.status(400).json({ error: 'Name and path are required' });
  }

  const id = uuidv4();

  try {
    await db.execute(
      `INSERT INTO pages (id, name, path, parent_id, position, show_in_menu)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, path, parent_id || null, position || 0, show_in_menu ? 1 : 0]
    );

    res.status(201).json({ id, message: 'Page created successfully' });
  } catch (err: any) {
    console.error('Insert error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A page with this path already exists' });
    }
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Update page
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, path, parent_id, position, is_active, show_in_menu } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE pages
       SET name = COALESCE(?, name),
           path = COALESCE(?, path),
           parent_id = ?,
           position = COALESCE(?, position),
           is_active = COALESCE(?, is_active),
           show_in_menu = COALESCE(?, show_in_menu),
           updated_at = NOW()
       WHERE id = ?`,
      [name, path, parent_id, position, is_active ? 1 : 0, show_in_menu ? 1 : 0, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ message: 'Page updated successfully' });
  } catch (err: any) {
    console.error('Update error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A page with this path already exists' });
    }
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Delete page (soft delete)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { permanent } = req.query;

  try {
    if (permanent === 'true') {
      // Permanent delete - actually remove from database
      const [result] = await db.execute('DELETE FROM pages WHERE id = ?', [id]);

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ error: 'Page not found' });
      }

      res.json({ message: 'Page permanently deleted successfully' });
    } else {
      // Soft delete - just hide the page
      const [result] = await db.execute(
        'UPDATE pages SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ error: 'Page not found' });
      }

      res.json({ message: 'Page deleted successfully' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// Bulk update page positions (for drag-and-drop reordering)
router.post('/reorder', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { pages } = req.body;

  if (!Array.isArray(pages)) {
    return res.status(400).json({ error: 'Pages must be an array' });
  }

  try {
    const updatePromises = pages.map((page: any, index: number) => {
      return db.execute(
        'UPDATE pages SET position = ?, updated_at = NOW() WHERE id = ?',
        [index, page.id]
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Pages reordered successfully' });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder pages' });
  }
});

export default router;