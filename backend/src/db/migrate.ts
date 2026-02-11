/**
 * Database Migration Script
 * 
 * This script creates the database schema for the Career Path Explorer application.
 * It creates two tables:
 * 1. roles - Stores technology career roles
 * 2. resources - Stores learning resources associated with roles
 * 
 * Run this script with: npm run migrate
 */

import { pool, testConnection, closePool } from './config';

/**
 * SQL to create the roles table
 * 
 * The roles table stores information about technology career positions.
 * - id: Auto-incrementing primary key
 * - name: The role title (e.g., "Software Engineer")
 * - short_description: Brief summary for card display
 * - long_description: Detailed explanation of the role
 * - responsibilities: Array of key responsibilities
 * - skills: Array of required skills
 */
const CREATE_ROLES_TABLE = `
  CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT,
    responsibilities TEXT[],
    skills TEXT[]
  );
`;

/**
 * SQL to create the resources table
 * 
 * The resources table stores learning materials for each role.
 * - id: Auto-incrementing primary key
 * - role_id: Foreign key reference to roles table
 * - title: Resource title
 * - url: Link to the resource
 * - resource_type: Type of resource (Video, Article, or Course)
 * - difficulty: Difficulty level (Beginner, Intermediate, or Advanced)
 * 
 * Foreign key constraint ensures referential integrity.
 * ON DELETE RESTRICT prevents deleting roles that have associated resources.
 */
const CREATE_RESOURCES_TABLE = `
  CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('Video', 'Article', 'Course')),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced'))
  );
`;

/**
 * SQL to create indexes for better query performance
 * 
 * - idx_resources_role_id: Speeds up queries that filter resources by role
 * - idx_resources_difficulty: Speeds up queries that filter by difficulty level
 */
const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_resources_role_id ON resources(role_id);
  CREATE INDEX IF NOT EXISTS idx_resources_difficulty ON resources(difficulty);
`;

/**
 * Main migration function
 * Executes all SQL statements to create the database schema
 */
async function migrate() {
  console.log('Starting database migration...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Cannot proceed with migration - database connection failed');
    process.exit(1);
  }

  try {
    // Create roles table
    console.log('Creating roles table...');
    await pool.query(CREATE_ROLES_TABLE);
    console.log('✓ Roles table created');

    // Create resources table
    console.log('Creating resources table...');
    await pool.query(CREATE_RESOURCES_TABLE);
    console.log('✓ Resources table created');

    // Create indexes
    console.log('Creating indexes...');
    await pool.query(CREATE_INDEXES);
    console.log('✓ Indexes created');

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrate();
}

export { migrate };
