# Database Setup Guide

This guide will help you set up PostgreSQL for the Career Path Explorer application.

## Prerequisites

You need PostgreSQL installed on your system. If you don't have it installed:

### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Database Setup Steps

### 1. Start PostgreSQL Service

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "postgresql-x64-14" (or your version)
- Right-click and select "Start"

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### 2. Create the Database

Open a terminal/command prompt and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE career_path_explorer;

# Exit psql
\q
```

If you get a password prompt, use the password you set during PostgreSQL installation.

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux
```

Edit the `.env` file and update the DATABASE_URL with your credentials:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/career_path_explorer
PORT=3000
```

Replace `your_password` with your PostgreSQL password.

### 4. Run Database Migrations

```bash
npm run migrate
```

This will create the `roles` and `resources` tables.

### 5. Seed Sample Data (Optional)

```bash
npm run seed
```

This will populate the database with sample technology roles and learning resources.

## Running Tests

Once the database is set up, you can run the property-based tests:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/db/__tests__/role-creation.property.test.ts
```

## Troubleshooting

### Connection Refused Error

If you see `ECONNREFUSED` errors:
1. Verify PostgreSQL is running
2. Check that the port is 5432 (default)
3. Verify your DATABASE_URL in `.env` is correct

### Authentication Failed

If you see authentication errors:
1. Verify your password in the DATABASE_URL
2. Try connecting with `psql -U postgres` to test credentials

### Database Does Not Exist

If you see "database does not exist":
1. Run the CREATE DATABASE command from step 2
2. Verify the database name matches in your DATABASE_URL

## Verifying Setup

To verify everything is working:

```bash
# Test database connection
npm run migrate

# Should output:
# ✓ Database connection successful
# ✓ Roles table created
# ✓ Resources table created
# ✓ Indexes created
```
