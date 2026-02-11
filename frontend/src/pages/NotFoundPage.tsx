import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NotFoundPage Component
 * 
 * Displays a 404 error page when users navigate to an unknown route.
 * Provides a button to return to the landing page.
 * 
 * Requirements: 9.1
 */

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page" data-testid="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={handleGoHome} className="home-button">
        Go to Home
      </button>
    </div>
  );
};
