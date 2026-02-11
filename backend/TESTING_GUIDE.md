# Testing Guide for Career Path Explorer

## Current Status

✅ **Implementation Complete:**
- Database query functions (getAllRoles, getRoleById, createRole, roleExists, getResourcesByRoleId, createResource)
- Property-based tests for role creation persistence (Property 10)
- Property-based tests for resource creation persistence (Property 12)

⚠️ **Tests Require Database Setup:**
The property-based tests require a running PostgreSQL database with correct credentials.

## Quick Setup Steps

### 1. Verify PostgreSQL is Running

PostgreSQL service is currently running (postgresql-x64-18).

### 2. Set Up Database Credentials

You need to configure the correct PostgreSQL credentials in the `.env` file.

**Option A: Use the interactive setup (Recommended)**
```bash
npm run setup-db
```
This will prompt you for your PostgreSQL credentials and set everything up automatically.

**Option B: Manual setup**
1. Edit `backend/.env` file
2. Update the DATABASE_URL with your correct credentials:
   ```
   DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/career_path_explorer
   ```
3. Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual PostgreSQL credentials

### 3. Create the Database

```bash
npm run create-db
```

This will create the `career_path_explorer` database if it doesn't exist.

### 4. Run Migrations

```bash
npm run migrate
```

This will create the `roles` and `resources` tables with proper indexes.

### 5. (Optional) Seed Sample Data

```bash
npm run seed
```

This will populate the database with 5 sample technology roles and their learning resources.

### 6. Run Property-Based Tests

```bash
# Run all tests
npm test

# Run specific property tests
npm test -- src/db/__tests__/role-creation.property.test.ts
npm test -- src/db/__tests__/resource-creation.property.test.ts
```

## Expected Test Results

When the database is properly configured, both property tests should:
- Run 100 iterations each
- Test role/resource creation with randomly generated data
- Verify persistence by retrieving created records
- Clean up test data after each iteration
- **PASS** with all assertions successful

## Troubleshooting

### Authentication Failed (28P01)
- Verify your PostgreSQL username and password in `.env`
- Try connecting with `psql` to test credentials
- Check if the user has permission to create databases

### Connection Refused (ECONNREFUSED)
- Verify PostgreSQL service is running
- Check that port 5432 is correct
- Ensure no firewall is blocking the connection

### Database Does Not Exist
- Run `npm run create-db` to create the database
- Or manually create it: `psql -U postgres -c "CREATE DATABASE career_path_explorer;"`

## What the Tests Validate

### Property 10: Role Creation Persistence
- Any valid role data can be persisted to the database
- Created roles are assigned unique IDs
- All role fields (name, descriptions, responsibilities, skills) are stored correctly
- Created roles can be retrieved by ID
- Tests run across 100 random role variations

### Property 12: Resource Creation Persistence
- Any valid resource data can be persisted to the database
- Created resources are assigned unique IDs
- All resource fields (title, URL, type, difficulty) are stored correctly
- Resources are correctly associated with their parent role
- Created resources can be retrieved by role ID
- Tests run across 100 random resource variations

## Next Steps After Tests Pass

Once the property tests pass, you can proceed to:
1. Task 3: Implement validation layer
2. Task 4: Implement backend API routes
3. Task 5: Set up backend server and error handling

The database access layer is fully implemented and ready for use by the API layer.
