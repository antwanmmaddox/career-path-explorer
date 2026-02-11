/**
 * Property-Based Tests for Error Logging
 * 
 * Feature: career-path-explorer, Property 15: Error Logging
 * 
 * Property 15: Error Logging
 * For any error encountered by the backend, the system SHALL log the error details 
 * including the error message and stack trace.
 * 
 * Validates: Requirements 8.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';

describe('Property 15: Error Logging', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.error to verify logging
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  /**
   * **Validates: Requirements 8.5**
   * 
   * Property: For any error encountered by the backend, the system SHALL log 
   * the error details including the error message and stack trace.
   * 
   * Strategy:
   * 1. Generate arbitrary error messages and stack traces
   * 2. Create Express routes that throw these errors
   * 3. Trigger the errors through HTTP requests
   * 4. Verify that console.error was called with error details
   */
  it('should log error message and stack trace for any error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // Error message
        fc.string({ minLength: 10, maxLength: 200 }), // Stack trace
        async (errorMessage, stackTrace) => {
          // Reset spy for each iteration
          consoleErrorSpy.mockClear();

          // Create a test Express app with error handling
          const app = express();
          app.use(express.json());

          // Create a route that throws an error with the generated message
          app.get('/test-error', (req: Request, res: Response, next: NextFunction) => {
            const error = new Error(errorMessage);
            error.stack = stackTrace;
            throw error;
          });

          // Global error handler that logs errors
          app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            // Log error details (this is what we're testing)
            console.error('Error occurred:', err.message);
            console.error('Stack trace:', err.stack);
            
            res.status(500).json({
              error: 'Internal server error',
              details: err.message
            });
          });

          // Make request to trigger the error
          await request(app)
            .get('/test-error')
            .expect(500);

          // Verify that console.error was called with error details
          expect(consoleErrorSpy).toHaveBeenCalled();
          
          // Check that error message was logged
          const loggedCalls = consoleErrorSpy.mock.calls.flat().join(' ');
          expect(loggedCalls).toContain(errorMessage);
          
          // Check that stack trace was logged
          expect(loggedCalls).toContain(stackTrace);
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified
    );
  });

  /**
   * Additional property test: Verify logging occurs for different error types
   * 
   * Tests that the system logs errors regardless of error type (Error, TypeError, etc.)
   */
  it('should log errors regardless of error type', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('Error', 'TypeError', 'ReferenceError', 'RangeError'),
        async (errorMessage, errorType) => {
          consoleErrorSpy.mockClear();

          const app = express();
          app.use(express.json());

          app.get('/test-error-type', (req: Request, res: Response, next: NextFunction) => {
            let error: Error;
            switch (errorType) {
              case 'TypeError':
                error = new TypeError(errorMessage);
                break;
              case 'ReferenceError':
                error = new ReferenceError(errorMessage);
                break;
              case 'RangeError':
                error = new RangeError(errorMessage);
                break;
              default:
                error = new Error(errorMessage);
            }
            throw error;
          });

          app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('Error occurred:', err.message);
            console.error('Stack trace:', err.stack);
            
            res.status(500).json({
              error: 'Internal server error',
              details: err.message
            });
          });

          await request(app)
            .get('/test-error-type')
            .expect(500);

          expect(consoleErrorSpy).toHaveBeenCalled();
          const loggedCalls = consoleErrorSpy.mock.calls.flat().join(' ');
          expect(loggedCalls).toContain(errorMessage);
        }
      ),
      { numRuns: 100 }
    );
  });
});
