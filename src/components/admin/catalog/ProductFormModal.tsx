import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  DollarSign, 
  Package, 
  Tag, 
  Sliders, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  Star,
  Check,
  RefreshCw,
  Eye,
  Upload
} from 'lucide-react';
import { Product, Category, Brand, ProductAttribute, ProductStatus } from '../../../types';
import { AdminModal, AdminButton, AdminBadge } from '../common/AdminUiElements';
import { productService } from '../../../services';

export interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSave: (productData: Product | Omit<Product, 'id'> | FormData) => void;
}

const CURATED_IMAGE_PRESETS = [
  { label: 'Womens Kurti', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Ethnic Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80' },
  { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Crossbody Bag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Beauty Skincare Bottle', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80' },
  { label: 'GaN Fast Charger', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80' }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  categories,
  brands,
  onClose,
  onSave
}) => {
  const isEditing = !!product;

  const [activeTab, setActiveTab] = useState<'general' | 'pricing_inventory' | 'media' | 'attributes' | 'woo_preview'>('general');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState<ProductStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const [regularPrice, setRegularPrice] = useState(1500);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [hasSalePrice, setHasSalePrice] = useState(false);
  const [costPrice, setCostPrice] = useState(900);

  const [stockQuantity, setStockQuantity] = useState(25);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [manageStock, setManageStock] = useState(true);

  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [tagsString, setTagsString] = useState('');

  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrOptions, setNewAttrOptions] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setName(product.name || '');
      setSlug(product.slug || '');
      setSku(product.sku || '');
      setCategory(product.category || (categories[0]?.name || 'Fashion'));
      setSubcategory(product.subcategory || 'General');
      setBrand(product.brand || (brands[0]?.name || 'Cholti Essentials'));
      setStatus((product.status as ProductStatus) || 'published');
      setIsFeatured(!!product.isFeatured);
      setIsTrending(!!product.isTrending);

      const regP = product.regularPrice || product.oldPrice || product.price || 1500;
      setRegularPrice(regP);
      if (product.salePrice && product.salePrice < regP) {
        setHasSalePrice(true);
        setSalePrice(product.salePrice);
      } else {
        setHasSalePrice(false);
        setSalePrice(undefined);
      }

      setCostPrice(product.costPrice || Math.round(regP * 0.62));
      const stock = product.stockQuantity ?? product.stockCount ?? (product.stock ?? 20);
      setStockQuantity(stock);
      setLowStockThreshold(product.lowStockThreshold || 10);
      setManageStock(true);

      setImages(product.images && product.images.length > 0 ? [...product.images] : [CURATED_IMAGE_PRESETS[0].url]);
      setSelectedFiles([]);
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setTagsString(product.tags ? product.tags.join(', ') : '');
      setAttributes(product.attributes ? [...product.attributes] : [
        { id: 'attr-1', name: 'Standard Grade', options: ['Premium Bangladesh Source'], visible: true, variation: false }
      ]);
    } else {
      const defCat = categories[0]?.name || "Women's Fashion";
      const defBrand = brands[0]?.name || 'Cholti Essentials';
      const autoSku = `CM-${defCat.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      setName('');
      setSlug('');
      setSku(autoSku);
      setCategory(defCat);
      setSubcategory(categories[0]?.subcategories?.[0] || 'Kurtis');
      setBrand(defBrand);
      setStatus('published');
      setIsFeatured(false);
      setIsTrending(false);

      setRegularPrice(1800);
      setHasSalePrice(false);
      setSalePrice(undefined);
      setCostPrice(1100);

      setStockQuantity(30);
      setLowStockThreshold(10);
      setManageStock(true);

      setImages([CURATED_IMAGE_PRESETS[0].url]);
      setSelectedFiles([]);
      setShortDescription('Gracefully crafted authentic product sourced directly for Cholti Mart.');
      setDescription('Designed for effortless everyday elegance with high quality materials crafted in Bangladesh. Pre-checked for authentic stitch and finish quality with express door-to-door delivery.');
      setTagsString('authentic, top-rated, bangladesh, best-seller');
      setAttributes([
        { id: `attr-${Date.now()}-1`, name: 'Color', options: ['Black', 'Navy Blue', 'Maroon'], visible: true, variation: true },
        { id: `attr-${Date.now()}-2`, name: 'Size', options: ['M (38")', 'L (40")', 'XL (42")'], visible: true, variation: true }
      ]);
    }
  }, [product, isOpen, categories, brands]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleGenerateSku = () => {
    const prefix = category ? category.slice(0, 2).toUpperCase() : 'CM';
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`CM-${prefix}-${rand}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);

      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleAddPresetImage = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakePrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const handleAddAttribute = () => {
    if (!newAttrName.trim()) return;
    const opts = newAttrOptions
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    const newAttr: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: newAttrName.trim(),
      options: opts.length > 0 ? opts : ['Standard'],
      visible: true,
      variation: opts.length > 1
    };

    setAttributes(prev => [...prev, newAttr]);
    setNewAttrName('');
    setNewAttrOptions('');
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes(prev => attributes.filter(a => a.id !== id));
  };

  const currentSelling = hasSalePrice && salePrice && salePrice > 0 ? salePrice : regularPrice;
  const currentProfit = currentSelling - costPrice;
  const marginPct = currentSelling > 0 ? Math.round((currentProfit / currentSelling) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('slug', slug.trim() || (name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prod-${Date.now()}`));
    formData.append('sku', sku.trim() || `CM-${Date.now().toString().slice(-4)}`);
    formData.append('category_id', '1');
    formData.append('price', currentSelling.toString());
    formData.append('regular_price', regularPrice.toString());
    if (hasSalePrice && salePrice) {
      formData.append('sale_price', salePrice.toString());
    }
    formData.append('stock_quantity', stockQuantity.toString());
    formData.append('description', description.trim());
    formData.append('short_description', shortDescription.trim());
    formData.append('status', status);
    formData.append('is_featured', isFeatured ? '1' : '0');
    formData.append('is_trending', isTrending ? '1' : '0');

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    if (images.length > 0 && selectedFiles.length === 0) {
      formData.append('image_url', images[0]);
    }

    onSave(formData as any);
  };

  const simulatedProductForWoo: Product = {
    id: product?.id || 'cm-preview',
    name: name || 'Preview Product',
    slug: slug || 'preview-product',
    sku: sku || 'CM-PREVIEW',
    category: category || 'General',
    subcategory: subcategory || 'General',
    brand: brand || 'Cholti Essentials',
    price: currentSelling,
    regularPrice,
    salePrice: hasSalePrice ? salePrice : undefined,
    costPrice,
    stockQuantity,
    stockCount: stockQuantity,
    stock: stockQuantity,
    lowStockThreshold,
    inStock: stockQuantity > 0,
    status,
    isFeatured,
    images: images.length > 0 ? images : [CURATED_IMAGE_PRESETS[0].url],
    shortDescription,
    description,
    tags: tagsString.split(',').map(t => t.trim()).filter(Boolean),
    attributes,
    specifications: {},
    reviewsList: [],
    rating: 5,
    reviewCount: 0
  };

  const wooPayloadPreview = productService.toWooCommercePayload(simulatedProductForWoo);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2D5128] text-[#E4EB9C] flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {isEditing ? `Edit Product: ${product?.name}` : 'Create New Catalog Product'}
            </h3>
            <p className="text-xs text-neutral-400">
              Configure inventory, pricing, WooCommerce REST mapping & attributes
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'general', label: '1. Basic Info & Taxonomy', icon: <Package className="w-3.5 h-3.5" /> },
            { id: 'pricing_inventory', label: '2. Pricing & Stock', icon: <DollarSign className="w-3.5 h-3.5" /> },
            { id: 'media', label: `3. Gallery (${images.length})`, icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { id: 'attributes', label: `4. Attributes (${attributes.length})`, icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'woo_preview', label: 'WooCommerce API', icon: <Globe className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] border border-[#8DA750]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Product Name / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Women's Handcrafted Silk Kurti"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#8DA750] focus:ring-1 focus:ring-[#8DA750] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Product Slug (URL identifier)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="womens-handcrafted-silk-kurti"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs focus:border-[#8DA750] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    SKU (Stock Keeping Unit) <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSku}
                    className="text-[10px] text-[#E4EB9C] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Auto-Gen SKU
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="CM-WF-101"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:border-[#8DA750] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Primary Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    const selectedCat = categories.find(c => c.name === e.target.value);
                    if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0) {
                      setSubcategory(selectedCat.subcategories[0]);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} {cat.banglaName ? `(${cat.banglaName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Kurtis, Dresses, Accessories"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Brand / Manufacturer
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} {b.origin ? `(${b.origin})` : ''}
                    </option>
                  ))}
                  <option value="Cholti Essentials">Cholti Essentials (In-House)</option>
                  <option value="Other / Generic">Other / Generic Source</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                >
                  <option value="published">Published (Visible on Storefront)</option>
                  <option value="draft">Draft (Hidden, under review)</option>
                  <option value="archived">Archived (Decommissioned)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8DA750] focus:ring-[#8DA750] bg-neutral-900 border-neutral-700"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-400 text-amber-400' : 'text-neutral-500'}`} />
                  Mark as Featured Product
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8DA750] focus:ring-[#8DA750] bg-neutral-900 border-neutral-700"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className={`w-3.5 h-3.5 ${isTrending ? 'text-[#E4EB9C]' : 'text-neutral-500'}`} />
                  Trending Collection Badge
                </span>
              </label>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Short One-Line Summary
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Gracefully stitched breathable cotton kurti featuring subtle artisan embroidery."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Detailed Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, fit, specifications, styling advice, and maintenance..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#8DA750] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Search & Filter Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="cotton, festive, trending, kurti, organic"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs focus:border-[#8DA750] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing_inventory' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Unit Financial Health</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">
                    Procurement: <strong className="text-white font-mono">৳{costPrice}</strong>
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-neutral-400">
                    Active Price: <strong className="text-white font-mono">৳{currentSelling}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Unit Gross Profit:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold font-mono ${currentProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {currentProfit >= 0 ? `+৳${currentProfit}` : `-৳${Math.abs(currentProfit)}`}
                  </span>
                  <AdminBadge variant={currentProfit > 0 ? 'success' : 'danger'} size="xs">
                    {marginPct}% Margin
                  </AdminBadge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Regular Base Price (৳) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-xs">৳</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:border-[#8DA750] outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Sale / Discount Price (৳)
                  </label>
                  <label className="text-[10px] text-neutral-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSalePrice}
                      onChange={(e) => {
                        setHasSalePrice(e.target.checked);
                        if (e.target.checked && !salePrice) {
                          setSalePrice(Math.round(regularPrice * 0.85));
                        }
                      }}
                      className="rounded bg-neutral-800 border-neutral-700 text-[#8DA750]"
                    />
                    Enable Sale
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-xs">৳</span>
                  <input
                    type="number"
                    disabled={!hasSalePrice}
                    min="1"
                    value={salePrice ?? ''}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:border-[#8DA750] outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Cost Price (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-xs">৳</span>
                  <input
                    type="number"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-sm focus:border-[#8DA750] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#E4EB9C]" />
                Inventory & Stock Management
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Current Stock Quantity (Units) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-sm focus:border-[#8DA750] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Low-Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-sm focus:border-[#8DA750] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Local File Upload & Gallery Assets</h4>
                <p className="text-xs text-neutral-400">Select images from your computer or device gallery.</p>
              </div>
              <span className="text-xs font-mono text-[#E4EB9C] bg-[#2D5128]/50 px-2 py-1 rounded-md">
                {images.length} Image{images.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950 text-center hover:border-[#8DA750] transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-[#2D5128]/60 text-[#E4EB9C] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-white font-semibold">
                  Click to browse local files or drag & drop images here
                </div>
                <p className="text-[10px] text-neutral-400">Supports PNG, JPG, WEBP, JPEG up to 10MB</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">
                Quick Preset Photos (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetImage(preset.url)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#2D5128] hover:text-[#E4EB9C] text-neutral-300 border border-neutral-800 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className={`group relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border-2 transition-all ${
                    idx === 0 ? 'border-[#8DA750]' : 'border-neutral-800'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Product ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {idx === 0 && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#2D5128] text-[#E4EB9C] text-[9px] font-bold shadow-md">
                      PRIMARY
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimaryImage(idx)}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="w-7 h-7 rounded bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Add Custom Attribute (e.g. Size, Color)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    placeholder="Attribute Name"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={newAttrOptions}
                    onChange={(e) => setNewAttrOptions(e.target.value)}
                    placeholder="Options (Red, Blue)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <AdminButton
                    type="button"
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleAddAttribute}
                  >
                    Add
                  </AdminButton>
                </div>
              </div>
            </div>

            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
              {attributes.length > 0 ? (
                attributes.map((attr) => (
                  <div key={attr.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs">{attr.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {attr.options.map((opt, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 font-mono text-[11px] border border-neutral-800">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(attr.id)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-neutral-500">
                  No attributes defined yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'woo_preview' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/40">
              <span className="text-xs font-bold text-purple-200 block">WooCommerce REST API Synchronization Ready</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 max-h-72 overflow-y-auto">
              <pre className="text-[11px] leading-relaxed">
                {JSON.stringify(wooPayloadPreview, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <AdminButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </AdminButton>

          <div className="flex items-center gap-2">
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </AdminButton>
          </div>
        </div>
      </form>
    </AdminModal>
  );
};