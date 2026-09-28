import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Truck, 
  Eye, 
  Plus, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react';
import { Product, Order, AdminNavSection } from '../../../types';
import { AdminCard, AdminBadge, AdminButton } from '../common/AdminUiElements';
import { inventoryService, orderService, adminUserService, analyticsService } from '../../../services';

export interface DashboardViewProps {
  subnav?: string;
  onNavigateSubnav?: (sub: string) => void;
  products: Product[];
  orders: Order[];
  onNavigate: (section: AdminNavSection, subnav?: string) => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subnav = 'overview',
  onNavigateSubnav,
  products,
  orders,
  onNavigate,
  onSelectOrder,
  onSelectProduct
}) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const activityLogs = adminUserService.getActivityLogsSync().slice(0, 5);
  const analytics = analyticsService.getAnalyticsOverview();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRestock = async (productId: string) => {
    await inventoryService.updateStock(productId, {
      quantityChange: 50,
      reason: 'restock',
      notes: 'Quick restock from Low Stock Dashboard'
    });
    showToast('Restocked +50 units to inventory!');
  };

  const handleBatchDispatch = async () => {
    const processing = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed' || o.status === 'Pending');
    if (processing.length === 0) {
      showToast('No pending orders ready for dispatch.');
      return;
    }
    await orderService.bulkUpdateStatus(processing.map(o => o.id), 'Shipped');
    showToast(`Successfully dispatched ${processing.length} orders to courier partners!`);
  };

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.phone || '',
      o.total,
      o.paymentMethod,
      o.status,
      o.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cholti_mart_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV!');
  };

  // Low stock products threshold (e.g., stock <= 10)
  const lowStockProducts = products.filter(p => ((p as any).stock ?? (p.inStock ? 15 : 0)) <= 10).slice(0, 5);

  // Compute metrics from actual orders state
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const confirmedOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

  const recentOrders = orders.slice(0, 5);

  // Top selling products by popularity/sales
  const topProducts = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5);

  // Bar chart simulated data points based on date range
  const chartPoints = dateRange === '7d' 
    ? [
        { label: 'Sat', amount: 32000, height: '55%' },
        { label: 'Sun', amount: 48250, height: '85%' },
        { label: 'Mon', amount: 38900, height: '65%' },
        { label: 'Tue', amount: 41200, height: '70%' },
        { label: 'Wed', amount: 54100, height: '95%' },
        { label: 'Thu', amount: 49000, height: '82%' },
        { label: 'Fri', amount: 58000, height: '100%' }
      ]
    : [
        { label: 'Week 1', amount: 285000, height: '60%' },
        { label: 'Week 2', amount: 342000, height: '75%' },
        { label: 'Week 3', amount: 395000, height: '88%' },
        { label: 'Week 4', amount: 406500, height: '100%' }
      ];

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'sales_analytics', label: 'Sales Analytics' },
          { id: 'recent_orders', label: `Recent Orders (${orders.length})` },
          { id: 'low_stock', label: `Low Stock (${lowStockProducts.length})` },
          { id: 'quick_actions', label: 'Quick Actions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigateSubnav ? onNavigateSubnav(tab.id) : onNavigate('dashboard', tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              subnav === tab.id
                ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SUBVIEW 2: SALES ANALYTICS */}
      {subnav === 'sales_analytics' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Sales & Revenue Analytics</h3>
              <p className="text-xs text-neutral-400">Deep telemetry on revenue trajectories, basket sizes, and conversions</p>
            </div>
            <div className="p-1 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-1 text-xs">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-lg ${dateRange === r ? 'bg-[#2D5128] text-[#E4EB9C] font-bold' : 'text-neutral-400'}`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-xs">Gross Revenue</span>
              <div className="text-xl font-bold text-white">৳1,428,500</div>
              <span className="text-[11px] text-emerald-400 font-medium">+18.4% vs last period</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-xs">Average Order Value (AOV)</span>
              <div className="text-xl font-bold text-white">৳1,840</div>
              <span className="text-[11px] text-emerald-400 font-medium">+4.2% basket size</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 text-xs">Repeat Purchase Rate</span>
              <div className="text-xl font-bold text-white">34.8%</div>
              <span className="text-[11px] text-[#E4EB9C] font-medium">High loyalty</span>
            </div>
          </div>

          <AdminCard title="Revenue Growth Trajectory" subtitle="Revenue curve across active fiscal timeline">
            <div className="h-56 flex items-end justify-between gap-4 pt-6 px-4">
              {chartPoints.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    ৳{(pt.amount / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{ height: pt.height }}
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#142C14] to-[#8DA750] group-hover:to-[#E4EB9C] transition-all"
                  />
                  <span className="text-xs text-neutral-400 font-medium">{pt.label}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {/* SUBVIEW 3: RECENT ORDERS */}
      {subnav === 'recent_orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
              <p className="text-xs text-neutral-400">Full review of all incoming checkout orders and line items</p>
            </div>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
            >
              Export CSV
            </AdminButton>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-neutral-900 border border-neutral-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800 text-[10px]">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#E4EB9C]">{ord.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{ord.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white">৳{ord.total.toLocaleString()}</td>
                    <td className="px-4 py-3">{ord.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <AdminBadge variant={ord.status === 'Delivered' ? 'success' : ord.status === 'Processing' ? 'info' : 'warning'} size="xs">
                        {ord.status}
                      </AdminBadge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminButton
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          if (onSelectOrder) onSelectOrder(ord.id);
                          onNavigate('orders', 'all');
                        }}
                      >
                        Details
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: LOW STOCK WARNINGS */}
      {subnav === 'low_stock' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Low Inventory Warning Console</h3>
              <p className="text-xs text-neutral-400">Products nearing or below the restock threshold (&le; 15 units)</p>
            </div>
            <AdminBadge variant="danger" size="sm">
              {products.filter(p => ((p as any).stock ?? 10) <= 15).length} Items Need Restock
            </AdminBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.filter(p => ((p as any).stock ?? 10) <= 20).map((prod) => {
              const currentStock = (prod as any).stock ?? (prod.inStock ? 12 : 2);
              return (
                <div key={prod.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={prod.images?.[0]} 
                      alt={prod.name} 
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                      <span className="text-[11px] font-mono text-neutral-400 block">SKU: {prod.sku} &bull; ৳{prod.price}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold font-mono ${currentStock <= 5 ? 'text-red-400' : 'text-amber-400'}`}>
                          {currentStock} units left
                        </span>
                        <span className="text-[10px] text-neutral-500">(Min: 15)</span>
                      </div>
                    </div>
                  </div>

                  <AdminButton
                    variant="primary"
                    size="xs"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => handleRestock(prod.id)}
                  >
                    Restock +50
                  </AdminButton>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBVIEW 5: QUICK ACTIONS */}
      {subnav === 'quick_actions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Operations Command Center</h3>
            <p className="text-xs text-neutral-400">One-click administrative tasks, batch dispatches, and emergency maintenance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="p-3 rounded-xl bg-[#2D5128] text-[#E4EB9C] w-fit">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Publish New Product</h4>
              <p className="text-xs text-neutral-400">Create a new SKU with price, images, variations and inventory.</p>
              <AdminButton
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('catalog', 'add_product')}
              >
                Open Product Form
              </AdminButton>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Batch Courier Dispatch</h4>
              <p className="text-xs text-neutral-400">Mark all processing orders as Shipped and sync with Steadfast / Pathao.</p>
              <AdminButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleBatchDispatch}
              >
                Dispatch All Pending
              </AdminButton>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Export Orders CSV</h4>
              <p className="text-xs text-neutral-400">Download formatted sales and fulfillment records for accountant audit.</p>
              <AdminButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleExportCsv}
              >
                Export Order Ledger
              </AdminButton>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Send VIP SMS Promo</h4>
              <p className="text-xs text-neutral-400">Simulate broadcasting an SMS discount voucher code to 1,200 VIP customers.</p>
              <AdminButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => showToast('Dispatched SMS campaign to 1,200 VIP customers via Greenweb gateway!')}
              >
                Broadcast SMS Blast
              </AdminButton>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Clear Storefront Cache</h4>
              <p className="text-xs text-neutral-400">Flush browser session caches and reload static category taxonomies.</p>
              <AdminButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  sessionStorage.clear();
                  showToast('Static cache and session storage successfully flushed!');
                }}
              >
                Flush App Cache
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 1: OVERVIEW (DEFAULT) */}
      {subnav === 'overview' && (
        <>
          {/* Top Banner: Welcome & Quick Date Range Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#142C14] via-[#0E200E] to-neutral-900 border border-[#8DA750]/30 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-[#E4EB9C] uppercase tracking-wider font-mono">
                  Live Store Performance &bull; Cholti Mart Bangladesh
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Commerce Operations Hub
              </h2>
              <p className="text-xs text-neutral-300">
                Real-time fulfillment, revenue telemetry, and inventory alerts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Date Range Selector */}
              <div className="p-1 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-1 text-xs">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      dateRange === range
                        ? 'bg-[#2D5128] text-[#E4EB9C] shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'This Quarter'}
                  </button>
                ))}
              </div>

              <AdminButton
                variant="lime"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => onNavigate('catalog', 'add_product')}
              >
                Add Product
              </AdminButton>
            </div>
          </div>

      {/* Metric Cards Grid (8 Key Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Monthly Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Monthly Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            ৳{analytics.monthlyRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* 2. Today's Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Today&apos;s Revenue</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            ৳{analytics.dailyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400">
            Avg. Order Value: <strong className="text-white">৳{analytics.averageOrderValue}</strong>
          </div>
        </div>

        {/* 3. Total Orders & Pipeline */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Total Orders</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {orders.length}
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-amber-400 font-medium">{pendingOrders.length} pending</span>
            <span className="text-neutral-500">&bull;</span>
            <span className="text-blue-400 font-medium">{confirmedOrders.length} processing</span>
          </div>
        </div>

        {/* 4. Delivered Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Delivered Orders</span>
            <div className="p-2 rounded-xl bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {deliveredOrders.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            98.2% on-time delivery rate
          </div>
        </div>

        {/* 5. Pending Orders Urgent */}
        <div 
          onClick={() => onNavigate('orders', 'pending')}
          className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 shadow-md space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span className="font-semibold">Pending Confirmation</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-amber-400/80">
            Awaiting phone confirmation or dispatch &rarr;
          </div>
        </div>

        {/* 6. Cancelled Orders */}
        <div 
          onClick={() => onNavigate('orders', 'cancelled')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800 shadow-md space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Cancelled Orders</span>
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {cancelledOrders.length}
          </div>
          <div className="text-[11px] text-neutral-400">
            Low 1.8% return/cancel rate
          </div>
        </div>

        {/* 7. New Customers */}
        <div 
          onClick={() => onNavigate('customers', 'all_customers')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800 shadow-md space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Total Customers</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            412
          </div>
          <div className="text-[11px] text-teal-400 font-medium">
            +89 new shoppers this month
          </div>
        </div>

        {/* 8. Low Stock Items */}
        <div 
          onClick={() => onNavigate('catalog', 'inventory')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800 shadow-md space-y-2 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold text-neutral-300">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-amber-400">
            Items require warehouse restock
          </div>
        </div>

      </div>

      {/* Middle Grid: Revenue Trend Visualizer & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Revenue Chart & Highlights */}
        <div className="lg:col-span-2">
          <AdminCard
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Revenue Performance ({dateRange === '7d' ? 'Past 7 Days' : 'Past 30 Days'})</span>
              </div>
            }
            subtitle="Gross sales trajectory across Dhaka & outside divisions"
            action={
              <AdminButton
                variant="outline"
                size="xs"
                onClick={() => onNavigate('analytics', 'sales_reports')}
              >
                Detailed Analytics
              </AdminButton>
            }
          >
            <div className="space-y-6">
              
              {/* Bar graph visualizer */}
              <div className="h-48 pt-6 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-neutral-800 pb-2">
                {chartPoints.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ৳{(pt.amount / 1000).toFixed(0)}k
                    </div>
                    <div className="w-full max-w-[38px] bg-neutral-800/80 rounded-t-lg relative flex items-end h-32 overflow-hidden">
                      <div 
                        className="w-full bg-gradient-to-t from-[#2D5128] to-[#8DA750] rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                        style={{ height: pt.height }}
                      />
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium truncate">
                      {pt.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Regional Summary breakdown pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {analytics.regionalBreakdown.slice(0, 4).map((region, i) => (
                  <div key={i} className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-400 font-medium block truncate">{region.region}</span>
                    <span className="text-sm font-bold text-white font-mono block">৳{region.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{region.share} volume</span>
                  </div>
                ))}
              </div>

            </div>
          </AdminCard>
        </div>

        {/* Right 1 Col: Low Stock Alerts Widget */}
        <div>
          <AdminCard
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low Stock Watchlist</span>
              </div>
            }
            subtitle="Immediate restock required"
            action={
              <button 
                onClick={() => onNavigate('catalog', 'inventory')}
                className="text-xs text-[#E4EB9C] hover:underline"
              >
                Manage All
              </button>
            }
          >
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                All catalog inventory is adequately stocked.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 group hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0" 
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-[#E4EB9C]">
                          {prod.name}
                        </h5>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          SKU: {prod.sku} &bull; ৳{prod.price}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <AdminBadge variant={(((prod as any).stock ?? (prod.inStock ? 15 : 0)) <= 5) ? 'danger' : 'warning'} size="xs">
                        {(prod as any).stock ?? (prod.inStock ? 15 : 0)} left
                      </AdminBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

      </div>

      {/* Bottom Grid: Recent Orders & Recent Admin Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Recent Orders Pipeline"
            subtitle="Latest eCommerce orders across bKash, Nagad, and Cash on Delivery"
            action={
              <AdminButton
                variant="outline"
                size="xs"
                onClick={() => onNavigate('orders', 'all')}
              >
                View All Orders &rarr;
              </AdminButton>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 text-[10px] uppercase font-bold tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 text-neutral-300 font-medium">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-white font-bold">
                        #{ord.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[10px] text-neutral-400">{ord.phone}</div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400 truncate max-w-[130px]">
                        {ord.district || (ord as any).city}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px]">{ord.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#E4EB9C]">
                        ৳{ord.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <AdminBadge
                          variant={
                            ord.status === 'Delivered'
                              ? 'success'
                              : ord.status === 'Processing'
                              ? 'info'
                              : ord.status === 'Cancelled'
                              ? 'danger'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {ord.status}
                        </AdminBadge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (onSelectOrder) onSelectOrder(ord.id);
                            onNavigate('orders', 'all');
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="View order details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>

        {/* Right 1 Col: Top Selling Products & Audit Stream */}
        <div className="space-y-6">
          
          {/* Top Selling Products */}
          <AdminCard
            title="Top Selling Products"
            subtitle="Customer favorites this month"
            action={
              <button
                onClick={() => onNavigate('catalog', 'products')}
                className="text-xs text-[#E4EB9C] hover:underline"
              >
                View Catalog
              </button>
            }
          >
            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 font-mono text-neutral-500 font-bold text-center">
                      #{idx + 1}
                    </span>
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-8 h-8 rounded-lg object-cover bg-neutral-800 shrink-0" 
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{p.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">৳{p.price}</span>
                    </div>
                  </div>
                  <AdminBadge variant="lime" size="xs">
                    {p.reviewCount || 12} sold
                  </AdminBadge>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Audit Stream */}
          <AdminCard
            title="Recent Admin Activity"
            subtitle="Security & operational audit log"
            action={
              <button
                onClick={() => onNavigate('security', 'activity_logs')}
                className="text-xs text-[#E4EB9C] hover:underline"
              >
                All Logs
              </button>
            }
          >
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-l-2 border-neutral-800 pl-3 py-0.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="font-bold text-neutral-300">{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-neutral-300 leading-snug">{log.action}</p>
                </div>
              ))}
            </div>
          </AdminCard>

        </div>

      </div>
      </>
      )}

    </div>
  );
};
