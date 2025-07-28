/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
// src/api/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;   // put e.g. JWT_SECRET=dev-secret in .env

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const hdr = req.header('Authorization') ?? '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);  // throws if invalid / expired
    console.log('jwt secret', JWT_SECRET)
    next();
  } catch(err: any) {
    console.error('verify error:', err.name, err.message);
    
    res.status(401).json({ message: 'Invalid or expired token' });
  }

  
}

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}
