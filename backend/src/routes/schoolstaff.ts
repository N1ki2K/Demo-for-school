import { Router } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all school staff members
router.get('/', (req, res) => {
  const sql = `
    SELECT * FROM schoolstaff 
    WHERE is_active = 1 
    ORDER BY position ASC, created_at ASC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching school staff:', err);
      return res.status(500).json({ error: 'Failed to fetch school staff' });
    }
    
    console.log(`📋 Retrieved ${rows.length} school staff members`);
    res.json(rows);
  });
});

// Get single school staff member
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM schoolstaff WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching school staff member:', err);
      return res.status(500).json({ error: 'Failed to fetch school staff member' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'School staff member not found' });
    }
    
    res.json(row);
  });
});

// Create new school staff member (admin only)
router.post('/', authenticateToken, (req, res) => {
  const {
    id,
    name,
    role,
    email,
    phone,
    bio,
    image_url,
    is_director,
    position,
    is_active
  } = req.body;
  
  if (!id || !name || !role) {
    return res.status(400).json({ error: 'ID, name, and role are required' });
  }
  
  const sql = `
    INSERT INTO schoolstaff (
      id, name, role, email, phone, bio, image_url, 
      is_director, position, is_active, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  
  db.run(sql, [
    id, name, role, email || null, phone || null, bio || null, 
    image_url || null, is_director || 0, position || 0, is_active !== false ? 1 : 0
  ], function(err) {
    if (err) {
      console.error('Error creating school staff member:', err);
      if ((err as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'School staff member with this ID already exists' });
      }
      return res.status(500).json({ error: 'Failed to create school staff member' });
    }
    
    console.log(`✅ Created school staff member: ${name} (${id})`);
    
    // Return the created staff member
    db.get('SELECT * FROM schoolstaff WHERE id = ?', [id], (selectErr, row) => {
      if (selectErr) {
        console.error('Error fetching created school staff member:', selectErr);
        return res.status(500).json({ error: 'Created but failed to fetch school staff member' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Update school staff member (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    name,
    role,
    email,
    phone,
    bio,
    image_url,
    is_director,
    position,
    is_active
  } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  
  const sql = `
    UPDATE schoolstaff SET 
      name = ?, role = ?, email = ?, phone = ?, bio = ?, 
      image_url = ?, is_director = ?, position = ?, is_active = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [
    name, role, email || null, phone || null, bio || null,
    image_url || null, is_director || 0, position || 0, 
    is_active !== false ? 1 : 0, id
  ], function(err) {
    if (err) {
      console.error('Error updating school staff member:', err);
      return res.status(500).json({ error: 'Failed to update school staff member' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'School staff member not found' });
    }
    
    console.log(`📝 Updated school staff member: ${name} (${id})`);
    
    // Return the updated staff member
    db.get('SELECT * FROM schoolstaff WHERE id = ?', [id], (selectErr, row) => {
      if (selectErr) {
        console.error('Error fetching updated school staff member:', selectErr);
        return res.status(500).json({ error: 'Updated but failed to fetch school staff member' });
      }
      
      res.json(row);
    });
  });
});

// Delete school staff member (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // First get the staff member info for logging
  db.get('SELECT name FROM schoolstaff WHERE id = ?', [id], (selectErr, row: any) => {
    if (selectErr) {
      console.error('Error fetching school staff member for deletion:', selectErr);
      return res.status(500).json({ error: 'Failed to fetch school staff member' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'School staff member not found' });
    }
    
    // Delete the staff member
    db.run('DELETE FROM schoolstaff WHERE id = ?', [id], function(deleteErr) {
      if (deleteErr) {
        console.error('Error deleting school staff member:', deleteErr);
        return res.status(500).json({ error: 'Failed to delete school staff member' });
      }
      
      console.log(`🗑️ Deleted school staff member: ${row.name} (${id})`);
      res.json({ message: 'School staff member deleted successfully' });
    });
  });
});

// Bulk update school staff positions (admin only)
router.put('/bulk/positions', authenticateToken, (req, res) => {
  const { staffList } = req.body;
  
  if (!Array.isArray(staffList)) {
    return res.status(400).json({ error: 'Staff list must be an array' });
  }
  
  console.log(`🔄 Bulk updating positions for ${staffList.length} school staff members`);
  
  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    let completed = 0;
    let hasError = false;
    
    staffList.forEach((staff, index) => {
      if (hasError) return;
      
      const sql = `
        UPDATE schoolstaff SET 
          position = ?, 
          name = ?, 
          role = ?, 
          email = ?, 
          phone = ?, 
          bio = ?, 
          image_url = ?, 
          is_director = ?, 
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(sql, [
        index, staff.name, staff.role, staff.email || null, 
        staff.phone || null, staff.bio || null, staff.image_url || null,
        staff.is_director || 0, staff.is_active !== false ? 1 : 0, staff.id
      ], function(err) {
        if (err && !hasError) {
          hasError = true;
          console.error('Error in bulk update:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to update school staff positions' });
        }
        
        completed++;
        if (completed === staffList.length && !hasError) {
          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              console.error('Error committing bulk update:', commitErr);
              return res.status(500).json({ error: 'Failed to commit school staff updates' });
            }
            
            console.log(`✅ Bulk updated ${staffList.length} school staff members`);
            res.json({ message: `Successfully updated ${staffList.length} school staff members` });
          });
        }
      });
    });
    
    // Handle empty list case
    if (staffList.length === 0) {
      db.run('COMMIT');
      res.json({ message: 'No school staff members to update' });
    }
  });
});

// Get staff member's profile image
router.get('/:id/image', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM staff_images WHERE staff_id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching staff image:', err);
      return res.status(500).json({ error: 'Failed to fetch staff image' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'No profile image found for this staff member' });
    }
    
    res.json(row);
  });
});

// Set/Update staff member's profile image (admin only)
router.post('/:id/image', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { image_filename, image_url, alt_text } = req.body;
  
  if (!image_filename || !image_url) {
    return res.status(400).json({ error: 'Image filename and URL are required' });
  }
  
  // Check if staff member exists
  db.get('SELECT id FROM schoolstaff WHERE id = ?', [id], (checkErr, staffRow) => {
    if (checkErr) {
      console.error('Error checking staff member:', checkErr);
      return res.status(500).json({ error: 'Failed to verify staff member' });
    }
    
    if (!staffRow) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    // Use INSERT OR REPLACE to handle both create and update
    const sql = `
      INSERT OR REPLACE INTO staff_images (
        staff_id, image_filename, image_url, alt_text, updated_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    db.run(sql, [id, image_filename, image_url, alt_text || null], function(err) {
      if (err) {
        console.error('Error setting staff image:', err);
        return res.status(500).json({ error: 'Failed to set staff image' });
      }
      
      console.log(`🖼️ Set profile image for staff member: ${id}`);
      
      // Return the image data
      db.get('SELECT * FROM staff_images WHERE staff_id = ?', [id], (selectErr, row) => {
        if (selectErr) {
          console.error('Error fetching set staff image:', selectErr);
          return res.status(500).json({ error: 'Image set but failed to fetch data' });
        }
        
        res.status(201).json(row);
      });
    });
  });
});

// Delete staff member's profile image (admin only)
router.delete('/:id/image', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM staff_images WHERE staff_id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting staff image:', err);
      return res.status(500).json({ error: 'Failed to delete staff image' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'No profile image found for this staff member' });
    }
    
    console.log(`🗑️ Deleted profile image for staff member: ${id}`);
    res.json({ message: 'Staff profile image deleted successfully' });
  });
});

export default router;