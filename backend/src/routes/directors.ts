import { Router, Request, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface Director {
  id?: number;
  name: string;
  tenure_start?: string;
  tenure_end?: string;
  description?: string;
  position?: number;
  is_active?: boolean;
}

// Get all directors
router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT * FROM school_directors 
      WHERE is_active = 1 
      ORDER BY position ASC, tenure_start DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching directors:', err);
        return res.status(500).json({ error: 'Failed to fetch directors' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in GET /directors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single director by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM school_directors WHERE id = ? AND is_active = 1';
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error fetching director:', err);
        return res.status(500).json({ error: 'Failed to fetch director' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Director not found' });
      }
      res.json(row);
    });
  } catch (error) {
    console.error('Error in GET /directors/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new director (requires auth)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, tenure_start, tenure_end, description, position } = req.body as Director;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const sql = `
      INSERT INTO school_directors (name, tenure_start, tenure_end, description, position, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    db.run(sql, [name, tenure_start || null, tenure_end || null, description || null, position || 0], function(err) {
      if (err) {
        console.error('Error creating director:', err);
        return res.status(500).json({ error: 'Failed to create director' });
      }
      
      // Return the created director
      db.get('SELECT * FROM school_directors WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created director:', err);
          return res.status(500).json({ error: 'Director created but failed to fetch' });
        }
        res.status(201).json(row);
      });
    });
  } catch (error) {
    console.error('Error in POST /directors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update director (requires auth)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, tenure_start, tenure_end, description, position, is_active } = req.body as Director;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const sql = `
      UPDATE school_directors 
      SET name = ?, tenure_start = ?, tenure_end = ?, description = ?, position = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(sql, [name, tenure_start || null, tenure_end || null, description || null, position || 0, is_active !== undefined ? is_active : 1, id], function(err) {
      if (err) {
        console.error('Error updating director:', err);
        return res.status(500).json({ error: 'Failed to update director' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Director not found' });
      }
      
      // Return the updated director
      db.get('SELECT * FROM school_directors WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated director:', err);
          return res.status(500).json({ error: 'Director updated but failed to fetch' });
        }
        res.json(row);
      });
    });
  } catch (error) {
    console.error('Error in PUT /directors/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete director (requires auth)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Soft delete by setting is_active = 0
    const sql = 'UPDATE school_directors SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        console.error('Error deleting director:', err);
        return res.status(500).json({ error: 'Failed to delete director' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Director not found' });
      }
      
      res.json({ message: 'Director deleted successfully' });
    });
  } catch (error) {
    console.error('Error in DELETE /directors/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update director positions (requires auth)
router.put('/bulk/positions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { directors } = req.body as { directors: Array<{ id: number; position: number }> };
    
    if (!Array.isArray(directors)) {
      return res.status(400).json({ error: 'Invalid directors data' });
    }
    
    const updatePromises = directors.map(({ id, position }) => {
      return new Promise<void>((resolve, reject) => {
        db.run(
          'UPDATE school_directors SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [position, id],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });
    
    await Promise.all(updatePromises);
    res.json({ message: 'Director positions updated successfully' });
  } catch (error) {
    console.error('Error in PUT /directors/bulk/positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;