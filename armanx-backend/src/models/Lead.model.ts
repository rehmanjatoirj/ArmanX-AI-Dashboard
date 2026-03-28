import { Schema, model } from 'mongoose';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'REPLIED' | 'MEETING_BOOKED' | 'REJECTED';

export interface Lead {
  agentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  linkedinUrl: string;
  fullName: string;
  jobTitle: string;
  company: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<Lead>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    linkedinUrl: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: undefined },
    phone: { type: String, trim: true, default: undefined },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'REPLIED', 'MEETING_BOOKED', 'REJECTED'],
      default: 'NEW',
    },
    scrapedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

leadSchema.index({ userId: 1, scrapedAt: -1 });
leadSchema.index({ userId: 1, status: 1 });
leadSchema.index({ agentId: 1 });

export const LeadModel = model<Lead>('Lead', leadSchema);
