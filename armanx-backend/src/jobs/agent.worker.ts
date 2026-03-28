import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import mongoose, { Types } from 'mongoose';
import { env } from '../config/env';
import { connectDB } from '../config/db';
import { AgentModel } from '../models/Agent.model';
import { LeadModel } from '../models/Lead.model';
import { addLog } from '../services/log.service';

const MOCK_LEADS = [
  { fullName: 'Ali Hassan', jobTitle: 'CTO', company: 'TechPK Solutions' },
  { fullName: 'Sara Ahmed', jobTitle: 'VP Sales', company: 'Gulf Ventures LLC' },
  { fullName: 'Usman Malik', jobTitle: 'Founder & CEO', company: 'Lahore SaaS Co' },
  { fullName: 'Fatima Al-Said', jobTitle: 'HR Director', company: 'Dubai Digital Hub' },
  { fullName: 'Omar Sheikh', jobTitle: 'Head of Growth', company: 'Karachi Tech Hub' },
  { fullName: 'Zainab Qureshi', jobTitle: 'Marketing Lead', company: 'Islamabad AI Labs' },
  { fullName: 'Bilal Chaudhry', jobTitle: 'Product Manager', company: 'PakSaaS Inc' },
  { fullName: 'Nadia Al-Rashid', jobTitle: 'Ops Head', company: 'Abu Dhabi Fintech' },
];

const pickRandomLeads = () => {
  const count = Math.floor(Math.random() * 3) + 1;
  return [...MOCK_LEADS].sort(() => Math.random() - 0.5).slice(0, count);
};

const buildLinkedinUrl = (name: string) =>
  `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const bootstrapWorker = async () => {
  if (!env.REDIS_URL) {
    console.warn('REDIS_URL is not set. Skipping agent worker bootstrap.');
    return;
  }

  await connectDB();
  const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

  const worker = new Worker(
    'agent-jobs',
    async (job) => {
      const { agentId, userId } = job.data as { agentId: string; userId: string };

      try {
        const randomLeads = pickRandomLeads();
        const agentObjectId = new Types.ObjectId(agentId);
        const userObjectId = new Types.ObjectId(userId);

        const leads = await LeadModel.insertMany(
          randomLeads.map((lead) => ({
            agentId: agentObjectId,
            userId: userObjectId,
            linkedinUrl: buildLinkedinUrl(lead.fullName),
            fullName: lead.fullName,
            jobTitle: lead.jobTitle,
            company: lead.company,
            status: 'NEW',
            scrapedAt: new Date(),
          })),
        );

        await AgentModel.findOneAndUpdate(
          { _id: agentObjectId, userId: userObjectId },
          {
            $inc: { queueCount: leads.length },
            $set: { lastRunAt: new Date(), status: 'RUNNING' },
          },
        );

        for (const lead of leads) {
          await addLog({
            userId,
            agentId,
            tag: 'Lead',
            message: `New lead: ${lead.fullName} - ${lead.jobTitle} at ${lead.company}`,
          });
        }

        await addLog({
          userId,
          agentId,
          tag: 'System',
          message: `Agent run complete. ${leads.length} leads added.`,
        });
      } catch (error) {
        await AgentModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(agentId), userId: new mongoose.Types.ObjectId(userId) },
          { $set: { status: 'ERROR' } },
        );

        await addLog({
          userId,
          agentId,
          tag: 'Error',
          message: error instanceof Error ? error.message : 'Agent execution failed.',
        });

        throw error;
      }
    },
    { connection },
  );

  worker.on('failed', (job, error) => {
    console.error(`Agent worker job failed: ${job?.id}`, error);
  });
};

void bootstrapWorker();
