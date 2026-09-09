export interface UserRoleSummary {
  id: string;
  name: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: UserRoleSummary[];
  lastLoginAt: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roleIds?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  status?: string;
  roleIds?: string[];
}
