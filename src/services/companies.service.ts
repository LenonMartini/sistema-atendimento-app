import { api } from '../plugins/axios';
import type { Company, CompanyPayload } from '../types/company.types';
export async function listCompanies() { const { data } = await api.get<Company[]>('/companies'); return data; }
export async function createCompany(payload: CompanyPayload) { const { data } = await api.post<Company>('/companies', payload); return data; }
export async function getCompany(id: string) { const { data } = await api.get<Company>(`/companies/${id}`); return data; }
export async function updateCompany(id: string, payload: CompanyPayload) { const { data } = await api.patch<Company>(`/companies/${id}`, payload); return data; }
export async function removeCompany(id: string) { await api.delete(`/companies/${id}`); }
