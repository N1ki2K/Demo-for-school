import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init-mysql';
import { authenticateToken } from '../middleware/auth';
import { StaffMember, AuthRequest } from '../types';

const router = Router();

// Get all staff members
router.get('/', async (req, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM staff_members WHERE is_active = 1 ORDER BY is_director DESC, position ASC, name ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
});

// Get single staff member
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM staff_members WHERE id = ? AND is_active = 1',
      [id]
    );
    const member = (rows as any[])[0];

    if (!member) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(member);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

// Create new staff member
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { name, role, email, phone, bio, image_url, is_director, position } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const id = uuidv4();

  try {
    await db.execute(
      `INSERT INTO staff_members (id, name, role, email, phone, bio, image_url, is_director, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, role, email, phone, bio, image_url, Boolean(is_director) ? 1 : 0, position || 0]
    );

    res.status(201).json({ id, message: 'Staff member created successfully' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// Update staff member
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, email, phone, bio, image_url, is_director, position } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE staff_members
       SET name = COALESCE(?, name),
           role = COALESCE(?, role),
           email = COALESCE(?, email),
           phone = COALESCE(?, phone),
           bio = COALESCE(?, bio),
           image_url = COALESCE(?, image_url),
           is_director = COALESCE(?, is_director),
           position = COALESCE(?, position),
           updated_at = NOW()
       WHERE id = ?`,
      [name, role, email, phone, bio, image_url, Boolean(is_director) ? 1 : 0, position, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// Delete staff member (soft delete)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'UPDATE staff_members SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

// Bulk update staff positions (for drag-and-drop reordering)
router.post('/reorder', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { staffMembers } = req.body;

  if (!Array.isArray(staffMembers)) {
    return res.status(400).json({ error: 'Staff members must be an array' });
  }

  try {
    const updatePromises = staffMembers.map((member: any, index: number) => {
      return db.execute(
        'UPDATE staff_members SET position = ?, updated_at = NOW() WHERE id = ?',
        [index, member.id]
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Staff members reordered successfully' });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder staff members' });
  }
});

export default router;