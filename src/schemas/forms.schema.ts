import { z } from 'zod';
export const contactSchema = z.object({ name: z.string().trim().min(1, 'Nome é obrigatório.'), email: z.union([z.string().email('E-mail inválido.'), z.literal('')]).optional(), phone: z.string().optional(), companyId: z.string().optional() });
export const departmentSchema = z.object({ name: z.string().trim().min(1, 'Nome é obrigatório.'), code: z.string().trim().min(1, 'Código é obrigatório.'), companyId: z.string().optional() });
export const tenantSchema = z.object({ name: z.string().trim().min(1, 'Nome é obrigatório.'), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use somente letras minúsculas, números e hífens.'), timezone: z.string().min(1, 'Fuso horário é obrigatório.'), status: z.string() });
export const roleSchema = z.object({ name: z.string().trim().min(1, 'Nome é obrigatório.'), description: z.string().optional(), permissionIds: z.array(z.string()) });
export const userSchema = z.object({ name: z.string().trim().min(1, 'Nome é obrigatório.'), email: z.string().email('E-mail inválido.'), password: z.string().optional(), status: z.string() });
