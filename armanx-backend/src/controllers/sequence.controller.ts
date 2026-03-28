import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { SequenceModel } from '../models/Sequence.model';
import type { AuthenticatedRequest } from '../types';
import { AppError } from '../types';
import { sendSuccess } from '../utils/response.utils';

const paramValue = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const serializeSequence = (sequence: any) => ({
  id: sequence._id.toString(),
  name: sequence.name,
  replyRate: sequence.replyRate,
  activeCount: sequence.activeCount,
  target: sequence.targetMarket,
  targetMarket: sequence.targetMarket,
  steps: sequence.steps,
  isActive: sequence.isActive,
});

export const getSequences = async (req: AuthenticatedRequest, res: Response) => {
  const sequences = await SequenceModel.find({ userId: new Types.ObjectId(req.user!.id) }).sort({ replyRate: -1 }).lean();
  return sendSuccess(res, sequences.map(serializeSequence));
};

export const getSequence = async (req: AuthenticatedRequest, res: Response) => {
  const sequence = await SequenceModel.findOne({
    _id: new Types.ObjectId(paramValue(req.params.id)),
    userId: new Types.ObjectId(req.user!.id),
  }).lean();

  if (!sequence) {
    throw new AppError('Sequence not found', StatusCodes.NOT_FOUND);
  }

  return sendSuccess(res, serializeSequence(sequence));
};

export const createSequence = async (req: AuthenticatedRequest, res: Response) => {
  const sequence = await SequenceModel.create({
    ...req.body,
    userId: new Types.ObjectId(req.user!.id),
  });

  return sendSuccess(res, serializeSequence(sequence), StatusCodes.CREATED);
};

export const updateSequence = async (req: AuthenticatedRequest, res: Response) => {
  const sequence = await SequenceModel.findOneAndUpdate(
    { _id: new Types.ObjectId(paramValue(req.params.id)), userId: new Types.ObjectId(req.user!.id) },
    req.body,
    { new: true },
  ).lean();

  if (!sequence) {
    throw new AppError('Sequence not found', StatusCodes.NOT_FOUND);
  }

  return sendSuccess(res, serializeSequence(sequence));
};

export const deleteSequence = async (req: AuthenticatedRequest, res: Response) => {
  const sequence = await SequenceModel.findOneAndDelete({
    _id: new Types.ObjectId(paramValue(req.params.id)),
    userId: new Types.ObjectId(req.user!.id),
  });

  if (!sequence) {
    throw new AppError('Sequence not found', StatusCodes.NOT_FOUND);
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};
