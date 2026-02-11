/**
 * API Endpoint Unit Tests
 * 
 * Tests for all API endpoints including:
 * - GET /api/roles
 * - GET /api/roles/:id
 * - POST /api/roles
 * - POST /api/resources
 * 
 * Requirements: 2.5, 5.4, 6.4, 8.4
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import rolesRouter from '../roles';
import resourcesRouter from '../resources';
import { pool } from '../../db/config';

// Create test app
function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api', rolesRouter);
  app.use('/api', resourcesRouter);
  return app;
}

describe('API Endpoints', () => {
  let app: Express;
  let testRoleId: number;

  beforeAll(async () => {
    app = createTestApp();
    
    // Create a test role for testing
    const result = await pool.query(
      `INSERT INTO roles (name, short_description, long_description, responsibilities, skills)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Test Role', 'Test short description', 'Test long description', ['resp1', 'resp2'], ['skill1', 'skill2']]
    );
    testRoleId = result.rows[0].id;
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM resources WHERE role_id = $1', [testRoleId]);
    await pool.query('DELETE FROM roles WHERE id = $1', [testRoleId]);
    await pool.end();
  });

  describe('GET /api/roles', () => {
    it('should return all roles with 200 status', async () => {
      const response = await request(app)
        .get('/api/roles')
        .expect(200);

      expect(response.body).toHaveProperty('roles');
      expect(Array.isArray(response.body.roles)).toBe(true);
      expect(response.body.roles.length).toBeGreaterThan(0);
      
      // Verify role structure
      const role = response.body.roles[0];
      expect(role).toHaveProperty('id');
      expect(role).toHaveProperty('name');
      expect(role).toHaveProperty('short_description');
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should return role with resources for valid ID', async () => {
      const response = await request(app)
        .get(`/api/roles/${testRoleId}`)
        .expect(200);

      expect(response.body).toHaveProperty('role');
      const role = response.body.role;
      
      expect(role.id).toBe(testRoleId);
      expect(role).toHaveProperty('name');
      expect(role).toHaveProperty('short_description');
      expect(role).toHaveProperty('long_description');
      expect(role).toHaveProperty('responsibilities');
      expect(role).toHaveProperty('skills');
      expect(role).toHaveProperty('resources');
      expect(Array.isArray(role.resources)).toBe(true);
    });

    it('should return 404 for non-existent role ID', async () => {
      const response = await request(app)
        .get('/api/roles/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Role not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/roles/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid ID format');
    });
  });

  describe('POST /api/roles', () => {
    it('should create a new role with valid data', async () => {
      const newRole = {
        name: 'New Test Role',
        short_description: 'A new test role description',
        long_description: 'A longer description',
        responsibilities: ['responsibility 1', 'responsibility 2'],
        skills: ['skill 1', 'skill 2']
      };

      const response = await request(app)
        .post('/api/roles')
        .send(newRole)
        .expect(201);

      expect(response.body).toHaveProperty('role');
      const role = response.body.role;
      
      expect(role).toHaveProperty('id');
      expect(role.name).toBe(newRole.name);
      expect(role.short_description).toBe(newRole.short_description);
      expect(role.long_description).toBe(newRole.long_description);
      expect(role.responsibilities).toEqual(newRole.responsibilities);
      expect(role.skills).toEqual(newRole.skills);

      // Clean up
      await pool.query('DELETE FROM roles WHERE id = $1', [role.id]);
    });

    it('should create role with only required fields', async () => {
      const newRole = {
        name: 'Minimal Role',
        short_description: 'Minimal description'
      };

      const response = await request(app)
        .post('/api/roles')
        .send(newRole)
        .expect(201);

      expect(response.body).toHaveProperty('role');
      const role = response.body.role;
      
      expect(role.name).toBe(newRole.name);
      expect(role.short_description).toBe(newRole.short_description);

      // Clean up
      await pool.query('DELETE FROM roles WHERE id = $1', [role.id]);
    });

    it('should return 400 when name is missing', async () => {
      const invalidRole = {
        short_description: 'Description without name'
      };

      const response = await request(app)
        .post('/api/roles')
        .send(invalidRole)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 when short_description is missing', async () => {
      const invalidRole = {
        name: 'Name without description'
      };

      const response = await request(app)
        .post('/api/roles')
        .send(invalidRole)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/resources', () => {
    it('should create a new resource with valid data', async () => {
      const newResource = {
        role_id: testRoleId,
        title: 'Test Resource',
        url: 'https://example.com/resource',
        resource_type: 'Video',
        difficulty: 'Beginner'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(newResource)
        .expect(201);

      expect(response.body).toHaveProperty('resource');
      const resource = response.body.resource;
      
      expect(resource).toHaveProperty('id');
      expect(resource.role_id).toBe(newResource.role_id);
      expect(resource.title).toBe(newResource.title);
      expect(resource.url).toBe(newResource.url);
      expect(resource.resource_type).toBe(newResource.resource_type);
      expect(resource.difficulty).toBe(newResource.difficulty);

      // Clean up
      await pool.query('DELETE FROM resources WHERE id = $1', [resource.id]);
    });

    it('should return 404 when role_id does not exist', async () => {
      const invalidResource = {
        role_id: 999999,
        title: 'Resource for non-existent role',
        url: 'https://example.com/resource',
        resource_type: 'Article',
        difficulty: 'Intermediate'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Role not found');
    });

    it('should return 400 for invalid resource_type', async () => {
      const invalidResource = {
        role_id: testRoleId,
        title: 'Invalid Resource',
        url: 'https://example.com/resource',
        resource_type: 'InvalidType',
        difficulty: 'Beginner'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid difficulty', async () => {
      const invalidResource = {
        role_id: testRoleId,
        title: 'Invalid Resource',
        url: 'https://example.com/resource',
        resource_type: 'Video',
        difficulty: 'InvalidDifficulty'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidResource = {
        role_id: testRoleId,
        title: 'Incomplete Resource'
        // Missing url, resource_type, difficulty
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid URL format', async () => {
      const invalidResource = {
        role_id: testRoleId,
        title: 'Invalid URL Resource',
        url: 'not-a-valid-url',
        resource_type: 'Article',
        difficulty: 'Advanced'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
    });
  });
});
