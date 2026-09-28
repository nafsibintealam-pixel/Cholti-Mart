import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Package, 
  Tag, 
  Barcode, 
  Layers, 
  Star, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  Sliders, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Product } from '../../../types';
import { AdminBadge, AdminButton, AdminModal } from '../common/AdminUiElements';
import { productService } from '../../../services';

export interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onAdjustStock
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'woocommerce'>('overview');
  const [copiedWoo, setCopiedWoo] = useState(false);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'];

  const currentStock = product.stockQuantity ?? product.stockCount ?? (product.stock ?? (product.inStock ? 15 : 0));
  const threshold = product.lowStockThreshold || 10;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= threshold;

  const cost = product.costPrice || Math.round((product.price || 1000) * 0.62);
  const sellingPrice = product.salePrice || product.price;
  const regularPrice = product.regularPrice || product.price;
  const profit = sellingPrice - cost;
  const marginPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;

  const wooPayload = productService.toWooCommercePayload(product);

  const handleCopyWoo = () => {
    navigator.clipboard.writeText(JSON.stringify(wooPayload, null, 2));
    setCopiedWoo(true);
    setTimeout(() => setCopiedWoo(false), 2000);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center font-bold text-xs">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-base">Product Specification Details</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-neutral-400">SKU: {product.sku}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs text-neutral-400">ID: {product.id}</span>
            </div>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'overview'
                ? 'bg-[#2D5128] text-[#E4EB9C]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Overview & Gallery
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'specs'
                ? 'bg-[#2D5128] text-[#E4EB9C]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Attributes & Specifications
          </button>
          <button
            onClick={() => setActiveTab('woocommerce')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5 ${
              activeTab === 'woocommerce'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            WooCommerce REST API Ready
          </button>
        </div>

        {/* Tab 1: Overview & Gallery */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Product Image Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isFeatured && (
                    <span className="px-2 py-1 rounded-md bg-amber-500/90 text-black text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  {product.salePrice && product.salePrice < regularPrice && (
                    <span className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-md">
                      Sale ৳{regularPrice - product.salePrice} OFF
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-neutral-300 text-[10px] font-mono">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#E4EB9C] scale-105 shadow-md shadow-[#E4EB9C]/20'
                          : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Simulated Barcode Card */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center space-y-1">
                <div className="flex justify-center items-center py-1 opacity-80">
                  <div className="h-8 flex items-center justify-center gap-0.5 tracking-widest font-mono text-neutral-400">
                    <span className="inline-block w-1 h-7 bg-neutral-400" />
                    <span className="inline-block w-0.5 h-7 bg-neutral-400" />
                    <span className="inline-block w-2 h-7 bg-neutral-400" />
                    <span className="inline-block w-1 h-7 bg-neutral-400" />
                    <span className="inline-block w-0.5 h-7 bg-neutral-400" />
                    <span className="inline-block w-1.5 h-7 bg-neutral-400" />
                    <span className="inline-block w-0.5 h-7 bg-neutral-400" />
                    <span className="inline-block w-2 h-7 bg-neutral-400" />
                    <span className="inline-block w-1 h-7 bg-neutral-400" />
                  </div>
                </div>
                <p className="font-mono text-[11px] text-neutral-400 font-bold tracking-widest">
                  *{product.sku}*
                </p>
              </div>
            </div>

            {/* Right: Core Attributes & Pricing */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <AdminBadge 
                    variant={
                      product.status === 'published' ? 'success' :
                      product.status === 'draft' ? 'warning' : 'neutral'
                    }
                    size="xs"
                  >
                    {product.status?.toUpperCase() || 'PUBLISHED'}
                  </AdminBadge>
                  <span className="text-xs text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-[#E4EB9C] bg-[#2D5128]/40 border border-[#8DA750]/30 px-2 py-0.5 rounded-md font-medium">
                      Brand: {product.brand}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">{product.name}</h2>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {product.shortDescription || product.description}
                </p>
              </div>

              {/* Pricing & Margins Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Selling Price</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-bold text-white font-mono">৳{sellingPrice.toLocaleString()}</span>
                  </div>
                  {product.salePrice && product.salePrice < regularPrice && (
                    <span className="text-[10px] text-neutral-500 line-through block font-mono">
                      Reg: ৳{regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Cost Price</span>
                  <div className="mt-1">
                    <span className="text-base font-bold text-neutral-300 font-mono">৳{cost.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Unit procurement</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Profit & Margin</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-bold text-emerald-400 font-mono">+৳{profit.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-bold block">
                    {marginPct}% Gross Margin
                  </span>
                </div>
              </div>

              {/* Stock Inventory Card */}
              <div className={`p-4 rounded-xl border ${
                isOutOfStock ? 'bg-red-500/10 border-red-500/30' :
                isLowStock ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-neutral-950 border-neutral-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-neutral-300" />
                    <span className="text-xs font-bold text-white">Stock Level Status</span>
                  </div>
                  <AdminBadge
                    variant={isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'success'}
                    size="xs"
                  >
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock Warning' : 'Healthy Stock'}
                  </AdminBadge>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Available Inventory:</span>
                  <span className="font-mono font-bold text-white text-sm">{currentStock} Units</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOutOfStock ? 'w-0' :
                      isLowStock ? 'bg-amber-500' : 'bg-[#8DA750]'
                    }`}
                    style={{ width: `${Math.min(100, (currentStock / 40) * 100)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Threshold Alert: {threshold} units</span>
                  <button
                    onClick={() => onAdjustStock(product)}
                    className="text-[#E4EB9C] hover:underline font-semibold flex items-center gap-1"
                  >
                    Quick Adjust Stock <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Tags and Metadata */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Product Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags && product.tags.length > 0 ? (
                    product.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-xs font-mono">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500 italic">No tags assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications & Attributes */}
        {activeTab === 'specs' && (
          <div className="space-y-5">
            {/* Custom Dynamic Attributes */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Product Variations & Attributes
              </h4>
              
              {product.attributes && product.attributes.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {product.attributes.map((attr, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-neutral-200">{attr.name}</span>
                        {attr.variation && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            Used for Variations
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {attr.options.map((opt, oIdx) => (
                          <span key={oIdx} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-2">
                  No dynamic attributes specified. Click &ldquo;Edit Product&rdquo; to configure custom options like Size, Color, or Material.
                </p>
              )}
            </div>

            {/* Specifications Map */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Technical Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                      <span className="text-neutral-400 block text-[11px] font-medium">{key}</span>
                      <span className="text-white font-semibold mt-0.5 block">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-xs text-neutral-400 py-2">
                    Standard manufacturer warranty and Bangladesh verified authenticity.
                  </div>
                )}
              </div>
            </div>

            {/* Full Product Description */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Full Description Content</h4>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 leading-relaxed max-h-40 overflow-y-auto">
                {product.description || 'No extended description provided.'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: WooCommerce REST API Payload */}
        {activeTab === 'woocommerce' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-purple-200">WooCommerce REST API v3 Integration Ready</span>
                </div>
                <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                  This product is mapped to the WooCommerce REST API standard schema. You can dispatch this payload directly to{' '}
                  <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[11px]">POST /wp-json/wc/v3/products</code>.
                </p>
              </div>
              <AdminButton
                variant="outline"
                size="sm"
                icon={copiedWoo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={handleCopyWoo}
              >
                {copiedWoo ? 'Copied JSON!' : 'Copy REST Payload'}
              </AdminButton>
            </div>

            <div className="relative rounded-xl bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs text-neutral-300 max-h-96 overflow-y-auto">
              <pre className="text-[11px] leading-relaxed">
                {JSON.stringify(wooPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Bottom Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Close Details
          </AdminButton>

          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="sm"
              icon={<Package className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onAdjustStock(product);
              }}
            >
              Adjust Inventory
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              Edit Product
            </AdminButton>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};
