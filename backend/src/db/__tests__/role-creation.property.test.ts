/**
 * Property-Based Tests for Role Creation Persistence
 * 
 * These tests verify that role creation works correctly across all valid inputs.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fc from 'fast-check';
import { createRole, getRoleById, roleExists } from '../queries';
import { pool, testConnection, closePool } from '../config';

// Feature: career-path-explorer, Property 10: Role Creation Persistence
// Validates: Requirements 5.3, 5.5

describe('Property 10: Role Creation Persistence', () => {
  beforeAll(async () => {
    // Ensure database connection is working
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
  });

  afterAll(async () => {
    // Clean up database connection
    await closePool();
  });

  it('should persist any valid role and assign a unique ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary role data
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 255 }),
          short_description: fc.string({ minLength: 1, maxLength: 1000 }),
          long_description: fc.option(fc.string({ maxLength: 5000 }), { nil: undefined }),
          responsibilities: fc.option(fc.array(fc.string({ maxLength: 500 }), { maxLength: 20 }), { nil: undefined }),
          skills: fc.option(fc.array(fc.string({ maxLength: 200 }), { maxLength: 30 }), { nil: undefined })
        }),
        async (roleData) => {
          // Create the role
          const createdRole = await createRole(roleData);

          // Verify the role was assigned an ID
          expect(createdRole.id).toBeDefined();
          expect(typeof createdRole.id).toBe('number');
          expect(createdRole.id).toBeGreaterThan(0);

          // Verify the role data matches what was provided
          expect(createdRole.name).toBe(roleData.name);
          expect(createdRole.short_description).toBe(roleData.short_description);
          expect(createdRole.long_description).toBe(roleData.long_description || null);
          expect(createdRole.responsibilities).toEqual(roleData.responsibilities || []);
          expect(createdRole.skills).toEqual(roleData.skills || []);

          // Verify the role exists in the database
          const exists = await roleExists(createdRole.id);
          expect(exists).toBe(true);

          // Verify we can retrieve the role by ID
          const retrievedRole = await getRoleById(createdRole.id);
          expect(retrievedRole).not.toBeNull();
          expect(retrievedRole?.id).toBe(createdRole.id);
          expect(retrievedRole?.name).toBe(roleData.name);
          expect(retrievedRole?.short_description).toBe(roleData.short_description);

          // Clean up: delete the created role
          await pool.query('DELETE FROM roles WHERE id = $1', [createdRole.id]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
