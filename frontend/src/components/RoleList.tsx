import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleCard } from './RoleCard';
import { getAllRoles } from '../api';
import type { RoleSummary } from '../types';

/**
 * RoleList Component
 * 
 * Fetches and displays all roles on the landing page.
 * Manages loading, error, and data states.
 * Handles navigation to role detail pages when cards are clicked.
 * 
 * Educational Concepts:
 * - Data fetching with useEffect hook
 * - Async/await for handling promises
 * - State management for loading, error, and data states
 * - Error handling with try-catch
 * - Conditional rendering based on state
 * - React Router navigation with useNavigate
 * 
 * Requirements: 1.1, 1.2, 1.3, 8.1, 8.2
 */

export const RoleList: React.FC = () => {
  // State for storing the fetched roles
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  
  // State for tracking loading status (true while fetching)
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for storing error messages (null if no error)
  const [error, setError] = useState<string | null>(null);
  
  // Hook for programmatic navigation (from React Router)
  const navigate = useNavigate();

  // useEffect runs after the component mounts (renders for the first time)
  // The empty dependency array [] means this only runs once on mount
  useEffect(() => {
    // Define an async function to fetch roles
    // We can't make useEffect itself async, so we define a function inside
    const fetchRoles = async () => {
      try {
        // Set loading to true before starting the fetch
        setLoading(true);
        
        // Clear any previous errors
        setError(null);
        
        // Call the API to get all roles (this is an async operation)
        const response = await getAllRoles();
        
        // Update state with the fetched roles
        setRoles(response.roles);
      } catch (err) {
        // Handle API errors
        // Extract error message if it's an Error object, otherwise use default
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load roles. Please try again later.';
        setError(errorMessage);
      } finally {
        // Set loading to false whether the fetch succeeded or failed
        // finally block always runs after try or catch
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchRoles();
  }, []); // Empty dependency array = run once on mount

  // Handle role card clicks - navigate to role detail page
  // This function is passed to RoleCard components as a prop
  const handleRoleClick = (id: number) => {
    navigate(`/roles/${id}`);  // Navigate to /roles/1, /roles/2, etc.
  };

  // Conditional rendering based on state
  // React re-renders when state changes, so the UI updates automatically
  
  // Display loading indicator while fetching data (Requirement 8.1)
  if (loading) {
    return (
      <div className="role-list-loading" data-testid="loading-indicator">
        <p>Loading roles...</p>
      </div>
    );
  }

  // Display error message if fetch fails (Requirement 8.2)
  if (error) {
    return (
      <div className="role-list-error" data-testid="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render role cards once data is loaded successfully
  // Map over the roles array and create a RoleCard for each role
  return (
    <div className="role-list">
      {roles.map((role) => (
        <RoleCard
          key={role.id}  // Unique key for React's reconciliation algorithm
          id={role.id}
          name={role.name}
          short_description={role.short_description}
          onClick={handleRoleClick}  // Pass the click handler as a prop
        />
      ))}
    </div>
  );
};
