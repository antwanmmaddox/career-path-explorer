/**
 * Database Query Functions
 * 
 * This module provides functions to interact with the database.
 * It implements the data access layer for roles and resources.
 */

import { pool } from './config';

/**
 * Type definitions for database entities
 */

export type Role = {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  responsibilities: string[];
  skills: string[];
};

export type RoleSummary = Pick<Role, 'id' | 'name' | 'short_description'>;

export type Resource = {
  id: number;
  role_id: number;
  title: string;
  url: string;
  resource_type: 'Video' | 'Article' | 'Course';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type RoleWithResources = Role & {
  resources: Resource[];
};

export type CreateRoleRequest = {
  name: string;
  short_description: string;
  long_description?: string;
  responsibilities?: string[];
  skills?: string[];
};

export type CreateResourceRequest = {
  role_id: number;
  title: string;
  url: string;
  resource_type: 'Video' | 'Article' | 'Course';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

/**
 * Role Query Functions
 */

/**
 * Get all roles with basic information (for landing page)
 * Returns role id, name, and short_description
 */
export async function getAllRoles(): Promise<RoleSummary[]> {
  const result = await pool.query(
    'SELECT id, name, short_description FROM roles ORDER BY id'
  );
  return result.rows;
}

/**
 * Get a specific role by ID with all associated resources
 * Uses JOIN to fetch role and resources in a single query
 * Returns null if role doesn't exist
 */
export async function getRoleById(id: number): Promise<RoleWithResources | null> {
  // First, get the role
  const roleResult = await pool.query(
    'SELECT id, name, short_description, long_description, responsibilities, skills FROM roles WHERE id = $1',
    [id]
  );

  if (roleResult.rows.length === 0) {
    return null;
  }

  const role = roleResult.rows[0];

  // Then, get all resources for this role
  const resourcesResult = await pool.query(
    'SELECT id, role_id, title, url, resource_type, difficulty FROM resources WHERE role_id = $1 ORDER BY id',
    [id]
  );

  return {
    ...role,
    resources: resourcesResult.rows
  };
}

/**
 * Create a new role
 * Returns the created role with assigned ID
 */
export async function createRole(data: CreateRoleRequest): Promise<Role> {
  const result = await pool.query(
    `INSERT INTO roles (name, short_description, long_description, responsibilities, skills)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, short_description, long_description, responsibilities, skills`,
    [
      data.name,
      data.short_description,
      data.long_description || null,
      data.responsibilities || [],
      data.skills || []
    ]
  );

  return result.rows[0];
}

/**
 * Check if a role exists by ID
 * Helper function for validation
 */
export async function roleExists(id: number): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM roles WHERE id = $1',
    [id]
  );
  return result.rows.length > 0;
}

/**
 * Resource Query Functions
 */

/**
 * Get all resources for a specific role
 * Returns resources ordered by ID
 */
export async function getResourcesByRoleId(roleId: number): Promise<Resource[]> {
  const result = await pool.query(
    'SELECT id, role_id, title, url, resource_type, difficulty FROM resources WHERE role_id = $1 ORDER BY id',
    [roleId]
  );
  return result.rows;
}

/**
 * Create a new resource
 * Returns the created resource with assigned ID
 */
export async function createResource(data: CreateResourceRequest): Promise<Resource> {
  const result = await pool.query(
    `INSERT INTO resources (role_id, title, url, resource_type, difficulty)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, role_id, title, url, resource_type, difficulty`,
    [
      data.role_id,
      data.title,
      data.url,
      data.resource_type,
      data.difficulty
    ]
  );

  return result.rows[0];
}
