import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { StaffMember, AuthRequest } from '../types';

const router = Router();

// Get all staff members
router.get('/', (req, res: Response) => {
  db.all(
    'SELECT * FROM staff_members WHERE is_active = 1 ORDER BY is_director DESC, position ASC, name ASC',
    (err, staff: StaffMember[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch staff members' });
      }
      res.json(staff);
    }
  );
});

// Get single staff member
router.get('/:id', (req, res: Response) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM staff_members WHERE id = ? AND is_active = 1',
    [id],
    (err, member: StaffMember) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch staff member' });
      }
      
      if (!member) {
        return res.status(404).json({ error: 'Staff member not found' });
      }
      
      res.json(member);
    }
  );
});

// Create new staff member
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const { name, role, email, phone, bio, image_url, is_director, position } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  
  const id = uuidv4();
  
  db.run(
    `INSERT INTO staff_members (id, name, role, email, phone, bio, image_url, is_director, position) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, role, email, phone, bio, image_url, is_director ? 1 : 0, position || 0],
    function(err) {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Failed to create staff member' });
      }
      
      res.status(201).json({ id, message: 'Staff member created successfully' });
    }
  );
});

// Update staff member
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, email, phone, bio, image_url, is_director, position } = req.body;
  
  db.run(
    `UPDATE staff_members 
     SET name = COALESCE(?, name), 
         role = COALESCE(?, role), 
         email = COALESCE(?, email), 
         phone = COALESCE(?, phone), 
         bio = COALESCE(?, bio), 
         image_url = COALESCE(?, image_url), 
         is_director = COALESCE(?, is_director), 
         position = COALESCE(?, position),
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, role, email, phone, bio, image_url, is_director ? 1 : 0, position, id],
    function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Failed to update staff member' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Staff member not found' });
      }
      
      res.json({ message: 'Staff member updated successfully' });
    }
  );
});

// Delete staff member (soft delete)
router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE staff_members SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ error: 'Failed to delete staff member' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Staff member not found' });
      }
      
      res.json({ message: 'Staff member deleted successfully' });
    }
  );
});

// Bulk update staff positions (for drag-and-drop reordering)
router.post('/reorder', authenticateToken, (req: AuthRequest, res: Response) => {
  const { staffMembers } = req.body;
  
  if (!Array.isArray(staffMembers)) {
    return res.status(400).json({ error: 'Staff members must be an array' });
  }
  
  const updatePromises = staffMembers.map((member: any, index: number) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE staff_members SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [index, member.id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  });
  
  Promise.all(updatePromises)
    .then(() => {
      res.json({ message: 'Staff members reordered successfully' });
    })
    .catch((err) => {
      console.error('Reorder error:', err);
      res.status(500).json({ error: 'Failed to reorder staff members' });
    });
});

export default router;