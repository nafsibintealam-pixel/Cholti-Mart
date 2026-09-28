import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ExternalLink, 
  ChevronDown, 
  Plus, 
  LogOut, 
  Shield, 
  Clock, 
  UserCheck, 
  Sparkles,
  Package,
  ShoppingBag,
  Users,
  Percent,
  KeyRound,
  Monitor
} from 'lucide-react';
import { useAdminAuth, ROLE_DEFINITIONS } from '../../../context/AdminAuthContext';
import { AdminNavSection, AdminRole } from '../../../types';
import { AdminBadge } from '../common/AdminUiElements';

export interface AdminHeaderProps {
  activeSection: AdminNavSection;
  activeSubnav?: string;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onNavigate: (section: AdminNavSection, subnav?: string) => void;
  onViewStorefront: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeSection,
  activeSubnav,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  onNavigate,
  onViewStorefront
}) => {
  const { currentUser, logout, switchRole } = useAdminAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [sessionRemaining, setSessionRemaining] = useState('7h 54m');

  // Human friendly section names for breadcrumbs
  const sectionLabels: Record<AdminNavSection, string> = {
    dashboard: 'Dashboard',
    catalog: 'Catalog & Inventory',
    orders: 'Orders & Fulfillment',
    customers: 'Customers',
    delivery: 'Delivery & Logistics',
    store_design: 'Store Design & Colors',
    marketing: 'Marketing & Promotions',
    payments: 'Payments & Gateway',
    analytics: 'Analytics & Reports',
    content: 'Content & Media',
    security: 'Admin & Security',
    settings: 'Settings',
    integrations: 'Integrations & API',
    system: 'System Health & Blueprint'
  };

  const currentRoleDef = currentUser ? ROLE_DEFINITIONS[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white lg:hidden shrink-0"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400 truncate">
          <span className="text-neutral-500">Admin</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-semibold truncate">
            {sectionLabels[activeSection] || activeSection}
          </span>
          {activeSubnav && (
            <>
              <span className="text-neutral-600 hidden sm:inline">/</span>
              <span className="text-[#E4EB9C] font-mono text-[11px] capitalize hidden sm:inline truncate">
                {activeSubnav.replace(/_/g, ' ')}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Center/Right Action Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white text-xs transition-colors"
          title="Search anything (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#E4EB9C]" />
          <span className="hidden md:inline text-neutral-400">Search catalog, orders...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-400 border border-neutral-700">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Add (+) Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-[#E4EB9C] border border-[#8DA750]/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Quick Add</span>
          </button>

          {quickActionsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setQuickActionsOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-1.5 z-30 space-y-0.5 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    onNavigate('catalog', 'add_product');
                    setQuickActionsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-neutral-200 hover:bg-neutral-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('marketing', 'coupons');
                    setQuickActionsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-neutral-200 hover:bg-neutral-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>Create Promo Coupon</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('customers', 'all_customers');
                    setQuickActionsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-neutral-200 hover:bg-neutral-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Add Customer Profile</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('store_design', 'colors');
                    setQuickActionsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-neutral-200 hover:bg-neutral-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Edit Theme Palette</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* View Customer Storefront */}
        <button
          onClick={onViewStorefront}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Open customer-facing Cholti Mart shopping storefront"
        >
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden lg:inline">View Store</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          title="Admin notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E4EB9C] animate-pulse" />
        </button>

        {/* Admin Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2D5128] to-[#142C14] border border-[#8DA750]/40 text-[#E4EB9C] flex items-center justify-center font-black text-xs">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-white leading-none">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-[#E4EB9C] leading-none mt-1 font-mono">
                {currentRoleDef?.title || currentUser?.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {profileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setProfileDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-3 z-30 space-y-3 text-xs">
                
                {/* User Info & Session */}
                <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Active Admin Session
                    </span>
                    <AdminBadge variant="lime" size="xs" dot>
                      Session Token
                    </AdminBadge>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{currentUser?.name}</div>
                    <div className="text-[11px] text-neutral-400">{currentUser?.email}</div>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      Expires in:
                    </span>
                    <span className="font-mono text-emerald-400">{sessionRemaining}</span>
                  </div>
                </div>

                {/* Role Switcher (RBAC Evaluation) */}
                <div className="space-y-1 px-1">
                  <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#E4EB9C]" />
                    <span>Switch Role (RBAC Simulator)</span>
                  </label>
                  <select
                    value={currentUser?.role}
                    onChange={(e) => switchRole(e.target.value as AdminRole)}
                    className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                  >
                    {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((roleKey) => (
                      <option key={roleKey} value={roleKey}>
                        {ROLE_DEFINITIONS[roleKey].title}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-neutral-400 leading-tight pt-1">
                    {currentRoleDef?.description}
                  </p>
                </div>

                {/* Direct Action Links */}
                <div className="pt-1 border-t border-neutral-800 space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('security', 'account_settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-neutral-200 hover:bg-[#2D5128]/40 hover:text-white flex items-center gap-2 transition-colors font-semibold"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#E4EB9C]" />
                    <span>My Account &amp; Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('security', 'admin_users');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Admin Team & Roles</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('security', 'sessions');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active Sessions</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('system', 'blueprint');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E4EB9C]" />
                    <span>WP & WC Blueprint</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate Session / Sign Out</span>
                  </button>
                </div>

              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
};
