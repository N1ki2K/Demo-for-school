import { Router, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// Get navigation structure for header (public endpoint)
router.get('/header-menu', (req, res) => {
  try {
    db.all(
      `SELECT * FROM navigation_items WHERE is_active = 1 ORDER BY position ASC, title ASC`,
      [],
      (err, items: NavigationItem[]) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to fetch navigation items' });
        }

        // Group items into parent-child structure for header
        const parentItems = items.filter(item => !item.parent_id);
        const childItems = items.filter(item => item.parent_id);
        
        const structuredItems = parentItems.map(parent => ({
          id: parent.id,
          label: parent.title,
          path: parent.path,
          children: childItems
            .filter(child => child.parent_id === parent.id)
            .map(child => ({
              id: child.id,
              label: child.title,
              path: child.path
            }))
        }));

        res.json({
          navigation: structuredItems
        });
      }
    );
  } catch (error) {
    console.error('Error fetching header navigation:', error);
    res.status(500).json({ error: 'Failed to fetch header navigation' });
  }
});

interface NavigationItem {
  id: string;
  title: string;
  path: string;
  position: number;
  is_active: boolean;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Get all navigation menu items
router.get('/menu-items', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    db.all(
      `SELECT * FROM navigation_items ORDER BY position ASC, title ASC`,
      [],
      (err, items: NavigationItem[]) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to fetch navigation items' });
        }

        // Group items into parent-child structure
        const parentItems = items.filter(item => !item.parent_id);
        const childItems = items.filter(item => item.parent_id);
        
        const structuredItems = parentItems.map(parent => ({
          ...parent,
          children: childItems.filter(child => child.parent_id === parent.id)
        }));

        res.json({
          items: structuredItems,
          total: items.length
        });
      }
    );
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    res.status(500).json({ error: 'Failed to fetch navigation items' });
  }
});

// Create new navigation menu item
router.post('/menu-items', authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, path, position, isActive, parentId } = req.body;
  
  if (!title || !path) {
    return res.status(400).json({ error: 'Title and path are required' });
  }

  const id = `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO navigation_items (id, title, path, position, is_active, parent_id, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, path, position || 0, isActive ? 1 : 0, parentId || null, now, now],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create navigation item' });
      }

      // Return the created item
      db.get(
        'SELECT * FROM navigation_items WHERE id = ?',
        [id],
        (selectErr, item: NavigationItem) => {
          if (selectErr) {
            console.error('Error fetching created item:', selectErr);
            return res.status(500).json({ error: 'Item created but failed to fetch' });
          }

          res.status(201).json({
            item,
            message: 'Navigation item created successfully'
          });
        }
      );
    }
  );
});

// Update navigation menu item
router.put('/menu-items/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, path, position, isActive, parentId } = req.body;
  
  if (!title || !path) {
    return res.status(400).json({ error: 'Title and path are required' });
  }

  const now = new Date().toISOString();

  db.run(
    `UPDATE navigation_items 
     SET title = ?, path = ?, position = ?, is_active = ?, parent_id = ?, updated_at = ?
     WHERE id = ?`,
    [title, path, position || 0, isActive ? 1 : 0, parentId || null, now, id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update navigation item' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Navigation item not found' });
      }

      // Return the updated item
      db.get(
        'SELECT * FROM navigation_items WHERE id = ?',
        [id],
        (selectErr, item: NavigationItem) => {
          if (selectErr) {
            console.error('Error fetching updated item:', selectErr);
            return res.status(500).json({ error: 'Item updated but failed to fetch' });
          }

          res.json({
            item,
            message: 'Navigation item updated successfully'
          });
        }
      );
    }
  );
});

// Toggle navigation menu item active status
router.patch('/menu-items/:id/toggle', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const now = new Date().toISOString();

  // First get current status
  db.get(
    'SELECT is_active FROM navigation_items WHERE id = ?',
    [id],
    (err, item: { is_active: number }) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch navigation item' });
      }

      if (!item) {
        return res.status(404).json({ error: 'Navigation item not found' });
      }

      const newStatus = item.is_active ? 0 : 1;

      // Update the status
      db.run(
        'UPDATE navigation_items SET is_active = ?, updated_at = ? WHERE id = ?',
        [newStatus, now, id],
        function(updateErr) {
          if (updateErr) {
            console.error('Database error:', updateErr);
            return res.status(500).json({ error: 'Failed to update navigation item status' });
          }

          res.json({
            message: 'Navigation item status updated successfully',
            isActive: newStatus === 1
          });
        }
      );
    }
  );
});

// Delete navigation menu item
router.delete('/menu-items/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // First check if item has children
  db.get(
    'SELECT COUNT(*) as count FROM navigation_items WHERE parent_id = ?',
    [id],
    (err, result: { count: number }) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to check for child items' });
      }

      if (result.count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete item with child items. Please delete or reassign child items first.' 
        });
      }

      // Delete the item
      db.run(
        'DELETE FROM navigation_items WHERE id = ?',
        [id],
        function(deleteErr) {
          if (deleteErr) {
            console.error('Database error:', deleteErr);
            return res.status(500).json({ error: 'Failed to delete navigation item' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'Navigation item not found' });
          }

          res.json({
            message: 'Navigation item deleted successfully'
          });
        }
      );
    }
  );
});

export default router;