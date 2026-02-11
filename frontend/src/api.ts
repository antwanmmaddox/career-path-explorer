// API client module for communicating with the backend
// Provides fetch wrapper functions for all API endpoints

import type {
  GetRolesResponse,
  GetRoleByIdResponse,
  CreateRoleRequest,
  CreateRoleResponse,
  CreateResourceRequest,
  CreateResourceResponse,
  ErrorResponse,
} from './types';

// API base URL - uses Vite proxy configuration in development
// In production, this would be configured via environment variables
const API_BASE_URL = '/api';

/**
 * Custom error class for API errors
 * Includes HTTP status code and error details from the server
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public details?: string
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper that handles common API request logic
 * - Adds JSON headers
 * - Parses JSON responses
 * - Throws ApiError for non-2xx responses
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Parse response body
  const data = await response.json();

  // Handle error responses
  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new ApiError(
      response.status,
      response.statusText,
      errorData.details || errorData.error
    );
  }

  return data as T;
}

/**
 * Fetch all roles with basic information
 * Used on the landing page to display role cards
 * 
 * @returns Promise resolving to array of role summaries
 * @throws ApiError if the request fails
 */
export async function getAllRoles(): Promise<GetRolesResponse> {
  return fetchApi<GetRolesResponse>('/roles');
}

/**
 * Fetch complete information for a specific role
 * Includes role details and all associated learning resources
 * 
 * @param id - The role ID
 * @returns Promise resolving to role with resources
 * @throws ApiError if the role is not found or request fails
 */
export async function getRoleById(id: number): Promise<GetRoleByIdResponse> {
  return fetchApi<GetRoleByIdResponse>(`/roles/${id}`);
}

/**
 * Create a new role
 * Used for demonstration and testing purposes
 * 
 * @param data - Role creation data
 * @returns Promise resolving to the created role
 * @throws ApiError if validation fails or request fails
 */
export async function createRole(
  data: CreateRoleRequest
): Promise<CreateRoleResponse> {
  return fetchApi<CreateRoleResponse>('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Create a new learning resource associated with a role
 * 
 * @param data - Resource creation data
 * @returns Promise resolving to the created resource
 * @throws ApiError if validation fails, role not found, or request fails
 */
export async function createResource(
  data: CreateResourceRequest
): Promise<CreateResourceResponse> {
  return fetchApi<CreateResourceResponse>('/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
