import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import { getDashboardMetrics, getFunnel, getTopSequences } from '../services/metrics.service';
import { sendSuccess } from '../utils/response.utils';

export const dashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await getDashboardMetrics(req.user!.id));
};

export const funnelMetrics = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await getFunnel(req.user!.id));
};

export const topSequences = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await getTopSequences(req.user!.id));
};
