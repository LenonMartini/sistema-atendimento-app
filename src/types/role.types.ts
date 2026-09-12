export interface AssignableRole {
  id: string;
  name: string;
  description: string | null;
  isGlobal: boolean;
  isSystem: boolean;
  permissions: string[];
  permissionIds: string[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionIds?: string[];
}
