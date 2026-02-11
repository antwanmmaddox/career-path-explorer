# Career Path Explorer - Teaching Guide

## Overview

This guide is designed for educators teaching web development concepts to high school students or beginners. The Career Path Explorer application serves as a practical, real-world example of full-stack web development.

## Target Audience

- High school students (grades 10-12)
- Beginners with basic programming knowledge
- Students interested in web development careers
- Coding bootcamp participants

## Prerequisites

Students should have:
- Basic understanding of HTML, CSS, and JavaScript
- Familiarity with command line/terminal
- Text editor or IDE installed
- Willingness to learn and experiment

## Learning Objectives

By the end of this project, students will be able to:

1. **Understand full-stack architecture:**
   - Explain the role of frontend, backend, and database layers
   - Describe how data flows through the application
   - Identify the responsibilities of each layer

2. **Work with databases:**
   - Create database schemas with tables and relationships
   - Write SQL queries to retrieve and manipulate data
   - Understand foreign keys and referential integrity

3. **Build REST APIs:**
   - Design RESTful endpoints following conventions
   - Implement CRUD operations (Create, Read, Update, Delete)
   - Handle errors and return appropriate status codes

4. **Develop React applications:**
   - Create reusable components
   - Manage component state with hooks
   - Fetch data from APIs
   - Implement client-side routing

5. **Use TypeScript:**
   - Define types and interfaces
   - Catch errors at compile time
   - Improve code quality and maintainability

6. **Test software:**
   - Write unit tests for specific scenarios
   - Understand property-based testing concepts
   - Run and interpret test results

---

## Teaching Approach

### Phase 1: Introduction (Week 1)

**Goal:** Understand the big picture and set up the development environment

#### Lesson 1.1: What is Full-Stack Development? (45 minutes)

**Topics:**
- What is a web application?
- Frontend vs. Backend vs. Database
- How do they communicate?
- Real-world examples (social media, e-commerce)

**Activities:**
1. Draw the architecture diagram on the board
2. Show the Career Path Explorer running
3. Open browser DevTools to show network requests
4. Discuss: "What happens when you click a role card?"

**Homework:**
- Install Node.js, PostgreSQL, and VS Code
- Read the README.md file
- Watch: "How the Internet Works" video

#### Lesson 1.2: Environment Setup (90 minutes)

**Topics:**
- Installing prerequisites
- Setting up the database
- Running the backend server
- Running the frontend application

**Activities:**
1. Follow setup instructions together as a class
2. Troubleshoot common issues
3. Verify everyone can see the application running
4. Explore the application features

**Common Issues:**
- PostgreSQL not starting → Check installation
- Port conflicts → Change PORT in .env
- Database connection errors → Verify credentials

**Homework:**
- Ensure the application runs on your machine
- Explore the codebase structure
- List 3 questions about the code

---

### Phase 2: Database Layer (Week 2)

**Goal:** Understand how data is stored and retrieved

#### Lesson 2.1: Database Fundamentals (60 minutes)

**Topics:**
- What is a relational database?
- Tables, rows, and columns
- Primary keys and foreign keys
- SQL basics (SELECT, INSERT, UPDATE, DELETE)

**Activities:**
1. Open PostgreSQL and show the `roles` and `resources` tables
2. Run SQL queries together:
   ```sql
   SELECT * FROM roles;
   SELECT * FROM resources WHERE role_id = 1;
   SELECT r.name, res.title 
   FROM roles r 
   JOIN resources res ON r.id = res.role_id;
   ```
3. Explain the foreign key relationship
4. Show what happens if you try to delete a role with resources

**Hands-On Exercise:**
- Write a query to find all "Beginner" resources
- Write a query to count resources per role
- Insert a new role using SQL

**Homework:**
- Complete SQL practice exercises
- Read `backend/src/db/migrate.ts` and understand the schema

#### Lesson 2.2: Database Access Layer (60 minutes)

**Topics:**
- Connection pooling
- Parameterized queries (SQL injection prevention)
- Query functions in TypeScript

**Activities:**
1. Open `backend/src/db/config.ts` and explain the connection pool
2. Open `backend/src/db/queries.ts` and walk through `getAllRoles()`
3. Explain parameterized queries: `$1, $2, $3`
4. Show how TypeScript types match database schema

**Code Walkthrough:**
```typescript
// Show this function and explain each part
export async function getAllRoles(): Promise<RoleSummary[]> {
  // 1. Execute SQL query using the connection pool
  const result = await pool.query(
    'SELECT id, name, short_description FROM roles ORDER BY id'
  );
  // 2. Return the rows (PostgreSQL returns an array)
  return result.rows;
}
```

**Hands-On Exercise:**
- Add a new query function: `getRolesBySkill(skill: string)`
- Test it by calling it from the backend

**Homework:**
- Read about SQL injection attacks
- Implement `getResourcesByDifficulty(difficulty: string)`

---

### Phase 3: Backend API (Week 3)

**Goal:** Build and understand REST APIs

#### Lesson 3.1: REST API Concepts (60 minutes)

**Topics:**
- What is REST?
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 201, 400, 404, 500)
- Request and response structure

**Activities:**
1. Use Postman or curl to call the API endpoints
2. Show the request/response cycle
3. Explain each status code with examples
4. Demonstrate error responses

**API Testing Exercise:**
```bash
# GET request - successful
curl http://localhost:3000/api/roles

# GET request - not found
curl http://localhost:3000/api/roles/999

# POST request - create role
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Role","short_description":"Test"}'
```

**Discussion Questions:**
- Why do we use different HTTP methods?
- What's the difference between 400 and 500 errors?
- Why is JSON the standard format for APIs?

**Homework:**
- Read API_DOCUMENTATION.md
- Test all endpoints using Postman
- Document what each endpoint does

#### Lesson 3.2: Building API Endpoints (90 minutes)

**Topics:**
- Express.js framework
- Route handlers
- Middleware
- Error handling

**Activities:**
1. Open `backend/src/routes/roles.ts`
2. Walk through the GET /api/roles endpoint:
   ```typescript
   router.get('/roles', async (req, res, next) => {
     try {
       // 1. Call database query function
       const roles = await getAllRoles();
       // 2. Return JSON response
       res.json({ roles });
     } catch (error) {
       // 3. Pass error to error handler
       next(error);
     }
   });
   ```
3. Explain try-catch error handling
4. Show the global error handler in `server.ts`

**Hands-On Exercise:**
- Add a new endpoint: `GET /api/roles/search?q=engineer`
- Implement the search functionality
- Test it with Postman

**Homework:**
- Implement `GET /api/resources?difficulty=Beginner`
- Add proper error handling
- Write tests for the new endpoint

#### Lesson 3.3: Input Validation (60 minutes)

**Topics:**
- Why validate input?
- Zod validation library
- Validation schemas
- Error messages

**Activities:**
1. Open `backend/src/validation/schemas.ts`
2. Explain the CreateRoleSchema:
   ```typescript
   export const CreateRoleSchema = z.object({
     name: z.string().min(1).max(255),
     short_description: z.string().min(1),
     // ...
   });
   ```
3. Show how validation is used in route handlers
4. Demonstrate validation errors with invalid requests

**Security Discussion:**
- What happens without validation?
- SQL injection attacks
- XSS attacks
- Always validate on the backend (never trust the client)

**Hands-On Exercise:**
- Add validation for the search endpoint
- Test with invalid inputs
- Improve error messages

**Homework:**
- Read about common web security vulnerabilities
- Add validation to your custom endpoints

---

### Phase 4: Frontend Development (Week 4-5)

**Goal:** Build interactive user interfaces with React

#### Lesson 4.1: React Fundamentals (90 minutes)

**Topics:**
- Components and props
- JSX syntax
- State management with useState
- Side effects with useEffect

**Activities:**
1. Open `frontend/src/components/RoleCard.tsx`
2. Explain the component structure:
   ```typescript
   interface RoleCardProps {
     id: number;
     name: string;
     short_description: string;
     onClick: (id: number) => void;
   }

   export const RoleCard: React.FC<RoleCardProps> = ({ 
     id, name, short_description, onClick 
   }) => {
     return (
       <div className="role-card" onClick={() => onClick(id)}>
         <h3>{name}</h3>
         <p>{short_description}</p>
       </div>
     );
   };
   ```
3. Explain props: data passed from parent to child
4. Show how the component is used in RoleList

**Hands-On Exercise:**
- Create a new component: `SkillBadge`
- Use it to display skills on the role detail page
- Style it with CSS

**Homework:**
- Read React documentation on components
- Create a `DifficultyBadge` component
- Use it in the ResourceItem component

#### Lesson 4.2: Data Fetching and State (90 minutes)

**Topics:**
- Fetching data from APIs
- Loading states
- Error handling
- useEffect hook

**Activities:**
1. Open `frontend/src/components/RoleList.tsx`
2. Walk through the data fetching logic:
   ```typescript
   const [roles, setRoles] = useState<RoleSummary[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     async function fetchRoles() {
       try {
         setLoading(true);
         const data = await getAllRoles();
         setRoles(data.roles);
       } catch (err) {
         setError('Failed to load roles');
       } finally {
         setLoading(false);
       }
     }
     fetchRoles();
   }, []);
   ```
3. Explain each state variable
4. Show the loading and error UI

**Common Mistakes:**
- Forgetting the dependency array in useEffect
- Not handling loading states
- Not handling errors
- Infinite loops with useEffect

**Hands-On Exercise:**
- Add a "Refresh" button to reload roles
- Show a success message after refreshing
- Add a retry button for errors

**Homework:**
- Implement data fetching for a new page
- Add loading and error states
- Test error scenarios (disconnect backend)

#### Lesson 4.3: Client-Side Routing (60 minutes)

**Topics:**
- Single-page applications (SPAs)
- React Router
- Route parameters
- Navigation

**Activities:**
1. Open `frontend/src/App.tsx`
2. Explain the routing setup:
   ```typescript
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<LandingPage />} />
       <Route path="/roles/:id" element={<RoleDetailPage />} />
       <Route path="*" element={<NotFoundPage />} />
     </Routes>
   </BrowserRouter>
   ```
3. Show how to navigate: `navigate('/roles/1')`
4. Show how to read params: `const { id } = useParams()`

**Hands-On Exercise:**
- Add a new route: `/about`
- Create an AboutPage component
- Add navigation links in the header

**Homework:**
- Add a "Favorites" page
- Implement navigation to it
- Store favorites in localStorage

---

### Phase 5: Testing (Week 6)

**Goal:** Ensure code quality through testing

#### Lesson 5.1: Unit Testing (90 minutes)

**Topics:**
- Why test?
- Unit tests vs. integration tests
- Writing test cases
- Running tests

**Activities:**
1. Open `backend/src/__tests__/server.test.ts`
2. Walk through a simple test:
   ```typescript
   test('GET /api/roles returns 200', async () => {
     const response = await request(app).get('/api/roles');
     expect(response.status).toBe(200);
     expect(response.body.roles).toBeInstanceOf(Array);
   });
   ```
3. Run the tests: `npm test`
4. Show how tests catch bugs

**Hands-On Exercise:**
- Write a test for GET /api/roles/:id
- Test the 404 case
- Test the 400 case (invalid ID)

**Homework:**
- Write tests for your custom endpoints
- Achieve 80% code coverage
- Fix any failing tests

#### Lesson 5.2: Property-Based Testing (60 minutes)

**Topics:**
- What is property-based testing?
- Universal properties vs. specific examples
- fast-check library
- Interpreting test results

**Activities:**
1. Explain the concept: "Test properties that should always be true"
2. Show a property test:
   ```typescript
   test('Property: All roles have required fields', async () => {
     await fc.assert(
       fc.asyncProperty(
         fc.array(fc.record({
           id: fc.integer({ min: 1 }),
           name: fc.string({ minLength: 1 }),
           short_description: fc.string({ minLength: 1 })
         })),
         async (roles) => {
           // This property should hold for ALL possible inputs
           roles.forEach(role => {
             expect(role.id).toBeGreaterThan(0);
             expect(role.name.length).toBeGreaterThan(0);
             expect(role.short_description.length).toBeGreaterThan(0);
           });
         }
       ),
       { numRuns: 100 } // Run 100 times with random data
     );
   });
   ```
3. Run property tests and show the output
4. Explain how it catches edge cases

**Discussion:**
- When to use unit tests vs. property tests?
- What properties should we test?
- How many iterations are enough?

**Homework:**
- Read about property-based testing
- Write a property test for resource validation
- Compare it to a unit test

---

## Assessment Ideas

### Formative Assessment (Ongoing)

1. **Code Reviews:**
   - Students review each other's code
   - Focus on readability and best practices
   - Provide constructive feedback

2. **Quick Quizzes:**
   - Multiple choice questions on concepts
   - Short coding challenges
   - Debugging exercises

3. **Discussion Participation:**
   - Ask questions during lessons
   - Explain concepts to peers
   - Share solutions and approaches

### Summative Assessment (End of Unit)

1. **Feature Implementation (40%):**
   - Add a new feature from the extensions list
   - Must include database, backend, and frontend changes
   - Must include tests
   - Must be documented

2. **Code Quality (30%):**
   - Follows TypeScript best practices
   - Proper error handling
   - Clean, readable code
   - Meaningful variable names

3. **Testing (20%):**
   - Unit tests for new functionality
   - Property tests where appropriate
   - Tests pass and provide good coverage

4. **Documentation (10%):**
   - README updates
   - Code comments
   - API documentation
   - Clear commit messages

### Project Ideas

**Beginner:**
1. Add a "Contact" page with a form
2. Implement role sorting (alphabetical, by ID)
3. Add a search bar for roles

**Intermediate:**
4. Implement user favorites with localStorage
5. Add pagination for roles (10 per page)
6. Create an admin dashboard to manage roles

**Advanced:**
7. Add user authentication (login/signup)
8. Implement role-based access control
9. Add a recommendation system based on skills
10. Deploy the application to production

---

## Common Student Questions

### "Why do we need TypeScript? JavaScript works fine."

**Answer:** TypeScript catches errors before runtime. Show an example:
```typescript
// Without TypeScript - error at runtime
function greet(name) {
  return name.toUpperCase(); // Crashes if name is undefined
}
greet(); // Runtime error!

// With TypeScript - error at compile time
function greet(name: string) {
  return name.toUpperCase();
}
greet(); // TypeScript error: Argument missing!
```

### "Why separate frontend and backend? Can't we do it all in one?"

**Answer:** Separation of concerns. Each layer has a specific job:
- Frontend: User interface and experience
- Backend: Business logic and data validation
- Database: Data storage and retrieval

This makes the code easier to maintain, test, and scale.

### "What's the difference between SQL and NoSQL databases?"

**Answer:** 
- **SQL (PostgreSQL):** Structured data with relationships, ACID guarantees
- **NoSQL (MongoDB):** Flexible schema, good for unstructured data

For this project, SQL is better because we have clear relationships (roles have resources).

### "Why do we need tests? Can't we just manually test?"

**Answer:** Manual testing doesn't scale. Tests:
- Run automatically on every change
- Catch regressions (breaking existing features)
- Document expected behavior
- Give confidence when refactoring

### "What's the difference between 400 and 500 errors?"

**Answer:**
- **400 (Bad Request):** Client's fault - invalid input, missing fields
- **500 (Internal Server Error):** Server's fault - database error, bug in code

---

## Additional Resources

### For Students

**Videos:**
- [How the Internet Works](https://www.youtube.com/watch?v=7_LPdttKXPc)
- [What is an API?](https://www.youtube.com/watch?v=s7wmiS2mSXY)
- [React in 100 Seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM)

**Interactive Tutorials:**
- [SQL Zoo](https://sqlzoo.net/) - Interactive SQL practice
- [React Tutorial](https://react.dev/learn) - Official React tutorial
- [TypeScript Playground](https://www.typescriptlang.org/play) - Try TypeScript online

**Documentation:**
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) - SQL and PostgreSQL
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - Backend framework

### For Educators

**Teaching Resources:**
- [CS50 Web Programming](https://cs50.harvard.edu/web/) - Harvard's web dev course
- [The Odin Project](https://www.theodinproject.com/) - Free full-stack curriculum
- [freeCodeCamp](https://www.freecodecamp.org/) - Interactive coding challenges

**Professional Development:**
- [Teaching Tech Together](https://teachtogether.tech/) - Evidence-based teaching
- [CS Teaching Tips](https://csteachingtips.org/) - Practical teaching strategies

---

## Tips for Success

### For Students

1. **Don't copy-paste code without understanding it**
   - Read the code line by line
   - Ask "What does this do?" and "Why is it here?"
   - Experiment by changing things

2. **Use the debugger**
   - Set breakpoints in VS Code
   - Step through code execution
   - Inspect variable values

3. **Read error messages carefully**
   - They tell you exactly what's wrong
   - Google the error message
   - Check Stack Overflow

4. **Ask for help when stuck**
   - Explain what you're trying to do
   - Show what you've tried
   - Share the error message

5. **Build something you care about**
   - Modify the project to match your interests
   - Add features you find useful
   - Make it your own

### For Educators

1. **Start with the big picture**
   - Show the working application first
   - Explain how pieces fit together
   - Then dive into details

2. **Use live coding**
   - Code in front of students
   - Make mistakes and fix them
   - Think out loud

3. **Encourage experimentation**
   - "What happens if we change this?"
   - Let students break things
   - Debugging is learning

4. **Relate to real-world**
   - Show how companies use these technologies
   - Discuss career paths
   - Invite guest speakers

5. **Differentiate instruction**
   - Provide extensions for advanced students
   - Offer extra support for struggling students
   - Allow different project choices

---

## Conclusion

The Career Path Explorer is more than just a coding project—it's a window into professional web development. By working through this application, students gain practical skills and confidence to pursue careers in technology.

Remember: The goal isn't perfection, it's progress. Celebrate small wins, learn from mistakes, and keep building!

**Happy teaching! 🎓**
