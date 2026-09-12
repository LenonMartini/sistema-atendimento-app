export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface ContactPayload { name: string; email?: string; phone?: string; companyId?: string; }
