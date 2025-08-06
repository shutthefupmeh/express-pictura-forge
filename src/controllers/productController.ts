import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import Category from '../models/Category';
import { AuthenticatedRequest, ProductQuery, MulterFile } from '../types';
import { successResponse, errorResponse, paginationResponse } from '../utils/apiResponse';
import { deleteFromCloudinary } from '../config/cloudinary';
import { generateSKU } from '../utils/generateSKU';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      featured,
      isActive = 'true'
    }: ProductQuery = req.query;

    // Build query
    const query: any = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name description')
        .sort(sort)
        .limit(limitNum)
        .skip(skip),
      Product.countDocuments(query)
    ]);

    paginationResponse(
      res,
      products,
      pageNum,
      limitNum,
      total,
      'Products retrieved successfully'
    );
  } catch (error: any) {
    console.error('Get products error:', error);
    errorResponse(res, 'Failed to retrieve products', 500);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Increment views
    product.views += 1;
    await product.save();

    successResponse(res, { product }, 'Product retrieved successfully');
  } catch (error: any) {
    console.error('Get product error:', error);
    errorResponse(res, 'Failed to retrieve product', 500);
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      sku,
      tags,
      specifications,
      featured
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      errorResponse(res, 'Category not found', 400);
      return;
    }

    // Process uploaded images
    const files = req.files as MulterFile[];
    const images = files ? files.map(file => ({
      url: file.path,
      public_id: file.filename
    })) : [];

    // Generate SKU if not provided
    let finalSKU = sku;
    if (!finalSKU) {
      finalSKU = generateSKU(name, categoryExists.name);
    }

    // Parse specifications if provided
    let parsedSpecifications = new Map();
    if (specifications) {
      try {
        const specs = typeof specifications === 'string' 
          ? JSON.parse(specifications) 
          : specifications;
        parsedSpecifications = new Map(Object.entries(specs));
      } catch (error) {
        errorResponse(res, 'Invalid specifications format', 400);
        return;
      }
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      images,
      stock: Number(stock),
      sku: finalSKU,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      specifications: parsedSpecifications,
      featured: featured === 'true'
    });

    await product.save();
    await product.populate('category', 'name description');

    successResponse(res, { product }, 'Product created successfully', 201);
  } catch (error: any) {
    if (error.code === 11000) {
      errorResponse(res, 'SKU already exists', 400);
      return;
    }
    console.error('Create product error:', error);
    errorResponse(res, 'Failed to create product', 500);
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, 'Validation errors', 400, errors.array());
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      sku,
      tags,
      specifications,
      featured,
      isActive
    } = req.body;

    // Verify category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        errorResponse(res, 'Category not found', 400);
        return;
      }
    }

    // Handle new images
    const files = req.files as MulterFile[];
    if (files && files.length > 0) {
      const newImages = files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      product.images.push(...newImages);
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (sku !== undefined) product.sku = sku;
    if (featured !== undefined) product.featured = featured === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';

    if (tags !== undefined) {
      product.tags = tags.split(',').map((tag: string) => tag.trim());
    }

    if (specifications !== undefined) {
      try {
        const specs = typeof specifications === 'string' 
          ? JSON.parse(specifications) 
          : specifications;
        product.specifications = new Map(Object.entries(specs));
      } catch (error) {
        errorResponse(res, 'Invalid specifications format', 400);
        return;
      }
    }

    await product.save();
    await product.populate('category', 'name description');

    successResponse(res, { product }, 'Product updated successfully');
  } catch (error: any) {
    if (error.code === 11000) {
      errorResponse(res, 'SKU already exists', 400);
      return;
    }
    console.error('Update product error:', error);
    errorResponse(res, 'Failed to update product', 500);
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Delete images from cloudinary
    for (const image of product.images) {
      try {
        await deleteFromCloudinary(image.public_id);
      } catch (error) {
        console.error('Error deleting image from cloudinary:', error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    successResponse(res, null, 'Product deleted successfully');
  } catch (error: any) {
    console.error('Delete product error:', error);
    errorResponse(res, 'Failed to delete product', 500);
  }
};

export const deleteProductImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id, imageId } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    const imageIndex = product.images.findIndex(img => 
      img._id && img._id.toString() === imageId
    );
    
    if (imageIndex === -1) {
      errorResponse(res, 'Image not found', 404);
      return;
    }

    const image = product.images[imageIndex];
    
    // Delete from cloudinary
    try {
      await deleteFromCloudinary(image.public_id);
    } catch (error) {
      console.error('Error deleting from cloudinary:', error);
    }

    // Remove from product
    product.images.splice(imageIndex, 1);
    await product.save();

    successResponse(res, null, 'Image deleted successfully');
  } catch (error: any) {
    console.error('Delete product image error:', error);
    errorResponse(res, 'Failed to delete image', 500);
  }
};