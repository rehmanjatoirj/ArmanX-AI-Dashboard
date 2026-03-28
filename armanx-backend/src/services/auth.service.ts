import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { UserModel } from '../models/User.model';
import { AppError } from '../types';
import { generateTokenPair, verifyToken } from '../utils/jwt.utils';

const sanitizeUser = (user: { _id: Types.ObjectId; email: string; fullName: string }) => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
});

export const registerUser = async (payload: { email: string; password: string; fullName: string }) => {
  const existingUser = await UserModel.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new AppError('Email already exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await UserModel.create({
    email: payload.email.toLowerCase(),
    hashedPassword,
    fullName: payload.fullName,
  });

  const safeUser = sanitizeUser(user);
  const tokens = generateTokenPair({ userId: safeUser.id, email: safeUser.email });

  return { ...tokens, user: safeUser };
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() }).select('+hashedPassword');

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(payload.password, user.hashedPassword);

  if (!isMatch) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const safeUser = sanitizeUser(user);
  const tokens = generateTokenPair({ userId: safeUser.id, email: safeUser.email });

  return { ...tokens, user: safeUser };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyToken(refreshToken);
  const user = await UserModel.findById(payload.userId);

  if (!user) {
    throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
  }

  return {
    token: generateTokenPair({ userId: user._id.toString(), email: user.email }).token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return { user: sanitizeUser(user) };
};
