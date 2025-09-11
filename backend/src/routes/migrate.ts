import { Router, Request, Response } from 'express';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Migrate achievements from content_sections to school_achievements table
router.post('/achievements', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('🚀 Starting achievements migration...');
    
    // Get achievements from content_sections table
    const getOldAchievements = `
      SELECT content FROM content_sections 
      WHERE id LIKE '%achievements-list%' AND type = 'list'
    `;
    
    db.all(getOldAchievements, [], async (err, rows: any[]) => {
      if (err) {
        console.error('Error fetching old achievements:', err);
        return res.status(500).json({ error: 'Failed to fetch old achievements' });
      }
      
      console.log('📊 Found old achievement records:', rows.length);
      
      let totalMigrated = 0;
      
      for (const row of rows) {
        try {
          const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
          
          if (Array.isArray(content)) {
            for (let i = 0; i < content.length; i++) {
              const achievementText = content[i];
              
              if (achievementText && achievementText.trim()) {
                // Insert into new table
                const insertSql = `
                  INSERT INTO school_achievements (title, position, is_active, created_at, updated_at)
                  VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `;
                
                await new Promise<void>((resolve, reject) => {
                  db.run(insertSql, [achievementText.trim(), i], function(err) {
                    if (err) {
                      console.error('Error inserting achievement:', err);
                      reject(err);
                    } else {
                      console.log('✅ Migrated achievement:', achievementText.trim());
                      totalMigrated++;
                      resolve();
                    }
                  });
                });
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing achievement content:', parseError);
        }
      }
      
      console.log(`🎉 Migration complete! Migrated ${totalMigrated} achievements`);
      res.json({ 
        success: true, 
        message: `Successfully migrated ${totalMigrated} achievements from old system to new database table`,
        migratedCount: totalMigrated
      });
    });
    
  } catch (error) {
    console.error('Error in achievements migration:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
});

// Check migration status
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Count old achievements
    const countOldSql = `
      SELECT COUNT(*) as old_count FROM content_sections 
      WHERE id LIKE '%achievements-list%' AND type = 'list'
    `;
    
    // Count new achievements
    const countNewSql = `SELECT COUNT(*) as new_count FROM school_achievements WHERE is_active = 1`;
    
    db.get(countOldSql, [], (err, oldRow: any) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to count old achievements' });
      }
      
      db.get(countNewSql, [], (err, newRow: any) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to count new achievements' });
        }
        
        res.json({
          oldSystem: oldRow.old_count,
          newSystem: newRow.new_count,
          needsMigration: oldRow.old_count > 0 && newRow.new_count === 0
        });
      });
    });
    
  } catch (error) {
    console.error('Error checking migration status:', error);
    res.status(500).json({ error: 'Failed to check migration status' });
  }
});

export default router;