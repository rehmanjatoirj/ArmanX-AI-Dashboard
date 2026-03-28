import { Schema, model } from 'mongoose';

export type AgentType = 'SCRAPER' | 'MESSENGER' | 'PUBLISHER' | 'SOURCER';
export type AgentStatus = 'RUNNING' | 'PAUSED' | 'ERROR' | 'IDLE';

export interface Agent {
  userId: Schema.Types.ObjectId;
  name: string;
  type: AgentType;
  status: AgentStatus;
  queueCount: number;
  config: Record<string, unknown>;
  lastRunAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<Agent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['SCRAPER', 'MESSENGER', 'PUBLISHER', 'SOURCER'], required: true },
    status: { type: String, enum: ['RUNNING', 'PAUSED', 'ERROR', 'IDLE'], default: 'IDLE' },
    queueCount: { type: Number, default: 0 },
    config: { type: Schema.Types.Mixed, default: {} },
    lastRunAt: { type: Date, default: null },
  },
  { timestamps: true },
);

agentSchema.index({ userId: 1, status: 1 });
agentSchema.index({ userId: 1, createdAt: 1 });

export const AgentModel = model<Agent>('Agent', agentSchema);
