import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { LeadModel } from '../models/Lead.model';
import { AppError } from '../types';

const serializeLead = (lead: any) => ({
  id: lead._id.toString(),
  agentId: lead.agentId.toString(),
  userId: lead.userId.toString(),
  linkedinUrl: lead.linkedinUrl,
  fullName: lead.fullName,
  jobTitle: lead.jobTitle,
  company: lead.company,
  email: lead.email,
  phone: lead.phone,
  status: lead.status,
  scrapedAt: lead.scrapedAt.toISOString(),
});

export const listLeads = async (
  userId: string,
  query: { agentId?: string; status?: string; page?: number; limit?: number },
) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

  if (query.agentId) {
    filter.agentId = new Types.ObjectId(query.agentId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  const leads = await LeadModel.find(filter)
    .sort({ scrapedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return leads.map(serializeLead);
};

export const getLeadById = async (id: string, userId: string) => {
  const lead = await LeadModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).lean();

  if (!lead) {
    throw new AppError('Lead not found', StatusCodes.NOT_FOUND);
  }

  return serializeLead(lead);
};

export const createLead = async (userId: string, payload: Record<string, unknown>) => {
  const lead = await LeadModel.create({
    ...payload,
    agentId: new Types.ObjectId(payload.agentId as string),
    userId: new Types.ObjectId(userId),
    scrapedAt: payload.scrapedAt ? new Date(payload.scrapedAt as string) : new Date(),
  });

  return getLeadById(lead._id.toString(), userId);
};

export const bulkCreateLeads = async (userId: string, leads: Record<string, unknown>[]) => {
  const created = await LeadModel.insertMany(
    leads.map((lead) => ({
      ...lead,
      agentId: new Types.ObjectId(lead.agentId as string),
      userId: new Types.ObjectId(userId),
      scrapedAt: lead.scrapedAt ? new Date(lead.scrapedAt as string) : new Date(),
    })),
  );

  return created.map((lead) => serializeLead(lead));
};

export const updateLead = async (id: string, userId: string, payload: Record<string, unknown>) => {
  const updatePayload = { ...payload } as Record<string, unknown>;

  if (payload.agentId) {
    updatePayload.agentId = new Types.ObjectId(payload.agentId as string);
  }

  if (payload.scrapedAt) {
    updatePayload.scrapedAt = new Date(payload.scrapedAt as string);
  }

  const lead = await LeadModel.findOneAndUpdate(
    { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
    updatePayload,
    { new: true },
  ).lean();

  if (!lead) {
    throw new AppError('Lead not found', StatusCodes.NOT_FOUND);
  }

  return serializeLead(lead);
};

export const deleteLead = async (id: string, userId: string) => {
  const deleted = await LeadModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });

  if (!deleted) {
    throw new AppError('Lead not found', StatusCodes.NOT_FOUND);
  }
};

export const exportLeadsForCsv = async (userId: string) => {
  const leads = await LeadModel.find({ userId: new Types.ObjectId(userId) }).sort({ scrapedAt: -1 }).lean();
  return leads.map(serializeLead);
};
