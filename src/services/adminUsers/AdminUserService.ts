import { StaffUserRecord, SecurityAuditLogRecord, AdminRole, AdminActivityLogRecord } from '../../types';
import { INITIAL_ACTIVITY_LOGS } from '../adminMockService';

export interface IAdminUserService {
  getStaffList(): Promise<StaffUserRecord[]>;
  getStaffListSync(): StaffUserRecord[];
  addStaff(newStaff: Omit<StaffUserRecord, 'id' | 'createdAt'>): Promise<StaffUserRecord>;
  saveStaffList(staff: StaffUserRecord[]): void;
  getAuditLogs(): Promise<SecurityAuditLogRecord[]>;
  getAuditLogsSync(): SecurityAuditLogRecord[];
  recordAuditLog(log: Omit<SecurityAuditLogRecord, 'id' | 'timestamp'>): Promise<SecurityAuditLogRecord>;
  getActivityLogs(): Promise<AdminActivityLogRecord[]>;
  getActivityLogsSync(): AdminActivityLogRecord[];
}

const STAFF_STORAGE_KEY = 'cholti_admin_staff_v1';
const AUDIT_STORAGE_KEY = 'cholti_admin_security_audits_v1';

const INITIAL_STAFF: StaffUserRecord[] = [
  {
    id: 'staff-1',
    name: 'MD Tanvir Chowdhury',
    username: 'tanvir_admin',
    email: 'tanvir@choltimart.com',
    role: 'SUPER_ADMIN' as AdminRole,
    status: 'active',
    createdAt: '01 Jan 2026',
    lastLogin: '10 min ago',
    twoFactorEnabled: true
  },
  {
    id: 'staff-2',
    name: 'Shafayet Hossain',
    username: 'shafayet_mgr',
    email: 'shafayet@choltimart.com',
    role: 'MANAGER' as AdminRole,
    status: 'active',
    createdAt: '12 Jan 2026',
    lastLogin: '2 hours ago',
    twoFactorEnabled: true
  },
  {
    id: 'staff-3',
    name: 'Sadia Rahman',
    username: 'sadia_ops',
    email: 'sadia@choltimart.com',
    role: 'ORDER_MANAGER' as AdminRole,
    status: 'active',
    createdAt: '05 Feb 2026',
    lastLogin: 'Yesterday',
    twoFactorEnabled: false
  },
  {
    id: 'staff-4',
    name: 'Kazi Farhan',
    username: 'farhan_copy',
    email: 'farhan@choltimart.com',
    role: 'CONTENT_MANAGER' as AdminRole,
    status: 'active',
    createdAt: '20 Feb 2026',
    lastLogin: '3 days ago',
    twoFactorEnabled: false
  }
];

const INITIAL_AUDITS: SecurityAuditLogRecord[] = [
  {
    id: 'sec-log-1',
    timestamp: '19 Sep 2026, 04:12 PM',
    adminName: 'Tanvir Chowdhury',
    adminRole: 'SUPER_ADMIN',
    action: 'Updated Store General Settings',
    ipAddress: 'Local Dev Environment (Preview Session)',
    status: 'SUCCESS',
    targetResource: 'StoreSettings'
  },
  {
    id: 'sec-log-2',
    timestamp: '19 Sep 2026, 02:45 PM',
    adminName: 'Shafayet Hossain',
    adminRole: 'MANAGER',
    action: 'Exported customer sales report to CSV',
    ipAddress: 'Local Dev Environment (Preview Session)',
    status: 'SUCCESS',
    targetResource: 'OrdersCSV'
  },
  {
    id: 'sec-log-3',
    timestamp: '18 Sep 2026, 11:20 AM',
    adminName: 'Tanvir Chowdhury',
    adminRole: 'SUPER_ADMIN',
    action: 'Simulated Courier Webhook Dispatch',
    ipAddress: 'Local Dev Environment (Preview Session)',
    status: 'SUCCESS',
    targetResource: 'SteadfastCourier'
  }
];

class AdminUserServiceImpl implements IAdminUserService {
  private staffCache: StaffUserRecord[] = [];
  private auditCache: SecurityAuditLogRecord[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const storedStaff = localStorage.getItem(STAFF_STORAGE_KEY);
        this.staffCache = storedStaff ? JSON.parse(storedStaff) : [...INITIAL_STAFF];

        const storedAudits = localStorage.getItem(AUDIT_STORAGE_KEY);
        this.auditCache = storedAudits ? JSON.parse(storedAudits) : [...INITIAL_AUDITS];
        return;
      } catch (e) {
        console.warn('Failed to parse staff/audit data', e);
      }
    }
    this.staffCache = [...INITIAL_STAFF];
    this.auditCache = [...INITIAL_AUDITS];
  }

  public getStaffListSync(): StaffUserRecord[] {
    return [...this.staffCache];
  }

  public async getStaffList(): Promise<StaffUserRecord[]> {
    return this.getStaffListSync();
  }

  public async addStaff(newStaff: Omit<StaffUserRecord, 'id' | 'createdAt'>): Promise<StaffUserRecord> {
    const created: StaffUserRecord = {
      ...newStaff,
      id: `staff-${Date.now().toString(36)}`,
      createdAt: 'Today'
    };
    this.staffCache = [created, ...this.staffCache];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(this.staffCache));
    }
    return created;
  }

  public saveStaffList(staff: StaffUserRecord[]): void {
    this.staffCache = staff;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
    }
  }

  public getAuditLogsSync(): SecurityAuditLogRecord[] {
    return [...this.auditCache];
  }

  public async getAuditLogs(): Promise<SecurityAuditLogRecord[]> {
    return this.getAuditLogsSync();
  }

  public async recordAuditLog(log: Omit<SecurityAuditLogRecord, 'id' | 'timestamp'>): Promise<SecurityAuditLogRecord> {
    const created: SecurityAuditLogRecord = {
      ...log,
      id: `sec-log-${Date.now().toString(36)}`,
      timestamp: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.auditCache = [created, ...this.auditCache];
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.auditCache));
    }
    return created;
  }

  public getActivityLogsSync(): AdminActivityLogRecord[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cholti_admin_activity_logs_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  }

  public async getActivityLogs(): Promise<AdminActivityLogRecord[]> {
    return this.getActivityLogsSync();
  }
}

export const adminUserService = new AdminUserServiceImpl();
