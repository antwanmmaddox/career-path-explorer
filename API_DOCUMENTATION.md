# Career Path Explorer - API Documentation

## Overview

The Career Path Explorer API is a RESTful API that provides access to technology career roles and associated learning resources. This document provides detailed information about each endpoint with example requests and responses.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data_key": { ... }
}
```

**Error Response:**
```json
{
  "error": "Human-readable error message",
  "details": "Additional context (optional)"
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (validation error)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Endpoints

### 1. Get All Roles

Retrieve a list of all technology career roles with basic information.

**Endpoint:** `GET /api/roles`

**Use Case:** Display role cards on the landing page

**Request:**
```bash
curl http://localhost:3000/api/roles
```

**Response (200 OK):**
```json
{
  "roles": [
    {
      "id": 1,
      "name": "Software Engineer",
      "short_description": "Design, develop, and maintain software applications using various programming languages and frameworks"
    },
    {
      "id": 2,
      "name": "QA Engineer",
      "short_description": "Ensure software quality through comprehensive testing strategies and automation"
    },
    {
      "id": 3,
      "name": "Data Scientist",
      "short_description": "Analyze complex data sets and build predictive models to drive business decisions"
    }
  ]
}
```

**Response Fields:**
- `roles` (array): List of role summaries
  - `id` (number): Unique role identifier
  - `name` (string): Role title
  - `short_description` (string): Brief role description

**Error Responses:**
- `500 Internal Server Error`: Database connection failure

**Example Usage (JavaScript):**
```javascript
const response = await fetch('http://localhost:3000/api/roles');
const data = await response.json();
console.log(data.roles); // Array of role summaries
```

---

### 2. Get Role by ID

Retrieve complete information about a specific role, including all associated learning resources.

**Endpoint:** `GET /api/roles/:id`

**Use Case:** Display detailed role information on the role detail page

**Parameters:**
- `id` (path parameter, required): Role ID (integer)

**Request:**
```bash
curl http://localhost:3000/api/roles/1
```

**Response (200 OK):**
```json
{
  "role": {
    "id": 1,
    "name": "Software Engineer",
    "short_description": "Design, develop, and maintain software applications using various programming languages and frameworks",
    "long_description": "Software engineers are the architects of the digital world. They design, develop, test, and maintain software applications that power everything from mobile apps to enterprise systems. This role requires strong problem-solving skills, attention to detail, and the ability to work collaboratively in teams. Software engineers continuously learn new technologies and adapt to changing requirements.",
    "responsibilities": [
      "Write clean, maintainable, and efficient code",
      "Collaborate with cross-functional teams to define and ship new features",
      "Debug and resolve software defects",
      "Participate in code reviews and provide constructive feedback",
      "Stay updated with emerging technologies and industry trends"
    ],
    "skills": [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Git",
      "Problem-solving",
      "Communication"
    ],
    "resources": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "url": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        "resource_type": "Video",
        "difficulty": "Beginner"
      },
      {
        "id": 2,
        "title": "TypeScript Handbook",
        "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
        "resource_type": "Article",
        "difficulty": "Intermediate"
      },
      {
        "id": 3,
        "title": "React - The Complete Guide",
        "url": "https://www.udemy.com/course/react-the-complete-guide/",
        "resource_type": "Course",
        "difficulty": "Intermediate"
      }
    ]
  }
}
```

**Response Fields:**
- `role` (object): Complete role information
  - `id` (number): Unique role identifier
  - `name` (string): Role title
  - `short_description` (string): Brief role description
  - `long_description` (string): Detailed role description
  - `responsibilities` (array of strings): List of job responsibilities
  - `skills` (array of strings): Required skills for the role
  - `resources` (array): Associated learning resources
    - `id` (number): Unique resource identifier
    - `title` (string): Resource title
    - `url` (string): Resource URL
    - `resource_type` (string): Type of resource (Video, Article, or Course)
    - `difficulty` (string): Difficulty level (Beginner, Intermediate, or Advanced)

**Error Responses:**

**404 Not Found:**
```json
{
  "error": "Role not found",
  "details": "No role exists with ID 999"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid role ID",
  "details": "Role ID must be a positive integer"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database error",
  "details": "Failed to fetch role from database"
}
```

**Example Usage (JavaScript):**
```javascript
const roleId = 1;
const response = await fetch(`http://localhost:3000/api/roles/${roleId}`);

if (response.ok) {
  const data = await response.json();
  console.log(data.role.name); // "Software Engineer"
  console.log(data.role.resources.length); // Number of resources
} else if (response.status === 404) {
  console.error('Role not found');
} else {
  console.error('Error fetching role');
}
```

---

### 3. Create Role

Create a new technology career role.

**Endpoint:** `POST /api/roles`

**Use Case:** Add new roles to the system (demonstration and testing)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Cloud Architect",
  "short_description": "Design and implement cloud infrastructure solutions",
  "long_description": "Cloud architects design, build, and manage cloud computing strategies for organizations. They evaluate business needs and design scalable, secure, and cost-effective cloud solutions using platforms like AWS, Azure, or Google Cloud.",
  "responsibilities": [
    "Design cloud infrastructure architecture",
    "Ensure security and compliance in cloud environments",
    "Optimize cloud costs and performance",
    "Lead cloud migration projects"
  ],
  "skills": [
    "AWS",
    "Azure",
    "Kubernetes",
    "Terraform",
    "Security best practices"
  ]
}
```

**Request Body Fields:**
- `name` (string, required): Role title (max 255 characters)
- `short_description` (string, required): Brief role description
- `long_description` (string, optional): Detailed role description
- `responsibilities` (array of strings, optional): List of job responsibilities
- `skills` (array of strings, optional): Required skills for the role

**Request (curl):**
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cloud Architect",
    "short_description": "Design and implement cloud infrastructure solutions",
    "long_description": "Cloud architects design, build, and manage cloud computing strategies...",
    "responsibilities": ["Design cloud infrastructure", "Ensure security"],
    "skills": ["AWS", "Azure", "Kubernetes"]
  }'
```

**Response (201 Created):**
```json
{
  "role": {
    "id": 6,
    "name": "Cloud Architect",
    "short_description": "Design and implement cloud infrastructure solutions",
    "long_description": "Cloud architects design, build, and manage cloud computing strategies...",
    "responsibilities": [
      "Design cloud infrastructure",
      "Ensure security"
    ],
    "skills": [
      "AWS",
      "Azure",
      "Kubernetes"
    ]
  }
}
```

**Error Responses:**

**400 Bad Request (Missing Required Field):**
```json
{
  "error": "Validation error",
  "details": "name is required"
}
```

**400 Bad Request (Invalid Data Type):**
```json
{
  "error": "Validation error",
  "details": "responsibilities must be an array of strings"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database error",
  "details": "Failed to insert role into database"
}
```

**Example Usage (JavaScript):**
```javascript
const newRole = {
  name: "Cloud Architect",
  short_description: "Design and implement cloud infrastructure solutions",
  responsibilities: ["Design cloud infrastructure", "Ensure security"],
  skills: ["AWS", "Azure", "Kubernetes"]
};

const response = await fetch('http://localhost:3000/api/roles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newRole)
});

if (response.status === 201) {
  const data = await response.json();
  console.log('Created role with ID:', data.role.id);
} else {
  const error = await response.json();
  console.error('Error:', error.details);
}
```

---

### 4. Create Resource

Add a new learning resource associated with a role.

**Endpoint:** `POST /api/resources`

**Use Case:** Add learning materials for a specific role

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "role_id": 1,
  "title": "Advanced TypeScript Patterns",
  "url": "https://www.example.com/typescript-advanced",
  "resource_type": "Course",
  "difficulty": "Advanced"
}
```

**Request Body Fields:**
- `role_id` (number, required): ID of the associated role
- `title` (string, required): Resource title (max 255 characters)
- `url` (string, required): Valid URL to the resource
- `resource_type` (string, required): Type of resource - must be one of:
  - `"Video"`
  - `"Article"`
  - `"Course"`
- `difficulty` (string, required): Difficulty level - must be one of:
  - `"Beginner"`
  - `"Intermediate"`
  - `"Advanced"`

**Request (curl):**
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 1,
    "title": "Advanced TypeScript Patterns",
    "url": "https://www.example.com/typescript-advanced",
    "resource_type": "Course",
    "difficulty": "Advanced"
  }'
```

**Response (201 Created):**
```json
{
  "resource": {
    "id": 15,
    "role_id": 1,
    "title": "Advanced TypeScript Patterns",
    "url": "https://www.example.com/typescript-advanced",
    "resource_type": "Course",
    "difficulty": "Advanced"
  }
}
```

**Error Responses:**

**400 Bad Request (Missing Required Field):**
```json
{
  "error": "Validation error",
  "details": "title is required"
}
```

**400 Bad Request (Invalid Enum Value):**
```json
{
  "error": "Validation error",
  "details": "resource_type must be one of: Video, Article, Course"
}
```

**400 Bad Request (Invalid URL):**
```json
{
  "error": "Validation error",
  "details": "url must be a valid URL"
}
```

**404 Not Found (Role Doesn't Exist):**
```json
{
  "error": "Role not found",
  "details": "Cannot create resource for non-existent role with ID 999"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database error",
  "details": "Failed to insert resource into database"
}
```

**Example Usage (JavaScript):**
```javascript
const newResource = {
  role_id: 1,
  title: "Advanced TypeScript Patterns",
  url: "https://www.example.com/typescript-advanced",
  resource_type: "Course",
  difficulty: "Advanced"
};

const response = await fetch('http://localhost:3000/api/resources', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newResource)
});

if (response.status === 201) {
  const data = await response.json();
  console.log('Created resource with ID:', data.resource.id);
} else if (response.status === 404) {
  console.error('Role not found');
} else {
  const error = await response.json();
  console.error('Error:', error.details);
}
```

---

## Testing the API

### Using curl

**Get all roles:**
```bash
curl http://localhost:3000/api/roles
```

**Get specific role:**
```bash
curl http://localhost:3000/api/roles/1
```

**Create a role:**
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Role","short_description":"Test description"}'
```

**Create a resource:**
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"role_id":1,"title":"Test Resource","url":"https://example.com","resource_type":"Video","difficulty":"Beginner"}'
```

### Using Postman

1. **Import Collection:**
   - Create a new collection named "Career Path Explorer"
   - Add requests for each endpoint

2. **Set Environment Variables:**
   - `base_url`: `http://localhost:3000/api`

3. **Test Requests:**
   - GET {{base_url}}/roles
   - GET {{base_url}}/roles/1
   - POST {{base_url}}/roles (with JSON body)
   - POST {{base_url}}/resources (with JSON body)

### Using JavaScript/TypeScript

See the example usage sections above for each endpoint.

---

## Rate Limiting

Currently, the API does not implement rate limiting. In a production environment, consider implementing rate limiting to prevent abuse.

**Recommended limits:**
- 100 requests per minute per IP address
- 1000 requests per hour per IP address

---

## CORS Configuration

The API is configured to accept requests from:
- Development: `http://localhost:5173` (Vite dev server)
- Production: Configure via `FRONTEND_URL` environment variable

**CORS Headers:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Error Handling Best Practices

When consuming this API:

1. **Always check response status:**
   ```javascript
   if (!response.ok) {
     const error = await response.json();
     console.error(error.details);
   }
   ```

2. **Handle network errors:**
   ```javascript
   try {
     const response = await fetch(url);
   } catch (error) {
     console.error('Network error:', error);
   }
   ```

3. **Provide user feedback:**
   - Show loading indicators during requests
   - Display error messages to users
   - Offer retry options for failed requests

4. **Log errors for debugging:**
   - Log error details to console in development
   - Send error reports to monitoring service in production

---

## Future Enhancements

Potential API improvements:

1. **Pagination:** Add `?page=1&limit=10` query parameters
2. **Filtering:** Add `?difficulty=Beginner` for resources
3. **Sorting:** Add `?sort=name&order=asc` for roles
4. **Search:** Add `?q=engineer` for text search
5. **Authentication:** Add JWT-based authentication
6. **Rate Limiting:** Implement request throttling
7. **Caching:** Add ETag headers for cache control
8. **Versioning:** Add `/v1/` prefix for API versioning

---

## Support

For questions or issues:
- Check the main README.md for setup instructions
- Review the code comments in the source files
- Open an issue on the project repository
