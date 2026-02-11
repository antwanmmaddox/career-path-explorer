import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RoleDetailPage } from './pages/RoleDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * App Component
 * 
 * Root component that sets up React Router for client-side routing.
 * Configures browser history integration and defines all application routes.
 * 
 * Routes:
 * - "/" - Landing page displaying all roles
 * - "/roles/:id" - Role detail page for a specific role
 * - "*" - 404 page for unknown routes
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Role detail page route with dynamic ID parameter */}
        <Route path="/roles/:id" element={<RoleDetailPage />} />
        
        {/* 404 page for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
