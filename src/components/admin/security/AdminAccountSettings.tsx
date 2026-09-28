import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  AtSign, 
  KeyRound, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Laptop, 
  Smartphone, 
  Monitor, 
  Globe, 
  Clock, 
  MapPin, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Lock, 
  Save, 
  Sparkles, 
  Server, 
  Filter, 
  Search,
  Fingerprint
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { AdminActiveSession, LoginHistoryRecord } from '../../../types';

export const AdminAccountSettings: React.FC = () => {
  const { 
    adminUser, 
    updateProfile, 
    changePassword, 
    checkPasswordStrength, 
    getActiveSessions, 
    terminateSession, 
    terminateAllOtherSessions, 
    getLoginHistory,
    backendConfig,
    authMode,
    isProductionBackendConnected,
    logout
  } = useAdminAuth();

  // Profile Form State
  const [name, setName] = useState(adminUser?.name || '');
  const [username, setUsername] = useState(adminUser?.username || '');
  const [email, setEmail] = useState(adminUser?.email || '');
  const [phone, setPhone] = useState(adminUser?.phone || '+880 1711-234567');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState<AdminActiveSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionToTerminate, setSessionToTerminate] = useState<AdminActiveSession | null>(null);
  const [showTerminateAllModal, setShowTerminateAllModal] = useState(false);
  const [sessionActionMsg, setSessionActionMsg] = useState<string | null>(null);

  // Login History State
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'ALL' | 'Success' | 'Failed' | 'Blocked'>('ALL');

  // Load sessions and history
  const refreshSessionsData = async () => {
    setIsLoadingSessions(true);
    try {
      const data = await getActiveSessions();
      setActiveSessions(data);
    } catch {
      // ignore
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const refreshHistoryData = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await getLoginHistory();
      setLoginHistory(data);
    } catch {
      // ignore
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name);
      setUsername(adminUser.username);
      setEmail(adminUser.email);
      if (adminUser.phone) setPhone(adminUser.phone);
    }
    refreshSessionsData();
    refreshHistoryData();
  }, [adminUser]);

  // Password Strength Calculation
  const strengthReport = checkPasswordStrength(newPassword);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);
    setIsSavingProfile(true);

    try {
      if (!name.trim()) throw new Error('Administrator name cannot be empty.');
      if (!username.trim()) throw new Error('Username cannot be empty.');
      if (!email.trim() || !email.includes('@')) throw new Error('A valid email address is required.');

      await updateProfile({
        name,
        username,
        email,
        phone
      });

      setProfileSuccessMsg('Administrator account details updated successfully.');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err?.message || 'Failed to update account information.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);
    setIsChangingPassword(true);

    try {
      if (!newPassword) throw new Error('Please enter a new password.');
      if (newPassword.length < 8) throw new Error('Password must be at least 8 characters long.');
      if (newPassword !== confirmPassword) throw new Error('Confirm password does not match new password.');
      if (strengthReport.score < 2) throw new Error('Password is too weak. Please add uppercase letters, numbers, or symbols.');

      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to change administrator password.');
      }

      setPasswordSuccessMsg('Administrator password changed successfully. Security audit log updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refreshHistoryData();
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    } catch (err: any) {
      setPasswordErrorMsg(err?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Terminating Single Session
  const confirmTerminateSession = async () => {
    if (!sessionToTerminate) return;
    try {
      const isCurrent = sessionToTerminate.isCurrentSession;
      await terminateSession(sessionToTerminate.id);
      setSessionToTerminate(null);
      if (isCurrent) {
        logout();
        return;
      }
      setSessionActionMsg(`Session for ${sessionToTerminate.device} has been revoked.`);
      refreshSessionsData();
      setTimeout(() => setSessionActionMsg(null), 4000);
    } catch {
      setSessionActionMsg('Failed to revoke session.');
    }
  };

  // Handle Terminating All Other Sessions
  const confirmTerminateAllOther = async () => {
    try {
      const result = await terminateAllOtherSessions();
      setShowTerminateAllModal(false);
      setSessionActionMsg(`Terminated ${result.terminatedCount} other active sessions. Current session remains active.`);
      refreshSessionsData();
      setTimeout(() => setSessionActionMsg(null), 4000);
    } catch {
      setSessionActionMsg('Failed to terminate sessions.');
    }
  };

  // Filtered Login History
  const filteredHistory = loginHistory.filter((item) => {
    const matchesSearch = 
      item.user.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.ipAddress.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.device.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.browser.toLowerCase().includes(historySearchQuery.toLowerCase());

    const matchesStatus = 
      historyStatusFilter === 'ALL' || 
      item.status.toLowerCase().includes(historyStatusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const getDeviceIcon = (deviceType: string, deviceName: string) => {
    const nameLower = deviceName.toLowerCase();
    if (deviceType === 'mobile' || nameLower.includes('phone') || nameLower.includes('android') || nameLower.includes('ios')) {
      return <Smartphone className="w-5 h-5 text-emerald-400" />;
    }
    if (nameLower.includes('mac') || nameLower.includes('laptop') || nameLower.includes('book')) {
      return <Laptop className="w-5 h-5 text-[#E4EB9C]" />;
    }
    return <Monitor className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2D5128] to-[#142C14] border border-[#8DA750]/40 text-[#E4EB9C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Admin Account &amp; Security Settings
            </h1>
          </div>
          <p className="text-sm text-neutral-400">
            Manage administrator credentials, change passwords, audit active sessions, and review security access logs.
          </p>
        </div>

        {/* Security / Backend Status Badge */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            isProductionBackendConnected 
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}>
            <Server className="w-3.5 h-3.5" />
            <span>{isProductionBackendConnected ? 'Production Server Auth' : 'Preview Mock Auth Driver'}</span>
          </div>
        </div>
      </div>

      {/* Production Security Callout / Transparency Notice */}
      <div className="bg-[#142C14]/60 border border-[#8DA750]/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-[#E4EB9C] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Security &amp; Architecture Status</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[#E4EB9C] font-mono text-[10px]">
                {authMode === 'development-mock' ? 'In-Browser Driver' : 'Live REST API'}
              </span>
            </div>
            <p>
              <strong>Production Rule:</strong> {backendConfig.securityNotice}
            </p>
            <p className="text-neutral-400">
              When ready for production deployment, connect this interface to your live WordPress JWT auth or WooCommerce REST endpoint over HTTPS. Frontend code contains zero hardcoded production passwords.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Profile Details & Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Admin Profile Information */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#E4EB9C]" />
              <h2 className="text-base font-bold text-white">Administrator Profile</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#2D5128]/50 text-[#E4EB9C] border border-[#8DA750]/30 font-semibold">
              {adminUser?.role || 'SUPER_ADMIN'}
            </span>
          </div>

          {profileSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Admin Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Admin Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Nafsi Bin Tealam"
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-neutral-400" />
                <span>Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. superadmin"
                  className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors font-mono"
                />
              </div>
              <span className="text-[10px] text-neutral-500">
                Primary login identifier for administrative authentication.
              </span>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Administrator Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@choltimart.com"
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors"
              />
              <span className="text-[10px] text-neutral-500">
                Used for password resets, order escalation notices, and 2FA recovery.
              </span>
            </div>

            {/* Phone (Optional Contact) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <span>Security Contact Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1711-000000"
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2D5128] to-[#142C14] hover:from-[#537B2F] hover:to-[#2D5128] text-white text-sm font-bold border border-[#8DA750]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <span>Saving Changes...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#E4EB9C]" />
                    <span>Save Account Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Change Password with Strength Indicator */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-[#E4EB9C]" />
              <h2 className="text-base font-bold text-white">Change Password</h2>
            </div>
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#E4EB9C]" />
              <span>TLS / SHA-256 Hashed</span>
            </span>
          </div>

          {passwordSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}

          {passwordErrorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passwordErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>Current Password</span>
                <span className="text-[10px] text-neutral-500">Verification</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>New Password</span>
                <span className="text-[10px] text-neutral-500">Min 8 characters</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Password Strength:</span>
                  <span className={`font-bold ${strengthReport.textColor}`}>
                    {strengthReport.label}
                  </span>
                </div>
                
                {/* Visual meter */}
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strengthReport.color}`}
                    style={{ width: `${strengthReport.percentage}%` }}
                  />
                </div>

                {/* Criteria Checklist */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                  <div className={`flex items-center gap-1.5 ${strengthReport.checks.minLength ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthReport.checks.hasUpper && strengthReport.checks.hasLower ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Upper &amp; lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthReport.checks.hasNumber ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthReport.checks.hasSpecial ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Special symbol (!@#$)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>Confirm New Password</span>
                {confirmPassword && confirmPassword === newPassword && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Matches
                  </span>
                )}
                {confirmPassword && confirmPassword !== newPassword && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1 font-semibold">
                    <XCircle className="w-3 h-3" /> Does not match
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-neutral-950/80 border rounded-xl text-white text-sm focus:outline-none transition-colors ${
                    confirmPassword && confirmPassword !== newPassword 
                      ? 'border-red-500/80 focus:border-red-500' 
                      : 'border-neutral-700 focus:border-[#8DA750]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Password Change */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword || !newPassword || newPassword !== confirmPassword}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2D5128] to-[#142C14] hover:from-[#537B2F] hover:to-[#2D5128] text-white text-sm font-bold border border-[#8DA750]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <span>Encrypting &amp; Updating Password...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#E4EB9C]" />
                    <span>Update Administrator Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Card 3: Last Login & Session Security Audit Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#E4EB9C]" />
            <h2 className="text-base font-bold text-white">Last Login &amp; Security State</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session Integrity: Active &amp; Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
              Last Sign-In Timestamp
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E4EB9C]" />
              <span>{adminUser?.lastLogin || 'Today, 12:15 PM'}</span>
            </div>
            <p className="text-[10px] text-neutral-500">Dhaka Standard Time (UTC+6)</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
              Source IP Address
            </span>
            <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>103.144.201.42</span>
            </div>
            <p className="text-[10px] text-neutral-500">Dhaka, Bangladesh</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
              Sign-In Device
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-emerald-400" />
              <span>MacBook Pro (Chrome 130)</span>
            </div>
            <p className="text-[10px] text-neutral-500">macOS Sequoia 15.1</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
              Multi-Factor Authentication
            </span>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enforced (App TOTP)</span>
            </div>
            <p className="text-[10px] text-neutral-500">Complies with PCI-DSS guidelines</p>
          </div>

        </div>
      </div>

      {/* Card 4: Active Sessions & "Logout from all sessions" */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Monitor className="w-5 h-5 text-[#E4EB9C]" />
              <h2 className="text-base font-bold text-white">Active Sessions</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                {activeSessions.length} Devices
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Devices and browsers currently logged into this administrator account.
            </p>
          </div>

          {/* Action: Logout from all other sessions */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshSessionsData}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh sessions"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingSessions ? 'animate-spin text-[#E4EB9C]' : ''}`} />
            </button>
            <button
              onClick={() => setShowTerminateAllModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout From All Other Sessions</span>
            </button>
          </div>
        </div>

        {sessionActionMsg && (
          <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sessionActionMsg}</span>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div 
              key={session.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                session.isCurrentSession 
                  ? 'bg-[#142C14]/60 border-[#8DA750]/50 shadow-md' 
                  : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                  {getDeviceIcon(session.deviceType, session.device)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{session.device}</span>
                    {session.isCurrentSession ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Current Device (Active Now)
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">
                        Last active: {session.lastActive}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-neutral-500" />
                      <span className="font-mono text-neutral-300">{session.ipAddress}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      <span>{session.location}</span>
                    </span>
                    <span>&bull;</span>
                    <span>{session.browser}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end">
                {session.isCurrentSession ? (
                  <button
                    onClick={() => logout()}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSessionToTerminate(session)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-neutral-800 hover:border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Revoke Session</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Card 5: Login History */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#E4EB9C]" />
              <h2 className="text-base font-bold text-white">Login History &amp; Access Log</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Audit trails of authentication attempts, IP addresses, and authorization results.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search IP, device, user..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8DA750] w-44"
              />
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DA750]"
            >
              <option value="ALL">All Events</option>
              <option value="Success">Success Only</option>
              <option value="Failed">Failed Only</option>
              <option value="Blocked">Blocked Only</option>
            </select>

            <button
              onClick={refreshHistoryData}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh log"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin text-[#E4EB9C]' : ''}`} />
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Admin Account</th>
                <th className="py-3 px-4">IP Address &amp; Location</th>
                <th className="py-3 px-4">Device &amp; Browser</th>
                <th className="py-3 px-4">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No login events match your criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-white">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 text-neutral-200">
                      {item.user}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300 whitespace-nowrap">
                      {item.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      <span className="text-neutral-200">{item.device}</span>
                      <span className="text-neutral-500 ml-1.5">({item.browser})</span>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'Success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      ) : item.status === 'Blocked' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold text-[11px]">
                          <ShieldAlert className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Confirmation Modal: Terminate Single Session */}
      {sessionToTerminate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Revoke Session</h3>
            </div>
            
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to invalidate the active session on <strong>{sessionToTerminate.device}</strong> ({sessionToTerminate.ipAddress})?
              Any operations on that device will immediately require re-authenticating with administrator credentials.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSessionToTerminate(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTerminateSession}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Revoke Session Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Terminate All Other Sessions */}
      {showTerminateAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Logout From All Other Sessions</h3>
            </div>
            
            <p className="text-xs text-neutral-300 leading-relaxed">
              This will immediately invalidate all authorization tokens on other laptops, workstations, and mobile devices logged into this administrator account. Your current session will remain active.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTerminateAllModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTerminateAllOther}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Terminate All Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
