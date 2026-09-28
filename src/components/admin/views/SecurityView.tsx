import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Lock, 
  Plus, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Check, 
  Trash2,
  Edit2
} from 'lucide-react';
import { StaffUserRecord, SecurityAuditLogRecord, AdminRole } from '../../../types';
import { AdminCard, AdminBadge, AdminButton, AdminModal } from '../common/AdminUiElements';
import { adminUserService } from '../../../services';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { AdminAccountSettings } from '../security/AdminAccountSettings';

export interface SecurityViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  subnav = 'account_settings',
  onNavigateSubnav
}) => {
  const { currentUser, activeRole } = useAdminAuth();
  const isSuperAdmin = activeRole === 'SUPER_ADMIN';
  const [staffList, setStaffList] = useState<StaffUserRecord[]>(() => adminUserService.getStaffListSync());
  const [auditLogs] = useState<SecurityAuditLogRecord[]>(() => adminUserService.getAuditLogsSync());
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: 'MANAGER' as AdminRole,
    status: 'active' as const
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUserService.addStaff({
      name: newStaffForm.name,
      username: newStaffForm.email.split('@')[0] || 'staff_user',
      email: newStaffForm.email,
      role: newStaffForm.role,
      status: newStaffForm.status,
      twoFactorEnabled: false
    });
    setStaffList(adminUserService.getStaffListSync());
    setIsAddStaffOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = staffList.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' ? 'suspended' : 'active';
        return { ...s, status: nextStatus as any };
      }
      return s;
    });
    setStaffList(updated);
    adminUserService.saveStaffList(updated);
  };

  // Check if subnav is account_settings or subviews handled by AdminAccountSettings
  const isAccountOrSessionView = 
    subnav === 'account_settings' || 
    subnav === 'sessions' || 
    subnav === 'login_history';

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'account_settings', label: 'My Account & Credentials' },
            { id: 'staff', label: `Staff Accounts (${staffList.length})` },
            { id: 'roles', label: 'Role Permissions Matrix' },
            { id: 'activity_logs', label: `Security Audit Logs (${auditLogs.length})` },
            { id: 'two_factor', label: '2FA & Policies' }
          ].map((tab) => {
            const isActive = subnav === tab.id || (tab.id === 'account_settings' && isAccountOrSessionView);
            return (
              <button
                key={tab.id}
                onClick={() => onNavigateSubnav(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-colors font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {subnav === 'staff' && (
          <AdminButton
            variant="lime"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsAddStaffOpen(true)}
          >
            Invite Staff Member
          </AdminButton>
        )}
      </div>

      {isAccountOrSessionView ? (
        <AdminAccountSettings />
      ) : subnav === 'roles' ? (
        /* Role Permissions Matrix */
        <AdminCard title="Role-Based Access Control (RBAC) Matrix" subtitle="Permissions granted to each administrative tier">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Permission Area</th>
                  <th className="px-4 py-3 text-center">Super Admin</th>
                  <th className="px-4 py-3 text-center">Admin</th>
                  <th className="px-4 py-3 text-center">Manager</th>
                  <th className="px-4 py-3 text-center">Order Specialist</th>
                  <th className="px-4 py-3 text-center">Content Editor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {[
                  { name: 'Dashboard Overview', sa: true, ad: true, mg: true, ord: true, cnt: true },
                  { name: 'Manage Products & Catalog', sa: true, ad: true, mg: true, ord: false, cnt: false },
                  { name: 'Update Orders & Shipments', sa: true, ad: true, mg: true, ord: true, cnt: false },
                  { name: 'Manage Customers', sa: true, ad: true, mg: true, ord: false, cnt: false },
                  { name: 'Store Design & Colors', sa: true, ad: true, mg: false, ord: false, cnt: false },
                  { name: 'Discounts & Marketing', sa: true, ad: true, mg: true, ord: false, cnt: false },
                  { name: 'Payments & Refunds', sa: true, ad: true, mg: false, ord: false, cnt: false },
                  { name: 'Content & Blog', sa: true, ad: true, mg: true, ord: false, cnt: true },
                  { name: 'Admin Accounts & Security', sa: true, ad: false, mg: false, ord: false, cnt: false },
                  { name: 'System Core & Database', sa: true, ad: false, mg: false, ord: false, cnt: false }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-800/30">
                    <td className="px-5 py-3 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-3 text-center">{row.sa ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-neutral-600">-</span>}</td>
                    <td className="px-4 py-3 text-center">{row.ad ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-neutral-600">-</span>}</td>
                    <td className="px-4 py-3 text-center">{row.mg ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-neutral-600">-</span>}</td>
                    <td className="px-4 py-3 text-center">{row.ord ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-neutral-600">-</span>}</td>
                    <td className="px-4 py-3 text-center">{row.cnt ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-neutral-600">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : subnav === 'activity_logs' ? (
        /* Audit Logs View */
        <AdminCard title="Administrative Security Audit Log" subtitle="Tamper-proof record of all admin actions, logins and modifications" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Action Description</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-5 py-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3 font-mono text-neutral-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {log.adminName || log.staffName} <span className="text-neutral-500 font-normal">({log.adminRole || log.role})</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-200">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-400 text-[11px]">
                      {log.ipAddress || log.ip}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <AdminBadge
                        variant={log.status === 'BLOCKED' || (log.severity as any) === 'critical' ? 'danger' : log.status === 'WARNING' || (log.severity as any) === 'warning' ? 'warning' : 'neutral'}
                        size="xs"
                      >
                        {log.status || (log.severity as any) || 'INFO'}
                      </AdminBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      ) : subnav === 'two_factor' ? (
        /* 2FA & Session Hardening */
        <div className="max-w-xl space-y-4">
          <AdminCard title="Two-Factor Authentication (2FA) & Session Guard" subtitle="Enforce multi-factor verification for back-office administrators">
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-neutral-900 border-neutral-700 text-[#8DA750]"
                />
                <div>
                  <span className="text-white font-semibold block">Require 2FA for Super Admin accounts</span>
                  <span className="text-neutral-400 text-[11px]">Enforce Google Authenticator / TOTP prompt at login</span>
                </div>
              </label>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Inactivity Session Timeout</label>
                <select className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]">
                  <option value="15">15 Minutes of inactivity</option>
                  <option value="30">30 Minutes of inactivity</option>
                  <option value="60" selected>1 Hour</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Restricted Admin IP Allowlist (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Enter IP addresses separated by comma (e.g. 103.14.25.10)"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <AdminButton variant="lime" size="sm">
                Save Security Policies
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      ) : (
        /* Staff Members Table */
        <AdminCard title="Authorized Staff Members" subtitle="Manage back-office administrative personnel" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5">Staff Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Account Status</th>
                  <th className="px-4 py-3.5">Last Active</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center font-bold text-[11px]">
                        {st.name.charAt(0)}
                      </div>
                      <span>{st.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400">
                      {st.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <AdminBadge
                        variant={st.role === 'SUPER_ADMIN' ? 'danger' : st.role === 'ADMIN' ? 'purple' : 'info'}
                        size="xs"
                      >
                        {st.role}
                      </AdminBadge>
                    </td>
                    <td className="px-4 py-3.5">
                      <AdminBadge
                        variant={st.status === 'active' ? 'success' : 'danger'}
                        size="xs"
                      >
                        {st.status}
                      </AdminBadge>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400 text-[11px] whitespace-nowrap">
                      {st.lastLogin}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {st.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(st.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            st.status === 'active'
                              ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                              : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                          }`}
                        >
                          {st.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* Add Staff Modal */}
      <AdminModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        title="Invite Administrative Staff"
        subtitle="Issue credentials and assign RBAC role permissions"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="lime" size="sm" onClick={handleAddStaff}>
              Send Invitation
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newStaffForm.name}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
              placeholder="e.g. Tanvir Hossain"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              value={newStaffForm.email}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
              placeholder="tanvir@choltimart.com"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Assigned Role</label>
            <select
              value={newStaffForm.role}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as AdminRole })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            >
              <option value="ADMIN">Admin (Full Store Control)</option>
              <option value="MANAGER">Manager (Catalog & Orders)</option>
              <option value="ORDER_MANAGER">Order Fulfillment Specialist</option>
              <option value="CONTENT_MANAGER">Content Editor</option>
              <option value="VIEWER">Viewer (Read-Only)</option>
            </select>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};
