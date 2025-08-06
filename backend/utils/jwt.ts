import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

export const generateToken = (id: string, email: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '30d';
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload: JWTPayload = {
    id,
    email,
    role
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpire,
    issuer: 'express-api',
    audience: 'api-users'
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, jwtSecret) as JWTPayload;
  } catch (error) {
    throw error;
  }
};