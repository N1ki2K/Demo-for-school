import express from 'express';
import { Request, Response } from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const dbPath = path.join(__dirname, '../../database/cms.db');

// Initialize events table
const initEventsTable = () => {
  const db = new Database(dbPath);
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('academic', 'extracurricular', 'meeting', 'holiday', 'other')),
      location TEXT,
      locale TEXT DEFAULT 'en',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createTableQuery);
  db.close();
};

// Initialize table on module load
initEventsTable();

// GET /api/events - Get all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = new Database(dbPath);
    const { locale = 'en', start, end } = req.query;
    
    let query = 'SELECT * FROM events WHERE locale = ? ORDER BY date ASC, startTime ASC';
    let params: any[] = [locale];
    
    // Optional date range filtering
    if (start && end) {
      query = 'SELECT * FROM events WHERE locale = ? AND date >= ? AND date <= ? ORDER BY date ASC, startTime ASC';
      params = [locale, start, end];
    }
    
    const events = db.prepare(query).all(...params);
    db.close();
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// GET /api/events/:id - Get specific event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = new Database(dbPath);
    const { id } = req.params;
    
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    db.close();
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// POST /api/events - Create new event
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, date, startTime, endTime, type, location, locale = 'en' } = req.body;
    
    // Validation
    if (!title || !date || !startTime || !endTime || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, date, startTime, endTime, type'
      });
    }
    
    const validTypes = ['academic', 'extracurricular', 'meeting', 'holiday', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type'
      });
    }
    
    const db = new Database(dbPath);
    const stmt = db.prepare(`
      INSERT INTO events (title, description, date, startTime, endTime, type, location, locale)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title,
      description || '',
      date,
      startTime,
      endTime,
      type,
      location || '',
      locale
    );
    
    db.close();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: result.lastInsertRowid,
        title,
        description,
        date,
        startTime,
        endTime,
        type,
        location,
        locale
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, type, location } = req.body;
    
    // Validation
    if (!title || !date || !startTime || !endTime || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, date, startTime, endTime, type'
      });
    }
    
    const validTypes = ['academic', 'extracurricular', 'meeting', 'holiday', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type'
      });
    }
    
    const db = new Database(dbPath);
    
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existingEvent) {
      db.close();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const stmt = db.prepare(`
      UPDATE events 
      SET title = ?, description = ?, date = ?, startTime = ?, endTime = ?, 
          type = ?, location = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      title,
      description || '',
      date,
      startTime,
      endTime,
      type,
      location || '',
      id
    );
    
    const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    db.close();
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const db = new Database(dbPath);
    
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existingEvent) {
      db.close();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(id);
    db.close();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

// GET /api/events/public/upcoming - Get upcoming public events (no auth required)
router.get('/public/upcoming', async (req: Request, res: Response) => {
  try {
    const db = new Database(dbPath);
    const { locale = 'en', limit = 10 } = req.query;
    
    const today = new Date().toISOString().split('T')[0];
    
    const events = db.prepare(`
      SELECT * FROM events 
      WHERE locale = ? AND date >= ? 
      ORDER BY date ASC, startTime ASC 
      LIMIT ?
    `).all(locale, today, Number(limit));
    
    db.close();
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming events'
    });
  }
});

export default router;