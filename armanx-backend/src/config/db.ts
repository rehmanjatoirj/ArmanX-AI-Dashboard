import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (uri = env.MONGODB_URI): Promise<typeof mongoose> => {
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  logger.info(`MongoDB connected: ${connection.connection.name}`);
  return connection;
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
