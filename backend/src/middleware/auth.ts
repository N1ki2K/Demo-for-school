import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, AuthRequest } from '../types';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    (req as AuthRequest).user = decoded as User;
    next();
  });
};

export const generateToken = (user: Omit<User, 'created_at' | 'updated_at'>): string => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
};