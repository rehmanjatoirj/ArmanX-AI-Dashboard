import { Types } from 'mongoose';
import { ActivityLogModel, type LogTag } from '../models/ActivityLog.model';
import { getIO } from '../socket/logSocket';

interface AddLogInput {
  userId: string;
  agentId?: string;
  tag: LogTag;
  message: string;
}

export const addLog = async ({ userId, agentId, tag, message }: AddLogInput) => {
  const log = await ActivityLogModel.create({
    userId: new Types.ObjectId(userId),
    agentId: agentId ? new Types.ObjectId(agentId) : undefined,
    tag,
    message,
  });

  try {
    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit('new-log', {
        id: log._id.toString(),
        tag: log.tag,
        message: log.message,
        timestamp: log.createdAt.toISOString(),
        createdAt: log.createdAt.toISOString(),
      });
    }
  } catch (_error) {
    // Socket server may not be booted in isolated tests.
  }

  return log;
};

export const getLogs = async (userId: string, options: { limit?: number; offset?: number; tag?: string }) => {
  const { limit = 50, offset = 0, tag } = options;
  const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

  if (tag) {
    filter.tag = tag;
  }

  const logs = await ActivityLogModel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();

  return logs.map((log) => ({
    id: log._id.toString(),
    tag: log.tag,
    message: log.message,
    timestamp: log.createdAt.toISOString(),
    createdAt: log.createdAt.toISOString(),
  }));
};

export const clearLogsByUser = async (userId: string) => {
  await ActivityLogModel.deleteMany({ userId: new Types.ObjectId(userId) });
};
