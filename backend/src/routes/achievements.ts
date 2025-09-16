import { Router, Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface Achievement extends RowDataPacket {
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
    const sql = `SELECT * FROM school_achievements WHERE is_active = true ORDER BY position ASC, created_at DESC`;
    const [rows] = await db.execute(sql);
    const achievements = rows as Achievement[];
    res.json(achievements);
  } catch (error) {
    console.error('Error in GET /achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single achievement by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM school_achievements WHERE id = ? AND is_active = true';
    const [rows] = await db.execute(sql, [id]);
    const achievements = rows as Achievement[];
    if (achievements.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    res.json(achievements[0]);
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
    const sql = `INSERT INTO school_achievements (title, description, year, position, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, true, NOW(), NOW())`;
    const [result] = await db.execute(sql, [title, description || null, year || null, position || 0]);
    const [rows] = await db.execute('SELECT * FROM school_achievements WHERE id = ?', [(result as OkPacket).insertId]);
    const achievements = rows as Achievement[];
    res.status(201).json(achievements[0]);
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
    const sql = `UPDATE school_achievements SET title = ?, description = ?, year = ?, position = ?, is_active = ?, updated_at = NOW() WHERE id = ?`;
    const [result] = await db.execute(sql, [title, description || null, year || null, position || 0, is_active !== undefined ? is_active : true, id]);
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    const [rows] = await db.execute('SELECT * FROM school_achievements WHERE id = ?', [id]);
    const achievements = rows as Achievement[];
    res.json(achievements[0]);
  } catch (error) {
    console.error('Error in PUT /achievements/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete achievement (requires auth)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = 'UPDATE school_achievements SET is_active = false, updated_at = NOW() WHERE id = ?';
    const [result] = await db.execute(sql, [id]);
    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    res.json({ message: 'Achievement deleted successfully' });
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

    await db.beginTransaction();
    
    for (const achievement of achievements) {
      await db.execute(
        'UPDATE school_achievements SET position = ?, updated_at = NOW() WHERE id = ?',
        [achievement.position, achievement.id]
      );
    }
    
    await db.commit();

    res.json({ message: 'Achievement positions updated successfully' });
  } catch (error) {
    await db.rollback();
    console.error('Error in PUT /achievements/bulk/positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
