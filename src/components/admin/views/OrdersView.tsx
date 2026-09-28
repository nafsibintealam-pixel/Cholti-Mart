import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Download,
  FileText,
  AlertCircle,
  Code2,
  Trash2,
  RotateCcw,
  RefreshCw,
  CreditCard,
  CheckSquare,
  Square,
  MinusSquare,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Order, OrderStatus, DeliveryStatus, PaymentStatus } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminPagination, 
  AdminExportButton,
  AdminEmptyState
} from '../common/AdminUiElements';
import { useCustomizer } from '../../../context/CustomizerContext';
import { OrderDetailsDrawer } from '../orders/OrderDetailsDrawer';
import { OrderInvoiceModal } from '../orders/OrderInvoiceModal';
import { WooCommerceOrderModal } from '../orders/WooCommerceOrderModal';
import { OrderConfirmationModal } from '../orders/OrderConfirmationModal';
import { orderService } from '../../../services';

export interface OrdersViewProps {
  orders: Order[];
  subnav?: string;
  selectedOrderId?: string | null;
  onUpdateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string,
    courierPartner?: string,
    deliveryStatus?: DeliveryStatus,
    note?: string
  ) => void;
  onAddAdminNote?: (orderId: string, text: string) => void;
  onBulkUpdateOrderStatus?: (orderIds: string[], status: OrderStatus) => void;
  onBulkAssignCourier?: (orderIds: string[], courier: string) => void;
  onBulkDeleteOrders?: (orderIds: string[]) => void;
  onNavigateSubnav: (sub: string) => void;
}

const ORDER_STATUS_TABS: { id: string; label: string; status?: OrderStatus }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending', status: 'Pending' },
  { id: 'confirmed', label: 'Confirmed', status: 'Confirmed' },
  { id: 'processing', label: 'Processing', status: 'Processing' },
  { id: 'shipped', label: 'Shipped', status: 'Shipped' },
  { id: 'delivered', label: 'Delivered', status: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled', status: 'Cancelled' },
  { id: 'returned', label: 'Returned', status: 'Returned' },
  { id: 'refunded', label: 'Refunded', status: 'Refunded' }
];

const COURIER_OPTIONS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX',
  'Paperfly',
  'Sundarban'
];

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  subnav = 'all',
  selectedOrderId = null,
  onUpdateOrderStatus,
  onAddAdminNote,
  onBulkUpdateOrderStatus,
  onBulkAssignCourier,
  onBulkDeleteOrders,
  onNavigateSubnav
}) => {
  const { config } = useCustomizer();

  // Active status tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    const validTab = ORDER_STATUS_TABS.find(t => t.id === subnav.toLowerCase());
    return validTab ? validTab.id : 'all';
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [courierFilter, setCourierFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // all, today, last_7_days, this_month

  // Selection for Bulk Actions
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Modals & Drawers
  const [viewingOrder, setViewingOrder] = useState<Order | null>(
    selectedOrderId ? orders.find(o => o.id === selectedOrderId) || null : null
  );
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [wooCommerceOrder, setWooCommerceOrder] = useState<Order | null>(null);

  // Bulk confirmation modal
  const [bulkConfirmState, setBulkConfirmState] = useState<{
    isOpen: boolean;
    actionType: 'status' | 'courier' | 'delete' | null;
    targetValue?: string;
    title: string;
    description: string;
    variant: 'danger' | 'warning' | 'primary';
  }>({
    isOpen: false,
    actionType: null,
    title: '',
    description: '',
    variant: 'warning'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Keep viewing order in sync with updated orders prop
  React.useEffect(() => {
    if (viewingOrder) {
      const fresh = orders.find(o => o.id === viewingOrder.id);
      if (fresh) setViewingOrder(fresh);
    }
  }, [orders]);

  // Keep tab in sync with subnav when route changes
  React.useEffect(() => {
    if (subnav) {
      const match = ORDER_STATUS_TABS.find(t => t.id === subnav.toLowerCase());
      if (match) setActiveTab(match.id);
    }
  }, [subnav]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, paymentMethodFilter, paymentStatusFilter, courierFilter, dateRangeFilter]);

  // Counts by status for tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    ORDER_STATUS_TABS.forEach(t => {
      if (t.status) {
        counts[t.id] = orders.filter(o => o.status.toLowerCase() === t.status!.toLowerCase()).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders pipeline
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return orders.filter((ord) => {
      // Tab status filter
      if (activeTab !== 'all') {
        const tabDef = ORDER_STATUS_TABS.find(t => t.id === activeTab);
        if (tabDef && tabDef.status && ord.status.toLowerCase() !== tabDef.status.toLowerCase()) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = ord.id.toLowerCase().includes(q);
        const matchesCustomer = ord.customerName.toLowerCase().includes(q);
        const matchesPhone = ord.phone.includes(q);
        const matchesEmail = ord.email ? ord.email.toLowerCase().includes(q) : false;
        const matchesTracking = (ord.courierTrackingCode || ord.trackingNumber || '').toLowerCase().includes(q);
        const matchesCity = (ord.district || (ord as any).city || '').toLowerCase().includes(q);

        if (!matchesId && !matchesCustomer && !matchesPhone && !matchesEmail && !matchesTracking && !matchesCity) {
          return false;
        }
      }

      // Payment method filter
      if (paymentMethodFilter !== 'all') {
        if (ord.paymentMethod.toLowerCase() !== paymentMethodFilter.toLowerCase()) {
          return false;
        }
      }

      // Payment status filter
      if (paymentStatusFilter !== 'all') {
        const currentPStatus = ord.paymentStatus || 'unpaid';
        if (currentPStatus.toLowerCase() !== paymentStatusFilter.toLowerCase()) {
          return false;
        }
      }

      // Courier filter
      if (courierFilter !== 'all') {
        const ordCourier = ord.courierPartner || ord.courier || '';
        if (courierFilter === 'unassigned') {
          if (ordCourier && ordCourier !== 'Unassigned') return false;
        } else if (ordCourier.toLowerCase() !== courierFilter.toLowerCase()) {
          return false;
        }
      }

      // Date Range filter
      if (dateRangeFilter !== 'all') {
        const ordTime = ord.createdAt ? new Date(ord.createdAt).getTime() : new Date(ord.date).getTime();
        if (!isNaN(ordTime)) {
          if (dateRangeFilter === 'today' && ordTime < startOfToday) return false;
          if (dateRangeFilter === 'last_7_days' && ordTime < sevenDaysAgo) return false;
          if (dateRangeFilter === 'this_month' && ordTime < startOfMonth) return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery, paymentMethodFilter, paymentStatusFilter, courierFilter, dateRangeFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Selection Handlers
  const isAllOnPageSelected = paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrderIds.includes(o.id));
  const isSomeSelected = selectedOrderIds.length > 0;

  const handleToggleSelectAll = () => {
    if (isAllOnPageSelected) {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrderIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrderIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleTriggerBulkStatus = (targetStatus: OrderStatus) => {
    if (selectedOrderIds.length === 0) return;
    setBulkConfirmState({
      isOpen: true,
      actionType: 'status',
      targetValue: targetStatus,
      title: `Update Status for ${selectedOrderIds.length} Orders`,
      description: `Are you sure you want to change the status of ${selectedOrderIds.length} selected orders to "${targetStatus}"?`,
      variant: ['Cancelled', 'Refunded', 'Returned'].includes(targetStatus) ? 'danger' : 'primary'
    });
  };

  const handleTriggerBulkCourier = (courierName: string) => {
    if (selectedOrderIds.length === 0) return;
    setBulkConfirmState({
      isOpen: true,
      actionType: 'courier',
      targetValue: courierName,
      title: `Assign Courier for ${selectedOrderIds.length} Orders`,
      description: `Assign "${courierName}" to the ${selectedOrderIds.length} selected orders? Dispatch logs and tracking placeholders will be generated.`,
      variant: 'primary'
    });
  };

  const handleTriggerBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    setBulkConfirmState({
      isOpen: true,
      actionType: 'delete',
      title: `Delete ${selectedOrderIds.length} Orders`,
      description: `Warning: This action will permanently remove ${selectedOrderIds.length} order records from the store archive. This cannot be undone.`,
      variant: 'danger'
    });
  };

  const handleExecuteBulkAction = () => {
    if (!bulkConfirmState.actionType) return;

    if (bulkConfirmState.actionType === 'status' && bulkConfirmState.targetValue) {
      if (onBulkUpdateOrderStatus) {
        onBulkUpdateOrderStatus(selectedOrderIds, bulkConfirmState.targetValue as OrderStatus);
      } else {
        selectedOrderIds.forEach(id => {
          onUpdateOrderStatus(id, bulkConfirmState.targetValue as OrderStatus);
        });
      }
    } else if (bulkConfirmState.actionType === 'courier' && bulkConfirmState.targetValue) {
      if (onBulkAssignCourier) {
        onBulkAssignCourier(selectedOrderIds, bulkConfirmState.targetValue);
      } else {
        selectedOrderIds.forEach(id => {
          const ord = orders.find(o => o.id === id);
          if (ord) {
            onUpdateOrderStatus(id, ord.status, ord.courierTrackingCode || ord.trackingNumber, bulkConfirmState.targetValue);
          }
        });
      }
    } else if (bulkConfirmState.actionType === 'delete') {
      if (onBulkDeleteOrders) {
        onBulkDeleteOrders(selectedOrderIds);
      }
    }

    setSelectedOrderIds([]);
    setBulkConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const listToExport = selectedOrderIds.length > 0 
      ? orders.filter(o => selectedOrderIds.includes(o.id))
      : filteredOrders;

    const headers = [
      'Order ID',
      'Created Date',
      'Customer Name',
      'Phone',
      'Email',
      'Street Address',
      'District',
      'Items Count',
      'Items Summary',
      'Subtotal (BDT)',
      'Delivery Charge (BDT)',
      'Discount (BDT)',
      'Total (BDT)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Delivery Status',
      'Courier Partner',
      'Tracking Number',
      'Customer Notes'
    ];

    const rows = listToExport.map(o => {
      const itemsSummary = o.items.map(i => `${i.productName} (x${i.quantity})`).join('; ');
      const subtotal = o.subtotal || o.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryCharge = typeof o.deliveryCharge === 'number' ? o.deliveryCharge : (o.shippingFee || 70);
      const discount = o.discount || 0;

      return [
        o.id,
        `"${o.createdAt || o.date}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${o.phone || ''}"`,
        `"${o.email || ''}"`,
        `"${(o.address || '').replace(/"/g, '""')}"`,
        `"${(o.district || (o as any).city || '').replace(/"/g, '""')}"`,
        o.itemCount || o.items.reduce((acc, it) => acc + it.quantity, 0),
        `"${itemsSummary.replace(/"/g, '""')}"`,
        subtotal,
        deliveryCharge,
        discount,
        o.total,
        `"${o.paymentMethod || ''}"`,
        `"${o.paymentStatus || 'unpaid'}"`,
        `"${o.status}"`,
        `"${o.deliveryStatus || 'pending'}"`,
        `"${o.courierPartner || o.courier || ''}"`,
        `"${o.courierTrackingCode || o.trackingNumber || ''}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cholti_mart_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export handler
  const handleExportJson = () => {
    const listToExport = selectedOrderIds.length > 0 
      ? orders.filter(o => selectedOrderIds.includes(o.id))
      : filteredOrders;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(listToExport, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `cholti_mart_orders_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'purple';
      case 'Confirmed':
      case 'Processing': return 'info';
      case 'Cancelled':
      case 'Refunded':
      case 'Returned': return 'danger';
      case 'Pending':
      default: return 'warning';
    }
  };

  const paymentBadgeVariant = (pStatus: PaymentStatus) => {
    switch (pStatus) {
      case 'paid': return 'success';
      case 'refunded':
      case 'partially_refunded': return 'danger';
      case 'unpaid':
      default: return 'warning';
    }
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    paymentMethodFilter !== 'all' ||
    paymentStatusFilter !== 'all' ||
    courierFilter !== 'all' ||
    dateRangeFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setPaymentMethodFilter('all');
    setPaymentStatusFilter('all');
    setCourierFilter('all');
    setDateRangeFilter('all');
    setActiveTab('all');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Subnav & Status Filter Tabs with Real Counts */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          {ORDER_STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.id] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onNavigateSubnav(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/50 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-[#142C14] text-[#E4EB9C]' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AdminExportButton 
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            label={selectedOrderIds.length > 0 ? `Export (${selectedOrderIds.length})` : 'Export Orders'}
          />
        </div>
      </div>

      {/* 2. Advanced Search & Multi-Filter Controls */}
      <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Order ID, customer, phone, email, tracking..."
            className="w-full lg:w-96"
          />

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Date Range Dropdown */}
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="this_month">This Month</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Payment Methods</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Courier Filter */}
            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Couriers</option>
              {COURIER_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
          <span>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> total orders
          </span>
          {selectedOrderIds.length > 0 && (
            <span className="text-[#E4EB9C] font-medium">
              {selectedOrderIds.length} orders selected for batch processing
            </span>
          )}
        </div>
      </div>

      {/* 3. Bulk Actions Toolbar (Sticky when items selected) */}
      {isSomeSelected && (
        <div className="p-3 bg-[#142C14]/90 border border-[#8DA750]/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#2D5128] text-[#E4EB9C] font-mono text-xs font-bold">
              {selectedOrderIds.length} Selected
            </span>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-neutral-300 hover:text-white underline underline-offset-2"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk Status Change */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-300 font-medium">Status:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleTriggerBulkStatus(e.target.value as OrderStatus);
                    e.target.value = '';
                  }
                }}
                className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Change Status...</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Bulk Assign Courier */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-300 font-medium">Courier:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleTriggerBulkCourier(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Assign Courier...</option>
                {COURIER_OPTIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Bulk Delete */}
            <AdminButton
              variant="danger"
              size="xs"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleTriggerBulkDelete}
            >
              Delete
            </AdminButton>
          </div>
        </div>
      )}

      {/* 4. Production Orders Table */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/90 text-neutral-400 text-[10px] uppercase font-bold tracking-wider border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3.5 w-8">
                  <button
                    onClick={handleToggleSelectAll}
                    className="p-1 rounded text-neutral-400 hover:text-white"
                    title={isAllOnPageSelected ? 'Deselect page' : 'Select all on page'}
                  >
                    {isAllOnPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#8DA750]" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-500" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Customer & Contact</th>
                <th className="px-4 py-3.5">Destination</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-right">Total</th>
                <th className="px-4 py-3.5 text-center">Fulfillment</th>
                <th className="px-4 py-3.5">Logistics / Courier</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord) => {
                  const isSelected = selectedOrderIds.includes(ord.id);
                  const totalItems = ord.itemCount || ord.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr 
                      key={ord.id} 
                      className={`transition-colors ${isSelected ? 'bg-neutral-800/70' : 'hover:bg-neutral-800/40'}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleSelectRow(ord.id)}
                          className="p-1 rounded text-neutral-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#8DA750]" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-white hover:text-[#E4EB9C] cursor-pointer" onClick={() => setViewingOrder(ord)}>
                            #{ord.id}
                          </span>
                          {ord.wooCommerceOrderId && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              WC
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-neutral-400 text-[11px] whitespace-nowrap">
                        <div>{ord.date}</div>
                        {ord.createdAt && (
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>

                      {/* Customer & Phone */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white leading-tight">{ord.customerName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{ord.phone}</div>
                        {ord.email && (
                          <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">{ord.email}</div>
                        )}
                      </td>

                      {/* Delivery Location */}
                      <td className="px-4 py-3.5 text-neutral-300">
                        <div className="font-medium text-white">{ord.district || (ord as any).city || 'Dhaka'}</div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[130px]">{ord.address}</div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5 text-neutral-300">
                        <span className="font-mono">{totalItems} pcs</span>
                        <div className="text-[10px] text-neutral-500">
                          {ord.items.length} sku{ord.items.length > 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] bg-neutral-800/90 px-1.5 py-0.5 rounded text-neutral-300 block w-fit">
                            {ord.paymentMethod}
                          </span>
                          <AdminBadge variant={paymentBadgeVariant(ord.paymentStatus || 'unpaid')} size="xs">
                            {ord.paymentStatus || 'unpaid'}
                          </AdminBadge>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-mono font-bold text-right text-[#E4EB9C] whitespace-nowrap">
                        ৳{ord.total.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <AdminBadge variant={statusBadgeVariant(ord.status)} size="xs">
                          {ord.status}
                        </AdminBadge>
                      </td>

                      {/* Logistics / Courier */}
                      <td className="px-4 py-3.5">
                        <div className="text-[11px] text-neutral-300 font-medium truncate max-w-[130px]">
                          {ord.courierPartner || ord.courier || 'Steadfast Courier'}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">
                          {ord.courierTrackingCode || ord.trackingNumber ? (
                            <span className="text-emerald-400">
                              {ord.courierTrackingCode || ord.trackingNumber}
                            </span>
                          ) : (
                            <span className="text-neutral-500 italic">No tracking</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingOrder(ord)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                            title="View Full Order Details & Timeline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 transition-colors"
                            title="Print Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setWooCommerceOrder(ord)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-purple-400 hover:text-purple-300 transition-colors"
                            title="Inspect WooCommerce v3 REST Payload"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-neutral-400">
                    <AdminEmptyState
                      icon={<ShoppingBag className="w-10 h-10 text-neutral-500" />}
                      title="No Orders Found"
                      description={
                        hasActiveFilters 
                          ? "No orders match your selected filter criteria or search query. Try clearing filters." 
                          : "There are currently no orders in this status category."
                      }
                      action={
                        hasActiveFilters ? (
                          <AdminButton variant="outline" size="sm" onClick={resetFilters}>
                            Clear All Filters
                          </AdminButton>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </AdminCard>

      {/* 6. Order Details & Activity Timeline Drawer / Modal */}
      <OrderDetailsDrawer
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateOrderStatus={onUpdateOrderStatus}
        onAddAdminNote={onAddAdminNote}
        onOpenInvoice={() => {
          setInvoiceOrder(viewingOrder);
        }}
        onOpenWooCommerce={() => {
          setWooCommerceOrder(viewingOrder);
        }}
      />

      {/* 7. Printable Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* 8. WooCommerce REST API Inspector Modal */}
      <WooCommerceOrderModal
        order={wooCommerceOrder}
        isOpen={!!wooCommerceOrder}
        onClose={() => setWooCommerceOrder(null)}
      />

      {/* 9. Bulk Action Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={bulkConfirmState.isOpen}
        onClose={() => setBulkConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleExecuteBulkAction}
        title={bulkConfirmState.title}
        description={bulkConfirmState.description}
        variant={bulkConfirmState.variant}
        confirmLabel="Execute Bulk Action"
      />

    </div>
  );
};
