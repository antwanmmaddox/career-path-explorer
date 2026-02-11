import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as fc from 'fast-check';
import { RoleDetailPage } from '../RoleDetailPage';
import * as api from '../../api';
import type { RoleWithResources, ResourceType, DifficultyLevel } from '../../types';

/**
 * Property-Based Tests for RoleDetailPage Component
 * 
 * Feature: career-path-explorer
 * Property: 3
 * 
 * Property 3: Role Detail Rendering Completeness
 * For any role with associated resources, the role detail page SHALL 
 * display the role's name, long_description, all responsibilities, 
 * all skills, and all associated resources.
 * 
 * Validates: Requirements 2.1, 2.2
 */

// Helper to render RoleDetailPage with router context
const renderRoleDetailPage = (roleId: string) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/roles/:id" element={<RoleDetailPage />} />
      </Routes>
    </BrowserRouter>,
    { 
      // Set the initial URL to match the route
      wrapper: ({ children }) => {
        window.history.pushState({}, '', `/roles/${roleId}`);
        return <>{children}</>;
      }
    }
  );
};

describe('RoleDetailPage Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Property 3: displays role name, long_description, all responsibilities, all skills, and all resources', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a complete role with resources
        fc.record({
          id: fc.integer({ min: 1, max: 10000 }),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          short_description: fc.string({ minLength: 1, maxLength: 500 }),
          long_description: fc.string({ minLength: 1, maxLength: 1000 }),
          responsibilities: fc.array(
            fc.string({ minLength: 1, maxLength: 200 }),
            { minLength: 0, maxLength: 10 }
          ),
          skills: fc.array(
            fc.string({ minLength: 1, maxLength: 100 }),
            { minLength: 0, maxLength: 15 }
          ),
          resources: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              role_id: fc.integer({ min: 1, max: 10000 }),
              title: fc.string({ minLength: 1, maxLength: 200 }),
              url: fc.webUrl(),
              resource_type: fc.constantFrom('Video' as ResourceType, 'Article' as ResourceType, 'Course' as ResourceType),
              difficulty: fc.constantFrom('Beginner' as DifficultyLevel, 'Intermediate' as DifficultyLevel, 'Advanced' as DifficultyLevel),
            }),
            { minLength: 0, maxLength: 20 }
          ),
        }),
        async (role: RoleWithResources) => {
          // Mock the API to return the generated role
          vi.spyOn(api, 'getRoleById').mockResolvedValue({ role });

          // Render the component
          const { container } = renderRoleDetailPage(role.id.toString());

          // Wait for loading to complete
          await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
          });

          // Verify role name is displayed
          expect(container.textContent).toContain(role.name);

          // Verify long description is displayed
          expect(container.textContent).toContain(role.long_description);

          // Verify all responsibilities are displayed
          role.responsibilities.forEach((responsibility) => {
            expect(container.textContent).toContain(responsibility);
          });

          // Verify all skills are displayed
          role.skills.forEach((skill) => {
            expect(container.textContent).toContain(skill);
          });

          // Verify all resources are displayed (check titles)
          role.resources.forEach((resource) => {
            expect(container.textContent).toContain(resource.title);
          });

          // Cleanup after each iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
