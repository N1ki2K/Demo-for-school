import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/init';
import { generateToken, authenticateToken } from '../middleware/auth';
import { LoginRequest, User, AuthRequest } from '../types';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username],
      (err, user: any) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });

        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  res.json({ user: (req as AuthRequest).user });
});

// Logout endpoint (client handles token removal)
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// Change password endpoint
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as AuthRequest).user!.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    db.get('SELECT password_hash FROM users WHERE id = ?', [userId], (err, user: any) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = bcrypt.compareSync(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      
      db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedNewPassword, userId],
        function(updateErr) {
          if (updateErr) {
            console.error('Password update error:', updateErr);
            return res.status(500).json({ error: 'Failed to update password' });
          }

          res.json({ message: 'Password updated successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;