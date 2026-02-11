/**
 * Database Configuration
 * 
 * This module manages the PostgreSQL database connection using the pg library.
 * It creates a connection pool for efficient database access across the application.
 */

import { Pool } from 'pg';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Database connection URL from environment variable
// Format: postgresql://username:password@host:port/database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:Amad7511!!@localhost:5432/career_path_explorer';

/**
 * Connection pool for PostgreSQL database
 * Using a pool allows multiple concurrent database operations
 * and automatically manages connection lifecycle
 */
export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout if connection takes longer than 2 seconds
});

/**
 * Test database connection
 * This function verifies that the database is accessible
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

/**
 * Close all database connections
 * Should be called when shutting down the application
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('Database connection pool closed');
}
