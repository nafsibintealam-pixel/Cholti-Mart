import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  ExternalLink, 
  LogOut, 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Tag, 
  FileText, 
  Share2, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Truck,
  Layers,
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Server,
  UserCheck
} from 'lucide-react';
import { useAdminAuth, ROLE_DEFINITIONS } from '../../context/AdminAuthContext';
import { useShop } from '../../context/ShopContext';
import { useCustomizer } from '../../context/CustomizerContext';
import { AdminRole, AdminPermission, Product, CategoryItem, Order, OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { adminUser, activeRole, logout, switchRole, hasPermission, backendConfig } = useAdminAuth();
  const { navigateTo, orders, setOrders, showToast } = useShop();
  const { 
    config, 
    updateSiteSettings, 
    updateThemeColors, 
    updateTypography, 
    toggleSectionVisibility, 
    updateHero, 
    updatePromoBanner, 
    updateSocialLinks, 
    updateFooter, 
    updateCategory, 
    updateProduct, 
    updateFaq, 
    downloadConfigJson, 
    importConfigJson, 
    resetToDefaults 
  } = useCustomizer();

  const [activeTab, setActiveTab] = useState<'overview' | 'brand' | 'colors' | 'typography' | 'homepage' | 'products' | 'categories' | 'orders' | 'content' | 'export'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const currentRoleDef = ROLE_DEFINITIONS[activeRole];

  // Role permissions check helper
  const canAccess = (requiredPermission?: AdminPermission) => {
    if (!requiredPermission) return true;
    return hasPermission(requiredPermission);
  };

  // Handle order status update
  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (!hasPermission('manage_orders')) {
      showToast('Your role does not have permission to modify order status.', 'error');
      return;
    }
    setOrders((prev: Order[]) => 
      prev.map((o: Order) => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
  };

  // Handle tracking code update
  const handleTrackingCodeChange = (orderId: string, trackingCode: string) => {
    if (!hasPermission('manage_orders')) return;
    setOrders((prev: Order[]) => 
      prev.map((o: Order) => o.id === orderId ? { ...o, courierTrackingCode: trackingCode } : o)
    );
  };

  const filteredProducts = config.products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.phone.includes(orderSearch)
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans selection:bg-[#E4EB9C] selection:text-[#142C14]">
      
      {/* 1. TOP WORDPRESS-STYLE ADMIN BAR */}
      <header className="h-12 bg-black border-b border-neutral-800 px-4 flex items-center justify-between z-30 shrink-0 select-none">
        
        {/* Left: Store link & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-xs tracking-wide text-white">
            <div className="w-5 h-5 rounded bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center text-[10px] font-black border border-[#8DA750]/40">
              W
            </div>
            <span>Cholti Mart Administration</span>
          </div>

          <span className="text-neutral-600">|</span>

          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-neutral-800"
            title="Switch to customer-facing storefront"
          >
            <Store className="w-3.5 h-3.5 text-[#8DA750]" />
            <span>Visit Live Store</span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </button>
        </div>

        {/* Right: Role Switcher & User Logout */}
        <div className="flex items-center gap-3">
          
          {/* Active Role Selector (for testing RBAC) */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-neutral-400">Current Role:</span>
            <select
              value={activeRole}
              onChange={(e) => switchRole(e.target.value as AdminRole)}
              className="px-2 py-1 text-xs rounded bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-[#8DA750]"
              title="Test interface with different WordPress user roles"
            >
              {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_DEFINITIONS[r].title}
                </option>
              ))}
            </select>
          </div>

          {/* Admin User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="w-6 h-6 rounded-full bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center text-xs font-bold">
              {adminUser?.username.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-xs font-medium text-neutral-300 hidden md:inline">
              {adminUser?.name || 'Administrator'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-red-950/60 hover:text-red-300 border border-neutral-700 hover:border-red-800 text-xs text-neutral-300 transition-colors cursor-pointer"
            title="Log out of administrator session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN ADMIN WORKSPACE: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION (WordPress / WooCommerce Structure) */}
        <aside className="w-60 sm:w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0 overflow-y-auto">
          
          <div className="p-4 border-b border-neutral-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Management System
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${currentRoleDef.badgeColor}`}>
                {currentRoleDef.title.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 truncate">
              {currentRoleDef.wpEquivalent}
            </p>
          </div>

          <nav className="p-3 space-y-6 flex-1 text-xs">
            
            {/* Group 1: General & Overview */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  activeTab === 'overview' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <Layout className="w-4 h-4 text-[#8DA750]" />
                <span>Dashboard Overview</span>
              </button>
            </div>

            {/* Group 2: WordPress Theme & Site Customizer */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                WordPress Customizer
              </div>
              
              <button
                onClick={() => setActiveTab('brand')}
                disabled={!canAccess('manage_settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'brand' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#8DA750]" />
                  <span>Brand & Identity</span>
                </span>
                {!canAccess('manage_settings') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>

              <button
                onClick={() => setActiveTab('colors')}
                disabled={!canAccess('manage_theme')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'colors' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-[#8DA750]" />
                  <span>Colors (Palette)</span>
                </span>
                {!canAccess('manage_theme') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>

              <button
                onClick={() => setActiveTab('typography')}
                disabled={!canAccess('manage_theme')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'typography' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-[#8DA750]" />
                  <span>Typography</span>
                </span>
                {!canAccess('manage_theme') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>
            </div>

            {/* Group 3: WooCommerce Store & Fulfillment */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                WooCommerce Store
              </div>

              <button
                onClick={() => setActiveTab('products')}
                disabled={!canAccess('manage_products')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'products' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#8DA750]" />
                  <span>Products & Pricing</span>
                </span>
                <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                  {config.products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                disabled={!canAccess('manage_categories')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'categories' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FolderTree className="w-4 h-4 text-[#8DA750]" />
                  <span>Categories</span>
                </span>
                <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                  {config.categories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                disabled={!canAccess('manage_orders')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'orders' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#8DA750]" />
                  <span>Orders & Delivery</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  {orders.length}
                </span>
              </button>
            </div>

            {/* Group 4: Elementor Visual Page & Content */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Elementor Page Builder
              </div>

              <button
                onClick={() => setActiveTab('homepage')}
                disabled={!canAccess('manage_content')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'homepage' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#8DA750]" />
                  <span>Hero & Sections</span>
                </span>
                {!canAccess('manage_content') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>

              <button
                onClick={() => setActiveTab('content')}
                disabled={!canAccess('manage_content')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'content' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#8DA750]" />
                  <span>Promos, FAQ & Footer</span>
                </span>
                {!canAccess('manage_content') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>
            </div>

            {/* Group 5: WP System & Export */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Tools & Migration
              </div>

              <button
                onClick={() => setActiveTab('export')}
                disabled={!canAccess('manage_export')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-40 ${
                  activeTab === 'export' 
                    ? 'bg-[#2D5128] text-white font-bold' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#8DA750]" />
                  <span>WP / WC Blueprint</span>
                </span>
                {!canAccess('manage_export') && <Lock className="w-3 h-3 text-neutral-500" />}
              </button>
            </div>

          </nav>

          {/* Backend Info Footer */}
          <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 text-[10px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-300">
              <Server className="w-3 h-3 text-[#8DA750]" />
              <span>WP REST API Integration</span>
            </div>
            <p className="truncate text-neutral-500">{backendConfig.wpApiEndpoint}</p>
          </div>

        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 bg-neutral-900 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Greeting & Active Role Badge */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#8DA750] uppercase tracking-wider block">
                      WordPress & WooCommerce Control Panel
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      Welcome back, {adminUser?.name}
                    </h1>
                    <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                      You are authenticated as <strong className="text-white">{currentRoleDef.title}</strong>. This secure control center governs brand styling, product pricing, inventory, order fulfillment, and Elementor page sections.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentRoleDef.badgeColor}`}>
                      {currentRoleDef.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Session Active &bull; Expires in 8 hrs
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-1">
                    <span className="text-xs text-neutral-400 font-medium">WooCommerce Products</span>
                    <div className="text-2xl font-black text-white">{config.products.length}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">100% In Stock</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-1">
                    <span className="text-xs text-neutral-400 font-medium">Customer Orders</span>
                    <div className="text-2xl font-black text-white">{orders.length}</div>
                    <span className="text-[10px] text-blue-400 font-semibold">Active Fulfillment</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-1">
                    <span className="text-xs text-neutral-400 font-medium">Product Categories</span>
                    <div className="text-2xl font-black text-white">{config.categories.length}</div>
                    <span className="text-[10px] text-purple-400 font-semibold">Curated Collections</span>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-1">
                    <span className="text-xs text-neutral-400 font-medium">Elementor Sections</span>
                    <div className="text-2xl font-black text-white">11</div>
                    <span className="text-[10px] text-amber-400 font-semibold">Live on Storefront</span>
                  </div>
                </div>

                {/* Role-Based Permissions Summary */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#8DA750]" />
                      <h3 className="text-sm font-bold text-white">Active Role Capabilities (RBAC)</h3>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {currentRoleDef.permissions.length} granted permissions
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {currentRoleDef.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentRoleDef.permissions.map((perm) => (
                      <span 
                        key={perm}
                        className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-[11px] font-mono text-[#E4EB9C]"
                      >
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-[#8DA750] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-white block">Manage Products</span>
                    <span className="text-xs text-neutral-400 mt-0.5 block">Update pricing, stock, badges & specs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5 text-[#8DA750] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-white block">Order Fulfillment</span>
                    <span className="text-xs text-neutral-400 mt-0.5 block">Update delivery stages & courier tracking</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('brand')}
                    className="p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <Settings className="w-5 h-5 text-[#8DA750] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-white block">Store Settings & Colors</span>
                    <span className="text-xs text-neutral-400 mt-0.5 block">Edit logo, branding, palette & fonts</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB: BRAND & IDENTITY */}
            {activeTab === 'brand' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Brand & Site Settings</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Corresponds to WordPress &rarr; Settings &rarr; General and Site Identity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Store Name</label>
                    <input
                      type="text"
                      value={config.siteSettings.storeName}
                      onChange={(e) => updateSiteSettings({ storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Tagline / Slogan</label>
                    <input
                      type="text"
                      value={config.siteSettings.tagline}
                      onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Customer Support Phone</label>
                    <input
                      type="text"
                      value={config.siteSettings.phone}
                      onChange={(e) => updateSiteSettings({ phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Official Support Email</label>
                    <input
                      type="email"
                      value={config.siteSettings.email}
                      onChange={(e) => updateSiteSettings({ email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-300">Physical Office / Warehouse Address</label>
                    <input
                      type="text"
                      value={config.siteSettings.address}
                      onChange={(e) => updateSiteSettings({ address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-300">Store Logo URL / Image Source</label>
                    <input
                      type="text"
                      value={config.siteSettings.logoImageUrl || ''}
                      onChange={(e) => updateSiteSettings({ logoImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => showToast('Brand & site settings saved successfully', 'success')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB: COLORS */}
            {activeTab === 'colors' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Color Palette & CSS Variables</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Official 5-Color Natural Green System. Changing colors injects real-time CSS custom properties.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'primary' as const, label: 'Dark Green (Base / Header)', hex: config.themeColors.primary },
                    { key: 'secondary' as const, label: 'Cal Poly Green (Primary Brand)', hex: config.themeColors.secondary },
                    { key: 'accent' as const, label: 'Fern Green (Accent / Buttons)', hex: config.themeColors.accent },
                    { key: 'softAccent' as const, label: 'Asparagus (Muted Accent / Borders)', hex: config.themeColors.softAccent },
                    { key: 'lightAccent' as const, label: 'Mindaro (Vibrant Gold-Green Highlight)', hex: config.themeColors.lightAccent },
                    { key: 'background' as const, label: 'Background Canvas', hex: config.themeColors.background }
                  ].map((colorItem) => (
                    <div key={colorItem.key} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{colorItem.label}</span>
                        <span 
                          className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: colorItem.hex }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorItem.hex}
                          onChange={(e) => updateThemeColors({ [colorItem.key]: e.target.value })}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorItem.hex}
                          onChange={(e) => updateThemeColors({ [colorItem.key]: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      updateThemeColors({
                        primary: '#142C14',
                        secondary: '#2D5128',
                        accent: '#537B2F',
                        softAccent: '#8DA750',
                        lightAccent: '#E4EB9C',
                        background: '#F7F8F3'
                      });
                      showToast('Reset to official 5-color palette', 'info');
                    }}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Official 5-Color Palette</span>
                  </button>

                  <button
                    onClick={() => showToast('Color theme saved', 'success')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply Theme
                  </button>
                </div>
              </div>
            )}

            {/* TAB: TYPOGRAPHY */}
            {activeTab === 'typography' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Typography & Border Radii</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Configure Google Fonts font-family stacks and modern corner radius.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Heading Font Family</label>
                    <select
                      value={config.typography.headingFont}
                      onChange={(e) => updateTypography({ headingFont: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    >
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Modern Clean)</option>
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Outfit', sans-serif">Outfit (Contemporary)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Editorial Luxury)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Body Font Family</label>
                    <select
                      value={config.typography.bodyFont}
                      onChange={(e) => updateTypography({ bodyFont: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    >
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'DM Sans', sans-serif">DM Sans</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Card & Modal Border Radius</label>
                    <select
                      value={config.typography.cardRadius}
                      onChange={(e) => updateTypography({ cardRadius: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    >
                      <option value="16px">16px (Refined Modern)</option>
                      <option value="12px">12px (Subtle)</option>
                      <option value="20px">20px (Soft Organics)</option>
                      <option value="8px">8px (Crisp Angular)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Button Corner Radius</label>
                    <select
                      value={config.typography.buttonRadius}
                      onChange={(e) => updateTypography({ buttonRadius: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    >
                      <option value="12px">12px (Balanced Pill)</option>
                      <option value="16px">16px (Rounded)</option>
                      <option value="9999px">9999px (Full Capsule Pill)</option>
                      <option value="8px">8px (Standard Box)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => showToast('Typography settings updated', 'success')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Typography
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS & PRICING */}
            {activeTab === 'products' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">WooCommerce Product Catalog</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Direct catalog management: edit pricing, in-stock status, promotional badges, and images.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search SKU or name..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Product Selector Dropdown */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <label className="text-xs font-bold text-neutral-300">Select Product to Edit:</label>
                  <select
                    value={selectedProductIdx}
                    onChange={(e) => setSelectedProductIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  >
                    {config.products.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        [{p.sku}] {p.name} — ৳{p.price} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Editor Form for Selected Product */}
                {config.products[selectedProductIdx] && (
                  <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-neutral-300">Product Title</label>
                        <input
                          type="text"
                          value={config.products[selectedProductIdx].name}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], name: e.target.value };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">SKU Code</label>
                        <input
                          type="text"
                          value={config.products[selectedProductIdx].sku}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], sku: e.target.value };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Regular Price (৳ BDT)</label>
                        <input
                          type="number"
                          value={config.products[selectedProductIdx].price}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], price: Number(e.target.value) };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-bold text-emerald-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Original Price (Strike-through ৳)</label>
                        <input
                          type="number"
                          value={config.products[selectedProductIdx].oldPrice || 0}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], oldPrice: Number(e.target.value) };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Stock Count</label>
                        <input
                          type="number"
                          value={config.products[selectedProductIdx].stockCount}
                          onChange={(e) => {
                            const updated = { 
                              ...config.products[selectedProductIdx], 
                              stockCount: Number(e.target.value),
                              inStock: Number(e.target.value) > 0
                            };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-neutral-300">Primary Image URL</label>
                        <input
                          type="text"
                          value={config.products[selectedProductIdx].images[0] || ''}
                          onChange={(e) => {
                            const imgs = [...config.products[selectedProductIdx].images];
                            imgs[0] = e.target.value;
                            const updated = { ...config.products[selectedProductIdx], images: imgs };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Promotional Badge</label>
                        <input
                          type="text"
                          value={config.products[selectedProductIdx].badge || ''}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], badge: e.target.value };
                            updateProduct(updated);
                          }}
                          placeholder="e.g. Best Seller or 20% OFF"
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-amber-300"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-3">
                        <label className="text-xs font-bold text-neutral-300">Short Description</label>
                        <textarea
                          rows={2}
                          value={config.products[selectedProductIdx].shortDescription}
                          onChange={(e) => {
                            const updated = { ...config.products[selectedProductIdx], shortDescription: e.target.value };
                            updateProduct(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                        />
                      </div>

                    </div>
                  </div>
                )}

                {/* Products Table */}
                <div className="overflow-x-auto rounded-2xl border border-neutral-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 font-bold border-b border-neutral-800">
                      <tr>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {filteredProducts.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-neutral-900/60 transition-colors">
                          <td className="p-3 font-mono text-neutral-400">{p.sku}</td>
                          <td className="p-3 font-bold text-white">{p.name}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3 font-bold text-emerald-400">৳{p.price}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
                              {p.stockCount} in stock
                            </span>
                          </td>
                          <td className="p-3">
                            {p.badge ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px]">
                                {p.badge}
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">WooCommerce Product Categories</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage store collections, Bangla translations, and category banners.
                  </p>
                </div>

                {/* Category Selection & Edit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-300">Select Category to Edit:</label>
                    <div className="space-y-1.5">
                      {config.categories.map((c, idx) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategoryIdx(idx)}
                          className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-colors cursor-pointer ${
                            selectedCategoryIdx === idx
                              ? 'bg-[#2D5128]/40 border-[#8DA750] text-white'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{c.name}</span>
                            <span className="text-[10px] text-neutral-400">{c.banglaName} &bull; {c.subcategories.length} subcategories</span>
                          </div>
                          <span className="text-xs text-[#8DA750]">{c.itemCount} items</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.categories[selectedCategoryIdx] && (
                    <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                      <h3 className="text-sm font-bold text-white">
                        Editing: {config.categories[selectedCategoryIdx].name}
                      </h3>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">English Name</label>
                        <input
                          type="text"
                          value={config.categories[selectedCategoryIdx].name}
                          onChange={(e) => {
                            const updated = { ...config.categories[selectedCategoryIdx], name: e.target.value };
                            updateCategory(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Bangla Name (বাংলা নাম)</label>
                        <input
                          type="text"
                          value={config.categories[selectedCategoryIdx].banglaName}
                          onChange={(e) => {
                            const updated = { ...config.categories[selectedCategoryIdx], banglaName: e.target.value };
                            updateCategory(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-300">Category Showcase Image URL</label>
                        <input
                          type="text"
                          value={config.categories[selectedCategoryIdx].image}
                          onChange={(e) => {
                            const updated = { ...config.categories[selectedCategoryIdx], image: e.target.value };
                            updateCategory(updated);
                          }}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-300"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => showToast('Category updated', 'success')}
                          className="w-full py-2 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold cursor-pointer"
                        >
                          Save Category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ORDERS & FULFILLMENT */}
            {activeTab === 'orders' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">WooCommerce Orders & Fulfillment</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Manage real-time customer orders, update delivery pipeline status, and assign Pathao/Steadfast tracking codes.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Order ID or phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                      
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-mono text-white">#{order.id}</span>
                            <span className="text-xs text-neutral-400">&bull; {order.date}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-1">
                            <strong>{order.customerName}</strong> ({order.phone}) &bull; {order.area}, {order.district}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block uppercase">Total Amount</span>
                            <span className="text-base font-black text-[#E4EB9C]">৳{order.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Ordered Items:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                              <img src={item.image} alt={item.productName} className="w-9 h-9 rounded-lg object-cover bg-neutral-800 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-white block truncate">{item.productName}</span>
                                <span className="text-neutral-400 text-[11px]">Qty: {item.quantity} &bull; ৳{item.price} each</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status & Courier Tracking Controls */}
                      <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-xs font-bold text-neutral-400 shrink-0">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-[#8DA750]"
                          >
                            <option value="Order Received">Order Received</option>
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Truck className="w-4 h-4 text-[#8DA750] shrink-0" />
                          <input
                            type="text"
                            placeholder="Courier Tracking Code..."
                            value={order.courierTrackingCode || ''}
                            onChange={(e) => handleTrackingCodeChange(order.id, e.target.value)}
                            className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white w-full sm:w-48"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: HOMEPAGE & SECTIONS (Elementor) */}
            {activeTab === 'homepage' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Elementor Homepage Builder</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Control hero copywriting, featured lifestyle visuals, and toggle section visibility.
                  </p>
                </div>

                {/* Hero Section Config */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <Sparkles className="w-4 h-4 text-[#E4EB9C]" />
                    <span>Hero Banner Content</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Main Headline</label>
                      <input
                        type="text"
                        value={config.hero.headlineMain}
                        onChange={(e) => updateHero({ headlineMain: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Accent Headline Text</label>
                      <input
                        type="text"
                        value={config.hero.headlineAccent}
                        onChange={(e) => updateHero({ headlineAccent: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-[#E4EB9C]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-300">Subheadline Description</label>
                      <textarea
                        rows={2}
                        value={config.hero.subheadline}
                        onChange={(e) => updateHero({ subheadline: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-300">Hero Lifestyle Image URL</label>
                      <input
                        type="text"
                        value={config.hero.mainImage}
                        onChange={(e) => updateHero({ mainImage: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Primary CTA Label</label>
                      <input
                        type="text"
                        value={config.hero.primaryCtaLabel}
                        onChange={(e) => updateHero({ primaryCtaLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Secondary CTA Label</label>
                      <input
                        type="text"
                        value={config.hero.secondaryCtaLabel}
                        onChange={(e) => updateHero({ secondaryCtaLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Visibility Toggles */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Homepage Sections Visibility</span>
                    <span className="text-xs text-neutral-400">11 Modular Sections</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'hero', label: '1. Hero Banner' },
                      { key: 'categories', label: '2. Shop by Category' },
                      { key: 'featuredProducts', label: '3. Handpicked Products' },
                      { key: 'offersBanner', label: '4. Campaign Deals & Coupons' },
                      { key: 'dualShowcase', label: '5. New Arrivals & Trending' },
                      { key: 'trustSection', label: '6. Trust Pillars Bar' },
                      { key: 'promoCategory', label: '7. Category Spotlight' },
                      { key: 'testimonials', label: '8. Customer Reviews' },
                      { key: 'faq', label: '9. Interactive FAQ' },
                      { key: 'newsletter', label: '10. Newsletter Signup' },
                      { key: 'ctaSection', label: '11. Final Call-to-Action' }
                    ].map((sec) => {
                      const isVisible = config.sectionsVisibility[sec.key as keyof typeof config.sectionsVisibility];
                      return (
                        <div 
                          key={sec.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800"
                        >
                          <span className="text-xs font-medium text-neutral-300">{sec.label}</span>
                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(sec.key as keyof typeof config.sectionsVisibility)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              isVisible 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            {isVisible ? 'Visible' : 'Hidden'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('Homepage structure saved', 'success')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Section Layout
                  </button>
                </div>

              </div>
            )}

            {/* TAB: CONTENT & FAQS & FOOTER */}
            {activeTab === 'content' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Promotional Banners, FAQ & Footer</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage active campaign discount codes, customer frequently asked questions, and footer copyright.
                  </p>
                </div>

                {/* Promo Campaign Banner */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Campaign Deals & Coupons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Campaign Title</label>
                      <input
                        type="text"
                        value={config.promoBanner.titleMain}
                        onChange={(e) => updatePromoBanner({ titleMain: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Title Accent</label>
                      <input
                        type="text"
                        value={config.promoBanner.titleAccent}
                        onChange={(e) => updatePromoBanner({ titleAccent: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-[#E4EB9C]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Primary Coupon Code</label>
                      <input
                        type="text"
                        value={config.promoBanner.couponCode}
                        onChange={(e) => updatePromoBanner({ couponCode: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Discount Label</label>
                      <input
                        type="text"
                        value={config.promoBanner.couponDiscount}
                        onChange={(e) => updatePromoBanner({ couponDiscount: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ List */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Frequently Asked Questions (FAQ)</h3>
                  <div className="space-y-3">
                    {config.faqs.map((faq, idx) => (
                      <div key={faq.id || idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, e.target.value, faq.answer)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-bold text-white"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, faq.question, e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer & Social Links */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Footer & Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-300">Footer Copyright Notice</label>
                      <input
                        type="text"
                        value={config.footer.copyright}
                        onChange={(e) => updateFooter({ copyright: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Facebook Page URL</label>
                      <input
                        type="text"
                        value={config.socialLinks.facebook}
                        onChange={(e) => updateSocialLinks({ facebook: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-300">Instagram URL</label>
                      <input
                        type="text"
                        value={config.socialLinks.instagram}
                        onChange={(e) => updateSocialLinks({ instagram: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('Content settings saved', 'success')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Content Settings
                  </button>
                </div>
              </div>
            )}

            {/* TAB: EXPORT & WP BLUEPRINT */}
            {activeTab === 'export' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">WordPress & WooCommerce Migration Blueprint</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Export entire site configuration, products, palettes, and section data directly for WordPress, WooCommerce, and Elementor import.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">Download Store JSON Blueprint</span>
                      <span className="text-xs text-neutral-400">Includes all 12 products, categories, palette tokens, and copy.</span>
                    </div>
                    <button
                      onClick={downloadConfigJson}
                      className="px-4 py-2 rounded-xl bg-[#2D5128] hover:bg-[#537B2F] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>

                {/* Import JSON Box */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <span className="text-sm font-bold text-white block">Restore / Import Configuration JSON</span>
                  <textarea
                    rows={4}
                    placeholder="Paste exported JSON here to restore entire store state..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono text-neutral-300"
                  />
                  <div className="flex justify-end">
                    <button
                      disabled={!importJsonText.trim()}
                      onClick={() => {
                        const ok = importConfigJson(importJsonText);
                        if (ok) {
                          showToast('Configuration successfully restored!', 'success');
                          setImportJsonText('');
                        } else {
                          showToast('Invalid JSON format.', 'error');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                    >
                      Import & Apply
                    </button>
                  </div>
                </div>

                {/* Backend Architecture & Security Notice */}
                <div className="p-5 rounded-2xl bg-[#142C14]/60 border border-[#8DA750]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E4EB9C]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Production Architecture & WordPress Implementation Notes</span>
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>WordPress Administrator:</strong> Controls core settings, brand identity, and theme options via the standard WordPress Customizer.</li>
                    <li><strong>WooCommerce:</strong> Stores all products in <code className="text-[#E4EB9C] font-mono">wp_posts</code> (type <code className="text-[#E4EB9C] font-mono">product</code>) and orders in <code className="text-[#E4EB9C] font-mono">wp_wc_orders</code> with HPOS (High-Performance Order Storage).</li>
                    <li><strong>Elementor:</strong> Imports page sections, hero layout, and promotional banners through Elementor templates.</li>
                    <li><strong>Authentication:</strong> In production, authentication is handled through WordPress REST API JWT auth tokens with secure HTTP-only cookies and nonce validation.</li>
                  </ul>
                </div>

              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};
