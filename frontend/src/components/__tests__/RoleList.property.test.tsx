import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import { RoleList } from '../RoleList';
import * as api from '../../api';
import type { RoleSummary } from '../../types';

/**
 * Property-Based Tests for RoleList Component
 * 
 * Feature: career-path-explorer
 * Properties: 1, 13, 14
 * 
 * Property 1: Role List Rendering Completeness
 * For any set of roles returned by the API, the frontend SHALL render 
 * exactly one card per role, and each card SHALL display the role's 
 * name and short_description.
 * 
 * Property 13: Loading State Display
 * For any API request initiated by the frontend, the UI SHALL display 
 * a loading indicator while the request is in progress.
 * 
 * Property 14: Error State Display
 * For any failed API request, the frontend SHALL display an error 
 * message to the user.
 * 
 * Validates: Requirements 1.1, 1.2, 8.1, 8.2
 */

// Helper to render RoleList with router context
const renderRoleList = () => {
  return render(
    <BrowserRouter>
      <RoleList />
    </BrowserRouter>
  );
};

describe('RoleList Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Property 1: renders exactly one card per role with name and short_description', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of role summaries
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            short_description: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        async (roles) => {
          // Mock the API to return the generated roles
          vi.spyOn(api, 'getAllRoles').mockResolvedValue({ roles });

          // Render the component
          const { container } = renderRoleList();

          // Wait for loading to complete
          await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
          });

          // Verify exactly one card per role
          const cards = container.querySelectorAll('.role-card');
          expect(cards.length).toBe(roles.length);

          // Verify each role's name and short_description are displayed
          roles.forEach((role) => {
            // Check that the text content includes the role data
            expect(container.textContent).toContain(role.name);
            expect(container.textContent).toContain(role.short_description);
          });

          // Cleanup after each iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: displays loading indicator while API request is in progress', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary roles data
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            short_description: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (roles) => {
          // Create a promise that we can control
          let resolvePromise: (value: { roles: RoleSummary[] }) => void;
          const delayedPromise = new Promise<{ roles: RoleSummary[] }>((resolve) => {
            resolvePromise = resolve;
          });

          // Mock the API to return a delayed promise
          vi.spyOn(api, 'getAllRoles').mockReturnValue(delayedPromise);

          // Render the component
          renderRoleList();

          // Verify loading indicator is displayed while request is in progress
          expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
          expect(screen.getByText('Loading roles...')).toBeInTheDocument();

          // Resolve the promise
          resolvePromise!({ roles });

          // Wait for loading to complete
          await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
          });

          // Cleanup after each iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 14: displays error message when API request fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary error messages
        fc.string({ minLength: 1, maxLength: 200 }),
        async (errorMessage) => {
          // Clean up before rendering
          cleanup();
          
          // Mock the API to reject with an error
          vi.spyOn(api, 'getAllRoles').mockRejectedValue(new Error(errorMessage));

          // Render the component
          const { getByTestId } = renderRoleList();

          // Wait for error to be displayed using the local query
          await waitFor(() => {
            expect(getByTestId('error-message')).toBeInTheDocument();
          });

          // Verify error message is displayed (check that it contains the error message)
          const errorElement = getByTestId('error-message');
          const errorText = errorElement.textContent || '';
          expect(errorText).toContain(errorMessage);
        }
      ),
      { numRuns: 100 }
    );
  });
});
