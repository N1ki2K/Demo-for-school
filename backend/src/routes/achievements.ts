import { Router, Request, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface Achievement {
  id?: number;
  title: string;
  description?: string;
  year?: number;
  position?: number;
  is_active?: boolean;
}

// Get all achievements
router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT * FROM school_achievements 
      WHERE is_active = 1 
      ORDER BY position ASC, created_at DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching achievements:', err);
        return res.status(500).json({ error: 'Failed to fetch achievements' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in GET /achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single achievement by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM school_achievements WHERE id = ? AND is_active = 1';
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error fetching achievement:', err);
        return res.status(500).json({ error: 'Failed to fetch achievement' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      res.json(row);
    });
  } catch (error) {
    console.error('Error in GET /achievements/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new achievement (requires auth)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, year, position } = req.body as Achievement;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const sql = `
      INSERT INTO school_achievements (title, description, year, position, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    db.run(sql, [title, description || null, year || null, position || 0], function(err) {
      if (err) {
        console.error('Error creating achievement:', err);
        return res.status(500).json({ error: 'Failed to create achievement' });
      }
      
      // Return the created achievement
      db.get('SELECT * FROM school_achievements WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created achievement:', err);
          return res.status(500).json({ error: 'Achievement created but failed to fetch' });
        }
        res.status(201).json(row);
      });
    });
  } catch (error) {
    console.error('Error in POST /achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update achievement (requires auth)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, year, position, is_active } = req.body as Achievement;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const sql = `
      UPDATE school_achievements 
      SET title = ?, description = ?, year = ?, position = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(sql, [title, description || null, year || null, position || 0, is_active !== undefined ? is_active : 1, id], function(err) {
      if (err) {
        console.error('Error updating achievement:', err);
        return res.status(500).json({ error: 'Failed to update achievement' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      
      // Return the updated achievement
      db.get('SELECT * FROM school_achievements WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated achievement:', err);
          return res.status(500).json({ error: 'Achievement updated but failed to fetch' });
        }
        res.json(row);
      });
    });
  } catch (error) {
    console.error('Error in PUT /achievements/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete achievement (requires auth)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Soft delete by setting is_active = 0
    const sql = 'UPDATE school_achievements SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        console.error('Error deleting achievement:', err);
        return res.status(500).json({ error: 'Failed to delete achievement' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      
      res.json({ message: 'Achievement deleted successfully' });
    });
  } catch (error) {
    console.error('Error in DELETE /achievements/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update achievement positions (requires auth)
router.put('/bulk/positions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { achievements } = req.body as { achievements: Array<{ id: number; position: number }> };
    
    if (!Array.isArray(achievements)) {
      return res.status(400).json({ error: 'Invalid achievements data' });
    }
    
    const updatePromises = achievements.map(({ id, position }) => {
      return new Promise<void>((resolve, reject) => {
        db.run(
          'UPDATE school_achievements SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [position, id],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });
    
    await Promise.all(updatePromises);
    res.json({ message: 'Achievement positions updated successfully' });
  } catch (error) {
    console.error('Error in PUT /achievements/bulk/positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;