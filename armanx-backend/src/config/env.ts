import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path:
    process.env.NODE_ENV === 'test'
      ? path.resolve(process.cwd(), '.env.test')
      : path.resolve(process.cwd(), '.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().min(1).optional(),
  MONGO_URI: z.string().min(1).optional(),
  REDIS_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('30m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  CLIENT_URL: z.string().url().default('http://localhost:5173')
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  MONGODB_URI: parsed.MONGODB_URI ?? parsed.MONGO_URI,
};

if (!env.MONGODB_URI) {
  throw new Error('MONGODB_URI or MONGO_URI must be provided.');
}
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
