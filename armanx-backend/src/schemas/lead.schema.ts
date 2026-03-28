import { z } from 'zod';

const leadBase = z.object({
  agentId: z.string().min(1),
  linkedinUrl: z.string().url(),
  fullName: z.string().min(2),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  status: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'MEETING_BOOKED', 'REJECTED']).optional(),
  scrapedAt: z.string().datetime().optional(),
});

export const createLeadSchema = z.object({
  body: leadBase,
});

export const bulkLeadSchema = z.object({
  body: z.object({
    leads: z.array(leadBase).min(1).max(500),
  }),
});

export const updateLeadSchema = z.object({
  body: leadBase.partial(),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const leadQuerySchema = z.object({
  query: z.object({
    agentId: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'MEETING_BOOKED', 'REJECTED']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});
