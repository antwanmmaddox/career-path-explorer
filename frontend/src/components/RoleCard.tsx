import React from 'react';

/**
 * RoleCard Component
 * 
 * Displays a single role as a clickable card on the landing page.
 * Shows the role name and short description with hover effects.
 * 
 * Requirements: 1.2, 1.3
 */

interface RoleCardProps {
  id: number;
  name: string;
  short_description: string;
  onClick: (id: number) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ id, name, short_description, onClick }) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <div 
      className="role-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <h3 className="role-card-name">{name}</h3>
      <p className="role-card-description">{short_description}</p>
    </div>
  );
};
