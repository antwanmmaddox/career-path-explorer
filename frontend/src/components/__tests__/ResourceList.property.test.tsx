import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { ResourceList } from '../ResourceList';
import { ResourceType, DifficultyLevel } from '../../types';

/**
 * Property-Based Tests for ResourceList Component
 * 
 * Feature: career-path-explorer
 * Property 8: Resource Filtering Correctness
 * 
 * For any list of resources and any selected difficulty level, the filtered view 
 * SHALL display only resources matching that difficulty level, and when the filter 
 * is cleared, all resources SHALL be displayed.
 * 
 * Validates: Requirements 4.2, 4.3
 */

describe('ResourceList Property Tests', () => {
  // Arbitraries for generating test data
  const resourceTypeArbitrary = fc.constantFrom<ResourceType>('Video', 'Article', 'Course');
  const difficultyArbitrary = fc.constantFrom<DifficultyLevel>('Beginner', 'Intermediate', 'Advanced');

  // Generate a single resource (without ID - will be added later to ensure uniqueness)
  const resourceWithoutIdArbitrary = fc.record({
    role_id: fc.integer({ min: 1, max: 100 }),
    title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    url: fc.webUrl(),
    resource_type: resourceTypeArbitrary,
    difficulty: difficultyArbitrary,
  });

  // Generate an array of resources with guaranteed unique IDs
  const resourceArrayArbitrary = (minLength: number, maxLength: number) =>
    fc.array(resourceWithoutIdArbitrary, { minLength, maxLength })
      .map(resources => resources.map((resource, index) => ({
        ...resource,
        id: index + 1, // Ensure unique IDs by using array index
      })));

  afterEach(() => {
    cleanup();
  });

  it('Property 8: filtering by difficulty shows only matching resources', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of resources (1-20 resources) with unique IDs
        resourceArrayArbitrary(1, 20),
        // Generate a difficulty level to filter by
        difficultyArbitrary,
        async (resources, filterDifficulty) => {
          cleanup(); // Clean up before rendering to avoid multiple instances

          const { container } = render(<ResourceList resources={resources} />);

          // Find the filter dropdown
          const filterSelect = screen.getByLabelText(/filter by difficulty/i) as HTMLSelectElement;
          expect(filterSelect).toBeTruthy();

          // Initially, all resources should be displayed (filter is "All" by default)
          const initialItems = container.querySelectorAll('.resource-item');
          expect(initialItems.length).toBe(resources.length);

          // Change filter to the selected difficulty
          const user = userEvent.setup();
          await user.selectOptions(filterSelect, filterDifficulty);

          // Wait a tick for React to update
          await new Promise(resolve => setTimeout(resolve, 0));

          // Count how many resources match the selected difficulty
          const expectedCount = resources.filter(r => r.difficulty === filterDifficulty).length;

          // Verify only matching resources are displayed
          const filteredItems = container.querySelectorAll('.resource-item');
          expect(filteredItems.length).toBe(expectedCount);

          // Verify each displayed resource has the correct difficulty
          if (expectedCount > 0) {
            filteredItems.forEach(item => {
              const difficultyBadge = item.querySelector('.difficulty-badge');
              expect(difficultyBadge?.textContent).toBe(filterDifficulty);
            });
          } else {
            // If no resources match, verify "No resources available" message is shown
            const noResourcesMessage = screen.queryByText(/no resources available/i);
            expect(noResourcesMessage).toBeTruthy();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Increase timeout to 30 seconds

  it('Property 8: clearing filter (selecting "All") displays all resources', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of resources with at least 2 items and unique IDs
        resourceArrayArbitrary(2, 20),
        // Generate a difficulty level to filter by first
        difficultyArbitrary,
        async (resources, filterDifficulty) => {
          cleanup(); // Clean up before rendering to avoid multiple instances

          const { container } = render(<ResourceList resources={resources} />);

          const filterSelect = screen.getByLabelText(/filter by difficulty/i) as HTMLSelectElement;

          // Apply a filter first
          const user = userEvent.setup();
          await user.selectOptions(filterSelect, filterDifficulty);
          await new Promise(resolve => setTimeout(resolve, 0));

          // Verify filter is applied
          const filteredCount = resources.filter(r => r.difficulty === filterDifficulty).length;
          let displayedItems = container.querySelectorAll('.resource-item');
          
          expect(displayedItems.length).toBe(filteredCount);

          // Clear the filter by selecting "All"
          await user.selectOptions(filterSelect, 'All');
          await new Promise(resolve => setTimeout(resolve, 0));

          // Verify all resources are now displayed
          displayedItems = container.querySelectorAll('.resource-item');
          expect(displayedItems.length).toBe(resources.length);

          // Verify no "No resources available" message is shown (since we have resources)
          const noResourcesMessage = container.querySelector('.no-resources-message');
          expect(noResourcesMessage).toBeFalsy();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Increase timeout to 30 seconds

  it('Property 8: empty resource list shows "No resources available" message', () => {
    fc.assert(
      fc.property(
        // Test with empty array
        fc.constant([]),
        (resources) => {
          cleanup(); // Clean up before rendering to avoid multiple instances

          const { container } = render(<ResourceList resources={resources} />);

          // Verify "No resources available" message is displayed
          const noResourcesMessage = screen.queryByText(/no resources available/i);
          expect(noResourcesMessage).toBeTruthy();

          // Verify no resource items are displayed
          const resourceItems = container.querySelectorAll('.resource-item');
          expect(resourceItems.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: filter persists correct state across multiple selections', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate resources with varied difficulties and unique IDs
        resourceArrayArbitrary(5, 15),
        async (resources) => {
          cleanup(); // Clean up before rendering to avoid multiple instances

          const { container } = render(<ResourceList resources={resources} />);

          const filterSelect = screen.getByLabelText(/filter by difficulty/i) as HTMLSelectElement;
          const user = userEvent.setup();

          // Test each difficulty level
          const difficulties: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced'];

          for (const difficulty of difficulties) {
            await user.selectOptions(filterSelect, difficulty);
            await new Promise(resolve => setTimeout(resolve, 0));

            const expectedCount = resources.filter(r => r.difficulty === difficulty).length;
            const displayedItems = container.querySelectorAll('.resource-item');

            if (expectedCount > 0) {
              expect(displayedItems.length).toBe(expectedCount);
              // Verify all displayed items have the correct difficulty
              displayedItems.forEach(item => {
                const difficultyBadge = item.querySelector('.difficulty-badge');
                expect(difficultyBadge?.textContent).toBe(difficulty);
              });
            } else {
              expect(displayedItems.length).toBe(0);
              const noResourcesMessage = screen.queryByText(/no resources available/i);
              expect(noResourcesMessage).toBeTruthy();
            }
          }

          // Finally, select "All" and verify all resources are shown
          await user.selectOptions(filterSelect, 'All');
          await new Promise(resolve => setTimeout(resolve, 0));
          
          const allItems = container.querySelectorAll('.resource-item');
          expect(allItems.length).toBe(resources.length);
        }
      ),
      { numRuns: 50 } // Reduced from 100 due to multiple interactions per iteration
    );
  }, 60000); // Increase timeout to 60 seconds for this complex test
});
