import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { OkPacket, RowDataPacket } from 'mysql2';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/events - Get all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'en', start, end } = req.query;
    
    let stmt;
    let events;
    
    // Optional date range filtering
    if (start && end) {
      const [rows] = await db.execute(
        'SELECT * FROM events WHERE start_date >= ? AND start_date <= ? ORDER BY start_date ASC',
        [start, end]
      );
      events = rows;
    } else {
      const [rows] = await db.execute('SELECT * FROM events ORDER BY start_date ASC');
      events = rows;
    }
    
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
    const { id } = req.params;
    
    const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const event = (rows as RowDataPacket[])[0];
    
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
    const { 
      title_bg, 
      title_en, 
      description_bg, 
      description_en, 
      start_date, 
      end_date, 
      location, 
      is_public = true 
    } = req.body;
    
    // Validation
    if (!title_bg || !title_en || !start_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title_bg, title_en, start_date'
      });
    }
    
    const [result] = await db.execute(
      `INSERT INTO events (title_bg, title_en, description_bg, description_en, start_date, end_date, location, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title_bg,
        title_en,
        description_bg || '',
        description_en || '',
        start_date,
        end_date,
        location || '',
        is_public
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: (result as OkPacket).insertId,
        title_bg,
        title_en,
        description_bg,
        description_en,
        start_date,
        end_date,
        location,
        is_public
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
    const { 
      title_bg, 
      title_en, 
      description_bg, 
      description_en, 
      start_date, 
      end_date, 
      location, 
      is_public 
    } = req.body;
    
    // Validation
    if (!title_bg || !title_en || !start_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title_bg, title_en, start_date'
      });
    }
    
    // Check if event exists
    const [checkRows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const existingEvent = (checkRows as RowDataPacket[])[0];
    
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await db.execute(
      `UPDATE events 
       SET title_bg = ?, title_en = ?, description_bg = ?, description_en = ?, 
           start_date = ?, end_date = ?, location = ?, is_public = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        title_bg,
        title_en,
        description_bg || '',
        description_en || '',
        start_date,
        end_date,
        location || '',
        is_public,
        id
      ]
    );
    
    const [updatedRows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const updatedEvent = (updatedRows as RowDataPacket[])[0];
    
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
    
    // Check if event exists
    const [deleteCheckRows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const existingEventToDelete = (deleteCheckRows as RowDataPacket[])[0];
    
    if (!existingEventToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await db.execute('DELETE FROM events WHERE id = ?', [id]);
    
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
    const { limit = 10 } = req.query;
    
    const today = new Date().toISOString().split('T')[0];
    
    const [rows] = await db.execute(
      `SELECT * FROM events 
       WHERE is_public = true AND start_date >= ? 
       ORDER BY start_date ASC 
       LIMIT ?`,
      [today, Number(limit)]
    );
    
    const events = rows;
    
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