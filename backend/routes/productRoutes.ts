import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadProduct } from '../config/cloudinary';
import { 
  productValidation, 
  mongoIdValidation, 
  imageIdValidation,
  productQueryValidation 
} from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', productQueryValidation, getAllProducts);
router.get('/:id', mongoIdValidation, getProductById);

// Admin only routes
router.post('/', 
  authenticate, 
  authorize('admin'), 
  uploadProduct.array('images', 10), 
  productValidation, 
  createProduct
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  mongoIdValidation,
  uploadProduct.array('images', 10), 
  updateProduct
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  mongoIdValidation,
  deleteProduct
);

router.delete('/:id/images/:imageId', 
  authenticate, 
  authorize('admin'), 
  mongoIdValidation,
  imageIdValidation,
  deleteProductImage
);

export default router;