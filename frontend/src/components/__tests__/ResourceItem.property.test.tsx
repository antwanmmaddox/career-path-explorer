import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ResourceItem } from '../ResourceItem';
import { ResourceType, DifficultyLevel } from '../../types';

/**
 * Property-Based Tests for ResourceItem Component
 * 
 * Feature: career-path-explorer
 * Property 4: Resource Rendering Completeness
 * Property 5: Resource Link Behavior
 * 
 * Property 4: For any resource displayed in the UI, the rendered output 
 * SHALL contain the resource's title, url, resource_type, and difficulty level.
 * 
 * Property 5: For any resource link rendered in the UI, the link element 
 * SHALL have the target attribute set to "_blank" to open in a new tab.
 * 
 * Validates: Requirements 3.1, 3.2
 */

describe('ResourceItem Property Tests', () => {
  // Arbitraries for generating test data
  const resourceTypeArbitrary = fc.constantFrom<ResourceType>('Video', 'Article', 'Course');
  const difficultyArbitrary = fc.constantFrom<DifficultyLevel>('Beginner', 'Intermediate', 'Advanced');

  afterEach(() => {
    cleanup();
  });

  it('Property 4: any resource displays all required fields (title, url, resource_type, difficulty)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // title - non-empty after trim
        fc.webUrl(), // url
        resourceTypeArbitrary,
        difficultyArbitrary,
        (title, url, resource_type, difficulty) => {
          cleanup(); // Clean up before each property test iteration
          
          const { container } = render(
            <ResourceItem
              title={title}
              url={url}
              resource_type={resource_type}
              difficulty={difficulty}
            />
          );

          // Verify title is rendered using the link element
          const linkElement = container.querySelector('.resource-item-link');
          expect(linkElement).toBeTruthy();
          expect(linkElement?.textContent).toBe(title);

          // Verify url is present in the link
          expect(linkElement?.getAttribute('href')).toBe(url);

          // Verify resource_type is displayed
          const resourceTypeElement = container.querySelector('.resource-type-badge');
          expect(resourceTypeElement?.textContent).toBe(resource_type);

          // Verify difficulty is displayed
          const difficultyElement = container.querySelector('.difficulty-badge');
          expect(difficultyElement?.textContent).toBe(difficulty);

          // Verify the component structure
          const resourceItem = container.querySelector('.resource-item');
          expect(resourceItem).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: any resource link has target="_blank" to open in new tab', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        fc.webUrl(),
        resourceTypeArbitrary,
        difficultyArbitrary,
        (title, url, resource_type, difficulty) => {
          cleanup(); // Clean up before each property test iteration
          
          const { container } = render(
            <ResourceItem
              title={title}
              url={url}
              resource_type={resource_type}
              difficulty={difficulty}
            />
          );

          // Find the link element
          const linkElement = container.querySelector('.resource-item-link') as HTMLAnchorElement;
          expect(linkElement).toBeTruthy();
          
          // Verify target="_blank" attribute
          expect(linkElement.getAttribute('target')).toBe('_blank');
          
          // Verify rel="noopener noreferrer" for security
          expect(linkElement.getAttribute('rel')).toBe('noopener noreferrer');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4 & 5: difficulty styling is applied correctly based on difficulty level', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        fc.webUrl(),
        resourceTypeArbitrary,
        difficultyArbitrary,
        (title, url, resource_type, difficulty) => {
          cleanup(); // Clean up before each property test iteration
          
          const { container } = render(
            <ResourceItem
              title={title}
              url={url}
              resource_type={resource_type}
              difficulty={difficulty}
            />
          );

          // Find the difficulty badge
          const difficultyBadge = container.querySelector('.difficulty-badge');
          expect(difficultyBadge).toBeTruthy();
          
          // Verify appropriate CSS class is applied based on difficulty
          const expectedClass = `difficulty-${difficulty.toLowerCase()}`;
          expect(difficultyBadge?.className).toContain(expectedClass);
        }
      ),
      { numRuns: 100 }
    );
  });
});
