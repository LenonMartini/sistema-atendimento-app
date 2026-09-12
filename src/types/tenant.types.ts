export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  timezone: string;
  createdAt: string;
}

export interface CreateTenantPayload {
  name: string;
  slug: string;
  timezone?: string;
}

export interface UpdateTenantPayload {
  name?: string;
  timezone?: string;
  status?: string;
}
