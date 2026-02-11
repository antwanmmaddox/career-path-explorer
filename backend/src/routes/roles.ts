/**
 * Role API Routes
 * 
 * This module defines the REST API endpoints for role operations.
 * Endpoints:
 * - GET /api/roles - Get all roles (Requirements 1.4, 1.5)
 * - GET /api/roles/:id - Get role by ID with resources (Requirements 2.3, 2.4, 2.5)
 * - POST /api/roles - Create a new role (Requirements 5.1, 5.2, 5.3, 5.4, 5.5)
 */

import { Router, Request, Response } from 'express';
import { getAllRoles, getRoleById, createRole } from '../db/queries';
import { CreateRoleSchema, RoleIdParamSchema } from '../validation/schemas';
import { ZodError } from 'zod';

const router = Router();

/**
 * GET /api/roles
 * 
 * Retrieve all roles with basic information for the landing page.
 * Returns role id, name, and short_description for each role.
 * 
 * Requirements: 1.4, 1.5
 * 
 * Response: 200 OK
 * {
 *   roles: Array<{ id: number, name: string, short_description: string }>
 * }
 * 
 * Error Response: 500 Internal Server Error
 * { error: string, details?: string }
 */
router.get('/roles', async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      error: 'Failed to fetch roles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

/**
 * GET /api/roles/:id
 * 
 * Retrieve complete information for a specific role including all associated resources.
 * 
 * Requirements: 2.3, 2.4, 2.5
 * 
 * Parameters:
 * - id (path parameter): Role ID (must be a positive integer)
 * 
 * Response: 200 OK
 * {
 *   role: {
 *     id: number,
 *     name: string,
 *     short_description: string,
 *     long_description: string,
 *     responsibilities: string[],
 *     skills: string[],
 *     resources: Array<Resource>
 *   }
 * }
 * 
 * Error Responses:
 * - 400 Bad Request: Invalid ID format
 * - 404 Not Found: Role with specified ID does not exist
 * - 500 Internal Server Error: Database connection failure
 */
router.get('/roles/:id', async (req: Request, res: Response) => {
  try {
    // Validate ID parameter
    const validationResult = RoleIdParamSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid ID format',
        details: validationResult.error.errors[0].message
      });
    }

    const { id } = validationResult.data;

    // Fetch role with resources
    const role = await getRoleById(id);

    if (!role) {
      return res.status(404).json({
        error: 'Role not found',
        details: `No role found with ID ${id}`
      });
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    res.status(500).json({
      error: 'Failed to fetch role',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/roles
 * 
 * Create a new role in the database.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * Request Body:
 * {
 *   name: string (required),
 *   short_description: string (required),
 *   long_description?: string (optional),
 *   responsibilities?: string[] (optional),
 *   skills?: string[] (optional)
 * }
 * 
 * Response: 201 Created
 * {
 *   role: {
 *     id: number,
 *     name: string,
 *     short_description: string,
 *     long_description: string | null,
 *     responsibilities: string[],
 *     skills: string[]
 *   }
 * }
 * 
 * Error Responses:
 * - 400 Bad Request: Missing required fields or validation failure
 * - 500 Internal Server Error: Database insertion failure
 */
router.post('/roles', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = CreateRoleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const roleData = validationResult.data;

    // Create role in database
    const createdRole = await createRole(roleData);

    res.status(201).json({ role: createdRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      error: 'Failed to create role',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
