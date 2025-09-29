import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ExpressAuth } from '@auth/express';
import { authConfig } from './routes/auth.route';
import logger from './logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth.js configuration
app.use("/auth/*", ExpressAuth(authConfig));

// Routes
app.get('/', (req: Request, res: Response) => {
  logger.info('Root endpoint accessed');
  res.json({ 
    message: 'Sui Run Club Backend Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req: Request, res: Response) => {
  logger.info('Health check endpoint accessed');
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
