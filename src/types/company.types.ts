export interface Company {
  id: string;
  name: string;
  legalName: string | null;
  document: string | null;
  stateRegistration: string | null;
  municipalRegistration: string | null;
  taxRegime: string | null;
  cnae: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  cityCode: string | null;
  state: string | null;
  zipCode: string | null;
  countryCode: string | null;
  countryName: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  _count?: { contacts: number; departments: number };
}
export interface CompanyPayload {
  name: string; legalName?: string; document?: string; email?: string; phone?: string;
  stateRegistration?: string; municipalRegistration?: string; taxRegime?: string; cnae?: string;
  street?: string; number?: string; complement?: string; neighborhood?: string; city?: string;
  cityCode?: string; state?: string; zipCode?: string; countryCode?: string; countryName?: string;
}
