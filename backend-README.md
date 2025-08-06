# Express.js TypeScript Backend API

A complete backend API built with Express.js, TypeScript, MongoDB, and Cloudinary for product management with image upload capabilities.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Protected routes

### Product Management
- CRUD operations for products
- Multiple image upload to Cloudinary
- Advanced search, filtering, and pagination
- Automatic SKU generation
- Stock management
- Product ratings and view tracking
- Specifications with Map support

### Category Management
- CRUD operations for categories
- Image upload for categories
- Validation before deletion (check associated products)

### Image Management
- Upload to Cloudinary with optimization
- Auto resize and quality optimization
- Individual image deletion
- Automatic cleanup on product/category deletion

### Security Features
- Helmet for security headers
- Rate limiting
- CORS configuration
- Input validation and sanitization
- MongoDB injection protection
- File upload validation

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── cloudinary.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── categoryController.ts
│   │   └── productController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   └── Product.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   └── productRoutes.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── generateSKU.ts
│   │   └── jwt.ts
│   └── server.ts
├── dist/                 # Compiled JavaScript files
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/product_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

### 3. Cloudinary Setup
1. Register at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to your `.env` file

### 4. MongoDB Setup
- **Local**: Install MongoDB or use Docker
- **Cloud**: Create MongoDB Atlas cluster
- Update `MONGODB_URI` in `.env`

### 5. Build and Run

#### Development
```bash
npm run dev
```

#### Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile (protected)
PUT    /api/auth/profile      - Update user profile (protected)
```

### Products
```
GET    /api/products                    - Get all products (public)
GET    /api/products/:id                - Get product by ID (public)
POST   /api/products                    - Create product (admin only)
PUT    /api/products/:id                - Update product (admin only)
DELETE /api/products/:id                - Delete product (admin only)
DELETE /api/products/:id/images/:imageId - Delete product image (admin only)
```

### Categories
```
GET    /api/categories         - Get all categories (public)
GET    /api/categories/:id     - Get category by ID (public)
POST   /api/categories         - Create category (admin only)
PUT    /api/categories/:id     - Update category (admin only)
DELETE /api/categories/:id     - Delete category (admin only)
```

### Health Check
```
GET    /health                 - Server health check
```

## 📝 API Usage Examples

### Register User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'SecurePass123',
    role: 'user' // optional, defaults to 'user'
  })
});
```

### Create Product with Images
```javascript
const formData = new FormData();
formData.append('name', 'iPhone 15 Pro');
formData.append('description', 'Latest iPhone with advanced features');
formData.append('price', '999');
formData.append('discountPrice', '899');
formData.append('category', 'categoryId');
formData.append('stock', '50');
formData.append('tags', 'smartphone,apple,premium');
formData.append('specifications', JSON.stringify({
  'Storage': '256GB',
  'Color': 'Space Gray',
  'Display': '6.1 inch'
}));
formData.append('featured', 'true');

// Add multiple images
formData.append('images', file1);
formData.append('images', file2);

const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Query Products with Filters
```javascript
const queryParams = new URLSearchParams({
  page: '1',
  limit: '10',
  category: 'categoryId',
  search: 'iphone',
  minPrice: '100',
  maxPrice: '1000',
  featured: 'true',
  sortBy: 'price',
  sortOrder: 'asc'
});

const response = await fetch(`/api/products?${queryParams}`);
```

## 📊 Database Schema

### User Model
```typescript
interface IUser {
  username: string;      // unique, 3-20 chars
  email: string;         // unique, valid email
  password: string;      // hashed, min 6 chars
  role: 'admin' | 'user'; // default: 'user'
  avatar?: string;       // optional
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model
```typescript
interface ICategory {
  name: string;          // unique, max 100 chars
  description?: string;  // optional, max 500 chars
  image?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;     // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
interface IProduct {
  name: string;                    // required, max 200 chars
  description: string;             // required
  price: number;                   // required, min 0
  discountPrice?: number;          // optional, min 0
  category: ObjectId;              // ref to Category
  images: Array<{
    url: string;
    public_id: string;
  }>;
  stock: number;                   // required, min 0
  sku?: string;                    // auto-generated if not provided
  tags: string[];                  // max 10 tags
  specifications: Map<string, string>;
  isActive: boolean;               // default: true
  featured: boolean;               // default: false
  views: number;                   // default: 0
  rating: {
    average: number;               // 0-5
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security Features

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt (12 rounds)
- Protected routes with role validation

### Input Validation
- Schema validation with express-validator
- File type and size validation
- MongoDB injection prevention
- XSS protection

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits

### CORS Configuration
- Configurable allowed origins
- Credentials support

## 🚀 Deployment

### Environment Variables
Set these in production:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_secure_production_jwt_secret
# ... other variables
```

### PM2 Configuration
```json
{
  "name": "api-server",
  "script": "dist/server.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## 🧪 Development

### Scripts
```bash
npm run dev          # Development with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
npm run clean        # Clean dist folder
```

### Code Style
- TypeScript strict mode enabled
- Consistent error handling
- Comprehensive type definitions
- Clean architecture with separation of concerns

## 📈 Performance Considerations

### Database Optimization
- Strategic indexing on frequently queried fields
- Compound indexes for complex queries
- Connection pooling with Mongoose

### Image Optimization
- Automatic image resizing with Cloudinary
- Quality optimization
- Lazy loading support

### Caching Strategy
- Consider implementing Redis for session storage
- API response caching for frequently accessed data

## 🔍 Monitoring & Logging

### Health Checks
- `/health` endpoint for load balancer checks
- Database connection monitoring
- Graceful shutdown handling

### Error Handling
- Comprehensive error middleware
- Structured error responses
- Development vs production error details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.