import { api } from '../plugins/axios';
import type { AuthenticatedUser } from '../types/auth.types';

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}


export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function me(): Promise<AuthenticatedUser> {
  const { data } = await api.get<AuthenticatedUser>('/auth/me');
  return data;
}
