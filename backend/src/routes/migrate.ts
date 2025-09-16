import { Router, Request, Response } from 'express';
import { db } from '../database/init-mysql';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface OldAchievement {
    content: string;
}

// Migrate achievements from content_sections to school_achievements table
router.post('/achievements', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🚀 Starting achievements migration...');

        const [rows] = await db.execute(`SELECT content FROM content_sections WHERE id LIKE '%achievements-list%' AND type = 'list'`);
        const oldAchievements = rows as OldAchievement[];

        console.log('📊 Found old achievement records:', oldAchievements.length);

        let totalMigrated = 0;

        for (const row of oldAchievements) {
            try {
                const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;

                if (Array.isArray(content)) {
                    for (let i = 0; i < content.length; i++) {
                        const achievementText = content[i];

                        if (achievementText && achievementText.trim()) {
                            await db.execute(`INSERT INTO school_achievements (title, position, is_active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())`, [achievementText.trim(), i]);
                            console.log('✅ Migrated achievement:', achievementText.trim());
                            totalMigrated++;
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

    } catch (error) {
        console.error('Error in achievements migration:', error);
        res.status(500).json({ error: 'Migration failed' });
    }
});

// Check migration status
router.get('/status', async (req: Request, res: Response) => {
    try {
        const [oldRows] = await db.execute(`SELECT COUNT(*) as old_count FROM content_sections WHERE id LIKE '%achievements-list%' AND type = 'list'`);
        const [newRows] = await db.execute(`SELECT COUNT(*) as new_count FROM school_achievements WHERE is_active = 1`);

        const oldResult = (oldRows as any[])[0];
        const newResult = (newRows as any[])[0];

        res.json({
            oldSystem: oldResult.old_count,
            newSystem: newResult.new_count,
            needsMigration: oldResult.old_count > 0 && newResult.new_count === 0
        });

    } catch (error) {
        console.error('Error checking migration status:', error);
        res.status(500).json({ error: 'Failed to check migration status' });
    }
});

export default router;
