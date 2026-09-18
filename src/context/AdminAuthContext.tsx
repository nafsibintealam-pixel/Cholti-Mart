import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminRole, AdminPermission, AdminUser, AdminSession } from '../types';

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
    wpEquivalent: 'WordPress Administrator (administrator)',
    description: 'Full unconstrained access to all site settings, themes, WooCommerce store, products, orders, content, and export tools.',
    permissions: [
      'manage_settings',
      'manage_theme',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_content',
      'manage_users',
      'manage_export'
    ],
    badgeColor: 'bg-red-500/15 text-red-700 border-red-300'
  },
  STORE_MANAGER: {
    role: 'STORE_MANAGER',
    title: 'Store Manager',
    wpEquivalent: 'WooCommerce Shop Manager (shop_manager)',
    description: 'Manages all eCommerce store operations: products, categories, stock, orders, customer shipments, and promotional campaigns.',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_content',
      'manage_export'
    ],
    badgeColor: 'bg-emerald-500/15 text-emerald-800 border-emerald-300'
  },
  PRODUCT_MANAGER: {
    role: 'PRODUCT_MANAGER',
    title: 'Product & Catalog Manager',
    wpEquivalent: 'WooCommerce Product Editor',
    description: 'Specialized access for catalog updates, adding products, editing pricing, descriptions, images, tags, and stock counts.',
    permissions: [
      'manage_products',
      'manage_categories'
    ],
    badgeColor: 'bg-blue-500/15 text-blue-800 border-blue-300'
  },
  ORDER_MANAGER: {
    role: 'ORDER_MANAGER',
    title: 'Order Fulfillment Manager',
    wpEquivalent: 'WooCommerce Order Manager',
    description: 'Handles order processing pipeline, fulfillment status changes (Processing, Shipped, Delivered), and courier tracking code assignments.',
    permissions: [
      'manage_orders'
    ],
    badgeColor: 'bg-purple-500/15 text-purple-800 border-purple-300'
  },
  CONTENT_MANAGER: {
    role: 'CONTENT_MANAGER',
    title: 'Content & Marketing Manager',
    wpEquivalent: 'WordPress Editor (editor)',
    description: 'Manages Elementor homepage sections, hero banners, campaign promo codes, trust pillars, and customer FAQ content.',
    permissions: [
      'manage_content',
      'manage_theme'
    ],
    badgeColor: 'bg-amber-500/15 text-amber-800 border-amber-300'
  },
  CUSTOMER_SUPPORT: {
    role: 'CUSTOMER_SUPPORT',
    title: 'Customer Support Representative',
    wpEquivalent: 'WooCommerce Support Desk',
    description: 'Read-only and status-update access for looking up orders, customer delivery inquiries, tracking parcels, and resolving issues.',
    permissions: [
      'manage_orders'
    ],
    badgeColor: 'bg-teal-500/15 text-teal-800 border-teal-300'
  }
};

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
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
  backendConfig: {
    wpApiEndpoint: string;
    authMethod: 'JWT' | 'Application Passwords' | 'OAuth2';
    status: 'Ready for Backend Connection' | 'Connected';
  };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'cholti_admin_auth_session_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        // Check if token is still valid (default 8 hours session)
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
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        if (new Date(session.expiresAt) > new Date()) {
          return session.token;
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
    const trimmedUsername = credentials.usernameOrEmail.trim();

    if (!trimmedUsername) {
      return { success: false, error: 'Please enter your administrator username or email.' };
    }

    if (!credentials.password || credentials.password.length < 4) {
      return { success: false, error: 'Please enter a valid password (minimum 4 characters).' };
    }

    // Role assignment: use selectedRole or default to SUPER_ADMIN
    const targetRole: AdminRole = credentials.selectedRole || 'SUPER_ADMIN';
    const roleDef = ROLE_DEFINITIONS[targetRole];

    // Generate secure session structure
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8-hour session
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const token = `wp_jwt_${Date.now()}_${randomHex}`;

    const newUser: AdminUser = {
      id: `usr_${Date.now().toString(36)}`,
      username: trimmedUsername.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      name: trimmedUsername.includes('@') 
        ? trimmedUsername.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) 
        : trimmedUsername,
      email: trimmedUsername.includes('@') ? trimmedUsername : `${trimmedUsername}@choltimart.com`,
      role: targetRole,
      lastLogin: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      permissions: roleDef.permissions
    };

    const session: AdminSession = {
      token,
      expiresAt,
      user: newUser
    };

    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to store session in sessionStorage', e);
    }

    setAdminUser(newUser);
    setSessionToken(token);

    return { success: true };
  };

  const logout = () => {
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

  const backendConfig = {
    wpApiEndpoint: 'https://choltimart.com/wp-json/jwt-auth/v1/token',
    authMethod: 'JWT' as const,
    status: 'Ready for Backend Connection' as const
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!adminUser,
        adminUser,
        activeRole,
        login,
        logout,
        switchRole,
        hasPermission,
        sessionToken,
        backendConfig
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
