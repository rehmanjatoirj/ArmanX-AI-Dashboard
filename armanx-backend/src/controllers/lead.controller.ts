import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedRequest } from '../types';
import {
  bulkCreateLeads,
  createLead,
  deleteLead,
  exportLeadsForCsv,
  getLeadById,
  listLeads,
  updateLead,
} from '../services/lead.service';
import { streamCsv } from '../utils/csv.utils';
import { sendSuccess } from '../utils/response.utils';

const paramValue = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await listLeads(req.user!.id, req.query as Record<string, string>));
};

export const getLead = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await getLeadById(paramValue(req.params.id), req.user!.id));
};

export const createLeadHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await createLead(req.user!.id, req.body), StatusCodes.CREATED);
};

export const bulkCreateLeadsHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await bulkCreateLeads(req.user!.id, req.body.leads), StatusCodes.CREATED);
};

export const updateLeadHandler = async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, await updateLead(paramValue(req.params.id), req.user!.id, req.body));
};

export const deleteLeadHandler = async (req: AuthenticatedRequest, res: Response) => {
  await deleteLead(paramValue(req.params.id), req.user!.id);
  return res.status(StatusCodes.NO_CONTENT).send();
};

export const exportLeadsCsvHandler = async (req: AuthenticatedRequest, res: Response) => {
  const leads = await exportLeadsForCsv(req.user!.id);
  streamCsv(
    res,
    'leads.csv',
    ['id', 'agentId', 'userId', 'linkedinUrl', 'fullName', 'jobTitle', 'company', 'email', 'phone', 'status', 'scrapedAt'],
    leads,
  );
};
