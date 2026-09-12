import { api } from '../plugins/axios';
import type { Contact, ContactPayload } from '../types/contact.types';

export async function listContacts() { const { data } = await api.get<Contact[]>('/contacts'); return data; }
export async function getContact(id: string) { const { data } = await api.get<Contact>(`/contacts/${id}`); return data; }
export async function createContact(payload: ContactPayload) { const { data } = await api.post<Contact>('/contacts', payload); return data; }
export async function updateContact(id: string, payload: ContactPayload) { const { data } = await api.patch<Contact>(`/contacts/${id}`, payload); return data; }
export async function removeContact(id: string) { await api.delete(`/contacts/${id}`); }
