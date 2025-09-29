import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

interface NewsArticle extends RowDataPacket {
  id: string;
  title_bg: string;
  title_en: string;
  excerpt_bg: string;
  excerpt_en: string;
  content_bg?: string;
  content_en?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  is_published: boolean;
  is_featured: boolean;
  published_date: string;
  created_at: string;
  updated_at: string;
}

// Get all news articles (public endpoint)
router.get('/', async (req, res: Response) => {
  const language = req.query.lang as string || 'bg';
  const published_only = req.query.published !== 'false'; // Default to true

  try {
    let stmt;
    let articles;

    if (published_only) {
      const [rows] = await db.execute('SELECT * FROM news WHERE is_published = true ORDER BY published_date DESC');
      articles = rows;
    } else {
      const [rows] = await db.execute('SELECT * FROM news ORDER BY published_date DESC');
      articles = rows;
    }

    // Format articles for the requested language
    const formattedArticles = (articles as NewsArticle[]).map((article: NewsArticle) => ({
      id: article.id,
      title: language === 'en' ? article.title_en : article.title_bg,
      excerpt: language === 'en' ? article.excerpt_en : article.excerpt_bg,
      content: language === 'en' ? article.content_en : article.content_bg,
      featuredImage: article.featured_image_url,
      featuredImageAlt: article.featured_image_alt,
      isPublished: article.is_published,
      isFeatured: article.is_featured,
      publishedDate: article.published_date,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    }));

    res.json(formattedArticles);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

// Get single news article by ID (public endpoint)
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const language = req.query.lang as string || 'bg';

  try {
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [id]);
    const article = (rows as NewsArticle[])[0];

    if (!article) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Format article for the requested language
    const formattedArticle = {
      id: article.id,
      title: language === 'en' ? article.title_en : article.title_bg,
      excerpt: language === 'en' ? article.excerpt_en : article.excerpt_bg,
      content: language === 'en' ? article.content_en : article.content_bg,
      featuredImage: article.featured_image_url,
      featuredImageAlt: article.featured_image_alt,
      isPublished: article.is_published,
      isFeatured: article.is_featured,
      publishedDate: article.published_date,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    };

    res.json(formattedArticle);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

// Get all news articles for CMS (admin only)
router.get('/admin/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news ORDER BY created_at DESC');
    const articles = rows;
    res.json(articles);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

// Create new news article (admin only)
router.post('/admin', authenticateToken, async (req: AuthRequest, res: Response) => {
  const {
    title_bg,
    title_en,
    excerpt_bg,
    excerpt_en,
    content_bg,
    content_en,
    featured_image_url,
    featured_image_alt,
    is_published = true,
    is_featured = false,
    published_date
  } = req.body;

  // Validation
  if (!title_bg || !title_en || !excerpt_bg || !excerpt_en) {
    return res.status(400).json({ error: 'Title and excerpt are required in both languages' });
  }

  const id = uuidv4();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL format
  const publishDate = published_date ? new Date(published_date).toISOString().slice(0, 19).replace('T', ' ') : now;

  try {
    await db.execute(
      `INSERT INTO news (
        id, title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
        featured_image_url, featured_image_alt, is_published, is_featured, 
        published_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
        featured_image_url, featured_image_alt, is_published, is_featured,
        publishDate, now, now
      ]
    );

    res.status(201).json({
      id,
      message: 'News article created successfully'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

// Update news article (admin only)
router.put('/admin/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title_bg,
    title_en,
    excerpt_bg,
    excerpt_en,
    content_bg,
    content_en,
    featured_image_url,
    featured_image_alt,
    is_published,
    is_featured,
    published_date
  } = req.body;

  // Validation
  if (!title_bg || !title_en || !excerpt_bg || !excerpt_en) {
    return res.status(400).json({ error: 'Title and excerpt are required in both languages' });
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL format

  try {
    const [result] = await db.execute(
      `UPDATE news SET 
        title_bg = ?, title_en = ?, excerpt_bg = ?, excerpt_en = ?, 
        content_bg = ?, content_en = ?, featured_image_url = ?, featured_image_alt = ?,
        is_published = ?, is_featured = ?, published_date = ?, updated_at = ?
      WHERE id = ?`,
      [
        title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
        featured_image_url, featured_image_alt, is_published, is_featured,
        published_date ? new Date(published_date).toISOString().slice(0, 19).replace('T', ' ') : published_date, now, id
      ]
    );

    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json({ message: 'News article updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

// Delete news article (admin only)
router.delete('/admin/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM news WHERE id = ?', [id]);

    if ((result as OkPacket).affectedRows === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json({ message: 'News article deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

// Get featured news articles (public endpoint)
router.get('/featured/latest', async (req, res: Response) => {
  const language = req.query.lang as string || 'bg';
  const limit = parseInt(req.query.limit as string) || 3;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM news WHERE is_published = true ORDER BY published_date DESC LIMIT ?',
      [limit]
    );
    const articles = rows;

    // Format articles for the requested language
    const formattedArticles = (articles as NewsArticle[]).map((article: NewsArticle) => ({
      id: article.id,
      title: language === 'en' ? article.title_en : article.title_bg,
      excerpt: language === 'en' ? article.excerpt_en : article.excerpt_bg,
      content: language === 'en' ? article.content_en : article.content_bg,
      featuredImage: article.featured_image_url,
      featuredImageAlt: article.featured_image_alt,
      isPublished: article.is_published,
      isFeatured: article.is_featured,
      publishedDate: article.published_date,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    }));

    res.json(formattedArticles);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch featured news' });
  }
});

export default router;