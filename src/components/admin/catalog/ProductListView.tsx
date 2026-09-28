import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Star, 
  Filter, 
  ArrowUpDown, 
  Download, 
  CheckSquare, 
  Square, 
  SlidersHorizontal, 
  FolderTree, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Globe, 
  LayoutGrid, 
  List as ListIcon,
  Tag,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Product, Category, Brand, ProductStatus } from '../../../types';
import { 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminPagination, 
  AdminConfirmDialog, 
  AdminModal 
} from '../common/AdminUiElements';

export interface ProductListViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBulkDelete: (productIds: string[]) => void;
  onBulkStatusChange: (productIds: string[], status: ProductStatus) => void;
  onBulkCategoryAssign: (productIds: string[], category: string) => void;
  onToggleFeatured: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  initialCategoryFilter?: string;
  initialBrandFilter?: string;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  categories,
  brands,
  onAddNewProduct,
  onEditProduct,
  onViewProductDetails,
  onDeleteProduct,
  onBulkDelete,
  onBulkStatusChange,
  onBulkCategoryAssign,
  onToggleFeatured,
  onAdjustStock,
  initialCategoryFilter,
  initialBrandFilter
}) => {
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter || 'all');
  const [brandFilter, setBrandFilter] = useState(initialBrandFilter || 'all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'newest'>('newest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // View Layout mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection & Bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const [selectedBulkCategory, setSelectedBulkCategory] = useState(categories[0]?.name || 'Fashion');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // CSV Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const stock = product.stockQuantity ?? product.stockCount ?? (product.stock ?? 0);
      const threshold = product.lowStockThreshold || 10;

      // Text search in Name, SKU, Brand, Category, Tags
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = (product.sku || '').toLowerCase().includes(query);
        const matchesBrand = (product.brand || '').toLowerCase().includes(query);
        const matchesCat = (product.category || '').toLowerCase().includes(query);
        const matchesTags = (product.tags || []).some(t => t.toLowerCase().includes(query));

        if (!matchesName && !matchesSku && !matchesBrand && !matchesCat && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Brand filter
      if (brandFilter !== 'all' && product.brand !== brandFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && product.status !== statusFilter) {
        return false;
      }

      // Featured only
      if (featuredOnly && !product.isFeatured) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'out_of_stock' && stock > 0) return false;
      if (stockFilter === 'low_stock' && (stock === 0 || stock > threshold)) return false;
      if (stockFilter === 'in_stock' && stock <= threshold) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        const pA = a.salePrice || a.price || 0;
        const pB = b.salePrice || b.price || 0;
        comparison = pA - pB;
      } else if (sortBy === 'stock') {
        const sA = a.stockQuantity ?? a.stockCount ?? 0;
        const sB = b.stockQuantity ?? b.stockCount ?? 0;
        comparison = sA - sB;
      } else if (sortBy === 'newest') {
        comparison = (a.id || '').localeCompare(b.id || '');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [products, search, categoryFilter, brandFilter, statusFilter, featuredOnly, stockFilter, sortBy, sortDirection]);

  // Pagination Slice
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection helpers
  const allPageIdsSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.has(p.id));
  const somePageIdsSelected = paginatedProducts.some(p => selectedIds.has(p.id));

  const handleSelectAllOnPage = () => {
    const next = new Set(selectedIds);
    if (allPageIdsSelected) {
      paginatedProducts.forEach(p => next.delete(p.id));
    } else {
      paginatedProducts.forEach(p => next.add(p.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // CSV Export Logic
  const handleExportCSV = (exportMode: 'filtered' | 'selected') => {
    const targetProducts = exportMode === 'selected'
      ? products.filter(p => selectedIds.has(p.id))
      : filteredProducts;

    if (targetProducts.length === 0) return;

    const headers = [
      'Product ID',
      'Name',
      'SKU',
      'Category',
      'Subcategory',
      'Brand',
      'Regular Price (BDT)',
      'Sale Price (BDT)',
      'Cost Price (BDT)',
      'Stock Quantity',
      'Low Stock Threshold',
      'Status',
      'Is Featured',
      'Tags'
    ];

    const rows = targetProducts.map(p => {
      const reg = p.regularPrice || p.oldPrice || p.price;
      const sale = p.salePrice || '';
      const cost = p.costPrice || Math.round((p.price || 1000) * 0.62);
      const stock = p.stockQuantity ?? p.stockCount ?? (p.stock ?? 0);
      const tags = (p.tags || []).join(';');

      return [
        `"${p.id}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku}"`,
        `"${p.category}"`,
        `"${p.subcategory || ''}"`,
        `"${p.brand || ''}"`,
        reg,
        sale,
        cost,
        stock,
        p.lowStockThreshold || 10,
        p.status || 'published',
        p.isFeatured ? 'Yes' : 'No',
        `"${tags}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `choltimart-products-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Catalog Products Directory
            <span className="px-2 py-0.5 rounded-md bg-[#2D5128] text-[#E4EB9C] text-xs font-mono">
              {totalItems} Available
            </span>
          </h2>
          <p className="text-xs text-neutral-400">
            Manage SKU listings, unit margins, image galleries, and WooCommerce REST payloads
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV UI Button */}
          <AdminButton
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export CSV
          </AdminButton>

          {/* Add Product Button */}
          <AdminButton
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAddNewProduct}
          >
            Add Product
          </AdminButton>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <AdminSearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder="Search by Product Name, SKU, Tag, Brand..."
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div>
            <select
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs outline-none focus:border-[#8DA750]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Stock filter, Featured toggle, Sorting, and View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
          <div className="flex flex-wrap items-center gap-3">
            {/* Stock status tabs */}
            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setStockFilter(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    stockFilter === tab
                      ? 'bg-[#2D5128] text-[#E4EB9C] shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300 hover:text-white">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => {
                  setFeaturedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded bg-neutral-950 border-neutral-700 text-[#8DA750] focus:ring-0"
              />
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'}`} />
              <span>Featured Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Control */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortDirection(dir as any);
                }}
                className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs outline-none"
              >
                <option value="newest-desc">Newest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="stock-asc">Stock (Low to High)</option>
                <option value="stock-desc">Stock (High to Low)</option>
              </select>
            </div>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
                }`}
                title="Table View"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.size > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#2D5128]/20 border border-[#8DA750]/50 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#2D5128] text-[#E4EB9C] text-xs font-bold font-mono">
              {selectedIds.size} Selected
            </span>
            <button
              onClick={handleClearSelection}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk Status Change Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-300">Set Status:</span>
              <button
                onClick={() => onBulkStatusChange(Array.from(selectedIds), 'published')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-emerald-950/60 text-emerald-400 text-xs font-bold border border-neutral-800 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => onBulkStatusChange(Array.from(selectedIds), 'draft')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-amber-950/60 text-amber-400 text-xs font-bold border border-neutral-800 transition-colors"
              >
                Draft
              </button>
              <button
                onClick={() => onBulkStatusChange(Array.from(selectedIds), 'archived')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold border border-neutral-800 transition-colors"
              >
                Archive
              </button>
            </div>

            {/* Bulk Category Assign */}
            <AdminButton
              variant="outline"
              size="sm"
              icon={<FolderTree className="w-3.5 h-3.5" />}
              onClick={() => setIsBulkCategoryModalOpen(true)}
            >
              Assign Category
            </AdminButton>

            {/* Bulk Delete */}
            <AdminButton
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setIsBulkDeleteModalOpen(true)}
            >
              Delete Selected
            </AdminButton>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: DATA TABLE */}
      {viewMode === 'table' && (
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAllOnPage}
                      className="text-neutral-400 hover:text-white"
                    >
                      {allPageIdsSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#8DA750]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category & Brand</th>
                  <th className="py-3 px-4">Pricing (Sale/Reg/Cost)</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800/80">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => {
                    const isSelected = selectedIds.has(p.id);
                    const stock = p.stockQuantity ?? p.stockCount ?? (p.stock ?? 0);
                    const threshold = p.lowStockThreshold || 10;
                    const isOut = stock === 0;
                    const isLow = stock > 0 && stock <= threshold;

                    const regPrice = p.regularPrice || p.oldPrice || p.price;
                    const activePrice = p.salePrice || p.price;
                    const cost = p.costPrice || Math.round((p.price || 1000) * 0.62);

                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-neutral-800/40 transition-colors ${
                          isSelected ? 'bg-[#2D5128]/10' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectOne(p.id)}
                            className="text-neutral-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#8DA750]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Product Thumbnail & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80'}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {p.isFeatured && (
                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 max-w-xs">
                              <button
                                type="button"
                                onClick={() => onViewProductDetails(p)}
                                className="font-bold text-white text-xs hover:text-[#E4EB9C] text-left line-clamp-1 transition-colors"
                              >
                                {p.name}
                              </button>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {p.tags && p.tags.slice(0, 2).map((t, idx) => (
                                  <span key={idx} className="text-[10px] text-neutral-500 font-mono">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-4 font-mono text-neutral-300 text-xs">
                          {p.sku}
                        </td>

                        {/* Category & Brand */}
                        <td className="py-3 px-4">
                          <span className="text-white block font-medium">{p.category}</span>
                          <span className="text-neutral-400 text-[11px] block">{p.brand || 'Cholti Essentials'}</span>
                        </td>

                        {/* Pricing */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-white text-sm">৳{activePrice.toLocaleString()}</span>
                            {p.salePrice && p.salePrice < regPrice && (
                              <span className="text-[10px] text-neutral-500 line-through">
                                ৳{regPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 block">
                            Cost: ৳{cost.toLocaleString()}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-mono font-bold text-sm ${
                              isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {stock}
                            </span>
                            <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                              {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <AdminBadge
                            variant={
                              p.status === 'published' ? 'success' :
                              p.status === 'draft' ? 'warning' : 'neutral'
                            }
                            size="xs"
                          >
                            {p.status || 'PUBLISHED'}
                          </AdminBadge>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle Featured Star */}
                            <button
                              type="button"
                              onClick={() => onToggleFeatured(p)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                p.isFeatured
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-neutral-500 hover:text-neutral-300'
                              }`}
                              title={p.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-current' : ''}`} />
                            </button>

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => onViewProductDetails(p)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => onEditProduct(p)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                      No products found matching your active search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GRID CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((p) => {
            const isSelected = selectedIds.has(p.id);
            const stock = p.stockQuantity ?? p.stockCount ?? 0;
            const threshold = p.lowStockThreshold || 10;
            const isOut = stock === 0;
            const isLow = stock > 0 && stock <= threshold;
            const regPrice = p.regularPrice || p.oldPrice || p.price;
            const activePrice = p.salePrice || p.price;

            return (
              <div
                key={p.id}
                className={`bg-neutral-900/95 border rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between ${
                  isSelected ? 'border-[#8DA750] ring-1 ring-[#8DA750]' : 'border-neutral-800'
                }`}
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-square bg-neutral-950 overflow-hidden group">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <AdminBadge
                        variant={
                          p.status === 'published' ? 'success' :
                          p.status === 'draft' ? 'warning' : 'neutral'
                        }
                        size="xs"
                      >
                        {p.status || 'PUBLISHED'}
                      </AdminBadge>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectOne(p.id)}
                        className="w-7 h-7 rounded-lg bg-black/70 backdrop-blur-md text-white flex items-center justify-center"
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-[#8DA750]" /> : <Square className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(p)}
                        className="w-7 h-7 rounded-lg bg-black/70 backdrop-blur-md text-white flex items-center justify-center"
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md font-mono text-[11px] text-neutral-300">
                      <span>SKU: {p.sku}</span>
                      <span className={isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}>
                        {stock} Units
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{p.category}</span>
                      <span>{p.brand || 'Cholti'}</span>
                    </div>

                    <h3 
                      onClick={() => onViewProductDetails(p)}
                      className="font-bold text-white text-xs line-clamp-1 hover:text-[#E4EB9C] cursor-pointer"
                    >
                      {p.name}
                    </h3>

                    <div className="flex items-baseline gap-2 pt-1 font-mono">
                      <span className="text-base font-bold text-white">৳{activePrice.toLocaleString()}</span>
                      {p.salePrice && p.salePrice < regPrice && (
                        <span className="text-xs text-neutral-500 line-through">৳{regPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onAdjustStock(p)}
                    className="text-[11px] text-neutral-400 hover:text-white font-medium"
                  >
                    Adjust Stock
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewProductDetails(p)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>
            Showing <strong className="text-white font-mono">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-white font-mono">{Math.min(totalItems, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-white font-mono">{totalItems}</strong> products
          </span>

          <span className="text-neutral-600">•</span>

          <div className="flex items-center gap-1.5">
            <span>Per Page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs outline-none"
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Bulk Delete Confirm Modal */}
      <AdminConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          onBulkDelete(Array.from(selectedIds));
          setSelectedIds(new Set());
          setIsBulkDeleteModalOpen(false);
        }}
        title="Bulk Delete Products"
        message={`Are you sure you want to permanently delete ${selectedIds.size} selected products? This operation cannot be undone.`}
        confirmText={`Delete ${selectedIds.size} Products`}
        variant="danger"
      />

      {/* Single Product Delete Confirm */}
      <AdminConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            onDeleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}" (${productToDelete?.sku})?`}
        confirmText="Yes, Delete"
        variant="danger"
      />

      {/* Bulk Category Assign Modal */}
      <AdminModal
        isOpen={isBulkCategoryModalOpen}
        onClose={() => setIsBulkCategoryModalOpen(false)}
        title="Bulk Assign Category"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-300">
            Select a target category to reassign all <strong className="text-white">{selectedIds.size}</strong> selected products:
          </p>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Target Category
            </label>
            <select
              value={selectedBulkCategory}
              onChange={(e) => setSelectedBulkCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() => setIsBulkCategoryModalOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={() => {
                onBulkCategoryAssign(Array.from(selectedIds), selectedBulkCategory);
                setIsBulkCategoryModalOpen(false);
                setSelectedIds(new Set());
              }}
            >
              Apply Category
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* CSV Export Options Modal */}
      <AdminModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Products Catalog to CSV"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-300">
            Generate an enterprise CSV export containing all product titles, SKUs, inventory counts, retail & cost pricing, categories, and tags.
          </p>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Filtered Products:</span>
              <span className="font-mono font-bold text-white">{filteredProducts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Selected Checkbox Items:</span>
              <span className="font-mono font-bold text-[#E4EB9C]">{selectedIds.size}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleExportCSV('filtered')}
            >
              Export All {filteredProducts.length} Filtered Products
            </AdminButton>

            {selectedIds.size > 0 && (
              <AdminButton
                variant="outline"
                size="sm"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => handleExportCSV('selected')}
              >
                Export Only {selectedIds.size} Selected Products
              </AdminButton>
            )}

            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancel
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
