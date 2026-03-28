import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface AuthUserPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface RequestUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: RequestUser;
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export interface JwtTokenPair {
  token: string;
  refreshToken: string;
}
