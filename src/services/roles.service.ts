import { api } from '../plugins/axios';
import type { AssignableRole, CreateRolePayload, UpdateRolePayload } from '../types/role.types';

/** Usado tanto pelo seletor de papéis (form de usuário) quanto pela tela "Níveis de acesso". */
export async function listRoles(): Promise<AssignableRole[]> {
  const { data } = await api.get<AssignableRole[]>('/roles');
  return data;
}

export async function getRole(id: string): Promise<AssignableRole> {
  const { data } = await api.get<AssignableRole>(`/roles/${id}`);
  return data;
}

export async function createRole(payload: CreateRolePayload): Promise<AssignableRole> {
  const { data } = await api.post<AssignableRole>('/roles', payload);
  return data;
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<AssignableRole> {
  const { data } = await api.patch<AssignableRole>(`/roles/${id}`, payload);
  return data;
}

export async function removeRole(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/roles/${id}`);
  return data;
}
