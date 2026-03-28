import { z } from 'zod';

const stepSchema = z.object({
  order: z.number().int().min(1),
  channel: z.string().min(2),
  message: z.string().min(1),
  delayHours: z.number().min(0),
});

export const createSequenceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    targetMarket: z.string().min(2),
    replyRate: z.number().min(0).max(100).optional(),
    activeCount: z.number().int().min(0).optional(),
    steps: z.array(stepSchema).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateSequenceSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    targetMarket: z.string().min(2).optional(),
    replyRate: z.number().min(0).max(100).optional(),
    activeCount: z.number().int().min(0).optional(),
    steps: z.array(stepSchema).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
