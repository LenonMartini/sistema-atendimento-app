import { z } from 'zod';

export const channelSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  provider: z.enum(['evolution-whatsapp', 'email', 'webchat', 'instagram', 'automation'], { required_error: 'Selecione o provedor.' }),
  type: z.string().trim().min(1, 'Informe o tipo do canal.'),
});
