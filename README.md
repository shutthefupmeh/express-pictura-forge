# Express.js TypeScript Backend API

A complete RESTful API built with Express.js, TypeScript, MongoDB, and Cloudinary for image management.

## Project info

**URL**: https://lovable.dev/projects/a4569158-a33e-440d-9151-0236c6b4f6ad

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with image upload and management
- **Category Management**: Organize products into categories
- **Image Handling**: Cloudinary integration for optimized image storage
- **Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and secure password hashing
- **Database**: MongoDB with Mongoose ODM and proper indexing
- **Error Handling**: Centralized error handling with custom error types

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination and filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `DELETE /api/products/:id/images/:imageId` - Delete product image (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image storage and optimization
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js & npm installed
- MongoDB database
- Cloudinary account

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Navigate to the backend directory:
```sh
cd backend
```

3. Install dependencies:
```sh
npm install
```

4. Create environment file:
```sh
cp .env.example .env
```

5. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/product_db
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

6. Start the development server:
```sh
npm run dev
```

7. Build for production:
```sh
npm run build
npm start
```

The API will be available at `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── server.ts       # Entry point
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 30d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `MAX_FILE_SIZE` | Maximum file upload size | No (default: 5MB) |
| `CORS_ORIGIN` | CORS allowed origin | No |

## License

This project is licensed under the MIT License.