import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getCurrentUser, loginUser, refreshAccessToken, registerUser } from '../services/auth.service';
import { sendSuccess } from '../utils/response.utils';
import type { AuthenticatedRequest } from '../types';

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  return sendSuccess(res, result, StatusCodes.CREATED);
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  return sendSuccess(res, result);
};

export const refresh = async (req: Request, res: Response) => {
  const result = await refreshAccessToken(req.body.refreshToken);
  return sendSuccess(res, result);
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getCurrentUser(req.user!.id);
  return sendSuccess(res, result);
};
