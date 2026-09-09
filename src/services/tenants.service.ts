import { api } from '../plugins/axios';
import type { CreateTenantPayload, Tenant, UpdateTenantPayload } from '../types/tenant.types';

export async function listTenants(): Promise<Tenant[]> {
  const { data } = await api.get<Tenant[]>('/tenants');
  return data;
}

export async function getTenant(id: string): Promise<Tenant> {
  const { data } = await api.get<Tenant>(`/tenants/${id}`);
  return data;
}

export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  const { data } = await api.post<Tenant>('/tenants', payload);
  return data;
}

export async function updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant> {
  const { data } = await api.patch<Tenant>(`/tenants/${id}`, payload);
  return data;
}

export async function removeTenant(id: string): Promise<Tenant> {
  const { data } = await api.delete<Tenant>(`/tenants/${id}`);
  return data;
}
