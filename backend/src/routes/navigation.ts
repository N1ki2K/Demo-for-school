import { Router, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

interface NavigationItem extends RowDataPacket {
  id: string;
  title: string;
  path: string;
  position: number;
  is_active: boolean;
  parent_id?: string | null;
}

// Get navigation structure for header (public endpoint)
router.get('/header-menu', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM navigation_items WHERE is_active = true ORDER BY position ASC, title ASC`
    );
    const items = rows as NavigationItem[];

    const parentItems = items.filter(item => !item.parent_id);
    const childItems = items.filter(item => item.parent_id);

    const structuredItems = parentItems.map(parent => ({
      id: parent.id,
      label: parent.title,
      path: parent.path,
      children: childItems
        .filter(child => child.parent_id === parent.id)
        .map(child => ({ id: child.id, label: child.title, path: child.path }))
    }));

    res.json({ navigation: structuredItems });
  } catch (error) {
    console.error('Error fetching header navigation:', error);
    res.status(500).json({ error: 'Failed to fetch header navigation' });
  }
});

// Get all navigation menu items
router.get('/menu-items', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM navigation_items ORDER BY position ASC, title ASC`
    );
    const items = rows as NavigationItem[];

    const parentItems = items.filter(item => !item.parent_id);
    const childItems = items.filter(item => item.parent_id);

    const structuredItems = parentItems.map(parent => ({
      ...parent,
      children: childItems.filter(child => child.parent_id === parent.id)
    }));

    res.json({ items: structuredItems, total: items.length });
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    res.status(500).json({ error: 'Failed to fetch navigation items' });
  }
});

// Create new navigation menu item
router.post('/menu-items', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { title, path, position, isActive, parentId } = req.body;

  if (!title || !path) {
    return res.status(400).json({ error: 'Title and path are required' });
  }

  const id = `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  try {
    await db.execute(
      `INSERT INTO navigation_items (id, title, path, position, is_active, parent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, path, position || 0, isActive ? true : false, parentId || null, now, now]
    );

    const [itemRows] = await db.execute('SELECT * FROM navigation_items WHERE id = ?', [id]);
    const rows = itemRows as NavigationItem[];
    res.status(201).json({ item: rows[0], message: 'Navigation item created successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create navigation item' });
  }
});

// Update navigation menu item
router.put('/menu-items/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, path, position, isActive, parentId } = req.body;

  if (!title || !path) {
    return res.status(400).json({ error: 'Title and path are required' });
  }

  const now = new Date();

  try {
    const [result] = await db.execute(
      `UPDATE navigation_items SET title = ?, path = ?, position = ?, is_active = ?, parent_id = ?, updated_at = ? WHERE id = ?`,
      [title, path, position || 0, isActive ? true : false, parentId || null, now, id]
    );

    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }

    const [itemRows] = await db.execute('SELECT * FROM navigation_items WHERE id = ?', [id]);
    const rows = itemRows as NavigationItem[];
    res.json({ item: rows[0], message: 'Navigation item updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update navigation item' });
  }
});

// Toggle navigation menu item active status
router.patch('/menu-items/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const now = new Date();

  try {
    const [itemRows] = await db.execute('SELECT is_active FROM navigation_items WHERE id = ?', [id]);
    const rows = itemRows as NavigationItem[];

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }

    const newStatus = !rows[0].is_active;

    await db.execute('UPDATE navigation_items SET is_active = ?, updated_at = ? WHERE id = ?', [newStatus, now, id]);

    res.json({ message: 'Navigation item status updated successfully', isActive: newStatus });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update navigation item status' });
  }
});

// Delete navigation menu item
router.delete('/menu-items/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const [countRows] = await db.execute('SELECT COUNT(*) as count FROM navigation_items WHERE parent_id = ?', [id]);
    const rows = countRows as Array<{count: number}>;

    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete item with child items. Please delete or reassign child items first.' });
    }

    const [result] = await db.execute('DELETE FROM navigation_items WHERE id = ?', [id]);

    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }

    res.json({ message: 'Navigation item deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete navigation item' });
  }
});

export default router;
