export type ChannelProvider = 'evolution-whatsapp' | 'email' | 'webchat' | 'instagram' | 'automation';

export interface ChannelAccount {
  id: string;
  channelId: string;
  externalAccountId: string;
  displayName: string | null;
  status: string;
}

export interface Channel {
  id: string;
  provider: ChannelProvider;
  type: string;
  name: string;
  status: 'active' | 'inactive';
  hasConfig: boolean;
  hasWebhookSecret: boolean;
  webhookSecret?: string; // presente só na resposta de criação/rotação
  accounts?: ChannelAccount[];
  _count?: { accounts: number };
}

export interface ChannelPayload {
  name: string;
  provider: ChannelProvider;
  type: string;
  config?: Record<string, unknown>;
  status?: 'active' | 'inactive';
}
