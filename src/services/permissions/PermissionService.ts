import { AdminRole, AdminPermission } from '../../types';
import { ROLE_DEFINITIONS } from '../../context/AdminAuthContext';

export interface IPermissionService {
  getPermissionsForRole(role: AdminRole): AdminPermission[];
  hasPermission(userRole: AdminRole, permission: AdminPermission): boolean;
  canAccessRoute(userRole: AdminRole, route: string): boolean;
  getAllRoles(): { role: AdminRole; label: string; description: string; permissionsCount: number }[];
}

class PermissionServiceImpl implements IPermissionService {
  public getPermissionsForRole(role: AdminRole): AdminPermission[] {
    const def = ROLE_DEFINITIONS[role];
    return def ? def.permissions : [];
  }

  public hasPermission(userRole: AdminRole, permission: AdminPermission): boolean {
    if (userRole === 'SUPER_ADMIN') return true;
    const permissions = this.getPermissionsForRole(userRole);
    return permissions.includes(permission);
  }

  public canAccessRoute(userRole: AdminRole, route: string): boolean {
    if (userRole === 'SUPER_ADMIN') return true;

    const routePermissions: Record<string, AdminPermission> = {
      'orders': 'manage_orders',
      'catalog': 'manage_products',
      'customers': 'manage_customers',
      'marketing': 'manage_marketing',
      'content': 'manage_content',
      'design': 'manage_theme',
      'delivery': 'manage_delivery',
      'payments': 'manage_payments',
      'security': 'manage_users',
      'system': 'manage_system',
      'settings': 'manage_settings'
    };

    const required = routePermissions[route];
    if (!required) return true;
    return this.hasPermission(userRole, required);
  }

  public getAllRoles(): { role: AdminRole; label: string; description: string; permissionsCount: number }[] {
    return Object.entries(ROLE_DEFINITIONS).map(([roleKey, def]) => ({
      role: roleKey as AdminRole,
      label: def.title,
      description: def.description,
      permissionsCount: def.permissions.length
    }));
  }
}

export const permissionService = new PermissionServiceImpl();
