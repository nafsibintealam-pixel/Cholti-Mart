import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Truck, 
  Palette, 
  Megaphone, 
  CreditCard, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Boxes, 
  Cpu, 
  ChevronDown, 
  ChevronRight, 
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { AdminNavSection, AdminPermission } from '../../../types';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useCustomizer } from '../../../context/CustomizerContext';

export interface AdminSidebarProps {
  activeSection: AdminNavSection;
  activeSubnav?: string;
  onNavigate: (section: AdminNavSection, subnav?: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  ordersCount?: { pending: number; processing: number };
}

interface NavItemConfig {
  id: AdminNavSection;
  label: string;
  icon: React.ReactNode;
  permission?: AdminPermission;
  badge?: string | number;
  badgeColor?: string;
  subitems: { id: string; label: string }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  activeSubnav,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  ordersCount = { pending: 4, processing: 8 }
}) => {
  const { hasPermission, currentUser } = useAdminAuth();
  const { config } = useCustomizer();

  // Keep track of which accordion is expanded
  const [expandedSection, setExpandedSection] = useState<AdminNavSection | null>(activeSection);

  const NAV_ITEMS: NavItemConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      permission: 'view_dashboard',
      subitems: [
        { id: 'overview', label: 'Overview' },
        { id: 'sales_analytics', label: 'Sales Analytics' },
        { id: 'recent_orders', label: 'Recent Orders' },
        { id: 'low_stock', label: 'Low Stock' },
        { id: 'quick_actions', label: 'Quick Actions' }
      ]
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <Package className="w-4 h-4" />,
      permission: 'manage_products',
      subitems: [
        { id: 'products', label: 'Products' },
        { id: 'add_product', label: 'Add Product' },
        { id: 'categories', label: 'Categories' },
        { id: 'brands', label: 'Brands' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'attributes', label: 'Attributes' },
        { id: 'reviews', label: 'Product Reviews' },
        { id: 'coupons', label: 'Coupons' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      permission: 'manage_orders',
      badge: ordersCount.pending > 0 ? `${ordersCount.pending} new` : undefined,
      badgeColor: 'bg-[#E4EB9C] text-[#142C14]',
      subitems: [
        { id: 'all', label: 'All Orders' },
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'processing', label: 'Processing' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'returned', label: 'Returned' },
        { id: 'refunded', label: 'Refunded' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="w-4 h-4" />,
      permission: 'manage_customers',
      subitems: [
        { id: 'all_customers', label: 'All Customers' },
        { id: 'customer_profiles', label: 'Customer Profiles' },
        { id: 'guest_customers', label: 'Guest Customers' },
        { id: 'customer_groups', label: 'Customer Groups' }
      ]
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <Truck className="w-4 h-4" />,
      permission: 'manage_delivery',
      subitems: [
        { id: 'zones', label: 'Delivery Zones' },
        { id: 'charges', label: 'Delivery Charges' },
        { id: 'shipping_methods', label: 'Shipping Methods' },
        { id: 'courier_settings', label: 'Courier Settings' },
        { id: 'tracking', label: 'Tracking' },
        { id: 'cod_settings', label: 'COD Settings' }
      ]
    },
    {
      id: 'store_design',
      label: 'Store Design',
      icon: <Palette className="w-4 h-4" />,
      permission: 'manage_theme',
      badge: 'Live',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      subitems: [
        { id: 'brand_identity', label: 'Brand Identity' },
        { id: 'colors', label: 'Colors' },
        { id: 'typography', label: 'Typography' },
        { id: 'homepage', label: 'Homepage' },
        { id: 'hero_sections', label: 'Hero & Sections' },
        { id: 'banners', label: 'Banners' },
        { id: 'promos', label: 'Promos' },
        { id: 'faq', label: 'FAQ' },
        { id: 'footer', label: 'Footer' },
        { id: 'custom_pages', label: 'Custom Pages' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: <Megaphone className="w-4 h-4" />,
      permission: 'manage_marketing',
      subitems: [
        { id: 'promotions', label: 'Promotions' },
        { id: 'flash_sales', label: 'Flash Sales' },
        { id: 'coupons', label: 'Coupons' },
        { id: 'featured_products', label: 'Featured Products' },
        { id: 'recommendations', label: 'Product Recommendations' },
        { id: 'abandoned_carts', label: 'Abandoned Cart' }
      ]
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className="w-4 h-4" />,
      permission: 'manage_payments',
      subitems: [
        { id: 'cod', label: 'Cash on Delivery' },
        { id: 'online_payments', label: 'Online Payments' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'refunds', label: 'Refunds' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      permission: 'manage_analytics',
      subitems: [
        { id: 'sales', label: 'Sales' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'orders', label: 'Orders' },
        { id: 'products', label: 'Products' },
        { id: 'customers', label: 'Customers' },
        { id: 'conversion', label: 'Conversion' }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: <FileText className="w-4 h-4" />,
      permission: 'manage_content',
      subitems: [
        { id: 'pages', label: 'Pages' },
        { id: 'blog', label: 'Blog' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'media_library', label: 'Media Library' }
      ]
    },
    {
      id: 'security',
      label: 'Admin & Security',
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: 'manage_users',
      subitems: [
        { id: 'account_settings', label: 'My Account Settings' },
        { id: 'admin_users', label: 'Admin Users' },
        { id: 'roles_permissions', label: 'Roles & Permissions' },
        { id: 'sessions', label: 'Active Sessions' },
        { id: 'login_history', label: 'Login History' },
        { id: 'activity_logs', label: 'Activity Logs' },
        { id: 'security_settings', label: 'Security & 2FA' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      permission: 'manage_settings',
      subitems: [
        { id: 'general', label: 'General' },
        { id: 'store', label: 'Store' },
        { id: 'currency', label: 'Currency' },
        { id: 'tax', label: 'Tax' },
        { id: 'checkout', label: 'Checkout' },
        { id: 'email', label: 'Email' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'seo', label: 'SEO' },
        { id: 'social_media', label: 'Social Media' },
        { id: 'api_integrations', label: 'API / Integrations' }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: <Cpu className="w-4 h-4" />,
      permission: 'manage_system',
      subitems: [
        { id: 'blueprint', label: 'WP + WC Blueprint' },
        { id: 'api_status', label: 'API Status' },
        { id: 'database_status', label: 'Database Status' },
        { id: 'system_health', label: 'System Health' },
        { id: 'error_logs', label: 'Error Logs' },
        { id: 'updates', label: 'Version / Updates' }
      ]
    }
  ];

  const handleSectionClick = (sectionId: AdminNavSection, defaultSubnav?: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
    onNavigate(sectionId, defaultSubnav);
  };

  const handleSubnavClick = (sectionId: AdminNavSection, subnavId: string) => {
    onNavigate(sectionId, subnavId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0B150B] border-r border-[#1E361E] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#1E361E] flex items-center justify-between shrink-0 bg-[#0B150B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D5128] to-[#142C14] border border-[#8DA750]/50 text-[#E4EB9C] flex items-center justify-center font-black text-sm shadow-md">
              CM
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">
                {config.siteSettings.storeName}
              </span>
              <span className="text-[10px] text-[#8DA750] uppercase tracking-wider font-mono font-bold block">
                Enterprise Admin
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Item Scrollable Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
          {NAV_ITEMS.map((item) => {
            const hasAccess = !item.permission || hasPermission(item.permission);
            if (!hasAccess) {
              return null; // Enforce strict Role-Based Access Control
            }

            const isActiveSection = activeSection === item.id;
            const isExpanded = expandedSection === item.id;

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Main Nav Section Button */}
                <button
                  onClick={() => handleSectionClick(item.id, item.subitems[0]?.id)}
                  className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition-all group ${
                    isActiveSection
                      ? 'bg-[#142C14] text-[#E4EB9C] border border-[#8DA750]/30 shadow-sm'
                      : 'text-neutral-300 hover:bg-[#112411]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActiveSection ? 'text-[#E4EB9C]' : 'text-neutral-400 group-hover:text-[#8DA750]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.subitems.length > 0 && (
                      <span className="text-neutral-500 group-hover:text-neutral-300">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </button>

                {/* Sub-items accordion */}
                {isExpanded && item.subitems.length > 0 && (
                  <div className="pl-7 pr-2 py-1 space-y-0.5 border-l-2 border-[#1E361E] ml-4 my-0.5">
                    {item.subitems.map((sub) => {
                      const isSubActive = isActiveSection && activeSubnav === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubnavClick(item.id, sub.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors truncate ${
                            isSubActive
                              ? 'text-[#E4EB9C] bg-[#1E361E]/70 font-semibold'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#142C14]/40'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 border-t border-[#1E361E] bg-[#070E07] shrink-0 space-y-2">
          <div className="p-2.5 rounded-xl bg-[#0F1E0F] border border-[#1E361E] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                Backend Architecture
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WP & WC Bridge Active
              </span>
            </div>
            <button
              onClick={() => onNavigate('system', 'blueprint')}
              className="p-1.5 rounded-lg bg-[#142C14] hover:bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/30 transition-colors"
              title="View WordPress & WooCommerce Blueprint"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-neutral-400 flex items-center justify-between px-1">
            <span>Role: <strong className="text-neutral-300">{currentUser?.role}</strong></span>
            <span className="font-mono text-neutral-400">v2.4 Pro</span>
          </div>
        </div>
      </aside>
    </>
  );
};
