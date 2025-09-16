import { Router } from 'express';
import { db } from '../database/init-mysql';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get image by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM images WHERE id = ?', [id]);
    const image = (rows as any[])[0];
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(image);
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM images ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Set/Update image mapping (admin only)
router.post('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { filename, original_name, url, alt_text, page_id, description } = req.body;

  if (!filename || !url) {
    return res.status(400).json({ error: 'Filename and URL are required' });
  }

  try {
    // Check if image exists
    const [checkRows] = await db.execute('SELECT id FROM images WHERE id = ?', [id]);
    const existing = (checkRows as any[])[0];

    if (existing) {
      // Update existing image
      await db.execute(`
        UPDATE images SET
          filename = ?, original_name = ?, url = ?, alt_text = ?,
          page_id = ?, description = ?, updated_at = NOW()
        WHERE id = ?
      `, [filename, original_name || null, url, alt_text || null, page_id || null, description || null, id]);
    } else {
      // Insert new image
      await db.execute(`
        INSERT INTO images (id, filename, original_name, url, alt_text, page_id, description, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [id, filename, original_name || null, url, alt_text || null, page_id || null, description || null]);
    }

    console.log(`✅ Image mapping saved: ${id} -> ${filename}`);

    // Return the saved image mapping
    const [selectRows] = await db.execute('SELECT * FROM images WHERE id = ?', [id]);
    const image = (selectRows as any[])[0];

    res.json(image);
  } catch (err) {
    console.error('Error saving image mapping:', err);
    res.status(500).json({ error: 'Failed to save image mapping' });
  }
});

// Update image mapping (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { filename, original_name, url, alt_text, page_id, description } = req.body;

  try {
    const [result] = await db.execute(`
      UPDATE images SET
        filename = COALESCE(?, filename),
        original_name = COALESCE(?, original_name),
        url = COALESCE(?, url),
        alt_text = COALESCE(?, alt_text),
        page_id = COALESCE(?, page_id),
        description = COALESCE(?, description),
        updated_at = NOW()
      WHERE id = ?
    `, [filename, original_name, url, alt_text, page_id, description, id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Image mapping not found' });
    }

    console.log(`📝 Image mapping updated: ${id}`);

    // Return the updated image mapping
    const [selectRows] = await db.execute('SELECT * FROM images WHERE id = ?', [id]);
    const image = (selectRows as any[])[0];

    res.json(image);
  } catch (err) {
    console.error('Error updating image mapping:', err);
    res.status(500).json({ error: 'Failed to update image mapping' });
  }
});

// Delete image mapping (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM images WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Image mapping not found' });
    }

    console.log(`🗑️ Image mapping deleted: ${id}`);
    res.json({ message: 'Image mapping deleted successfully' });
  } catch (err) {
    console.error('Error deleting image mapping:', err);
    res.status(500).json({ error: 'Failed to delete image mapping' });
  }
});

// Get images by page ID
router.get('/page/:pageId', async (req, res) => {
  const { pageId } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM images WHERE page_id = ? ORDER BY created_at DESC', [pageId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching images by page:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;