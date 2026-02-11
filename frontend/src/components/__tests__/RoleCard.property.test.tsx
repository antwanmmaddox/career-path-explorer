import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { RoleCard } from '../RoleCard';

/**
 * Property-Based Tests for RoleCard Component
 * 
 * Feature: career-path-explorer
 * Property 2: Role Card Navigation
 * 
 * For any role card displayed on the landing page, clicking the card 
 * SHALL trigger navigation to the path "/roles/{role.id}".
 * 
 * Validates: Requirements 1.3
 */

describe('RoleCard Property Tests', () => {
  it('Property 2: clicking any role card triggers onClick with the correct role id', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary role data
        fc.integer({ min: 1, max: 10000 }), // id
        fc.string({ minLength: 1, maxLength: 100 }), // name
        fc.string({ minLength: 1, maxLength: 500 }), // short_description
        async (id, name, short_description) => {
          // Create a mock onClick handler
          const onClickMock = vi.fn();

          // Render the RoleCard with generated data
          const { container } = render(
            <RoleCard
              id={id}
              name={name}
              short_description={short_description}
              onClick={onClickMock}
            />
          );

          // Find the card element
          const card = container.querySelector('.role-card');
          expect(card).toBeTruthy();

          // Simulate click on the card
          const user = userEvent.setup();
          await user.click(card!);

          // Verify onClick was called with the correct id
          expect(onClickMock).toHaveBeenCalledTimes(1);
          expect(onClickMock).toHaveBeenCalledWith(id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: keyboard navigation (Enter key) triggers onClick with the correct role id', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10000 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 500 }),
        async (id, name, short_description) => {
          const onClickMock = vi.fn();

          const { container } = render(
            <RoleCard
              id={id}
              name={name}
              short_description={short_description}
              onClick={onClickMock}
            />
          );

          const card = container.querySelector('.role-card') as HTMLElement;
          expect(card).toBeTruthy();

          // Simulate Enter key press
          const user = userEvent.setup();
          card.focus();
          await user.keyboard('{Enter}');

          // Verify onClick was called with the correct id
          expect(onClickMock).toHaveBeenCalledTimes(1);
          expect(onClickMock).toHaveBeenCalledWith(id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
