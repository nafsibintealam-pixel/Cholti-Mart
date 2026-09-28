import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminRole, AdminPermission, AdminUser, AdminSession, AdminActiveSession, LoginHistoryRecord } from '../types';
import { 
  getAdminAuthService, 
  IAdminAuthService, 
  AdminPasswordChangePayload, 
  PasswordStrengthReport,
  BackendAuthStatus 
} from '../services/adminAuthService';

export interface RoleDefinition {
  role: AdminRole;
  title: string;
  wpEquivalent: string;
  description: string;
  permissions: AdminPermission[];
  badgeColor: string;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    wpEquivalent: 'WordPress Network Admin / Super Admin',
    description: 'Full unconstrained access to all site settings, themes, WooCommerce store, products, orders, content, users, security, and export tools.',
    permissions: [
      'manage_settings',
      'manage_theme',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_users',
      'manage_integrations',
      'manage_system',
      'manage_export',
      'view_dashboard'
    ],
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30'
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Store Administrator',
    wpEquivalent: 'WordPress Administrator (administrator)',
    description: 'Complete store and configuration control including catalog, orders, customers, design, marketing, integrations, and administration.',
    permissions: [
      'manage_settings',
      'manage_theme',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_users',
      'manage_integrations',
      'manage_export',
      'view_dashboard'
    ],
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  },
  MANAGER: {
    role: 'MANAGER',
    title: 'Operations & Store Manager',
    wpEquivalent: 'WooCommerce Shop Manager (shop_manager)',
    description: 'Manages all day-to-day operations: products, inventory, orders, customer shipments, promotional campaigns, and analytics.',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_export',
      'view_dashboard'
    ],
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  },
  ORDER_MANAGER: {
    role: 'ORDER_MANAGER',
    title: 'Order Fulfillment Manager',
    wpEquivalent: 'WooCommerce Order & Logistics Manager',
    description: 'Handles order processing pipeline, fulfillment status changes (Processing, Shipped, Delivered), and courier tracking code assignments.',
    permissions: [
      'manage_orders',
      'manage_delivery',
      'manage_customers',
      'view_dashboard'
    ],
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  },
  CONTENT_MANAGER: {
    role: 'CONTENT_MANAGER',
    title: 'Content & Marketing Editor',
    wpEquivalent: 'WordPress Editor (editor)',
    description: 'Manages Elementor homepage sections, hero banners, campaign promo codes, trust pillars, blog posts, pages, and media library.',
    permissions: [
      'manage_content',
      'manage_theme',
      'manage_marketing',
      'view_dashboard'
    ],
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  },
  VIEWER: {
    role: 'VIEWER',
    title: 'Read-Only Auditor / Viewer',
    wpEquivalent: 'WordPress Subscriber / Analytics Viewer',
    description: 'Read-only access for viewing dashboards, product catalogs, customer orders, and analytics reports without modification rights.',
    permissions: [
      'view_dashboard'
    ],
    badgeColor: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30'
  },
  // Legacy backward-compatibility mappings
  STORE_MANAGER: {
    role: 'STORE_MANAGER',
    title: 'Store Manager',
    wpEquivalent: 'WooCommerce Shop Manager (shop_manager)',
    description: 'Manages all eCommerce store operations: products, categories, stock, orders, customer shipments, and promotional campaigns.',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_content',
      'manage_export',
      'view_dashboard'
    ],
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  },
  PRODUCT_MANAGER: {
    role: 'PRODUCT_MANAGER',
    title: 'Product & Catalog Manager',
    wpEquivalent: 'WooCommerce Product Editor',
    description: 'Specialized access for catalog updates, adding products, editing pricing, descriptions, images, tags, and stock counts.',
    permissions: [
      'manage_products',
      'manage_categories',
      'view_dashboard'
    ],
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30'
  },
  CUSTOMER_SUPPORT: {
    role: 'CUSTOMER_SUPPORT',
    title: 'Customer Support Representative',
    wpEquivalent: 'WooCommerce Support Desk',
    description: 'Read-only and status-update access for looking up orders, customer delivery inquiries, tracking parcels, and resolving issues.',
    permissions: [
      'manage_orders',
      'manage_customers',
      'view_dashboard'
    ],
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
  }
};

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  currentUser: AdminUser | null;
  currentStaff: AdminUser | null;
  isSuperAdmin: boolean;
  activeRole: AdminRole;
  login: (credentials: { 
    usernameOrEmail: string; 
    password?: string; 
    selectedRole?: AdminRole;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  hasPermission: (permission: AdminPermission) => boolean;
  sessionToken: string | null;
  authService: IAdminAuthService;
  authMode: 'development-mock' | 'production-server';
  isProductionBackendConnected: boolean;
  backendConfig: {
    wpApiEndpoint: string;
    authMethod: 'JWT' | 'Application Passwords' | 'OAuth2';
    status: 'Development Mock Driver' | 'Connected';
    securityNotice: string;
  };
  updateProfile: (data: { name: string; username: string; email: string; phone?: string }) => Promise<AdminUser>;
  changePassword: (payload: AdminPasswordChangePayload) => Promise<{ success: boolean; error?: string }>;
  checkPasswordStrength: (password: string) => PasswordStrengthReport;
  getActiveSessions: () => Promise<AdminActiveSession[]>;
  terminateSession: (sessionId: string) => Promise<boolean>;
  terminateAllOtherSessions: () => Promise<{ success: boolean; terminatedCount: number }>;
  getLoginHistory: () => Promise<LoginHistoryRecord[]>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'cholti_admin_auth_session_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authService = getAdminAuthService();
  const backendStatus = authService.getBackendStatus();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const user = authService.getCurrentUser();
      if (user) return user;
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        if (new Date(session.expiresAt) > new Date()) {
          return session.user;
        }
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Session reading error', e);
    }
    return null;
  });

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      const session = authService.getCurrentSession();
      if (session && new Date(session.expiresAt) > new Date()) {
        return session.token;
      }
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const parsed: AdminSession = JSON.parse(saved);
        if (new Date(parsed.expiresAt) > new Date()) {
          return parsed.token;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const activeRole: AdminRole = adminUser ? adminUser.role : 'SUPER_ADMIN';

  const login = async (credentials: { 
    usernameOrEmail: string; 
    password?: string; 
    selectedRole?: AdminRole 
  }): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.login({
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password || '',
      selectedRole: credentials.selectedRole
    });

    if (result.success && result.user && result.token) {
      setAdminUser(result.user);
      setSessionToken(result.token);
      return { success: true };
    }

    return { 
      success: false, 
      error: result.error || 'Authentication failed. Please verify credentials.' 
    };
  };

  const logout = () => {
    authService.logout();
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.warn('Session removal error', e);
    }
    setAdminUser(null);
    setSessionToken(null);
  };

  const switchRole = (newRole: AdminRole) => {
    if (!adminUser) return;
    const roleDef = ROLE_DEFINITIONS[newRole];
    const updatedUser: AdminUser = {
      ...adminUser,
      role: newRole,
      permissions: roleDef.permissions
    };
    setAdminUser(updatedUser);

    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        session.user = updatedUser;
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      }
    } catch {
      // ignore
    }
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission);
  };

  const updateProfile = async (data: { name: string; username: string; email: string; phone?: string }): Promise<AdminUser> => {
    const updated = await authService.updateProfile(data);
    setAdminUser(updated);
    return updated;
  };

  const changePassword = async (payload: AdminPasswordChangePayload) => {
    return authService.changePassword(payload);
  };

  const checkPasswordStrength = (password: string) => {
    return authService.checkPasswordStrength(password);
  };

  const getActiveSessions = async () => {
    return authService.getActiveSessions();
  };

  const terminateSession = async (sessionId: string) => {
    const success = await authService.terminateSession(sessionId);
    if (success) {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        logout();
      }
    }
    return success;
  };

  const terminateAllOtherSessions = async () => {
    return authService.terminateAllOtherSessions();
  };

  const getLoginHistory = async () => {
    return authService.getLoginHistory();
  };

  const backendConfig = {
    wpApiEndpoint: backendStatus.endpoint,
    authMethod: 'JWT' as const,
    status: authService.isProductionBackendConnected() ? ('Connected' as const) : ('Development Mock Driver' as const),
    securityNotice: backendStatus.securityNotice
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!adminUser,
        adminUser,
        currentUser: adminUser,
        currentStaff: adminUser,
        isSuperAdmin: activeRole === 'SUPER_ADMIN',
        activeRole,
        login,
        logout,
        switchRole,
        hasPermission,
        sessionToken,
        authService,
        authMode: authService.getAuthMode(),
        isProductionBackendConnected: authService.isProductionBackendConnected(),
        backendConfig,
        updateProfile,
        changePassword,
        checkPasswordStrength,
        getActiveSessions,
        terminateSession,
        terminateAllOtherSessions,
        getLoginHistory
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

