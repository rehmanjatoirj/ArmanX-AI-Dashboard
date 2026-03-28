import type { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.utils';
import type { AuthenticatedRequest } from '../types';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch (_error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
  }
};
