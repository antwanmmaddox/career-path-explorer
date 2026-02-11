/**
 * Database Creation Script
 * 
 * This script creates the career_path_explorer database if it doesn't exist.
 * It uses the credentials from .env file or environment variables.
 */

const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  console.log('\n=== Creating Database ===\n');
  
  // Parse DATABASE_URL from .env
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:Amad7511!!@localhost:5432/career_path_explorer';
  const url = new URL(dbUrl);
  
  const username = url.username;
  const password = url.password;
  const host = url.hostname;
  const port = url.port;
  
  console.log(`Connecting to PostgreSQL at ${host}:${port} as ${username}...`);
  
  // Connect to postgres database (default database)
  const client = new Client({
    user: username,
    password: password,
    host: host,
    port: port,
    database: 'postgres'
  });
  
  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');
    
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'career_path_explorer'"
    );
    
    if (result.rows.length === 0) {
      console.log('\nCreating database "career_path_explorer"...');
      await client.query('CREATE DATABASE career_path_explorer');
      console.log('✓ Database created successfully');
    } else {
      console.log('✓ Database "career_path_explorer" already exists');
    }
    
    await client.end();
    
    console.log('\n=== Database Ready! ===');
    console.log('\nNext steps:');
    console.log('1. Run migrations: npm run migrate');
    console.log('2. Seed sample data: npm run seed');
    console.log('3. Run tests: npm test\n');
    
  } catch (error) {
    console.error('\n✗ Database creation failed:', error.message);
    
    if (error.code === '28P01') {
      console.error('\nAuthentication failed. Please check:');
      console.error('- Your PostgreSQL password in the .env file');
      console.error('- The username is correct (usually "postgres")');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. Please check:');
      console.error('- PostgreSQL service is running');
      console.error('- The host and port are correct');
    } else {
      console.error('\nPlease verify:');
      console.error('- PostgreSQL is running');
      console.error('- Your credentials in .env are correct');
      console.error('- The user has permission to create databases');
    }
    console.error('');
    process.exit(1);
  }
}

createDatabase();
