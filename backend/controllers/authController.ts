import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthenticatedRequest } from '../types';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      errorResponse(res, 'User already exists with this email or username', 400);
      return;
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email, user.role);

    successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token
      },
      'Login successful'
    );
  } catch (error: any) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      'Profile retrieved successfully'
    );
  } catch (error: any) {
    console.error('Get profile error:', error);
    errorResponse(res, 'Failed to retrieve profile', 500);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'User not found', 401);
      return;
    }

    const { username, avatar } = req.body;
    const updates: any = {};

    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(
      res,
      { user },
      'Profile updated successfully'
    );
  } catch (error: any) {
    if (error.code === 11000) {
      errorResponse(res, 'Username already exists', 400);
      return;
    }
    console.error('Update profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};