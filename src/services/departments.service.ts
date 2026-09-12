import { api } from '../plugins/axios';
import type { Department, DepartmentPayload, Team } from '../types/department.types';

export async function listDepartments() { const { data } = await api.get<Department[]>('/departments'); return data; }
export async function getDepartment(id: string) { const { data } = await api.get<Department>(`/departments/${id}`); return data; }
export async function createDepartment(payload: DepartmentPayload) { const { data } = await api.post<Department>('/departments', payload); return data; }
export async function updateDepartment(id: string, payload: DepartmentPayload) { const { data } = await api.patch<Department>(`/departments/${id}`, payload); return data; }
export async function removeDepartment(id: string) { await api.delete(`/departments/${id}`); }
export async function createTeam(departmentId: string, name: string) { const { data } = await api.post<Team>(`/departments/${departmentId}/teams`, { name }); return data; }
export async function removeTeam(departmentId: string, teamId: string) { await api.delete(`/departments/${departmentId}/teams/${teamId}`); }
