export type BusinessPartnerRole = 'customer' | 'supplier' | 'carrier' | 'partner';

export interface CustomerDetail {
  creditLimit: number;
  paymentTermsDays: number | null;
  salesRepUserId: string | null;
  notes: string | null;
}

export interface SupplierDetail {
  paymentTermsDays: number | null;
  leadTimeDays: number | null;
  defaultWarehouseId: string | null;
  notes: string | null;
}

export interface BusinessPartner {
  id: string;
  personType: 'individual' | 'organization';
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
  roles: Array<{ id: string; role: BusinessPartnerRole; active: boolean }>;
  customerDetail: CustomerDetail | null;
  supplierDetail: SupplierDetail | null;
  _count?: { contacts: number };
}

export interface BusinessPartnerPayload {
  personType?: 'individual' | 'organization';
  name: string;
  legalName?: string;
  document?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  taxRegime?: string;
  cnae?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  cityCode?: string;
  state?: string;
  zipCode?: string;
  countryCode?: string;
  countryName?: string;
  email?: string;
  phone?: string;
  roles?: BusinessPartnerRole[];
  customerDetail?: { creditLimit?: number; paymentTermsDays?: number; salesRepUserId?: string; notes?: string };
  supplierDetail?: { paymentTermsDays?: number; leadTimeDays?: number; defaultWarehouseId?: string; notes?: string };
}
