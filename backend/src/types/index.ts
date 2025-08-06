import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Category Types
export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProductImage {
  url: string;
  public_id: string;
  _id?: Types.ObjectId;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Types.ObjectId | ICategory;
  images: IProductImage[];
  stock: number;
  sku?: string;
  tags: string[];
  specifications: Map<string, string>;
  isActive: boolean;
  featured: boolean;
  views: number;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationResponse<T> extends ApiResponse<T> {
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
      limit: number;
    };
  };
}

// Query Types
export interface ProductQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  isActive?: string;
}

export interface CategoryQuery {
  isActive?: string;
}

// JWT Payload
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Error Types
export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}