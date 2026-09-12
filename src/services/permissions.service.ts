import { api } from '../plugins/axios';
import type { PermissionGroup } from '../types/permission.types';

export async function listPermissionsGrouped(): Promise<PermissionGroup[]> {
  const { data } = await api.get<PermissionGroup[]>('/permissions');
  return data;
}
