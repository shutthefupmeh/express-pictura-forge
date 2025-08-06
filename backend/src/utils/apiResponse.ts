import { Response } from 'express';
import { ApiResponse, PaginationResponse } from '../types';

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errors?: any[]
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

export const paginationResponse = <T>(
  res: Response,
  items: T[],
  currentPage: number,
  limit: number,
  totalItems: number,
  message: string = 'Success',
  statusCode: number = 200
): Response<PaginationResponse<T>> => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      items,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        limit
      }
    }
  });
};