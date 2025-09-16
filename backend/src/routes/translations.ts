import { Router, Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface Translation extends RowDataPacket {
    id: string;
    key_path: string;
    text_bg: string;
    text_en: string;
    description: string;
    category: string;
    is_active: boolean;
}

// GET /api/translations - Get all translations or by language
router.get('/', async (req: Request, res: Response) => {
    const { lang, category } = req.query;

    let query = 'SELECT * FROM translations WHERE is_active = true';
    const params: any[] = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    query += ' ORDER BY category, key_path';

    try {
        const [rows] = await db.execute(query, params);
        const translations = rows as Translation[];

        if (lang) {
            const translationsObj: { [key: string]: string } = {};
            translations.forEach((row) => {
                const text = lang === 'en' ? row.text_en : row.text_bg;
                if (text) {
                    translationsObj[row.key_path] = text;
                }
            });
            res.json(translationsObj);
        } else {
            res.json({ success: true, translations });
        }
    } catch (err) {
        console.error('Error fetching translations:', err);
        res.status(500).json({ error: 'Failed to fetch translations' });
    }
});

// GET /api/translations/:id - Get specific translation
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM translations WHERE id = ? AND is_active = true',
            [id]
        );
        const translations = rows as Translation[];

        if (translations.length === 0) {
            return res.status(404).json({ error: 'Translation not found' });
        }

        res.json({ success: true, translation: translations[0] });
    } catch (err) {
        console.error('Error fetching translation:', err);
        res.status(500).json({ error: 'Failed to fetch translation' });
    }
});

// PUT /api/translations/:id - Update translation (requires auth)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text_bg, text_en, description } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE translations SET text_bg = ?, text_en = ?, description = ?, updated_at = NOW() WHERE id = ?`,
            [text_bg, text_en, description, id]
        );

        if ((result as OkPacket).affectedRows === 0) {
            return res.status(404).json({ error: 'Translation not found' });
        }

        res.json({ success: true, message: 'Translation updated successfully' });
    } catch (err) {
        console.error('Error updating translation:', err);
        res.status(500).json({ error: 'Failed to update translation' });
    }
});

// POST /api/translations - Create new translation (requires auth)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { key_path, text_bg, text_en, description, category } = req.body;

    if (!key_path) {
        return res.status(400).json({ error: 'key_path is required' });
    }

    const id = key_path.replace(/\./g, '_');

    try {
        await db.execute(
            `INSERT INTO translations (id, key_path, text_bg, text_en, description, category) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, key_path, text_bg, text_en, description, category || 'general']
        );

        res.status(201).json({ 
            success: true, 
            message: 'Translation created successfully',
            id: id 
        });
    } catch (err: any) {
        console.error('Error creating translation:', err);
        if ((err as any).code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Translation with this key already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create translation' });
        }
    }
});

// DELETE /api/translations/:id - Delete translation (requires auth)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute(
            'UPDATE translations SET is_active = false WHERE id = ?',
            [id]
        );

        if ((result as OkPacket).affectedRows === 0) {
            return res.status(404).json({ error: 'Translation not found' });
        }

        res.json({ success: true, message: 'Translation deleted successfully' });
    } catch (err) {
        console.error('Error deleting translation:', err);
        res.status(500).json({ error: 'Failed to delete translation' });
    }
});

// GET /api/translations/nested/:lang - Get translations in nested object format
router.get('/nested/:lang', async (req: Request, res: Response) => {
    const { lang } = req.params;

    try {
        const [rows] = await db.execute(
            'SELECT key_path, text_bg, text_en FROM translations WHERE is_active = true'
        );
        const translations = rows as Translation[];

        const nested: any = {};

        translations.forEach((row) => {
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
    } catch (err) {
        console.error('Error fetching nested translations:', err);
        res.status(500).json({ error: 'Failed to fetch translations' });
    }
});

export default router;
