import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadCategory } from '../config/cloudinary';
import { categoryValidation, mongoIdValidation } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', mongoIdValidation, getCategoryById);

// Admin only routes
router.post('/', 
  authenticate, 
  authorize('admin'), 
  uploadCategory.single('image'), 
  categoryValidation, 
  createCategory
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  mongoIdValidation,
  uploadCategory.single('image'), 
  categoryValidation, 
  updateCategory
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  mongoIdValidation,
  deleteCategory
);

export default router;