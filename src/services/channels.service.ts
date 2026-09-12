import { api } from '../plugins/axios';
import type { Channel, ChannelPayload } from '../types/channel.types';
export async function listChannels() { const { data } = await api.get<Channel[]>('/channels'); return data; }
export async function createChannel(payload: ChannelPayload) { const { data } = await api.post<Channel>('/channels', payload); return data; }
export async function getChannel(id: string) { const { data } = await api.get<Channel>(`/channels/${id}`); return data; }
export async function updateChannel(id: string, payload: Partial<ChannelPayload>) { const { data } = await api.patch<Channel>(`/channels/${id}`, payload); return data; }
export async function removeChannel(id: string) { await api.delete(`/channels/${id}`); }
export async function rotateChannelWebhookSecret(id: string) { const { data } = await api.post<Channel>(`/channels/${id}/rotate-webhook-secret`); return data; }
export async function addChannelAccount(id: string, payload: { externalAccountId: string; displayName?: string }) { const { data } = await api.post(`/channels/${id}/accounts`, payload); return data; }
export async function removeChannelAccount(id: string, accountId: string) { await api.delete(`/channels/${id}/accounts/${accountId}`); }
