import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedRequest } from '../types';
import { clearLogsByUser, getLogs } from '../services/log.service';
import { sendSuccess } from '../utils/response.utils';

export const getLogsHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(
    res,
    await getLogs(req.user!.id, {
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
      tag: req.query.tag?.toString(),
    }),
  );
};

export const clearLogsHandler = async (req: AuthenticatedRequest, res: Response) => {
  await clearLogsByUser(req.user!.id);
  return res.status(StatusCodes.NO_CONTENT).send();
};
