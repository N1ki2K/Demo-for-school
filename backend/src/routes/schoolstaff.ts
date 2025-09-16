import { Router } from 'express';
import { db } from '../database/init-mysql';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all school staff members
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM schoolstaff
      WHERE is_active = 1
      ORDER BY position ASC, created_at ASC
    `);
    console.log(`📋 Retrieved ${(rows as any[]).length} school staff members`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching school staff:', err);
    res.status(500).json({ error: 'Failed to fetch school staff' });
  }
});

// Get single school staff member
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM schoolstaff WHERE id = ?', [id]);
    const staff = (rows as any[])[0];

    if (!staff) {
      return res.status(404).json({ error: 'School staff member not found' });
    }

    res.json(staff);
  } catch (err) {
    console.error('Error fetching school staff member:', err);
    res.status(500).json({ error: 'Failed to fetch school staff member' });
  }
});

// Create new school staff member (admin only)
router.post('/', authenticateToken, async (req, res) => {
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

  try {
    await db.execute(`
      INSERT INTO schoolstaff (
        id, name, role, email, phone, bio, image_url,
        is_director, position, is_active, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      id, name, role, email || null, phone || null, bio || null,
      image_url || null, is_director || 0, position || 0, is_active !== false ? 1 : 0
    ]);

    console.log(`✅ Created school staff member: ${name} (${id})`);

    // Return the created staff member
    const [rows] = await db.execute('SELECT * FROM schoolstaff WHERE id = ?', [id]);
    const staff = (rows as any[])[0];

    res.status(201).json(staff);
  } catch (err: any) {
    console.error('Error creating school staff member:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'School staff member with this ID already exists' });
    }
    res.status(500).json({ error: 'Failed to create school staff member' });
  }
});

// Update school staff member (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
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

  try {
    const [result] = await db.execute(`
      UPDATE schoolstaff SET
        name = ?, role = ?, email = ?, phone = ?, bio = ?,
        image_url = ?, is_director = ?, position = ?, is_active = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      name, role, email || null, phone || null, bio || null,
      image_url || null, is_director || 0, position || 0,
      is_active !== false ? 1 : 0, id
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'School staff member not found' });
    }

    console.log(`📝 Updated school staff member: ${name} (${id})`);

    // Return the updated staff member
    const [rows] = await db.execute('SELECT * FROM schoolstaff WHERE id = ?', [id]);
    const staff = (rows as any[])[0];

    res.json(staff);
  } catch (err) {
    console.error('Error updating school staff member:', err);
    res.status(500).json({ error: 'Failed to update school staff member' });
  }
});

// Delete school staff member (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // First get the staff member info for logging
    const [rows] = await db.execute('SELECT name FROM schoolstaff WHERE id = ?', [id]);
    const staff = (rows as any[])[0];

    if (!staff) {
      return res.status(404).json({ error: 'School staff member not found' });
    }

    // Delete the staff member
    await db.execute('DELETE FROM schoolstaff WHERE id = ?', [id]);

    console.log(`🗑️ Deleted school staff member: ${staff.name} (${id})`);
    res.json({ message: 'School staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting school staff member:', err);
    res.status(500).json({ error: 'Failed to delete school staff member' });
  }
});

// Bulk update school staff positions (admin only)
router.put('/bulk/positions', authenticateToken, async (req, res) => {
  const { staffList } = req.body;

  if (!Array.isArray(staffList)) {
    return res.status(400).json({ error: 'Staff list must be an array' });
  }

  console.log(`🔄 Bulk updating positions for ${staffList.length} school staff members`);

  if (staffList.length === 0) {
    return res.json({ message: 'No school staff members to update' });
  }

  try {
    // Use a transaction-like approach with promise.all
    const updatePromises = staffList.map((staff: any, index: number) => {
      return db.execute(`
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
          updated_at = NOW()
        WHERE id = ?
      `, [
        index, staff.name, staff.role, staff.email || null,
        staff.phone || null, staff.bio || null, staff.image_url || null,
        staff.is_director || 0, staff.is_active !== false ? 1 : 0, staff.id
      ]);
    });

    await Promise.all(updatePromises);

    console.log(`✅ Bulk updated ${staffList.length} school staff members`);
    res.json({ message: `Successfully updated ${staffList.length} school staff members` });
  } catch (err) {
    console.error('Error in bulk update:', err);
    res.status(500).json({ error: 'Failed to update school staff positions' });
  }
});

// Get staff member's profile image
router.get('/:id/image', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM staff_images WHERE staff_id = ?', [id]);
    const image = (rows as any[])[0];

    if (!image) {
      return res.status(404).json({ error: 'No profile image found for this staff member' });
    }

    res.json(image);
  } catch (err) {
    console.error('Error fetching staff image:', err);
    res.status(500).json({ error: 'Failed to fetch staff image' });
  }
});

// Set/Update staff member's profile image (admin only)
router.post('/:id/image', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { image_filename, image_url, alt_text } = req.body;

  if (!image_filename || !image_url) {
    return res.status(400).json({ error: 'Image filename and URL are required' });
  }

  try {
    // Check if staff member exists
    const [staffRows] = await db.execute('SELECT id FROM schoolstaff WHERE id = ?', [id]);
    const staff = (staffRows as any[])[0];

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Check if image already exists
    const [imageRows] = await db.execute('SELECT staff_id FROM staff_images WHERE staff_id = ?', [id]);
    const existingImage = (imageRows as any[])[0];

    if (existingImage) {
      // Update existing image
      await db.execute(`
        UPDATE staff_images SET
          image_filename = ?, image_url = ?, alt_text = ?, updated_at = NOW()
        WHERE staff_id = ?
      `, [image_filename, image_url, alt_text || null, id]);
    } else {
      // Insert new image
      await db.execute(`
        INSERT INTO staff_images (
          staff_id, image_filename, image_url, alt_text, updated_at
        ) VALUES (?, ?, ?, ?, NOW())
      `, [id, image_filename, image_url, alt_text || null]);
    }

    console.log(`🖼️ Set profile image for staff member: ${id}`);

    // Return the image data
    const [selectRows] = await db.execute('SELECT * FROM staff_images WHERE staff_id = ?', [id]);
    const image = (selectRows as any[])[0];

    res.status(201).json(image);
  } catch (err) {
    console.error('Error setting staff image:', err);
    res.status(500).json({ error: 'Failed to set staff image' });
  }
});

// Delete staff member's profile image (admin only)
router.delete('/:id/image', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM staff_images WHERE staff_id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'No profile image found for this staff member' });
    }

    console.log(`🗑️ Deleted profile image for staff member: ${id}`);
    res.json({ message: 'Staff profile image deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff image:', err);
    res.status(500).json({ error: 'Failed to delete staff image' });
  }
});

export default router;