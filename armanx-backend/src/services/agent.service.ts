import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { AgentModel } from '../models/Agent.model';
import { addLog } from './log.service';
import { agentQueue } from '../jobs/queue';
import { AppError } from '../types';

const agentFilter = (id: string, userId: string) => ({
  _id: new Types.ObjectId(id),
  userId: new Types.ObjectId(userId),
});

export const listAgents = async (userId: string) => {
  const agents = await AgentModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();

  return agents.map((agent) => ({
    id: agent._id.toString(),
    name: agent.name,
    type: agent.type.toLowerCase(),
    status: agent.status.toLowerCase(),
    queueCount: agent.queueCount,
    lastRunAt: agent.lastRunAt ? agent.lastRunAt.toISOString() : '',
  }));
};

export const getAgentById = async (id: string, userId: string) => {
  const agent = await AgentModel.findOne(agentFilter(id, userId)).lean();

  if (!agent) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }

  return {
    id: agent._id.toString(),
    name: agent.name,
    type: agent.type.toLowerCase(),
    status: agent.status.toLowerCase(),
    queueCount: agent.queueCount,
    lastRunAt: agent.lastRunAt ? agent.lastRunAt.toISOString() : '',
  };
};

export const createAgent = async (
  userId: string,
  payload: { name: string; type: 'SCRAPER' | 'MESSENGER' | 'PUBLISHER' | 'SOURCER'; queueCount?: number; config?: Record<string, unknown> },
) => {
  const agent = await AgentModel.create({
    userId: new Types.ObjectId(userId),
    name: payload.name,
    type: payload.type,
    queueCount: payload.queueCount ?? 0,
    config: payload.config ?? {},
  });

  return getAgentById(agent._id.toString(), userId);
};

export const updateAgent = async (
  id: string,
  userId: string,
  payload: Partial<{ name: string; type: 'SCRAPER' | 'MESSENGER' | 'PUBLISHER' | 'SOURCER'; status: string; queueCount: number; config: Record<string, unknown> }>,
) => {
  const agent = await AgentModel.findOneAndUpdate(agentFilter(id, userId), payload, { new: true }).lean();

  if (!agent) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }

  return {
    id: agent._id.toString(),
    name: agent.name,
    type: agent.type.toLowerCase(),
    status: agent.status.toLowerCase(),
    queueCount: agent.queueCount,
    lastRunAt: agent.lastRunAt ? agent.lastRunAt.toISOString() : '',
  };
};

export const deleteAgent = async (id: string, userId: string) => {
  const deleted = await AgentModel.findOneAndDelete(agentFilter(id, userId));

  if (!deleted) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }
};

export const startAgent = async (id: string, userId: string) => {
  const agent = await AgentModel.findOne(agentFilter(id, userId));

  if (!agent) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }

  if (agent.status === 'RUNNING') {
    throw new AppError('Agent is already running', StatusCodes.BAD_REQUEST);
  }

  const job = await agentQueue.add(
    'run-agent',
    { agentId: id, userId },
    { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
  );

  agent.status = 'RUNNING';
  agent.config = { ...(agent.config ?? {}), jobId: job.id };
  await agent.save();

  await addLog({ userId, agentId: id, tag: 'System', message: 'Agent started' });

  return getAgentById(id, userId);
};

export const pauseAgent = async (id: string, userId: string) => {
  const agent = await AgentModel.findOne(agentFilter(id, userId));

  if (!agent) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }

  if (agent.status !== 'RUNNING') {
    throw new AppError('Agent is not running', StatusCodes.BAD_REQUEST);
  }

  const jobId = agent.config?.jobId as string | undefined;

  if (jobId) {
    const job = await agentQueue.getJob(jobId);
    await job?.remove();
  }

  agent.status = 'PAUSED';
  await agent.save();

  await addLog({ userId, agentId: id, tag: 'System', message: 'Agent paused' });

  return getAgentById(id, userId);
};

export const restartAgent = async (id: string, userId: string) => {
  const agent = await AgentModel.findOne(agentFilter(id, userId));

  if (!agent) {
    throw new AppError('Agent not found', StatusCodes.NOT_FOUND);
  }

  if (agent.status === 'RUNNING') {
    await pauseAgent(id, userId);
  }

  return startAgent(id, userId);
};
