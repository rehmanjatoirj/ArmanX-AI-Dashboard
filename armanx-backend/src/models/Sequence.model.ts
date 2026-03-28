import { Schema, model } from 'mongoose';

export interface SequenceStep {
  order: number;
  channel: string;
  message: string;
  delayHours: number;
}

export interface Sequence {
  userId: Schema.Types.ObjectId;
  name: string;
  targetMarket: string;
  replyRate: number;
  activeCount: number;
  steps: SequenceStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sequenceStepSchema = new Schema<SequenceStep>(
  {
    order: { type: Number, required: true },
    channel: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    delayHours: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const sequenceSchema = new Schema<Sequence>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    targetMarket: { type: String, required: true, trim: true },
    replyRate: { type: Number, default: 0 },
    activeCount: { type: Number, default: 0 },
    steps: { type: [sequenceStepSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

sequenceSchema.index({ userId: 1, replyRate: -1 });

export const SequenceModel = model<Sequence>('Sequence', sequenceSchema);
