/**
 * Resource API Routes
 * 
 * This module defines the REST API endpoints for resource operations.
 * Endpoints:
 * - POST /api/resources - Create a new resource (Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6)
 */

import { Router, Request, Response } from 'express';
import { createResource, roleExists } from '../db/queries';
import { CreateResourceSchema } from '../validation/schemas';

const router = Router();

/**
 * POST /api/resources
 * 
 * Add a new learning resource associated with a role.
 * Verifies that the role exists before creating the resource.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 * 
 * Request Body:
 * {
 *   role_id: number (required),
 *   title: string (required),
 *   url: string (required, must be valid URL),
 *   resource_type: 'Video' | 'Article' | 'Course' (required),
 *   difficulty: 'Beginner' | 'Intermediate' | 'Advanced' (required)
 * }
 * 
 * Response: 201 Created
 * {
 *   resource: {
 *     id: number,
 *     role_id: number,
 *     title: string,
 *     url: string,
 *     resource_type: string,
 *     difficulty: string
 *   }
 * }
 * 
 * Error Responses:
 * - 400 Bad Request: Missing required fields, invalid enum values, or validation failure
 * - 404 Not Found: Specified role_id does not exist
 * - 500 Internal Server Error: Database insertion failure
 */
router.post('/resources', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = CreateResourceSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => e.message).join(', ')
      });
    }

    const resourceData = validationResult.data;

    // Verify role exists before creating resource
    const roleExistsResult = await roleExists(resourceData.role_id);

    if (!roleExistsResult) {
      return res.status(404).json({
        error: 'Role not found',
        details: `No role found with ID ${resourceData.role_id}`
      });
    }

    // Create resource in database
    const createdResource = await createResource(resourceData);

    res.status(201).json({ resource: createdResource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      error: 'Failed to create resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
