import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText, 
  Settings, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminNavSection } from '../../../types';
import { Product, Order } from '../../../types';

export interface AdminGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onNavigate: (section: AdminNavSection, subnav?: string) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectOrder?: (orderId: string) => void;
}

export const AdminGlobalSearchModal: React.FC<AdminGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onNavigate,
  onSelectProduct,
  onSelectOrder
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search products
  const matchedProducts = cleanQuery
    ? products.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) || 
        p.sku.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  // Search orders
  const matchedOrders = cleanQuery
    ? orders.filter(o => 
        o.id.toLowerCase().includes(cleanQuery) ||
        o.customerName.toLowerCase().includes(cleanQuery) ||
        o.phone.includes(cleanQuery)
      ).slice(0, 4)
    : [];

  // Fast Navigation jumps
  const navSuggestions = [
    { title: 'Products Catalog', section: 'catalog' as AdminNavSection, sub: 'products', icon: <Package className="w-4 h-4 text-emerald-400" /> },
    { title: 'Orders Fulfillment', section: 'orders' as AdminNavSection, sub: 'all', icon: <ShoppingBag className="w-4 h-4 text-purple-400" /> },
    { title: 'Customer Directory', section: 'customers' as AdminNavSection, sub: 'all_customers', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { title: 'Store Colors & Theme', section: 'store_design' as AdminNavSection, sub: 'colors', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { title: 'System & WP Blueprint', section: 'system' as AdminNavSection, sub: 'blueprint', icon: <Settings className="w-4 h-4 text-red-400" /> }
  ].filter(s => !cleanQuery || s.title.toLowerCase().includes(cleanQuery));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950/60">
          <Search className="w-5 h-5 text-[#E4EB9C] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search products, orders, customers, settings, or jump to view..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 font-mono border border-neutral-700">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4">
          
          {/* Products Matched */}
          {matchedProducts.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2">
                Products ({matchedProducts.length})
              </span>
              <div className="space-y-1">
                {matchedProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onNavigate('catalog', 'products');
                      if (onSelectProduct) onSelectProduct(prod.id);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-neutral-800/80 flex items-center justify-between group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-9 h-9 rounded-lg object-cover bg-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#E4EB9C] transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          SKU: {prod.sku} &bull; {prod.category} &bull; ৳{prod.price}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders Matched */}
          {matchedOrders.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2">
                Orders ({matchedOrders.length})
              </span>
              <div className="space-y-1">
                {matchedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      onNavigate('orders', 'all');
                      if (onSelectOrder) onSelectOrder(ord.id);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-neutral-800/80 flex items-center justify-between group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                        ORD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#E4EB9C]">
                          Order #{ord.id} &bull; {ord.customerName}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {ord.phone} &bull; ৳{ord.total} &bull; Status: {ord.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2">
              Fast Section Jumps
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.section, item.sub);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-neutral-950/40 hover:bg-neutral-800 border border-neutral-800/60 flex items-center gap-2.5 text-left group transition-colors"
                >
                  <div className="shrink-0 p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white block truncate">
                      {item.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {cleanQuery && matchedProducts.length === 0 && matchedOrders.length === 0 && (
            <div className="text-center py-6 text-xs text-neutral-400">
              No matching products or orders found for &ldquo;{query}&rdquo;
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Search index spans 14 modules & WooCommerce data</span>
          <span className="font-mono text-[#E4EB9C]">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
