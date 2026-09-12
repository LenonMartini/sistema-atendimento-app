import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório.' })
    .min(1, 'Campo obrigatório.')
    .email('Informe um e-mail válido.'),
  password: z
    .string({ required_error: 'Campo obrigatório.' })
    .min(1, 'Campo obrigatório.')
    .min(6, 'A senha deve ter ao menos 6 caracteres.'),
  remember: z.boolean().optional().default(true),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório.' })
    .min(1, 'Campo obrigatório.')
    .email('Informe um e-mail válido.'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
