import React from 'react';
import { RoleList } from '../components/RoleList';

/**
 * LandingPage Component
 * 
 * Main page of the Career Path Explorer application.
 * Displays a title, introductory text, and the list of all available roles.
 * 
 * Requirements: 1.1
 */

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Career Path Explorer</h1>
        <p className="intro-text">
          Explore different technology career paths and discover learning resources 
          to help you get started in your chosen field.
        </p>
      </header>
      <main>
        <RoleList />
      </main>
    </div>
  );
};
