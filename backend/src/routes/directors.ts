import { Router, Request, Response } from 'express';
import { db } from '../database/init-mysql';
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
    const [rows] = await db.execute(`SELECT * FROM school_directors WHERE is_active = 1 ORDER BY position ASC, tenure_start DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Error in GET /directors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single director by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM school_directors WHERE id = ? AND is_active = 1', [id]);
    const director = (rows as any[])[0];
    if (!director) {
      return res.status(404).json({ error: 'Director not found' });
    }
    res.json(director);
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
    const [result] = await db.execute(`INSERT INTO school_directors (name, tenure_start, tenure_end, description, position, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`, [name, tenure_start || null, tenure_end || null, description || null, position || 0]);
    const [selectRows] = await db.execute('SELECT * FROM school_directors WHERE id = ?', [(result as any).insertId]);
    const director = (selectRows as any[])[0];
    res.status(201).json(director);
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
    const [result] = await db.execute(`UPDATE school_directors SET name = ?, tenure_start = ?, tenure_end = ?, description = ?, position = ?, is_active = ?, updated_at = NOW() WHERE id = ?`, [name, tenure_start || null, tenure_end || null, description || null, position || 0, is_active !== undefined ? is_active : 1, id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }
    const [selectRows] = await db.execute('SELECT * FROM school_directors WHERE id = ?', [id]);
    const director = (selectRows as any[])[0];
    res.json(director);
  } catch (error) {
    console.error('Error in PUT /directors/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete director (requires auth)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('UPDATE school_directors SET is_active = 0, updated_at = NOW() WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }
    res.json({ message: 'Director deleted successfully' });
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

    const updatePromises = directors.map((director) => {
      return db.execute('UPDATE school_directors SET position = ?, updated_at = NOW() WHERE id = ?', [director.position, director.id]);
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Director positions updated successfully' });
  } catch (error) {
    console.error('Error in PUT /directors/bulk/positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
