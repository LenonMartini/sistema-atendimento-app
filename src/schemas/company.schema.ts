import { z } from 'zod';
export const companySchema = z.object({
  name: z.string().trim().min(1, 'Nome fantasia é obrigatório.'),
  legalName: z.string().optional(), document: z.string().optional(), stateRegistration: z.string().optional(), municipalRegistration: z.string().optional(),
  taxRegime: z.string().optional(), cnae: z.string().optional(), email: z.union([z.string().email('Informe um e-mail válido.'), z.literal('')]).optional(), phone: z.string().optional(),
  street: z.string().optional(), number: z.string().optional(), complement: z.string().optional(), neighborhood: z.string().optional(), city: z.string().optional(), cityCode: z.string().optional(), state: z.string().optional(), zipCode: z.string().optional(), countryCode: z.string().optional(), countryName: z.string().optional(),
});
