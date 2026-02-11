/**
 * Property-Based Tests for Resource Creation Persistence
 * 
 * These tests verify that resource creation works correctly across all valid inputs.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { createRole, createResource, getResourcesByRoleId } from '../queries';
import { pool, testConnection, closePool } from '../config';

// Feature: career-path-explorer, Property 12: Resource Creation Persistence
// Validates: Requirements 6.3

describe('Property 12: Resource Creation Persistence', () => {
  let testRoleId: number;

  beforeAll(async () => {
    // Ensure database connection is working
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
  });

  beforeEach(async () => {
    // Create a test role for each test
    const role = await createRole({
      name: 'Test Role for Resources',
      short_description: 'A test role for resource creation tests'
    });
    testRoleId = role.id;
  });

  afterEach(async () => {
    // Clean up: delete test resources and role
    await pool.query('DELETE FROM resources WHERE role_id = $1', [testRoleId]);
    await pool.query('DELETE FROM roles WHERE id = $1', [testRoleId]);
  });

  afterAll(async () => {
    // Clean up database connection
    await closePool();
  });

  it('should persist any valid resource and assign a unique ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary resource data
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced')
        }),
        async (resourceData) => {
          // Create the resource
          const createdResource = await createResource({
            role_id: testRoleId,
            ...resourceData
          });

          // Verify the resource was assigned an ID
          expect(createdResource.id).toBeDefined();
          expect(typeof createdResource.id).toBe('number');
          expect(createdResource.id).toBeGreaterThan(0);

          // Verify the resource data matches what was provided
          expect(createdResource.role_id).toBe(testRoleId);
          expect(createdResource.title).toBe(resourceData.title);
          expect(createdResource.url).toBe(resourceData.url);
          expect(createdResource.resource_type).toBe(resourceData.resource_type);
          expect(createdResource.difficulty).toBe(resourceData.difficulty);

          // Verify we can retrieve the resource by role ID
          const resources = await getResourcesByRoleId(testRoleId);
          const foundResource = resources.find(r => r.id === createdResource.id);
          expect(foundResource).toBeDefined();
          expect(foundResource?.title).toBe(resourceData.title);
          expect(foundResource?.url).toBe(resourceData.url);
          expect(foundResource?.resource_type).toBe(resourceData.resource_type);
          expect(foundResource?.difficulty).toBe(resourceData.difficulty);

          // Clean up: delete the created resource
          await pool.query('DELETE FROM resources WHERE id = $1', [createdResource.id]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
