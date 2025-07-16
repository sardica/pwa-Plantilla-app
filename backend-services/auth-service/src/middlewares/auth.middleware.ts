// backend-services/auth-service/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { env } from '../config/env.js';

// Extiende la interfaz global de Request para que TypeScript
// reconozca la propiedad `user` que añadimos en el middleware.
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // El token debe venir en el formato "Bearer <token>"
  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token format is invalid' });
  }

  jwt.verify(token, env.JWT_SECRET, (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
    if (err || typeof user !== 'object') {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = { id: (user as JwtPayload).id };
    next();
  });
};
