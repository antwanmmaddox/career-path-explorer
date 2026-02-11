/**
 * Express Server Setup
 * 
 * This is the main entry point for the Career Path Explorer backend server.
 * It sets up the Express application with middleware, routes, and error handling.
 * 
 * Requirements: 8.4, 8.5
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { testConnection } from './db/config';
import rolesRouter from './routes/roles';
import resourcesRouter from './routes/resources';

// Load environment variables
config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */

// Enable CORS for frontend access
// This allows the React frontend to make requests to the backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
// This middleware parses incoming JSON payloads and makes them available in req.body
app.use(express.json());

// Request logging middleware (for development/debugging)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * API Routes
 * 
 * All API endpoints are prefixed with /api
 */
app.use('/api', rolesRouter);
app.use('/api', resourcesRouter);

/**
 * Health Check Endpoint
 * 
 * Simple endpoint to verify the server is running
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

/**
 * Root Endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Career Path Explorer API',
    version: '1.0.0',
    endpoints: {
      roles: '/api/roles',
      resources: '/api/resources',
      health: '/health'
    }
  });
});

/**
 * 404 Handler
 * 
 * Catches requests to undefined routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    details: `Route ${req.method} ${req.path} does not exist`
  });
});

/**
 * Global Error Handler Middleware
 * 
 * This middleware catches all errors thrown in the application.
 * It logs error details and returns appropriate error responses.
 * 
 * Requirements: 8.4, 8.5
 * 
 * Requirement 8.4: Return appropriate HTTP status codes for all responses
 * Requirement 8.5: Log error details for debugging
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error details for debugging (Requirement 8.5)
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
  console.error('Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Determine status code (Requirement 8.4)
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Return error response
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

/**
 * Start Server
 * 
 * Initializes the database connection and starts the Express server
 */
async function startServer() {
  try {
    // Test database connection before starting server
    console.log('Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`✓ Server is running on http://localhost:${PORT}`);
      console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
      console.log(`✓ Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export app for testing purposes
export { app, startServer };
