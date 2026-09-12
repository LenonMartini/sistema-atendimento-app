import { api } from '../plugins/axios';
import type { BusinessPartner, BusinessPartnerPayload } from '../types/business-partner.types';
export async function listBusinessPartners() { const { data } = await api.get<BusinessPartner[]>('/business-partners'); return data; }
export async function createBusinessPartner(payload: BusinessPartnerPayload) { const { data } = await api.post<BusinessPartner>('/business-partners', payload); return data; }
export async function getBusinessPartner(id: string) { const { data } = await api.get<BusinessPartner>(`/business-partners/${id}`); return data; }
export async function updateBusinessPartner(id: string, payload: BusinessPartnerPayload) { const { data } = await api.patch<BusinessPartner>(`/business-partners/${id}`, payload); return data; }
export async function removeBusinessPartner(id: string) { await api.delete(`/business-partners/${id}`); }
