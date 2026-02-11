// Unit tests for API client module
// Verifies that API functions correctly handle requests and responses

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getAllRoles,
  getRoleById,
  createRole,
  createResource,
  ApiError,
} from '../api';
import type {
  GetRolesResponse,
  GetRoleByIdResponse,
  CreateRoleResponse,
  CreateResourceResponse,
} from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch as any;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllRoles', () => {
    it('should fetch all roles successfully', async () => {
      const mockResponse: GetRolesResponse = {
        roles: [
          { id: 1, name: 'Software Engineer', short_description: 'Build software' },
          { id: 2, name: 'QA Engineer', short_description: 'Test software' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAllRoles();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/roles',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Database connection failed' }),
      });

      await expect(getAllRoles()).rejects.toThrow(ApiError);
    });
  });

  describe('getRoleById', () => {
    it('should fetch role by id successfully', async () => {
      const mockResponse: GetRoleByIdResponse = {
        role: {
          id: 1,
          name: 'Software Engineer',
          short_description: 'Build software',
          long_description: 'Detailed description',
          responsibilities: ['Code', 'Review'],
          skills: ['JavaScript', 'TypeScript'],
          resources: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getRoleById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/roles/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError when role not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Role not found' }),
      });

      await expect(getRoleById(999)).rejects.toThrow(ApiError);
    });
  });

  describe('createRole', () => {
    it('should create role successfully', async () => {
      const requestData = {
        name: 'DevOps Engineer',
        short_description: 'Manage infrastructure',
      };

      const mockResponse: CreateRoleResponse = {
        role: {
          id: 3,
          name: 'DevOps Engineer',
          short_description: 'Manage infrastructure',
          long_description: '',
          responsibilities: [],
          skills: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await createRole(requestData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/roles',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on validation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Validation failed', details: 'Name is required' }),
      });

      await expect(createRole({ name: '', short_description: '' })).rejects.toThrow(ApiError);
    });
  });

  describe('createResource', () => {
    it('should create resource successfully', async () => {
      const requestData = {
        role_id: 1,
        title: 'Learn TypeScript',
        url: 'https://example.com',
        resource_type: 'Video' as const,
        difficulty: 'Beginner' as const,
      };

      const mockResponse: CreateResourceResponse = {
        resource: {
          id: 1,
          role_id: 1,
          title: 'Learn TypeScript',
          url: 'https://example.com',
          resource_type: 'Video',
          difficulty: 'Beginner',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await createResource(requestData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/resources',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError when role not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Role not found' }),
      });

      const requestData = {
        role_id: 999,
        title: 'Test',
        url: 'https://example.com',
        resource_type: 'Video' as const,
        difficulty: 'Beginner' as const,
      };

      await expect(createResource(requestData)).rejects.toThrow(ApiError);
    });
  });

  describe('ApiError', () => {
    it('should create error with correct properties', () => {
      const error = new ApiError(404, 'Not Found', 'Role does not exist');

      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.details).toBe('Role does not exist');
      expect(error.message).toBe('API Error 404: Not Found');
      expect(error.name).toBe('ApiError');
    });
  });
});
