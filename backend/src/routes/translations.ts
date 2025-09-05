import { Router } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/translations - Get all translations or by language
router.get('/', (req, res) => {
  const { lang, category } = req.query;
  
  let query = 'SELECT * FROM translations WHERE is_active = 1';
  const params: any[] = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY category, key_path';
  
  db.all(query, params, (err, rows: any[]) => {
    if (err) {
      console.error('Error fetching translations:', err);
      res.status(500).json({ error: 'Failed to fetch translations' });
      return;
    }
    
    if (lang) {
      // Return translations for specific language in flattened format
      const translations: { [key: string]: string } = {};
      rows.forEach((row) => {
        const text = lang === 'en' ? row.text_en : row.text_bg;
        if (text) {
          translations[row.key_path] = text;
        }
      });
      res.json(translations);
    } else {
      // Return full translation objects for CMS
      res.json({ success: true, translations: rows });
    }
  });
});

// GET /api/translations/:id - Get specific translation
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM translations WHERE id = ? AND is_active = 1', [id], (err, row) => {
    if (err) {
      console.error('Error fetching translation:', err);
      res.status(500).json({ error: 'Failed to fetch translation' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Translation not found' });
      return;
    }
    
    res.json({ success: true, translation: row });
  });
});

// PUT /api/translations/:id - Update translation (requires auth)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text_bg, text_en, description } = req.body;
  
  db.run(
    `UPDATE translations 
     SET text_bg = ?, text_en = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [text_bg, text_en, description, id],
    function(err) {
      if (err) {
        console.error('Error updating translation:', err);
        res.status(500).json({ error: 'Failed to update translation' });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Translation not found' });
        return;
      }
      
      res.json({ success: true, message: 'Translation updated successfully' });
    }
  );
});

// POST /api/translations - Create new translation (requires auth)
router.post('/', authenticateToken, (req, res) => {
  const { key_path, text_bg, text_en, description, category } = req.body;
  
  if (!key_path) {
    res.status(400).json({ error: 'key_path is required' });
    return;
  }
  
  const id = key_path.replace(/\./g, '_');
  
  db.run(
    `INSERT INTO translations (id, key_path, text_bg, text_en, description, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, key_path, text_bg, text_en, description, category || 'general'],
    function(err) {
      if (err) {
        console.error('Error creating translation:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(409).json({ error: 'Translation with this key already exists' });
        } else {
          res.status(500).json({ error: 'Failed to create translation' });
        }
        return;
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'Translation created successfully',
        id: id 
      });
    }
  );
});

// DELETE /api/translations/:id - Delete translation (requires auth)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE translations SET is_active = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting translation:', err);
      res.status(500).json({ error: 'Failed to delete translation' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Translation not found' });
      return;
    }
    
    res.json({ success: true, message: 'Translation deleted successfully' });
  });
});

// GET /api/translations/nested/:lang - Get translations in nested object format
router.get('/nested/:lang', (req, res) => {
  const { lang } = req.params;
  
  db.all(
    'SELECT key_path, text_bg, text_en FROM translations WHERE is_active = 1',
    [],
    (err, rows: any[]) => {
      if (err) {
        console.error('Error fetching nested translations:', err);
        res.status(500).json({ error: 'Failed to fetch translations' });
        return;
      }
      
      // Build nested object from dot notation keys
      const nested: any = {};
      
      rows.forEach((row) => {
        const text = lang === 'en' ? row.text_en : row.text_bg;
        if (!text) return;
        
        const keys = row.key_path.split('.');
        let current = nested;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!(keys[i] in current)) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = text;
      });
      
      res.json(nested);
    }
  );
});

export default router;