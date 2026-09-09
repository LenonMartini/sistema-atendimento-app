export interface UserRole {
  name: string;
  permissions: string[];
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  tenantName: string;
  roles: UserRole[];
  themePreference: 'dark' | 'light';
}

export interface AuthState {
  user: AuthenticatedUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
