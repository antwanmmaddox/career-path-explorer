# Career Path Explorer

A full-stack web application demonstrating fundamental web development concepts for high school students. This application showcases how frontend (React), backend (Node.js/Express), REST APIs, and PostgreSQL databases work together in a cohesive system. Hosted by Render.

## 🎯 Educational Purpose

This project is designed to teach:
- **Full-stack architecture**: How frontend, backend, and database layers interact
- **RESTful API design**: Standard HTTP methods and status codes
- **Database relationships**: Foreign keys and relational data modeling
- **React component architecture**: Building reusable UI components
- **TypeScript**: Type-safe development across the stack
- **Property-based testing**: Formal verification of correctness properties

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React Frontend (TypeScript)               │  │
│  │  - Components: RoleCard, RoleList, ResourceList   │  │
│  │  - Pages: LandingPage, RoleDetailPage            │  │
│  │  - Routing: React Router                          │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│              Node.js/Express Backend                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  API Routes                                       │  │
│  │  - GET /api/roles                                 │  │
│  │  - GET /api/roles/:id                             │  │
│  │  - POST /api/roles                                │  │
│  │  - POST /api/resources                            │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Database Access Layer                            │  │
│  │  - Query functions                                │  │
│  │  - Connection pooling                             │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ SQL Queries (pg driver)
┌──────────────────────▼──────────────────────────────────┐
│              PostgreSQL Database                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Tables:                                          │  │
│  │  - roles (id, name, descriptions, skills)         │  │
│  │  - resources (id, role_id, title, url, type)     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
career-path-explorer/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── db/                # Database layer
│   │   │   ├── config.ts      # Connection pool setup
│   │   │   ├── migrate.ts     # Schema creation script
│   │   │   ├── queries.ts     # Database query functions
│   │   │   └── seed.ts        # Sample data script
│   │   ├── routes/            # API route handlers
│   │   │   ├── roles.ts       # Role endpoints
│   │   │   └── resources.ts   # Resource endpoints
│   │   ├── validation/        # Input validation
│   │   │   └── schemas.ts     # Zod validation schemas
│   │   └── server.ts          # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── RoleCard.tsx   # Role card component
│   │   │   ├── RoleList.tsx   # Role list with data fetching
│   │   │   ├── ResourceItem.tsx    # Resource display
│   │   │   └── ResourceList.tsx    # Resource list with filtering
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.tsx     # Home page
│   │   │   ├── RoleDetailPage.tsx  # Role details
│   │   │   └── NotFoundPage.tsx    # 404 page
│   │   ├── api.ts             # API client functions
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── App.tsx            # Root component with routing
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe JavaScript
- **Zod** - Input validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn** - Package manager (comes with Node.js)

## 🚀 Quick Start

Follow these steps to get the application running on your machine:

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd career-path-explorer

# Or download and extract the ZIP file, then navigate to the folder
```

### Step 2: Set Up the Database

```bash
# Connect to PostgreSQL (you may need to enter your PostgreSQL password)
psql -U postgres

# Create the database
CREATE DATABASE career_path_explorer;

# Exit psql
\q
```

### Step 3: Configure and Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from the example
# On Windows:
copy .env.example .env
# On Mac/Linux:
cp .env.example .env

# Edit .env file and update DATABASE_URL with your PostgreSQL credentials
# Open backend/.env in your text editor and change:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/career_path_explorer
# Replace 'yourpassword' with your actual PostgreSQL password

# Run database migration (creates tables)
npm run migrate

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

✅ **Backend is now running at `http://localhost:3000`**

Keep this terminal window open!

### Step 4: Start the Frontend (in a new terminal)

```bash
# Open a NEW terminal window/tab
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ **Frontend is now running at `http://localhost:5173`**

### Step 5: Open the Application

Open your web browser and go to:
```
http://localhost:5173
```

You should see the Career Path Explorer landing page with role cards!

## 🔄 Starting the Application (After Initial Setup)

Once you've completed the initial setup, you only need to start the servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🛑 Stopping the Application

To stop the servers:
- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

## Setup Instructions (Detailed)

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE career_path_explorer;

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from the example
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit .env and update DATABASE_URL with your PostgreSQL credentials
# Open backend/.env in your text editor and change:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/career_path_explorer
# Replace 'yourpassword' with your actual PostgreSQL password

# Run database migration (creates tables)
npm run migrate

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Populate database with sample data
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## 🗄️ Database Schema

### Roles Table
Stores technology career roles with descriptions, responsibilities, and skills.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  responsibilities TEXT[],      -- Array of responsibility strings
  skills TEXT[]                 -- Array of skill strings
);
```

**Key Concepts:**
- `SERIAL PRIMARY KEY`: Auto-incrementing unique identifier
- `TEXT[]`: PostgreSQL array type for storing multiple values
- `NOT NULL`: Enforces required fields

### Resources Table
Stores learning resources associated with each role.

```sql
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('Video', 'Article', 'Course')),
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced'))
);

CREATE INDEX idx_resources_role_id ON resources(role_id);
CREATE INDEX idx_resources_difficulty ON resources(difficulty);
```

**Key Concepts:**
- `REFERENCES roles(id)`: Foreign key constraint establishing relationship
- `ON DELETE RESTRICT`: Prevents deleting a role if it has resources
- `CHECK`: Enforces enum-like constraints on values
- `INDEX`: Improves query performance for filtering and joins

## 🔌 API Endpoints

### GET /api/roles
Retrieve all roles with basic information for the landing page.

**Response (200 OK):**
```json
{
  "roles": [
    {
      "id": 1,
      "name": "Software Engineer",
      "short_description": "Design, develop, and maintain software applications"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Database connection failure

---

### GET /api/roles/:id
Retrieve complete information for a specific role including all associated resources.

**Parameters:**
- `id` (path): Role ID (integer)

**Response (200 OK):**
```json
{
  "role": {
    "id": 1,
    "name": "Software Engineer",
    "short_description": "Design, develop, and maintain software applications",
    "long_description": "Software engineers create and maintain applications...",
    "responsibilities": [
      "Write clean, maintainable code",
      "Collaborate with team members"
    ],
    "skills": [
      "JavaScript",
      "TypeScript",
      "React"
    ],
    "resources": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "url": "https://example.com/js-intro",
        "resource_type": "Video",
        "difficulty": "Beginner"
      }
    ]
  }
}
```

**Error Responses:**
- `404 Not Found`: Role with specified ID does not exist
- `400 Bad Request`: Invalid ID format
- `500 Internal Server Error`: Database connection failure

---

### POST /api/roles
Create a new role (for demonstration and testing purposes).

**Request Body:**
```json
{
  "name": "Cloud Architect",
  "short_description": "Design cloud infrastructure solutions",
  "long_description": "Cloud architects design and implement...",
  "responsibilities": ["Design cloud solutions", "Ensure security"],
  "skills": ["AWS", "Azure", "Kubernetes"]
}
```

**Response (201 Created):**
```json
{
  "role": {
    "id": 6,
    "name": "Cloud Architect",
    "short_description": "Design cloud infrastructure solutions",
    "long_description": "Cloud architects design and implement...",
    "responsibilities": ["Design cloud solutions", "Ensure security"],
    "skills": ["AWS", "Azure", "Kubernetes"]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or validation failure
- `500 Internal Server Error`: Database insertion failure

---

### POST /api/resources
Add a new learning resource associated with a role.

**Request Body:**
```json
{
  "role_id": 1,
  "title": "Advanced TypeScript Patterns",
  "url": "https://example.com/ts-advanced",
  "resource_type": "Course",
  "difficulty": "Advanced"
}
```

**Response (201 Created):**
```json
{
  "resource": {
    "id": 15,
    "role_id": 1,
    "title": "Advanced TypeScript Patterns",
    "url": "https://example.com/ts-advanced",
    "resource_type": "Course",
    "difficulty": "Advanced"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields, invalid enum values, or validation failure
- `404 Not Found`: Specified role_id does not exist
- `500 Internal Server Error`: Database insertion failure

## 📊 Sample Data

The seed script includes 5 technology roles:
1. **Software Engineer** - Design, develop, and maintain software applications
2. **QA Engineer** - Ensure software quality through testing
3. **Data Scientist** - Analyze data and build predictive models
4. **UX/UI Designer** - Create user-friendly interfaces
5. **DevOps Engineer** - Manage infrastructure and deployment pipelines

Each role includes 3-4 learning resources with varied difficulty levels (Beginner, Intermediate, Advanced) and types (Video, Article, Course).

## 🎓 Live Coding Demonstration Suggestions

### Demo 1: Full-Stack Data Flow (15-20 minutes)
**Goal:** Show how data flows from database → backend → frontend

1. **Start with the database:**
   - Show the `roles` and `resources` tables in PostgreSQL
   - Run a simple SQL query: `SELECT * FROM roles;`
   - Explain the foreign key relationship

2. **Backend API layer:**
   - Open `backend/src/db/queries.ts` and show `getAllRoles()`
   - Open `backend/src/routes/roles.ts` and show the GET endpoint
   - Use Postman or curl to call `GET /api/roles`
   - Show the JSON response

3. **Frontend consumption:**
   - Open `frontend/src/api.ts` and show `getAllRoles()`
   - Open `frontend/src/components/RoleList.tsx` and show the fetch call
   - Open the browser and show the roles displayed on the landing page
   - Open browser DevTools Network tab to show the API request

**Key Teaching Points:**
- Each layer has a specific responsibility
- Data transforms at each layer (SQL → TypeScript objects → JSON → React components)
- Error handling at each layer

---

### Demo 2: Adding a New Feature (20-25 minutes)
**Goal:** Add a "search roles by name" feature

1. **Database query:**
   ```typescript
   // Add to backend/src/db/queries.ts
   export async function searchRoles(query: string): Promise<RoleSummary[]> {
     const result = await pool.query(
       'SELECT id, name, short_description FROM roles WHERE name ILIKE $1',
       [`%${query}%`]
     );
     return result.rows;
   }
   ```

2. **API endpoint:**
   ```typescript
   // Add to backend/src/routes/roles.ts
   router.get('/roles/search', async (req, res) => {
     const query = req.query.q as string;
     const roles = await searchRoles(query);
     res.json({ roles });
   });
   ```

3. **Frontend component:**
   - Add a search input to `RoleList.tsx`
   - Call the new API endpoint on input change
   - Display filtered results

**Key Teaching Points:**
- How to extend existing functionality
- SQL pattern matching with ILIKE
- Query parameters in REST APIs
- React state management for search input

---

### Demo 3: Property-Based Testing (15 minutes)
**Goal:** Show how property tests verify correctness across many inputs

1. **Show a unit test:**
   ```typescript
   // Example: Testing a specific case
   test('GET /api/roles returns 200', async () => {
     const response = await request(app).get('/api/roles');
     expect(response.status).toBe(200);
   });
   ```

2. **Show a property test:**
   ```typescript
   // Example: Testing a universal property
   test('Property: All roles have required fields', async () => {
     await fc.assert(
       fc.asyncProperty(fc.array(fc.record({...})), async (roles) => {
         // Test runs 100+ times with different random inputs
         // Verifies the property holds for ALL inputs
       })
     );
   });
   ```

3. **Run the tests:**
   - `npm test` in backend directory
   - Show how property tests run 100+ iterations
   - Explain how this catches edge cases unit tests might miss

**Key Teaching Points:**
- Unit tests verify specific examples
- Property tests verify universal rules
- Both are valuable and complementary

---

### Demo 4: Debugging with Browser DevTools (10 minutes)
**Goal:** Show how to debug frontend-backend communication

1. **Network tab:**
   - Open DevTools → Network tab
   - Navigate to a role detail page
   - Show the API request and response
   - Explain status codes (200, 404, 500)

2. **Console tab:**
   - Show console.log statements in the code
   - Demonstrate error messages
   - Show how to inspect React component state

3. **React DevTools:**
   - Install React DevTools extension
   - Show component tree
   - Inspect component props and state

**Key Teaching Points:**
- How to diagnose issues
- Understanding HTTP requests/responses
- Reading error messages effectively

## 🚀 Potential Extensions for Student Exploration

### Beginner Extensions
1. **Add more roles and resources:**
   - Use the POST endpoints to add new tech roles
   - Add resources for different skill levels

2. **Customize styling:**
   - Modify `frontend/src/index.css`
   - Change colors, fonts, and layout
   - Add animations and transitions

3. **Add a search feature:**
   - Filter roles by name on the landing page
   - Use the `filter()` method on the roles array

### Intermediate Extensions
4. **Resource type filtering:**
   - Add a filter to show only Videos, Articles, or Courses
   - Combine with difficulty filtering

5. **Sorting functionality:**
   - Sort roles alphabetically
   - Sort resources by difficulty level

6. **User favorites:**
   - Add a "favorite" button to role cards
   - Store favorites in browser localStorage
   - Show a "My Favorites" section

7. **Pagination:**
   - Display 10 roles per page
   - Add "Next" and "Previous" buttons
   - Implement page numbers

### Advanced Extensions
8. **User authentication:**
   - Add login/signup functionality
   - Store user-specific favorites in the database
   - Implement JWT authentication

9. **Resource ratings:**
   - Allow users to rate resources (1-5 stars)
   - Display average ratings
   - Sort resources by rating

10. **Admin dashboard:**
    - Create an admin interface to manage roles and resources
    - Add edit and delete functionality
    - Implement role-based access control

11. **Full-text search:**
    - Search across role names, descriptions, and skills
    - Implement search highlighting
    - Add search suggestions

12. **Data visualization:**
    - Create charts showing skill distributions
    - Visualize resource difficulty levels
    - Show role popularity metrics

13. **API rate limiting:**
    - Implement rate limiting on the backend
    - Handle rate limit errors on the frontend
    - Add retry logic with exponential backoff

14. **Caching:**
    - Implement Redis caching for frequently accessed data
    - Add cache invalidation strategies
    - Measure performance improvements

15. **Deployment:**
    - Deploy backend to Heroku or Railway
    - Deploy frontend to Vercel or Netlify
    - Set up environment variables for production
    - Configure CORS for production domains

## 💡 Development Notes

This application is designed for educational purposes to demonstrate:

### Architecture Concepts
- **Three-tier architecture**: Separation of presentation, application, and data layers
- **RESTful API design**: Standard HTTP methods (GET, POST) and status codes
- **Database relationships**: Foreign keys and referential integrity
- **Connection pooling**: Efficient database connection management

### Frontend Concepts
- **Component-based architecture**: Reusable UI components
- **Client-side routing**: Single-page application with React Router
- **State management**: React hooks (useState, useEffect)
- **API integration**: Fetch API for backend communication
- **Error boundaries**: Graceful error handling in React

### Backend Concepts
- **Express middleware**: Request processing pipeline
- **Input validation**: Zod schemas for type-safe validation
- **Error handling**: Centralized error handling middleware
- **Database queries**: Parameterized queries to prevent SQL injection
- **CORS configuration**: Cross-origin resource sharing for frontend access

### Testing Concepts
- **Property-based testing**: Formal verification with fast-check
- **Unit testing**: Specific example validation
- **Integration testing**: End-to-end API testing
- **Test organization**: Co-located tests with source code

### TypeScript Benefits
- **Type safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support and autocomplete
- **Refactoring**: Safer code changes with type checking
- **Documentation**: Types serve as inline documentation

## 🔍 Code Organization Principles

### Backend Structure
```
backend/src/
├── db/              # Data access layer
│   ├── config.ts    # Database connection (infrastructure)
│   ├── queries.ts   # Query functions (data access)
│   ├── migrate.ts   # Schema management
│   └── seed.ts      # Sample data
├── routes/          # API endpoints (application layer)
│   ├── roles.ts     # Role-related endpoints
│   └── resources.ts # Resource-related endpoints
├── validation/      # Input validation (business logic)
│   └── schemas.ts   # Zod validation schemas
└── server.ts        # Application setup (entry point)
```

**Key Principles:**
- Each file has a single responsibility
- Database logic is separated from route handlers
- Validation is centralized and reusable
- Types are shared across the application

### Frontend Structure
```
frontend/src/
├── components/      # Reusable UI components
│   ├── RoleCard.tsx
│   ├── RoleList.tsx
│   ├── ResourceItem.tsx
│   └── ResourceList.tsx
├── pages/           # Page-level components
│   ├── LandingPage.tsx
│   ├── RoleDetailPage.tsx
│   └── NotFoundPage.tsx
├── api.ts           # API client (data fetching)
├── types.ts         # TypeScript type definitions
├── App.tsx          # Root component (routing)
└── main.tsx         # Application entry point
```

**Key Principles:**
- Components are small and focused
- Pages compose multiple components
- API logic is separated from UI components
- Types are centralized for consistency

## 🧪 Testing Strategy

This project uses a dual testing approach:

### Unit Tests
- Test specific examples and edge cases
- Verify individual functions work correctly
- Fast execution for rapid feedback
- Example: "GET /api/roles returns 200 status"

### Property-Based Tests
- Test universal properties across all inputs
- Generate random test data (100+ iterations)
- Catch edge cases that unit tests miss
- Example: "All roles must have id, name, and short_description"

**Both approaches are complementary and necessary for comprehensive coverage.**

### Running Tests
```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm test -- --run          # Run once (no watch mode)
npm test queries           # Run specific test file

# Frontend tests
cd frontend
npm test                    # Run all tests
npm test -- --run          # Run once (no watch mode)
npm test RoleCard          # Run specific test file
```

## 🐛 Common Issues and Solutions

### Database Connection Errors
**Problem:** `Error: connect ECONNREFUSED`
**Solution:**
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check DATABASE_URL in `.env` file
3. Verify database exists: `psql -l`
4. Check credentials are correct

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`
**Solution:**
1. Find process using port: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Kill the process or change PORT in `.env`

### CORS Errors
**Problem:** `Access to fetch at 'http://localhost:3000/api/roles' from origin 'http://localhost:5173' has been blocked by CORS policy`
**Solution:**
1. Ensure backend CORS is configured correctly in `server.ts`
2. Check FRONTEND_URL environment variable
3. Restart backend server after changes

### TypeScript Errors
**Problem:** `Type 'X' is not assignable to type 'Y'`
**Solution:**
1. Check type definitions in `types.ts`
2. Ensure API responses match expected types
3. Use TypeScript's error messages to identify mismatches

### Migration Errors
**Problem:** `relation "roles" already exists`
**Solution:**
1. Drop existing tables: `psql -d career_path_explorer -c "DROP TABLE IF EXISTS resources, roles CASCADE;"`
2. Run migration again: `npm run migrate`

## 📚 Learning Resources

### Web Development Fundamentals
- [MDN Web Docs](https://developer.mozilla.org/) - Comprehensive web development documentation
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Official TypeScript guide

### React
- [React Documentation](https://react.dev/) - Official React docs
- [React Router](https://reactrouter.com/) - Client-side routing
- [React Testing Library](https://testing-library.com/react) - Testing React components

### Backend Development
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - Express documentation
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Node.js patterns
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) - SQL and PostgreSQL

### Testing
- [Vitest Documentation](https://vitest.dev/) - Fast unit test framework
- [fast-check Documentation](https://fast-check.dev/) - Property-based testing
- [Testing Best Practices](https://testingjavascript.com/) - Comprehensive testing guide

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new features from the extensions list
- Improve documentation
- Add more test coverage
- Enhance styling and UX
- Create tutorial content

## 📄 License

This project is created for educational purposes and is free to use and modify.
