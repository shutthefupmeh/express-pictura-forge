import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { errorResponse } from '../utils/apiResponse';

export const authenticate = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      errorResponse(res, 'Access denied. No token provided.', 401);
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      errorResponse(res, 'JWT Secret not configured', 500);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      errorResponse(res, 'Invalid token - user not found.', 401);
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      errorResponse(res, 'Invalid token format.', 401);
    } else if (error.name === 'TokenExpiredError') {
      errorResponse(res, 'Token has expired.', 401);
    } else {
      console.error('Authentication error:', error);
      errorResponse(res, 'Authentication failed.', 401);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }
    
    next();
  };
};