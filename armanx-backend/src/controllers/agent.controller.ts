import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedRequest } from '../types';
import {
  createAgent,
  deleteAgent,
  getAgentById,
  listAgents,
  pauseAgent,
  restartAgent,
  startAgent,
  updateAgent,
} from '../services/agent.service';
import { sendSuccess } from '../utils/response.utils';

const paramValue = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

export const getAgents = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await listAgents(req.user!.id));
};

export const getAgent = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await getAgentById(paramValue(req.params.id), req.user!.id));
};

export const createAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await createAgent(req.user!.id, req.body), StatusCodes.CREATED);
};

export const updateAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await updateAgent(paramValue(req.params.id), req.user!.id, req.body));
};

export const deleteAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  await deleteAgent(paramValue(req.params.id), req.user!.id);
  return res.status(StatusCodes.NO_CONTENT).send();
};

export const startAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await startAgent(paramValue(req.params.id), req.user!.id));
};

export const pauseAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await pauseAgent(paramValue(req.params.id), req.user!.id));
};

export const restartAgentHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await restartAgent(paramValue(req.params.id), req.user!.id));
};
