import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Category from '../models/Category';
import Product from '../models/Product';
import { AuthenticatedRequest, CategoryQuery } from '../types';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { deleteFromCloudinary } from '../config/cloudinary';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive }: CategoryQuery = req.query;
    
    let query: any = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const categories = await Category.find(query).sort({ createdAt: -1 });
    
    successResponse(res, { categories }, 'Categories retrieved successfully');
  } catch (error: any) {
    console.error('Get categories error:', error);
    errorResponse(res, 'Failed to retrieve categories', 500);
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      errorResponse(res, 'Category not found', 404);
      return;
    }

    successResponse(res, { category }, 'Category retrieved successfully');
  } catch (error: any) {
    console.error('Get category error:', error);
    errorResponse(res, 'Failed to retrieve category', 500);
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const { name, description } = req.body;
    const file = req.file;
    
    const categoryData: any = {
      name,
      description
    };

    if (file) {
      categoryData.image = {
        url: file.path,
        public_id: file.filename
      };
    }

    const category = new Category(categoryData);
    await category.save();

    successResponse(res, { category }, 'Category created successfully', 201);
  } catch (error: any) {
    if (error.code === 11000) {
      errorResponse(res, 'Category name already exists', 400);
      return;
    }
    
    console.error('Create category error:', error);
    errorResponse(res, 'Failed to create category', 500);
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      errorResponse(res, 'Category not found', 404);
      return;
    }

    const { name, description, isActive } = req.body;
    const file = req.file;

    // Update fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive === 'true';

    // Handle new image
    if (file) {
      // Delete old image from cloudinary if exists
      if (category.image?.public_id) {
        try {
          await deleteFromCloudinary(category.image.public_id);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      category.image = {
        url: file.path,
        public_id: file.filename
      };
    }

    await category.save();

    successResponse(res, { category }, 'Category updated successfully');
  } catch (error: any) {
    if (error.code === 11000) {
      errorResponse(res, 'Category name already exists', 400);
      return;
    }

    console.error('Update category error:', error);
    errorResponse(res, 'Failed to update category', 500);
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      errorResponse(res, 'Category not found', 404);
      return;
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      errorResponse(res, `Cannot delete category. It has ${productsCount} products associated with it.`, 400);
      return;
    }

    // Delete image from cloudinary if exists
    if (category.image?.public_id) {
      try {
        await deleteFromCloudinary(category.image.public_id);
      } catch (error) {
        console.error('Error deleting image from cloudinary:', error);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    successResponse(res, null, 'Category deleted successfully');
  } catch (error: any) {
    console.error('Delete category error:', error);
    errorResponse(res, 'Failed to delete category', 500);
  }
};