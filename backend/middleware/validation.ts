import { body, param, query } from 'express-validator';

// User validation
export const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Product validation
export const productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .optional()
    .isLength({ max: 50 })
    .withMessage('SKU cannot exceed 50 characters')
    .trim(),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const tags = value.split(',').map(tag => tag.trim());
        if (tags.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        for (const tag of tags) {
          if (tag.length > 50) {
            throw new Error('Each tag cannot exceed 50 characters');
          }
        }
      }
      return true;
    }),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('IsActive must be a boolean value')
];

// Category validation
export const categoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('IsActive must be a boolean value')
];

// Parameter validation
export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

export const imageIdValidation = [
  param('imageId')
    .isMongoId()
    .withMessage('Invalid image ID format')
];

// Query validation
export const productQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt', 'rating.average', 'views'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('IsActive must be a boolean value')
];