// Instructions: Integrate Swagger UI into the main backend server file

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
//import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // for parsing application/json

// Serve Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.send('BookHaven Backend API is running! Access API docs at /api-docs');
});

// Define API routes (prefixed with /api)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger API docs available at http://localhost:${port}/api-docs`);
});

export default app;
