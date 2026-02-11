/**
 * Property-Based Tests for Validation Schemas
 * 
 * These tests verify that validation schemas correctly reject invalid inputs
 * and accept valid inputs across all possible input combinations.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  ResourceTypeSchema,
  DifficultyLevelSchema,
  CreateRoleSchema,
  CreateResourceSchema,
} from '../schemas';

// Feature: career-path-explorer, Property 6: Resource Type Validation
// Validates: Requirements 3.3, 6.5

describe('Property 6: Resource Type Validation', () => {
  it('should reject any resource_type that is not Video, Article, or Course', async () => {
    await fc.assert(
      fc.property(
        // Generate strings that are NOT valid resource types
        fc.string().filter(s => s !== 'Video' && s !== 'Article' && s !== 'Course'),
        (invalidType) => {
          const result = ResourceTypeSchema.safeParse(invalidType);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept exactly Video, Article, or Course', () => {
    const validTypes = ['Video', 'Article', 'Course'];
    
    validTypes.forEach(type => {
      const result = ResourceTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(type);
      }
    });
  });
});

// Feature: career-path-explorer, Property 7: Difficulty Level Validation
// Validates: Requirements 3.4, 6.6

describe('Property 7: Difficulty Level Validation', () => {
  it('should reject any difficulty that is not Beginner, Intermediate, or Advanced', async () => {
    await fc.assert(
      fc.property(
        // Generate strings that are NOT valid difficulty levels
        fc.string().filter(s => s !== 'Beginner' && s !== 'Intermediate' && s !== 'Advanced'),
        (invalidDifficulty) => {
          const result = DifficultyLevelSchema.safeParse(invalidDifficulty);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept exactly Beginner, Intermediate, or Advanced', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    
    validDifficulties.forEach(difficulty => {
      const result = DifficultyLevelSchema.safeParse(difficulty);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(difficulty);
      }
    });
  });
});

// Feature: career-path-explorer, Property 9: Role Creation Validation
// Validates: Requirements 5.2, 5.4

describe('Property 9: Role Creation Validation', () => {
  it('should reject role creation requests missing name field', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          short_description: fc.string({ minLength: 1 }),
          long_description: fc.option(fc.string()),
          responsibilities: fc.option(fc.array(fc.string())),
          skills: fc.option(fc.array(fc.string())),
        }),
        (roleDataWithoutName) => {
          const result = CreateRoleSchema.safeParse(roleDataWithoutName);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject role creation requests missing short_description field', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 255 }),
          long_description: fc.option(fc.string()),
          responsibilities: fc.option(fc.array(fc.string())),
          skills: fc.option(fc.array(fc.string())),
        }),
        (roleDataWithoutShortDesc) => {
          const result = CreateRoleSchema.safeParse(roleDataWithoutShortDesc);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject role creation requests with empty name', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          name: fc.constant(''),
          short_description: fc.string({ minLength: 1 }),
        }),
        (roleDataWithEmptyName) => {
          const result = CreateRoleSchema.safeParse(roleDataWithEmptyName);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject role creation requests with empty short_description', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 255 }),
          short_description: fc.constant(''),
        }),
        (roleDataWithEmptyShortDesc) => {
          const result = CreateRoleSchema.safeParse(roleDataWithEmptyShortDesc);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid role creation requests', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 255 }).filter(s => s.trim().length > 0),
          short_description: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          long_description: fc.option(fc.string()),
          responsibilities: fc.option(fc.array(fc.string())),
          skills: fc.option(fc.array(fc.string())),
        }),
        (validRoleData) => {
          const result = CreateRoleSchema.safeParse(validRoleData);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: career-path-explorer, Property 11: Resource Creation Validation
// Validates: Requirements 6.2, 6.5, 6.6

describe('Property 11: Resource Creation Validation', () => {
  it('should reject resource creation requests missing role_id', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithoutRoleId) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithoutRoleId);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests missing title', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithoutTitle) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithoutTitle);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests missing url', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithoutUrl) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithoutUrl);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests missing resource_type', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithoutType) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithoutType);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests missing difficulty', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
        }),
        (resourceDataWithoutDifficulty) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithoutDifficulty);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests with invalid resource_type', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          resource_type: fc.string().filter(s => s !== 'Video' && s !== 'Article' && s !== 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithInvalidType) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithInvalidType);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests with invalid difficulty', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.string().filter(s => s !== 'Beginner' && s !== 'Intermediate' && s !== 'Advanced'),
        }),
        (resourceDataWithInvalidDifficulty) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithInvalidDifficulty);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject resource creation requests with invalid URL format', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }),
          // Generate strings that are definitely invalid URLs
          // Zod's URL validator is very permissive, so we need to generate truly malformed strings
          url: fc.oneof(
            // Strings without any scheme separator
            fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes(':')),
            // Known invalid patterns
            fc.constantFrom('not a url', 'invalid', 'just text', '123', 'example.com')
          ),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (resourceDataWithInvalidUrl) => {
          const result = CreateResourceSchema.safeParse(resourceDataWithInvalidUrl);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid resource creation requests', async () => {
    await fc.assert(
      fc.property(
        fc.record({
          role_id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 255 }).filter(s => s.trim().length > 0),
          url: fc.webUrl(),
          resource_type: fc.constantFrom('Video', 'Article', 'Course'),
          difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
        }),
        (validResourceData) => {
          const result = CreateResourceSchema.safeParse(validResourceData);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
