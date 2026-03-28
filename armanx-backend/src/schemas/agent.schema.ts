import { z } from 'zod';

export const createAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(['SCRAPER', 'MESSENGER', 'PUBLISHER', 'SOURCER']),
    queueCount: z.number().int().min(0).optional(),
    config: z.record(z.unknown()).optional(),
  }),
});

export const updateAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    type: z.enum(['SCRAPER', 'MESSENGER', 'PUBLISHER', 'SOURCER']).optional(),
    status: z.enum(['RUNNING', 'PAUSED', 'ERROR', 'IDLE']).optional(),
    queueCount: z.number().int().min(0).optional(),
    config: z.record(z.unknown()).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
