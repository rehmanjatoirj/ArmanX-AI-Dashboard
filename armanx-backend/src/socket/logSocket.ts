import { createServer, type Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { Express } from 'express';
import { env } from '../config/env';
import { verifyToken } from '../utils/jwt.utils';

let io: Server | null = null;
const isVercel = Boolean(process.env.VERCEL);

export const initializeSocket = (app: Express): { server: HttpServer; io: Server } => {
  const server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: [env.CLIENT_URL],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      return next();
    } catch (_error) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  return { server, io };
};

export const getIO = (): Server | null => {
  if (isVercel) {
    return null;
  }

  if (!io) {
    throw new Error('Socket.io has not been initialized.');
  }

  return io;
};
