import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

interface NewsArticle {
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
router.get('/', (req, res: Response) => {
  const language = req.query.lang as string || 'bg';
  const published_only = req.query.published !== 'false'; // Default to true

  let sql = 'SELECT * FROM news';
  const params: any[] = [];

  if (published_only) {
    sql += ' WHERE is_published = 1';
  }

  sql += ' ORDER BY published_date DESC';

  db.all(sql, params, (err, articles: NewsArticle[]) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch news articles' });
    }

    // Format articles for the requested language
    const formattedArticles = articles.map(article => ({
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
  });
});

// Get single news article by ID (public endpoint)
router.get('/:id', (req, res: Response) => {
  const { id } = req.params;
  const language = req.query.lang as string || 'bg';

  db.get('SELECT * FROM news WHERE id = ?', [id], (err, article: NewsArticle) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch news article' });
    }

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
  });
});

// Get all news articles for CMS (admin only)
router.get('/admin/all', authenticateToken, (req: AuthRequest, res: Response) => {
  db.all('SELECT * FROM news ORDER BY created_at DESC', (err, articles: NewsArticle[]) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch news articles' });
    }

    res.json(articles);
  });
});

// Create new news article (admin only)
router.post('/admin', authenticateToken, (req: AuthRequest, res: Response) => {
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
  const now = new Date().toISOString();
  const publishDate = published_date || now;

  db.run(
    `INSERT INTO news (
      id, title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
      featured_image_url, featured_image_alt, is_published, is_featured, 
      published_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
      featured_image_url, featured_image_alt, is_published, is_featured,
      publishDate, now, now
    ],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create news article' });
      }

      res.status(201).json({
        id,
        message: 'News article created successfully'
      });
    }
  );
});

// Update news article (admin only)
router.put('/admin/:id', authenticateToken, (req: AuthRequest, res: Response) => {
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

  const now = new Date().toISOString();

  db.run(
    `UPDATE news SET 
      title_bg = ?, title_en = ?, excerpt_bg = ?, excerpt_en = ?, 
      content_bg = ?, content_en = ?, featured_image_url = ?, featured_image_alt = ?,
      is_published = ?, is_featured = ?, published_date = ?, updated_at = ?
    WHERE id = ?`,
    [
      title_bg, title_en, excerpt_bg, excerpt_en, content_bg, content_en,
      featured_image_url, featured_image_alt, is_published, is_featured,
      published_date, now, id
    ],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update news article' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'News article not found' });
      }

      res.json({ message: 'News article updated successfully' });
    }
  );
});

// Delete news article (admin only)
router.delete('/admin/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete news article' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    res.json({ message: 'News article deleted successfully' });
  });
});

// Get featured news articles (public endpoint)
router.get('/featured/latest', (req, res: Response) => {
  const language = req.query.lang as string || 'bg';
  const limit = parseInt(req.query.limit as string) || 3;

  db.all(
    'SELECT * FROM news WHERE is_published = 1 ORDER BY published_date DESC LIMIT ?',
    [limit],
    (err, articles: NewsArticle[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch featured news' });
      }

      // Format articles for the requested language
      const formattedArticles = articles.map(article => ({
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
    }
  );
});

export default router;