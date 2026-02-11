/**
 * Interactive Database Setup Script
 * 
 * This script helps you set up the PostgreSQL database for Career Path Explorer.
 * It will prompt for your PostgreSQL credentials and create the database if needed.
 */

const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('\n=== Career Path Explorer Database Setup ===\n');
  
  // Get PostgreSQL credentials
  const username = await question('PostgreSQL username (default: postgres): ') || 'postgres';
  const password = await question('PostgreSQL password: ');
  const host = await question('PostgreSQL host (default: localhost): ') || 'localhost';
  const port = await question('PostgreSQL port (default: 5432): ') || '5432';
  
  console.log('\nAttempting to connect to PostgreSQL...');
  
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
      console.log('✓ Database created');
    } else {
      console.log('✓ Database "career_path_explorer" already exists');
    }
    
    await client.end();
    
    // Update .env file
    const fs = require('fs');
    const envContent = `DATABASE_URL=postgresql://${username}:${password}@${host}:${port}/career_path_explorer\nPORT=3000\n`;
    fs.writeFileSync('.env', envContent);
    console.log('✓ .env file updated');
    
    console.log('\n=== Setup Complete! ===');
    console.log('\nNext steps:');
    console.log('1. Run migrations: npm run migrate');
    console.log('2. Seed sample data: npm run seed');
    console.log('3. Run tests: npm test\n');
    
  } catch (error) {
    console.error('\n✗ Setup failed:', error.message);
    console.error('\nPlease verify:');
    console.error('- PostgreSQL is running');
    console.error('- Your credentials are correct');
    console.error('- The user has permission to create databases\n');
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupDatabase();
