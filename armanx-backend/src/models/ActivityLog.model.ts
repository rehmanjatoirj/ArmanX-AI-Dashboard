import { Schema, model } from 'mongoose';

export type LogTag = 'Lead' | 'Outreach' | 'Error' | 'System';

export interface ActivityLog {
  userId: Schema.Types.ObjectId;
  agentId?: Schema.Types.ObjectId | null;
  tag: LogTag;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<ActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', default: null },
    tag: { type: String, enum: ['Lead', 'Outreach', 'Error', 'System'], required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLogModel = model<ActivityLog>('ActivityLog', activityLogSchema);
