import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  History, 
  ArrowUpDown, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpRight, 
  TrendingDown, 
  Layers, 
  DollarSign,
  FileSpreadsheet,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Product, InventoryAdjustment } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminModal, 
  AdminPagination,
  AdminExportButton
} from '../common/AdminUiElements';

export interface InventoryManagerProps {
  products: Product[];
  adjustments: InventoryAdjustment[];
  onUpdateInventory: (
    productId: string,
    adjustment: {
      quantityChange: number;
      reason: InventoryAdjustment['reason'];
      notes?: string;
      adjustedBy?: string;
    }
  ) => void;
  onEditProduct: (product: Product) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  adjustments,
  onUpdateInventory,
  onEditProduct
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stock_levels' | 'adjustment_history'>('stock_levels');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Stock Adjustment Modal
  const [selectedProductForAdjustment, setSelectedProductForAdjustment] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<InventoryAdjustment['reason']>('restock');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [adjustedBy, setAdjustedBy] = useState('Tanvir Hossain (Admin)');

  // History pagination & filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyReasonFilter, setHistoryReasonFilter] = useState('all');
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 10;

  // Stock Levels Pagination
  const [stockPage, setStockPage] = useState(1);
  const stockPerPage = 12;

  // Categories list
  const categoryNames = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Stock Levels Filter
  const filteredProducts = products.filter(p => {
    const stock = p.stockQuantity ?? p.stockCount ?? (p.stock ?? 0);
    const threshold = p.lowStockThreshold || 10;

    // Search query
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    // Stock condition
    if (stockFilter === 'out_of_stock') return stock === 0;
    if (stockFilter === 'low_stock') return stock > 0 && stock <= threshold;
    if (stockFilter === 'in_stock') return stock > threshold;

    return true;
  });

  const paginatedProducts = filteredProducts.slice((stockPage - 1) * stockPerPage, stockPage * stockPerPage);
  const totalStockPages = Math.max(1, Math.ceil(filteredProducts.length / stockPerPage));

  // Inventory KPI calculations
  const totalSKUs = products.length;
  const outOfStockCount = products.filter(p => (p.stockQuantity ?? p.stockCount ?? 0) === 0).length;
  const lowStockCount = products.filter(p => {
    const s = p.stockQuantity ?? p.stockCount ?? 0;
    return s > 0 && s <= (p.lowStockThreshold || 10);
  }).length;
  const inStockCount = totalSKUs - outOfStockCount - lowStockCount;

  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stockQuantity ?? p.stockCount ?? 0), 0);
  const totalInventoryCost = products.reduce((acc, p) => {
    const s = p.stockQuantity ?? p.stockCount ?? 0;
    const c = p.costPrice || Math.round((p.price || 1000) * 0.62);
    return acc + (s * c);
  }, 0);

  // History filtering
  const filteredHistory = adjustments.filter(adj => {
    const matchesSearch = 
      adj.productName.toLowerCase().includes(historySearch.toLowerCase()) ||
      adj.sku.toLowerCase().includes(historySearch.toLowerCase()) ||
      (adj.notes && adj.notes.toLowerCase().includes(historySearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (historyReasonFilter !== 'all' && adj.reason !== historyReasonFilter) return false;
    return true;
  });

  const paginatedHistory = filteredHistory.slice((historyPage - 1) * historyPerPage, historyPage * historyPerPage);
  const totalHistoryPages = Math.max(1, Math.ceil(filteredHistory.length / historyPerPage));

  const handleOpenAdjustment = (prod: Product, defaultType: 'add' | 'subtract' = 'add') => {
    setSelectedProductForAdjustment(prod);
    setAdjustmentType(defaultType);
    setAdjustmentQuantity(defaultType === 'add' ? 20 : 5);
    setAdjustmentReason(defaultType === 'add' ? 'restock' : 'damaged');
    setAdjustmentNotes('');
    setAdjustedBy('Tanvir Hossain (Admin)');
  };

  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAdjustment) return;

    const qtyChange = adjustmentType === 'add' ? Math.abs(adjustmentQuantity) : -Math.abs(adjustmentQuantity);

    onUpdateInventory(selectedProductForAdjustment.id, {
      quantityChange: qtyChange,
      reason: adjustmentReason,
      notes: adjustmentNotes.trim() || `Manual ${adjustmentReason} of ${Math.abs(qtyChange)} units`,
      adjustedBy
    });

    setSelectedProductForAdjustment(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Inventory KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Managed SKUs</span>
            <Package className="w-4 h-4 text-neutral-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-white font-mono">{totalSKUs}</p>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">{totalInventoryUnits} Total Units</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-400 font-mono">{inStockCount}</p>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Above threshold</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-amber-400 font-mono">{lowStockCount}</p>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Below alert threshold</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-red-400 font-mono">{outOfStockCount}</p>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Requires immediate PO</span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between text-[#E4EB9C]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Inventory Value</span>
            <DollarSign className="w-4 h-4 text-[#8DA750]" />
          </div>
          <p className="mt-2 text-xl font-bold text-[#E4EB9C] font-mono">৳{totalInventoryCost.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">Procurement valuation</span>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveSubTab('stock_levels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'stock_levels'
              ? 'bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/40 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Live Stock Levels ({products.length})
        </button>

        <button
          onClick={() => setActiveSubTab('adjustment_history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'adjustment_history'
              ? 'bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/40 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Stock Adjustment History Log ({adjustments.length})
        </button>
      </div>

      {/* SUBTAB 1: LIVE STOCK LEVELS */}
      {activeSubTab === 'stock_levels' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="w-full sm:w-64">
                <AdminSearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search SKU, Product, Brand..."
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setStockPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
              >
                {categoryNames.map((cat, i) => (
                  <option key={i} value={cat}>Category: {cat}</option>
                ))}
              </select>

              {/* Stock Status Pills */}
              <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
                {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setStockFilter(tab);
                      setStockPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      stockFilter === tab
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-400 font-mono shrink-0">
              Showing {filteredProducts.length} of {products.length} items
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Product & SKU</th>
                    <th className="py-3 px-4">Category / Brand</th>
                    <th className="py-3 px-4">Unit Cost</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4 text-center">Stock Level</th>
                    <th className="py-3 px-4">Health Status</th>
                    <th className="py-3 px-4 text-right">Stock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((prod) => {
                      const stock = prod.stockQuantity ?? prod.stockCount ?? (prod.stock ?? 0);
                      const threshold = prod.lowStockThreshold || 10;
                      const isOut = stock === 0;
                      const isLow = stock > 0 && stock <= threshold;
                      const cost = prod.costPrice || Math.round((prod.price || 1000) * 0.62);

                      return (
                        <tr key={prod.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                                <img
                                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80'}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white text-xs truncate max-w-xs">{prod.name}</p>
                                <span className="font-mono text-[10px] text-neutral-400">{prod.sku}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-neutral-300 block">{prod.category}</span>
                            <span className="text-neutral-500 text-[11px] block">{prod.brand || 'Cholti Essentials'}</span>
                          </td>

                          <td className="py-3 px-4 font-mono text-neutral-400">
                            ৳{cost.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-white">
                            ৳{(prod.salePrice || prod.price).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="font-mono font-bold text-sm text-white">{stock}</span>
                              <span className="text-[10px] text-neutral-500">Alert: &le;{threshold}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <AdminBadge
                              variant={isOut ? 'danger' : isLow ? 'warning' : 'success'}
                              size="xs"
                              dot
                            >
                              {isOut ? 'Out of Stock' : isLow ? 'Low Stock Alert' : 'In Stock'}
                            </AdminBadge>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick +10 button */}
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateInventory(prod.id, {
                                    quantityChange: 10,
                                    reason: 'restock',
                                    notes: 'Quick restock (+10) from inventory table'
                                  });
                                }}
                                className="px-2 py-1 rounded bg-neutral-800 hover:bg-[#2D5128] hover:text-[#E4EB9C] text-neutral-300 text-[11px] font-mono font-bold transition-colors"
                                title="Quick Restock +10"
                              >
                                +10
                              </button>

                              {/* Detailed Adjust */}
                              <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenAdjustment(prod, 'add')}
                              >
                                Adjust Stock
                              </AdminButton>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-neutral-500 text-xs">
                        No inventory records match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalStockPages > 1 && (
              <div className="p-4 border-t border-neutral-800 flex justify-between items-center">
                <AdminPagination
                  currentPage={stockPage}
                  totalPages={totalStockPages}
                  onPageChange={setStockPage}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: STOCK ADJUSTMENT HISTORY LOG */}
      {activeSubTab === 'adjustment_history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-full sm:w-72">
                <AdminSearchInput
                  value={historySearch}
                  onChange={setHistorySearch}
                  placeholder="Search by SKU, Product or Note..."
                />
              </div>

              <select
                value={historyReasonFilter}
                onChange={(e) => {
                  setHistoryReasonFilter(e.target.value);
                  setHistoryPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
              >
                <option value="all">All Adjustment Reasons</option>
                <option value="restock">Restock / Purchase Receipt</option>
                <option value="sale">Sale Order Fulfilled</option>
                <option value="damaged">Damaged / Expired</option>
                <option value="return">Customer Return</option>
                <option value="audit_correction">Audit Correction</option>
                <option value="manual_adjustment">Manual Adjustment</option>
              </select>
            </div>

            <div className="text-xs font-mono text-neutral-400">
              {filteredHistory.length} Adjustment Events Logged
            </div>
          </div>

          {/* Adjustment Log Table */}
          <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Product / SKU</th>
                    <th className="py-3 px-4 text-center">Previous</th>
                    <th className="py-3 px-4 text-center">Change</th>
                    <th className="py-3 px-4 text-center">New Stock</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Audited By</th>
                    <th className="py-3 px-4">Audit Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {paginatedHistory.length > 0 ? (
                    paginatedHistory.map((adj) => {
                      const isPositive = adj.quantityChange > 0;

                      return (
                        <tr key={adj.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-neutral-400 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                              {adj.date}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-bold text-white text-xs">{adj.productName}</p>
                            <span className="font-mono text-[10px] text-neutral-400">{adj.sku}</span>
                          </td>

                          <td className="py-3 px-4 text-center font-mono text-neutral-400">
                            {adj.previousStock}
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span className={`px-2 py-0.5 rounded-md ${
                              isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {isPositive ? `+${adj.quantityChange}` : adj.quantityChange}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold text-white">
                            {adj.newStock}
                          </td>

                          <td className="py-3 px-4">
                            <AdminBadge
                              variant={
                                adj.reason === 'restock' ? 'success' :
                                adj.reason === 'damaged' ? 'danger' :
                                adj.reason === 'return' ? 'purple' : 'neutral'
                              }
                              size="xs"
                            >
                              {adj.reason.replace('_', ' ').toUpperCase()}
                            </AdminBadge>
                          </td>

                          <td className="py-3 px-4 text-neutral-300 text-[11px]">
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-neutral-500" />
                              {adj.adjustedBy || 'System'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-neutral-400 text-xs italic max-w-xs truncate">
                            {adj.notes || '—'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-neutral-500 text-xs">
                        No inventory adjustment events logged matching query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalHistoryPages > 1 && (
              <div className="p-4 border-t border-neutral-800 flex justify-between items-center">
                <AdminPagination
                  currentPage={historyPage}
                  totalPages={totalHistoryPages}
                  onPageChange={setHistoryPage}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      <AdminModal
        isOpen={!!selectedProductForAdjustment}
        onClose={() => setSelectedProductForAdjustment(null)}
        title={
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E4EB9C]" />
            <span>Stock Inventory Adjustment</span>
          </div>
        }
      >
        {selectedProductForAdjustment && (
          <form onSubmit={handleConfirmAdjustment} className="space-y-4">
            {/* Product Summary */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{selectedProductForAdjustment.name}</h4>
                <span className="text-[10px] font-mono text-neutral-400">
                  SKU: {selectedProductForAdjustment.sku} • {selectedProductForAdjustment.category}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Current Stock</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedProductForAdjustment.stockQuantity ?? selectedProductForAdjustment.stockCount ?? 0} Units
                </span>
              </div>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  adjustmentType === 'add'
                    ? 'bg-[#2D5128] border-[#8DA750] text-[#E4EB9C]'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" /> Add Inventory (Restock)
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('subtract')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  adjustmentType === 'subtract'
                    ? 'bg-red-950/70 border-red-500 text-red-200'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Minus className="w-4 h-4" /> Deduct Stock (Damage/Shrinkage)
              </button>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Quantity Units to {adjustmentType === 'add' ? 'Add' : 'Deduct'} <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:border-[#8DA750] outline-none"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Adjustment Reason / Category <span className="text-red-400">*</span>
              </label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
              >
                <option value="restock">Restock / Shipment Received from Supplier</option>
                <option value="return">Customer Return to Warehouse</option>
                <option value="audit_correction">Physical Audit Count Discrepancy</option>
                <option value="damaged">Damaged in Transit / Warehouse Spoiled</option>
                <option value="sale">Manual Offline Walk-in Store Sale</option>
                <option value="manual_adjustment">Other Manual Correction</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Audit Notes / Reference PO or Ticket #
              </label>
              <textarea
                rows={2}
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
                placeholder="e.g. PO-8492 received from Narayanganj textiles depot."
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
              />
            </div>

            {/* Adjusted By */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Authorized By Staff
              </label>
              <input
                type="text"
                value={adjustedBy}
                onChange={(e) => setAdjustedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
              />
            </div>

            {/* Calculated Result Preview */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Estimated New Stock:</span>
              <span className="font-mono font-bold text-white text-sm">
                {Math.max(0, (selectedProductForAdjustment.stockQuantity ?? 0) + (adjustmentType === 'add' ? adjustmentQuantity : -adjustmentQuantity))} Units
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <AdminButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProductForAdjustment(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                variant="primary"
                size="sm"
              >
                Apply Inventory Adjustment
              </AdminButton>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
};
