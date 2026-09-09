import { api } from '../plugins/axios';
import type { CreateUserPayload, ManagedUser, UpdateUserPayload } from '../types/user.types';

export async function listUsers(): Promise<ManagedUser[]> {
  const { data } = await api.get<ManagedUser[]>('/users');
  return data;
}

export async function getUser(id: string): Promise<ManagedUser> {
  const { data } = await api.get<ManagedUser>(`/users/${id}`);
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<ManagedUser> {
  const { data } = await api.post<ManagedUser>('/users', payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<ManagedUser> {
  const { data } = await api.patch<ManagedUser>(`/users/${id}`, payload);
  return data;
}

export async function removeUser(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/users/${id}`);
  return data;
}
