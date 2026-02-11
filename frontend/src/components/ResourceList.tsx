import React, { useState } from 'react';
import { Resource, DifficultyLevel } from '../types';
import { ResourceItem } from './ResourceItem';

/**
 * ResourceList Component
 * 
 * Displays and filters learning resources for a role.
 * Provides a difficulty filter dropdown to show only resources of a specific difficulty level.
 * Renders ResourceItem components for each visible resource.
 * 
 * Educational Concepts:
 * - React state management with useState hook
 * - Array filtering with JavaScript filter() method
 * - Conditional rendering (show message when no resources)
 * - Controlled form inputs (select dropdown)
 * - Component composition (using ResourceItem)
 * 
 * Requirements: 3.5, 4.1, 4.2, 4.3
 */

interface ResourceListProps {
  resources: Resource[];  // Array of resources passed from parent component
}

// Type for filter options - can be 'All' or any difficulty level
type FilterOption = 'All' | DifficultyLevel;

export const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  // State to track the currently selected difficulty filter
  // useState returns [currentValue, setterFunction]
  // Initial value is 'All' to show all resources by default
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterOption>('All');

  // Filter resources based on selected difficulty
  // This is a "derived state" - computed from props and state
  // If 'All' is selected, show all resources
  // Otherwise, filter to only show resources matching the selected difficulty
  const filteredResources = selectedDifficulty === 'All'
    ? resources
    : resources.filter(resource => resource.difficulty === selectedDifficulty);

  // Event handler for when the user changes the filter dropdown
  // Updates the selectedDifficulty state, which triggers a re-render
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(event.target.value as FilterOption);
  };

  return (
    <div className="resource-list">
      <div className="resource-list-header">
        <h3>Learning Resources</h3>
        
        {/* Difficulty filter dropdown - a "controlled component" */}
        {/* The value is controlled by React state, not the DOM */}
        <div className="resource-filter">
          <label htmlFor="difficulty-filter">Filter by difficulty: </label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}  // Controlled by state
            onChange={handleFilterChange}  // Updates state on change
            className="difficulty-filter-select"
          >
            <option value="All">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="resource-list-items">
        {/* Conditional rendering: Show message if no resources, otherwise show list */}
        {filteredResources.length === 0 ? (
          <p className="no-resources-message">No resources available</p>
        ) : (
          // Map over filtered resources and render a ResourceItem for each
          // The key prop helps React efficiently update the list
          filteredResources.map(resource => (
            <ResourceItem
              key={resource.id}  // Unique key for React's reconciliation
              title={resource.title}
              url={resource.url}
              resource_type={resource.resource_type}
              difficulty={resource.difficulty}
            />
          ))
        )}
      </div>
    </div>
  );
};
