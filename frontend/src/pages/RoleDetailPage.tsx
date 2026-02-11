import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById } from '../api';
import { ResourceList } from '../components/ResourceList';
import type { RoleWithResources } from '../types';

/**
 * RoleDetailPage Component
 * 
 * Displays complete information about a specific role including:
 * - Role name and long description
 * - List of responsibilities
 * - List of required skills
 * - Associated learning resources (via ResourceList component)
 * 
 * Manages loading, error, and data states.
 * Provides back navigation to return to the landing page.
 * 
 * Requirements: 2.1, 2.2, 2.5, 8.1, 8.2, 9.3, 9.5
 */

export const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleWithResources | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch role details from the API on component mount or when ID changes
    const fetchRoleDetails = async () => {
      // Validate that ID exists and is a valid number
      if (!id || isNaN(Number(id))) {
        setError('Invalid role ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getRoleById(Number(id));
        setRole(response.role);
      } catch (err) {
        // Handle API errors
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load role details. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [id]);

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/');
  };

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <div className="role-detail-loading" data-testid="loading-indicator">
        <p>Loading role details...</p>
      </div>
    );
  }

  // Display error message if fetch fails or role not found
  if (error) {
    return (
      <div className="role-detail-error" data-testid="error-message">
        <p>Error: {error}</p>
        <button onClick={handleBackClick} className="back-button">
          Back to Roles
        </button>
      </div>
    );
  }

  // Display error if role is null (shouldn't happen but TypeScript safety)
  if (!role) {
    return (
      <div className="role-detail-error" data-testid="error-message">
        <p>Error: Role not found</p>
        <button onClick={handleBackClick} className="back-button">
          Back to Roles
        </button>
      </div>
    );
  }

  // Render role details
  return (
    <div className="role-detail-page">
      <button onClick={handleBackClick} className="back-button">
        ← Back to Roles
      </button>

      <header className="role-detail-header">
        <h1>{role.name}</h1>
      </header>

      <section className="role-description">
        <h2>About this Role</h2>
        <p>{role.long_description}</p>
      </section>

      <section className="role-responsibilities">
        <h2>Responsibilities</h2>
        {role.responsibilities && role.responsibilities.length > 0 ? (
          <ul>
            {role.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        ) : (
          <p>No responsibilities listed</p>
        )}
      </section>

      <section className="role-skills">
        <h2>Required Skills</h2>
        {role.skills && role.skills.length > 0 ? (
          <ul>
            {role.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed</p>
        )}
      </section>

      <section className="role-resources">
        <ResourceList resources={role.resources} />
      </section>
    </div>
  );
};
