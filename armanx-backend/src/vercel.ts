import type { IncomingMessage, ServerResponse } from 'http';
import { connectDB } from './config/db';
import { createApp } from './server';

const app = createApp();
let dbReady = false;

const ensureDb = async () => {
  if (dbReady) return;
  await connectDB();
  dbReady = true;
};

export default async (req: IncomingMessage, res: ServerResponse) => {
  await ensureDb();
  return app(req, res);
};
