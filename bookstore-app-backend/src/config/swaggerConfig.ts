// bookstore-app-backend/src/config/swaggerConfig.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookHaven API',
      version: '1.0.0',
      description: 'API documentation for the BookHaven online bookstore application',
      contact: {
        name: 'BookHaven Support',
        url: 'https://example.com/support', // Replace with actual support URL if any
        email: 'support@example.com', // Replace with actual support email
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}/api`,
        description: 'Development server',
      },
      // You can add more servers here (e.g., staging, production)
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Define common schemas here to be referenced in your JSDoc comments
        UserInput: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            name: { type: 'string', example: 'John Doe' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
          required: ['username', 'email', 'name', 'password'],
        },
        UserLogin: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
          required: ['email', 'password'],
        },
        UserProfileUpdate: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Johnathan Doe' },
                username: { type: 'string', example: 'johnD' },
                email: { type: 'string', format: 'email', example: 'john.doe.new@example.com' },
            },
        },
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60c72b2f9b1e8c3b4c8e4f1a' },
            title: { type: 'string', example: 'The Great Gatsby' },
            author: { type: 'string', example: 'F. Scott Fitzgerald' },
            description: { type: 'string', example: 'A novel about the American dream.' },
            price: { type: 'number', format: 'float', example: 10.99 },
            imageUrl: { type: 'string', format: 'url', example: 'http://example.com/image.jpg' },
            category: { type: 'string', example: 'Fiction' },
            rating: { type: 'number', format: 'float', example: 4.5 },
            featured: { type: 'boolean', example: false },
            inStock: { type: 'boolean', example: true },
            publicationDate: { type: 'string', format: 'date', example: '1925-04-10' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Applies JWT to all operations that don't override security
      },
    ],
  },
  // Path to the API docs
  // Use __dirname with path.join if this file is moved or if you have issues with relative paths
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Point to files containing JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
