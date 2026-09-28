import React, { useState } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useShop } from '../../context/ShopContext';
import { useCustomizer } from '../../context/CustomizerContext';
import { AdminNavSection, AdminRole, Order, OrderStatus, DeliveryStatus, Product } from '../../types';
import { productService, orderService } from '../../services';

// Layout Components
import { AdminHeader } from './layout/AdminHeader';
import { AdminSidebar } from './layout/AdminSidebar';
import { AdminGlobalSearchModal } from './layout/AdminGlobalSearchModal';
import { AdminNotificationsModal } from './layout/AdminNotificationsModal';
import { AdminCard, AdminButton } from './common/AdminUiElements';

// View Components
import { DashboardView } from './views/DashboardView';
import { CatalogView } from './views/CatalogView';
import { OrdersView } from './views/OrdersView';
import { CustomersView } from './views/CustomersView';
import { DeliveryView } from './views/DeliveryView';
import { StoreDesignView } from './views/StoreDesignView';
import { MarketingView } from './views/MarketingView';
import { PaymentsView } from './views/PaymentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ContentView } from './views/ContentView';
import { SecurityView } from './views/SecurityView';
import { SettingsView } from './views/SettingsView';
import { IntegrationsView } from './views/IntegrationsView';
import { SystemView } from './views/SystemView';

export const AdminDashboard: React.FC = () => {
  const { hasPermission, currentUser } = useAdminAuth();
  const { navigateTo, orders, setOrders, showToast } = useShop();
  const { config, updateProduct } = useCustomizer();

  // Navigation state
  const [activeSection, setActiveSection] = useState<AdminNavSection>('dashboard');
  const [activeSubnav, setActiveSubnav] = useState<string | undefined>('overview');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected entities across views
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Synchronized catalog products via ProductService
  const [products, setProducts] = useState<Product[]>(() => {
    const serviceProds = productService.getProductsSync();
    return serviceProds.length > 0 ? serviceProds : config.products;
  });

  // Subscribe to real-time changes in the authoritative ProductService
  React.useEffect(() => {
    return productService.subscribe(() => {
      setProducts(productService.getProductsSync());
    });
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Navigation handler
  const handleNavigate = (section: AdminNavSection, subnav?: string) => {
    setActiveSection(section);
    setActiveSubnav(subnav);
    setIsMobileSidebarOpen(false);
  };

  // Orders fulfillment handlers
  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string,
    courierPartner?: string,
    deliveryStatus?: DeliveryStatus,
    note?: string
  ) => {
    const updated = await orderService.updateOrderStatus(orderId, status, {
      trackingNumber,
      courierPartner,
      deliveryStatus,
      adminNote: note,
      adminUser: currentUser?.name || 'Admin User'
    });
    setOrders(orderService.getOrdersSync());
    showToast(`Order #${orderId} status updated to ${status}`, 'success');
  };

  const handleAddAdminNote = async (orderId: string, text: string) => {
    const updated = await orderService.addAdminNote(orderId, text, currentUser?.name || 'Admin User');
    setOrders(orderService.getOrdersSync());
    showToast('Internal admin note saved', 'success');
  };

  const handleBulkUpdateOrderStatus = async (orderIds: string[], status: OrderStatus) => {
    await orderService.bulkUpdateStatus(orderIds, status);
    setOrders(orderService.getOrdersSync());
    showToast(`Updated ${orderIds.length} orders to ${status}`, 'success');
  };

  const handleBulkAssignCourier = async (orderIds: string[], courier: string) => {
    await orderService.bulkAssignCourier(orderIds, courier);
    setOrders(orderService.getOrdersSync());
    showToast(`Assigned ${courier} to ${orderIds.length} orders`, 'success');
  };

  const handleBulkDeleteOrders = async (orderIds: string[]) => {
    await orderService.bulkDelete(orderIds);
    setOrders(orderService.getOrdersSync());
    showToast(`Deleted ${orderIds.length} orders from archive`, 'info');
  };

  // Product catalog handlers backed by ProductService
  const handleUpdateProduct = async (updated: Product) => {
    await productService.updateProduct(updated);
    updateProduct(updated);
    showToast(`Product "${updated.name}" updated successfully`, 'success');
  };

  const handleAddProduct = async (newProdData: Omit<Product, 'id'>) => {
    const created = await productService.createProduct(newProdData);
    showToast(`New product "${created.name}" added to catalog`, 'success');
  };

  const handleDeleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    showToast('Product removed from catalog', 'info');
  };

  // Helper to verify section permissions
  const checkSectionPermission = (sec: AdminNavSection): boolean => {
    switch (sec) {
      case 'dashboard':
        return true;
      case 'catalog':
        return hasPermission('manage_products');
      case 'orders':
        return hasPermission('manage_orders');
      case 'customers':
        return hasPermission('manage_customers');
      case 'delivery':
        return hasPermission('manage_orders') || hasPermission('manage_settings');
      case 'store_design':
        return hasPermission('manage_theme');
      case 'marketing':
        return hasPermission('manage_marketing');
      case 'payments':
        return hasPermission('manage_payments');
      case 'analytics':
        return hasPermission('manage_analytics');
      case 'content':
        return hasPermission('manage_content');
      case 'security':
        return hasPermission('manage_users');
      case 'settings':
        return hasPermission('manage_settings');
      case 'integrations':
        return hasPermission('manage_integrations');
      case 'system':
        return hasPermission('manage_system');
      default:
        return true;
    }
  };

  const hasAccess = checkSectionPermission(activeSection);

  // Orders count metrics for sidebar badges
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-[#0E1B0E] text-neutral-100 flex flex-col font-sans selection:bg-[#E4EB9C] selection:text-[#142C14]">
      
      {/* 1. Global Admin Top Header */}
      <AdminHeader
        activeSection={activeSection}
        activeSubnav={activeSubnav}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigate={handleNavigate}
        onViewStorefront={() => navigateTo('home')}
      />

      {/* 2. Main Admin Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <AdminSidebar
          activeSection={activeSection}
          activeSubnav={activeSubnav}
          onNavigate={handleNavigate}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          ordersCount={{
            pending: pendingOrdersCount,
            processing: processingOrdersCount
          }}
        />

        {/* Right Main Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0E1B0E]">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Permission Guard */}
            {!hasAccess ? (
              <AdminCard>
                <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Access Restricted</h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Your current administrative role (<strong>{currentUser?.role}</strong>) does not have sufficient RBAC permissions to access this management module.
                    </p>
                  </div>
                  <div className="pt-2">
                    <AdminButton
                      variant="primary"
                      size="sm"
                      icon={<ArrowLeft className="w-4 h-4" />}
                      onClick={() => handleNavigate('dashboard')}
                    >
                      Return to Dashboard
                    </AdminButton>
                  </div>
                </div>
              </AdminCard>
            ) : (
              /* Active View Render */
              <>
                {activeSection === 'dashboard' && (
                  <DashboardView
                    subnav={activeSubnav || 'overview'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                    products={products}
                    orders={orders}
                    onNavigate={handleNavigate}
                    onSelectOrder={(id) => {
                      setSelectedOrderId(id);
                      handleNavigate('orders', 'all');
                    }}
                    onSelectProduct={() => handleNavigate('catalog', 'products')}
                  />
                )}

                {activeSection === 'catalog' && (
                  <CatalogView
                    products={products}
                    categories={categories}
                    subnav={activeSubnav || 'products'}
                    onUpdateProduct={handleUpdateProduct}
                    onAddProduct={handleAddProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'orders' && (
                  <OrdersView
                    orders={orders}
                    subnav={activeSubnav || 'all'}
                    selectedOrderId={selectedOrderId}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAddAdminNote={handleAddAdminNote}
                    onBulkUpdateOrderStatus={handleBulkUpdateOrderStatus}
                    onBulkAssignCourier={handleBulkAssignCourier}
                    onBulkDeleteOrders={handleBulkDeleteOrders}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'customers' && (
                  <CustomersView
                    subnav={activeSubnav || 'all_customers'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'delivery' && (
                  <DeliveryView
                    subnav={activeSubnav || 'zones'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'store_design' && (
                  <StoreDesignView
                    subnav={activeSubnav || 'colors'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                    onViewStorefront={() => navigateTo('home')}
                  />
                )}

                {activeSection === 'marketing' && (
                  <MarketingView
                    subnav={activeSubnav || 'coupons'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'payments' && (
                  <PaymentsView
                    subnav={activeSubnav || 'methods'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'analytics' && (
                  <AnalyticsView
                    subnav={activeSubnav || 'sales_report'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'content' && (
                  <ContentView
                    subnav={activeSubnav || 'blog_posts'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'security' && (
                  <SecurityView
                    subnav={activeSubnav || 'account_settings'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'settings' && (
                  <SettingsView
                    subnav={activeSubnav || 'general'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'integrations' && (
                  <IntegrationsView
                    subnav={activeSubnav || 'all'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}

                {activeSection === 'system' && (
                  <SystemView
                    subnav={activeSubnav || 'health'}
                    onNavigateSubnav={(sub) => setActiveSubnav(sub)}
                  />
                )}
              </>
            )}

          </div>
        </main>
      </div>

      {/* Global Search Modal (Command+K) */}
      <AdminGlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        orders={orders}
        onNavigate={handleNavigate}
        onSelectOrder={(id) => {
          setSelectedOrderId(id);
          handleNavigate('orders', 'all');
        }}
        onSelectProduct={() => handleNavigate('catalog', 'products')}
      />

      {/* Global Notifications Drawer */}
      <AdminNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
};
