import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env, isTest } from '../config/env';

type MockJob = { id: string; remove: () => Promise<void> };

class MockQueue {
  async add(_name: string, _data: unknown) {
    return { id: `mock-job-${Date.now()}` };
  }

  async getJob(id: string): Promise<MockJob | null> {
    return {
      id,
      remove: async () => undefined,
    };
  }
}

const hasRedis = Boolean(env.REDIS_URL);

const connection =
  isTest || !hasRedis
    ? null
    : new IORedis(env.REDIS_URL as string, {
        maxRetriesPerRequest: null,
        lazyConnect: true,
        retryStrategy: () => null,
      });

export const agentQueue = isTest || !hasRedis
  ? new MockQueue()
  : new Queue('agent-jobs', {
      connection: connection as IORedis,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
      },
    });

export const queueConnection = connection;
