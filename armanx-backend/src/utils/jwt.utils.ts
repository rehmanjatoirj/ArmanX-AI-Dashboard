import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthUserPayload, JwtTokenPair } from '../types';

const accessTokenOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
};

export const generateAccessToken = (payload: AuthUserPayload) =>
  jwt.sign(payload, env.JWT_SECRET, accessTokenOptions);

export const generateRefreshToken = (payload: AuthUserPayload) =>
  jwt.sign(payload, env.JWT_SECRET, refreshTokenOptions);

export const generateTokenPair = (payload: AuthUserPayload): JwtTokenPair => ({
  token: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

export const verifyToken = (token: string): AuthUserPayload =>
  jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
