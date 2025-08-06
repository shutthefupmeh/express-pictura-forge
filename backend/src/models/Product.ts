import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productImageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  }
}, { _id: true });

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    default: 0,
    validate: {
      validator: function(this: IProduct, value: number) {
        return value <= this.price;
      },
      message: 'Discount price cannot be greater than regular price'
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  images: {
    type: [productImageSchema],
    validate: {
      validator: function(arr: any[]) {
        return arr.length <= 10;
      },
      message: 'Maximum 10 images allowed per product'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Convert specifications Map to Object for JSON
      if (ret.specifications) {
        ret.specifications = Object.fromEntries(ret.specifications);
      }
      return ret;
    }
  }
});

// Virtual for effective price (considering discount)
productSchema.virtual('effectivePrice').get(function(this: IProduct) {
  return this.discountPrice && this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function(this: IProduct) {
  if (this.discountPrice && this.discountPrice > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Create indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ views: -1 });

// Compound indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });

export default mongoose.model<IProduct>('Product', productSchema);