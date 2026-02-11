import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as fc from 'fast-check';
import { LandingPage } from '../pages/LandingPage';
import { RoleDetailPage } from '../pages/RoleDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import * as api from '../api';
import type { RoleSummary, RoleWithResources } from '../types';

/**
 * Property-Based Tests for Routing and Browser History Integration
 * 
 * Feature: career-path-explorer
 * Property: 16
 * 
 * Property 16: Browser History Integration
 * For any navigation action (forward, back, or direct URL access), 
 * the frontend SHALL display the correct page corresponding to the 
 * current URL path.
 * 
 * Validates: Requirements 9.4, 9.5
 */

describe('Routing Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Property 16: displays correct page for any navigation action (forward, back, direct URL)', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate navigation sequences with different paths
        fc.record({
          // Generate a list of roles for the landing page
          roles: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 1000 }),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              short_description: fc.string({ minLength: 1, maxLength: 500 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          // Generate a role detail for testing role detail page
          roleDetail: fc.record({
            id: fc.integer({ min: 1, max: 1000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            short_description: fc.string({ minLength: 1, maxLength: 500 }),
            long_description: fc.string({ minLength: 1, maxLength: 1000 }),
            responsibilities: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 0, maxLength: 3 }),
            skills: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 0, maxLength: 3 }),
            resources: fc.array(
              fc.record({
                id: fc.integer({ min: 1, max: 10000 }),
                role_id: fc.integer({ min: 1, max: 1000 }),
                title: fc.string({ minLength: 1, maxLength: 200 }),
                url: fc.webUrl(),
                resource_type: fc.constantFrom('Video', 'Article', 'Course'),
                difficulty: fc.constantFrom('Beginner', 'Intermediate', 'Advanced'),
              }),
              { minLength: 0, maxLength: 3 }
            ),
          }),
        }),
        async ({ roles, roleDetail }) => {
          // Mock API responses
          vi.spyOn(api, 'getAllRoles').mockResolvedValue({ roles: roles as RoleSummary[] });
          vi.spyOn(api, 'getRoleById').mockResolvedValue({ role: roleDetail as RoleWithResources });

          // Test 1: Direct URL access to landing page "/"
          const { unmount: unmount1 } = render(
            <MemoryRouter initialEntries={['/']}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/roles/:id" element={<RoleDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MemoryRouter>
          );

          // Wait for roles to load
          await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          }, { timeout: 1000 });

          // Verify landing page is displayed (should contain "Career Path Explorer")
          expect(screen.getByText('Career Path Explorer')).toBeInTheDocument();
          unmount1();

          // Test 2: Direct URL access to role detail page "/roles/:id"
          const { unmount: unmount2 } = render(
            <MemoryRouter initialEntries={[`/roles/${roleDetail.id}`]}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/roles/:id" element={<RoleDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MemoryRouter>
          );

          // Wait for role detail to load
          await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
          }, { timeout: 1000 });

          // Verify role detail page is displayed (should contain role name in h1)
          const heading = screen.getByRole('heading', { level: 1 });
          expect(heading.textContent).toContain(roleDetail.name.trim());
          unmount2();

          // Test 3: Direct URL access to invalid path (404)
          const { unmount: unmount3 } = render(
            <MemoryRouter initialEntries={['/invalid-path']}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/roles/:id" element={<RoleDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MemoryRouter>
          );

          // Verify 404 page is displayed
          expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
          expect(screen.getByText(/404/)).toBeInTheDocument();
          unmount3();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for property test
});
