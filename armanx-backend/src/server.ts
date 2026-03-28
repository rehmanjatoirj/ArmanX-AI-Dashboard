import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { env, isTest } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import routes from './routes';
import { initializeSocket } from './socket/logSocket';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: [env.CLIENT_URL],
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isTest ? 'tiny' : 'dev'));

  app.use('/api/v1', apiLimiter, routes);
  app.use(errorHandler);

  return app;
};

export const app = createApp();

export const bootstrap = async () => {
  try {
    await connectDB();
    const { server } = initializeSocket(app);

    return await new Promise<void>((resolve) => {
      server.listen(env.PORT, () => {
        console.log(`Server listening on port ${env.PORT}`);
        resolve();
      });
    });
  } catch (error) {
    console.error('Backend bootstrap failed:', error);
    throw error;
  }
};

if (!isTest) {
  void bootstrap().catch(() => {
    process.exit(1);
  });
}
