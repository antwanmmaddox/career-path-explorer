import { z } from 'zod';

/**
 * Validation schemas for Career Path Explorer API
 * 
 * These schemas validate incoming requests to ensure data integrity
 * and provide clear error messages for invalid inputs.
 */

// Enum schemas for resource types and difficulty levels
export const ResourceTypeSchema = z.enum(['Video', 'Article', 'Course'], {
  errorMap: () => ({ message: 'Resource type must be one of: Video, Article, Course' })
});

export const DifficultyLevelSchema = z.enum(['Beginner', 'Intermediate', 'Advanced'], {
  errorMap: () => ({ message: 'Difficulty must be one of: Beginner, Intermediate, Advanced' })
});

/**
 * Schema for creating a new role
 * Validates: Requirements 5.2
 */
export const CreateRoleSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .refine(val => val.trim().length > 0, 'Name cannot be only whitespace'),
  short_description: z.string()
    .min(1, 'Short description is required')
    .refine(val => val.trim().length > 0, 'Short description cannot be only whitespace'),
  long_description: z.string().optional().nullable(),
  responsibilities: z.array(z.string()).optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
});

/**
 * Schema for creating a new resource
 * Validates: Requirements 6.2, 6.5, 6.6
 */
export const CreateResourceSchema = z.object({
  role_id: z.number().int().positive('Role ID must be a positive integer'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less')
    .refine(val => val.trim().length > 0, 'Title cannot be only whitespace'),
  url: z.string().url('URL must be a valid URL'),
  resource_type: ResourceTypeSchema,
  difficulty: DifficultyLevelSchema,
});

/**
 * Schema for validating role ID URL parameters
 * Validates URL parameters and transforms string to number
 */
export const RoleIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

// Export types for TypeScript usage
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type RoleIdParam = z.infer<typeof RoleIdParamSchema>;
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;
