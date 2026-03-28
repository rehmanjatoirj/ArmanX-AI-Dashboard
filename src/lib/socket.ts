import { io, type Socket } from 'socket.io-client';
import type { LogEntry } from '../types';
import { useAgentStore } from '../store/agentStore';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket | null => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (!socketUrl) {
    return null;
  }

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('new-log', (log: LogEntry) => {
    useAgentStore.getState().addLog(log);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket error:', err.message);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
