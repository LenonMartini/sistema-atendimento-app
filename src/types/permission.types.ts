export interface PermissionItem {
  id: string;
  code: string;
  description: string;
}

export interface PermissionGroup {
  module: string;
  permissions: PermissionItem[];
}
