import { Router } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get image by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching image:', err);
      return res.status(500).json({ error: 'Failed to fetch image' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(row);
  });
});

// Get all images
router.get('/', (req, res) => {
  db.all('SELECT * FROM images ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
    
    res.json(rows);
  });
});

// Set/Update image mapping (admin only)
router.post('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { filename, original_name, url, alt_text, page_id, description } = req.body;
  
  if (!filename || !url) {
    return res.status(400).json({ error: 'Filename and URL are required' });
  }
  
  const sql = `
    INSERT INTO images (id, filename, original_name, url, alt_text, page_id, description, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      filename = excluded.filename,
      original_name = excluded.original_name,
      url = excluded.url,
      alt_text = excluded.alt_text,
      page_id = excluded.page_id,
      description = excluded.description,
      updated_at = CURRENT_TIMESTAMP
  `;
  
  db.run(sql, [id, filename, original_name || null, url, alt_text || null, page_id || null, description || null], function(err) {
    if (err) {
      console.error('Error saving image mapping:', err);
      return res.status(500).json({ error: 'Failed to save image mapping' });
    }
    
    console.log(`✅ Image mapping saved: ${id} -> ${filename}`);
    
    // Return the saved image mapping
    db.get('SELECT * FROM images WHERE id = ?', [id], (selectErr, row) => {
      if (selectErr) {
        console.error('Error fetching saved image:', selectErr);
        return res.status(500).json({ error: 'Saved but failed to fetch image' });
      }
      
      res.json(row);
    });
  });
});

// Update image mapping (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { filename, original_name, url, alt_text, page_id, description } = req.body;
  
  const sql = `
    UPDATE images SET 
      filename = COALESCE(?, filename),
      original_name = COALESCE(?, original_name),
      url = COALESCE(?, url),
      alt_text = COALESCE(?, alt_text),
      page_id = COALESCE(?, page_id),
      description = COALESCE(?, description),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [filename, original_name, url, alt_text, page_id, description, id], function(err) {
    if (err) {
      console.error('Error updating image mapping:', err);
      return res.status(500).json({ error: 'Failed to update image mapping' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Image mapping not found' });
    }
    
    console.log(`📝 Image mapping updated: ${id}`);
    
    // Return the updated image mapping
    db.get('SELECT * FROM images WHERE id = ?', [id], (selectErr, row) => {
      if (selectErr) {
        console.error('Error fetching updated image:', selectErr);
        return res.status(500).json({ error: 'Updated but failed to fetch image' });
      }
      
      res.json(row);
    });
  });
});

// Delete image mapping (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM images WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting image mapping:', err);
      return res.status(500).json({ error: 'Failed to delete image mapping' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Image mapping not found' });
    }
    
    console.log(`🗑️ Image mapping deleted: ${id}`);
    res.json({ message: 'Image mapping deleted successfully' });
  });
});

// Get images by page ID
router.get('/page/:pageId', (req, res) => {
  const { pageId } = req.params;
  
  db.all('SELECT * FROM images WHERE page_id = ? ORDER BY created_at DESC', [pageId], (err, rows) => {
    if (err) {
      console.error('Error fetching images by page:', err);
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
    
    res.json(rows);
  });
});

export default router;