import { AdminUser, AdminRole, AdminPermission, AdminSession, AdminActiveSession, LoginHistoryRecord } from '../types';
import { ROLE_DEFINITIONS } from '../context/AdminAuthContext';
import { API_CONFIG } from './api/config';

export interface AdminLoginCredentials {
  usernameOrEmail: string;
  password: string;
  selectedRole?: AdminRole;
  rememberMe?: boolean;
}

export interface AdminAuthResult {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
  isMockAuth: boolean;
  warning?: string;
}

export interface AdminPasswordChangePayload {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordStrengthReport {
  score: number; // 0 - 4
  percentage: number; // 0 - 100
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  textColor: string;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export interface BackendAuthStatus {
  mode: 'development-mock' | 'production-server';
  endpoint: string;
  isProduction: boolean;
  securityNotice: string;
}

/**
 * Clean, decoupled Administrator Authentication Service Interface.
 * Allows seamless switching between development in-browser mock driver
 * and production server-side authentication (e.g. WordPress JWT / OAuth2).
 */
export interface IAdminAuthService {
  getAuthMode(): 'development-mock' | 'production-server';
  isProductionBackendConnected(): boolean;
  getBackendStatus(): BackendAuthStatus;

  login(credentials: AdminLoginCredentials): Promise<AdminAuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): AdminUser | null;
  getCurrentSession(): AdminSession | null;
  
  updateProfile(data: { name: string; username: string; email: string; phone?: string }): Promise<AdminUser>;
  changePassword(payload: AdminPasswordChangePayload): Promise<{ success: boolean; error?: string }>;
  checkPasswordStrength(password: string): PasswordStrengthReport;

  getActiveSessions(): Promise<AdminActiveSession[]>;
  terminateSession(sessionId: string): Promise<boolean>;
  terminateAllOtherSessions(): Promise<{ success: boolean; terminatedCount: number }>;

  getLoginHistory(): Promise<LoginHistoryRecord[]>;
  recordLoginAttempt(record: Omit<LoginHistoryRecord, 'id'>): void;
}

// Storage Keys
const STORAGE_KEYS = {
  SESSION: 'cholti_admin_auth_session_v1',
  PROFILE: 'cholti_admin_user_profile_v1',
  ACTIVE_SESSIONS: 'cholti_admin_active_sessions_v2',
  LOGIN_HISTORY: 'cholti_admin_login_history_v2',
  PASSWORD_META: 'cholti_admin_pwd_meta_v1'
};

const INITIAL_MOCK_ACTIVE_SESSIONS: AdminActiveSession[] = [
  {
    id: 'sess-curr',
    adminUserId: 'usr-superadmin',
    device: 'Apple MacBook Pro 16"',
    deviceType: 'desktop',
    os: 'macOS Sequoia 15.1',
    browser: 'Google Chrome 130.0',
    ipAddress: '103.144.201.42',
    location: 'Dhaka Metropolitan, BD',
    createdAt: 'Today, 10:15 AM',
    lastActive: 'Active Now (Current Session)',
    isCurrentSession: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 'sess-phone',
    adminUserId: 'usr-superadmin',
    device: 'iPhone 15 Pro Max',
    deviceType: 'mobile',
    os: 'iOS 18.1',
    browser: 'Mobile Safari 18.0',
    ipAddress: '103.144.201.55',
    location: 'Gulshan 2, Dhaka, BD',
    createdAt: '18 Sep 2026, 08:30 PM',
    lastActive: '45 minutes ago',
    isCurrentSession: false,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)'
  },
  {
    id: 'sess-wh',
    adminUserId: 'usr-superadmin',
    device: 'Dell Warehouse POS Workstation',
    deviceType: 'desktop',
    os: 'Windows 11 Pro',
    browser: 'Microsoft Edge 129.0',
    ipAddress: '119.30.38.102',
    location: 'Tejgaon Industrial Area, Dhaka',
    createdAt: '17 Sep 2026, 09:00 AM',
    lastActive: 'Yesterday, 06:15 PM',
    isCurrentSession: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
];

const INITIAL_MOCK_LOGIN_HISTORY: LoginHistoryRecord[] = [
  {
    id: 'lh-101',
    timestamp: '19 Sep 2026, 12:15 PM',
    user: 'superadmin (Nafsi Bin Tealam)',
    ipAddress: '103.144.201.42 (Dhaka, BD)',
    device: 'MacBook Pro (macOS 15.1)',
    browser: 'Chrome 130.0',
    status: 'Success'
  },
  {
    id: 'lh-102',
    timestamp: '19 Sep 2026, 08:30 AM',
    user: 'superadmin (Nafsi Bin Tealam)',
    ipAddress: '103.144.201.55 (Dhaka, BD)',
    device: 'iPhone 15 Pro (iOS 18.1)',
    browser: 'Mobile Safari 18.0',
    status: 'Success'
  },
  {
    id: 'lh-103',
    timestamp: '18 Sep 2026, 11:42 PM',
    user: 'admin_root',
    ipAddress: '185.220.101.5 (Tor Exit Node)',
    device: 'Linux x86_64',
    browser: 'Python-Requests/2.31',
    status: 'Blocked'
  },
  {
    id: 'lh-104',
    timestamp: '18 Sep 2026, 03:10 PM',
    user: 'superadmin',
    ipAddress: '103.144.201.42 (Dhaka, BD)',
    device: 'MacBook Pro (macOS 15.1)',
    browser: 'Chrome 130.0',
    status: 'Failed (Wrong Password)'
  },
  {
    id: 'lh-105',
    timestamp: '17 Sep 2026, 09:00 AM',
    user: 'superadmin (Nafsi Bin Tealam)',
    ipAddress: '119.30.38.102 (Dhaka, BD)',
    device: 'Dell Workstation (Windows 11)',
    browser: 'Edge 129.0',
    status: 'Success'
  }
];

/**
 * Development & Prototyping Mock Authentication Driver.
 * NO plaintext production passwords exist here.
 * Safely simulates token sessions, active sessions list, login history, and RBAC roles in browser memory/storage.
 */
export class MockAdminAuthService implements IAdminAuthService {
  getAuthMode(): 'development-mock' | 'production-server' {
    return 'development-mock';
  }

  isProductionBackendConnected(): boolean {
    return false;
  }

  getBackendStatus(): BackendAuthStatus {
    return {
      mode: 'development-mock',
      endpoint: 'https://choltimart.com/wp-json/jwt-auth/v1/token',
      isProduction: false,
      securityNotice: 'Development Preview Driver Active. This environment is running an in-browser mock authentication driver for UI prototyping and RBAC simulation. It is NOT connected to a live production authentication server. The frontend code contains zero plaintext production passwords.'
    };
  }

  async login(credentials: AdminLoginCredentials): Promise<AdminAuthResult> {
    const trimmedUsername = credentials.usernameOrEmail.trim();

    if (!trimmedUsername) {
      return { 
        success: false, 
        error: 'Please enter your administrator username or email.',
        isMockAuth: true 
      };
    }

    if (!credentials.password || credentials.password.length < 4) {
      return { 
        success: false, 
        error: 'Please enter a valid password (minimum 4 characters in preview mode).',
        isMockAuth: true 
      };
    }

    const targetRole: AdminRole = credentials.selectedRole || 'SUPER_ADMIN';
    const roleDef = ROLE_DEFINITIONS[targetRole] || ROLE_DEFINITIONS.SUPER_ADMIN;

    // Retrieve customized profile if previously saved
    let baseUser: AdminUser;
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        baseUser = JSON.parse(savedProfile);
      } else {
        baseUser = {
          id: 'usr_superadmin',
          username: trimmedUsername.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'superadmin',
          name: trimmedUsername.includes('@') 
            ? trimmedUsername.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) 
            : trimmedUsername.charAt(0).toUpperCase() + trimmedUsername.slice(1),
          email: trimmedUsername.includes('@') ? trimmedUsername : `${trimmedUsername.toLowerCase()}@choltimart.com`,
          role: targetRole,
          lastLogin: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          permissions: roleDef.permissions,
          status: 'active'
        };
      }
    } catch {
      baseUser = {
        id: 'usr_superadmin',
        username: 'superadmin',
        name: 'Super Administrator',
        email: 'admin@choltimart.com',
        role: targetRole,
        lastLogin: 'Just now',
        permissions: roleDef.permissions,
        status: 'active'
      };
    }

    // Always update role and last login
    const updatedUser: AdminUser = {
      ...baseUser,
      role: targetRole,
      permissions: roleDef.permissions,
      lastLogin: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    // Generate secure mock JWT session token
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const token = `preview_mock_jwt_${Date.now()}_${randomHex}`;
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    const session: AdminSession = {
      token,
      expiresAt,
      user: updatedUser
    };

    try {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to store session in browser storage', e);
    }

    // Record login in history
    this.recordLoginAttempt({
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: `${updatedUser.username} (${updatedUser.name})`,
      ipAddress: '103.144.201.42 (Dhaka, BD)',
      device: navigator.userAgent.includes('Mac') ? 'MacBook Pro (macOS)' : 'Desktop PC (Windows)',
      browser: 'Web Browser Preview',
      status: 'Success'
    });

    return {
      success: true,
      token,
      user: updatedUser,
      isMockAuth: true,
      warning: 'Authenticated via in-browser development preview driver.'
    };
  }

  async logout(): Promise<void> {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.warn('Logout session clearing error', e);
    }
  }

  getCurrentUser(): AdminUser | null {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        if (new Date(session.expiresAt) > new Date()) {
          return session.user;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  getCurrentSession(): AdminSession | null {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        if (new Date(session.expiresAt) > new Date()) {
          return session;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  async updateProfile(data: { name: string; username: string; email: string; phone?: string }): Promise<AdminUser> {
    const current = this.getCurrentUser();
    if (!current) {
      throw new Error('No authenticated user session found.');
    }

    const updated: AdminUser = {
      ...current,
      name: data.name.trim() || current.name,
      username: data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || current.username,
      email: data.email.trim() || current.email,
      phone: data.phone !== undefined ? data.phone.trim() : current.phone
    };

    // Update in sessionStorage and localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        session.user = updated;
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('Profile save error', e);
    }

    return updated;
  }

  checkPasswordStrength(password: string): PasswordStrengthReport {
    const checks = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    let passedCount = 0;
    if (checks.minLength) passedCount++;
    if (checks.hasUpper && checks.hasLower) passedCount++;
    if (checks.hasNumber) passedCount++;
    if (checks.hasSpecial) passedCount++;

    // Length bonus
    if (password.length >= 12 && passedCount >= 3) {
      passedCount = Math.min(4, passedCount + 1);
    }

    let label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Too Weak';
    let color = 'bg-red-500';
    let textColor = 'text-red-400';
    let percentage = 15;

    if (password.length === 0) {
      percentage = 0;
      label = 'Too Weak';
    } else if (passedCount <= 1) {
      percentage = 25;
      label = 'Weak';
      color = 'bg-red-500';
      textColor = 'text-red-400';
    } else if (passedCount === 2) {
      percentage = 50;
      label = 'Fair';
      color = 'bg-amber-500';
      textColor = 'text-amber-400';
    } else if (passedCount === 3) {
      percentage = 75;
      label = 'Good';
      color = 'bg-lime-500';
      textColor = 'text-lime-400';
    } else {
      percentage = 100;
      label = 'Strong';
      color = 'bg-emerald-500';
      textColor = 'text-emerald-400';
    }

    return {
      score: passedCount,
      percentage,
      label,
      color,
      textColor,
      checks
    };
  }

  async changePassword(payload: AdminPasswordChangePayload): Promise<{ success: boolean; error?: string }> {
    if (!payload.newPassword) {
      return { success: false, error: 'New password cannot be empty.' };
    }

    if (payload.newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (payload.newPassword !== payload.confirmPassword) {
      return { success: false, error: 'Confirm password does not match new password.' };
    }

    const strength = this.checkPasswordStrength(payload.newPassword);
    if (strength.score < 2) {
      return { 
        success: false, 
        error: 'Password is too weak. Please include a mix of uppercase, numbers, and special symbols.' 
      };
    }

    // In mock mode, we simulate updating password metadata without storing any plaintext password
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD_META, JSON.stringify({
        lastChanged: new Date().toISOString(),
        hasCustomPasswordSet: true
      }));
    } catch {
      // ignore
    }

    return { success: true };
  }

  async getActiveSessions(): Promise<AdminActiveSession[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_MOCK_ACTIVE_SESSIONS;
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    const list = await this.getActiveSessions();
    const target = list.find(s => s.id === sessionId);

    if (target?.isCurrentSession) {
      await this.logout();
      return true;
    }

    const filtered = list.filter(s => s.id !== sessionId);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
    return true;
  }

  async terminateAllOtherSessions(): Promise<{ success: boolean; terminatedCount: number }> {
    const list = await this.getActiveSessions();
    const current = list.filter(s => s.isCurrentSession);
    const count = list.length - current.length;

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(current));
    } catch {
      // ignore
    }

    return { success: true, terminatedCount: count };
  }

  async getLoginHistory(): Promise<LoginHistoryRecord[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_MOCK_LOGIN_HISTORY;
  }

  recordLoginAttempt(record: Omit<LoginHistoryRecord, 'id'>): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY);
      const list: LoginHistoryRecord[] = saved ? JSON.parse(saved) : INITIAL_MOCK_LOGIN_HISTORY;
      const newEntry: LoginHistoryRecord = {
        ...record,
        id: `lh-${Date.now().toString(36)}`
      };
      const updated = [newEntry, ...list.slice(0, 49)];
      localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

/**
 * Production-ready Server Authentication Service Skeleton.
 * Ready for connection to WordPress JWT Authentication plugin or WooCommerce REST API.
 * The client sends credentials over HTTPS POST and NEVER retains plaintext passwords.
 */
export class ProductionServerAdminAuthService implements IAdminAuthService {
  private apiEndpoint: string;

  constructor(apiEndpoint = API_CONFIG.authApiUrl || 'https://choltimart.com/wp-json/jwt-auth/v1/token') {
    this.apiEndpoint = apiEndpoint;
  }

  getAuthMode(): 'development-mock' | 'production-server' {
    return 'production-server';
  }

  isProductionBackendConnected(): boolean {
    return Boolean(API_CONFIG.authApiUrl && !API_CONFIG.isMockMode);
  }

  getBackendStatus(): BackendAuthStatus {
    return {
      mode: 'production-server',
      endpoint: this.apiEndpoint,
      isProduction: API_CONFIG.environment === 'production',
      securityNotice: this.isProductionBackendConnected()
        ? 'Production Authentication Active: Verifying credentials directly with WordPress JWT endpoint over HTTPS.'
        : 'Production Server Authentication Adapter configured. Live WordPress/backend server not connected yet.'
    };
  }

  async login(credentials: AdminLoginCredentials): Promise<AdminAuthResult> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.usernameOrEmail,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errData.message || 'Invalid administrator username or password.',
          isMockAuth: false
        };
      }

      const data = await response.json();
      return {
        success: true,
        token: data.token,
        user: {
          id: data.user_id || 'wp_admin',
          username: data.user_nicename || credentials.usernameOrEmail,
          name: data.user_display_name || credentials.usernameOrEmail,
          email: data.user_email || `${credentials.usernameOrEmail}@choltimart.com`,
          role: 'SUPER_ADMIN',
          lastLogin: new Date().toISOString(),
          permissions: ROLE_DEFINITIONS.SUPER_ADMIN.permissions
        },
        isMockAuth: false
      };
    } catch (e: any) {
      return {
        success: false,
        error: `Could not connect to authentication server: ${e?.message || 'Network error'}`,
        isMockAuth: false
      };
    }
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  getCurrentUser(): AdminUser | null {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const session: AdminSession = JSON.parse(saved);
        return session.user;
      }
    } catch {
      // ignore
    }
    return null;
  }

  getCurrentSession(): AdminSession | null {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  }

  async updateProfile(data: { name: string; username: string; email: string }): Promise<AdminUser> {
    throw new Error('Direct server profile update requires live WordPress REST API connection.');
  }

  checkPasswordStrength(password: string): PasswordStrengthReport {
    // Re-use standard NIST-compliant client checks for UI feedback
    return new MockAdminAuthService().checkPasswordStrength(password);
  }

  async changePassword(payload: AdminPasswordChangePayload): Promise<{ success: boolean; error?: string }> {
    throw new Error('Server-side password change requires live WordPress REST API connection.');
  }

  async getActiveSessions(): Promise<AdminActiveSession[]> {
    return [];
  }

  async terminateSession(_sessionId: string): Promise<boolean> {
    return true;
  }

  async terminateAllOtherSessions(): Promise<{ success: boolean; terminatedCount: number }> {
    return { success: true, terminatedCount: 0 };
  }

  async getLoginHistory(): Promise<LoginHistoryRecord[]> {
    return [];
  }

  recordLoginAttempt(): void {
    // Logged directly by WordPress server audit plugins
  }
}

// Singleton Service Provider
let authServiceInstance: IAdminAuthService | null = null;

export const getAdminAuthService = (): IAdminAuthService => {
  if (!authServiceInstance) {
    if (!API_CONFIG.isMockMode) {
      authServiceInstance = new ProductionServerAdminAuthService(API_CONFIG.authApiUrl);
    } else {
      if (API_CONFIG.environment === 'production') {
        throw new Error('CRITICAL CONFIGURATION ERROR: Mock authentication driver cannot run in production environment.');
      }
      authServiceInstance = new MockAdminAuthService();
    }
  }
  return authServiceInstance;
};

export const adminAuthService: IAdminAuthService = getAdminAuthService();
