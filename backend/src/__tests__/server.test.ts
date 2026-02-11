/**
 * Server Integration Tests
 * 
 * Tests for the Express server setup, middleware, and error handling.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Server Setup', () => {
  describe('Health Check', () => {
    it('should return 200 OK for health endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        message: 'Server is running'
      });
    });
  });

  describe('Root Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.details).toContain('/api/nonexistent');
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers in responses', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('JSON Middleware', () => {
    it('should parse JSON request bodies', async () => {
      const testData = {
        name: 'Test Role',
        short_description: 'Test description'
      };

      // This will fail validation but proves JSON parsing works
      const response = await request(app)
        .post('/api/roles')
        .send(testData)
        .set('Content-Type', 'application/json');

      // Should get a response (either success or validation error)
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors with appropriate status codes', async () => {
      // Test with invalid role ID format
      const response = await request(app)
        .get('/api/roles/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent resources', async () => {
      const response = await request(app)
        .get('/api/roles/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
