// Shared TypeScript types for the Career Path Explorer application
// These types define the data structures used throughout the frontend

// Role types
export type Role = {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  responsibilities: string[];
  skills: string[];
};

export type RoleSummary = Pick<Role, 'id' | 'name' | 'short_description'>;

export type RoleWithResources = Role & {
  resources: Resource[];
};

// Resource types
export type ResourceType = 'Video' | 'Article' | 'Course';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Resource = {
  id: number;
  role_id: number;
  title: string;
  url: string;
  resource_type: ResourceType;
  difficulty: DifficultyLevel;
};

// API request/response types
export type CreateRoleRequest = {
  name: string;
  short_description: string;
  long_description?: string;
  responsibilities?: string[];
  skills?: string[];
};

export type CreateResourceRequest = {
  role_id: number;
  title: string;
  url: string;
  resource_type: ResourceType;
  difficulty: DifficultyLevel;
};

export type GetRolesResponse = {
  roles: RoleSummary[];
};

export type GetRoleByIdResponse = {
  role: RoleWithResources;
};

export type CreateRoleResponse = {
  role: Role;
};

export type CreateResourceResponse = {
  resource: Resource;
};

export type ErrorResponse = {
  error: string;
  details?: string;
};
