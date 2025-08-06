import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Express.js TypeScript Backend API</h1>
      <p>This is a backend-only project. The API is running on the server.</p>
      <div style={{ marginTop: '20px' }}>
        <h2>API Endpoints:</h2>
        <ul>
          <li><strong>POST</strong> /api/auth/register - User registration</li>
          <li><strong>POST</strong> /api/auth/login - User login</li>
          <li><strong>GET</strong> /api/auth/profile - Get user profile (protected)</li>
          <li><strong>PUT</strong> /api/auth/profile - Update user profile (protected)</li>
          <li><strong>GET</strong> /api/products - Get all products</li>
          <li><strong>GET</strong> /api/products/:id - Get product by ID</li>
          <li><strong>POST</strong> /api/products - Create product (admin only)</li>
          <li><strong>PUT</strong> /api/products/:id - Update product (admin only)</li>
          <li><strong>DELETE</strong> /api/products/:id - Delete product (admin only)</li>
          <li><strong>GET</strong> /api/categories - Get all categories</li>
          <li><strong>GET</strong> /api/categories/:id - Get category by ID</li>
          <li><strong>POST</strong> /api/categories - Create category (admin only)</li>
          <li><strong>PUT</strong> /api/categories/:id - Update category (admin only)</li>
          <li><strong>DELETE</strong> /api/categories/:id - Delete category (admin only)</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Note:</strong> The actual backend code is in the <code>src/</code> directory.</p>
        <p>To run the backend server, use: <code>npm run dev</code></p>
      </div>
    </div>
  );
};

export default App;