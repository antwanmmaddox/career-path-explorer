import React from 'react';
import { ResourceType, DifficultyLevel } from '../types';

/**
 * ResourceItem Component
 * 
 * Displays a single learning resource with all its metadata.
 * Renders the resource as a link that opens in a new tab.
 * Shows resource type and difficulty level badges with appropriate styling.
 * 
 * Requirements: 3.1, 3.2
 */

interface ResourceItemProps {
  title: string;
  url: string;
  resource_type: ResourceType;
  difficulty: DifficultyLevel;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({ 
  title, 
  url, 
  resource_type, 
  difficulty 
}) => {
  // Determine difficulty badge class based on difficulty level
  const getDifficultyClass = (level: DifficultyLevel): string => {
    switch (level) {
      case 'Beginner':
        return 'difficulty-beginner';
      case 'Intermediate':
        return 'difficulty-intermediate';
      case 'Advanced':
        return 'difficulty-advanced';
      default:
        return '';
    }
  };

  return (
    <div className="resource-item">
      <div className="resource-item-header">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="resource-item-link"
        >
          {title}
        </a>
      </div>
      <div className="resource-badges">
        <span className="resource-badge resource-type-badge">
          {resource_type}
        </span>
        <span className={`resource-badge difficulty-badge ${getDifficultyClass(difficulty)}`}>
          {difficulty}
        </span>
      </div>
    </div>
  );
};
