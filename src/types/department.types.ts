export interface Team { id: string; name: string; departmentId: string; }
export interface Department { id: string; name: string; code: string; active: boolean; managerUserId: string | null; teams: Team[]; }
export interface DepartmentPayload { name: string; code: string; managerUserId?: string; companyId?: string; }
