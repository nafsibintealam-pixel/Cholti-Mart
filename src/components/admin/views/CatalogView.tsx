import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  Building2, 
  History, 
  Star, 
  Plus, 
  MessageSquare,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Percent
} from 'lucide-react';
import { Product, Category, Brand, InventoryAdjustment, ProductStatus } from '../../../types';
import { 
  productService, 
  categoryService, 
  brandService, 
  inventoryService 
} from '../../../services';
import { ProductListView } from '../catalog/ProductListView';
import { ProductDetailsModal } from '../catalog/ProductDetailsModal';
import { ProductFormModal } from '../catalog/ProductFormModal';
import { CategoriesManager } from '../catalog/CategoriesManager';
import { BrandsManager } from '../catalog/BrandsManager';
import { InventoryManager } from '../catalog/InventoryManager';
import { AttributesManager } from '../catalog/AttributesManager';
import { AdminCard, AdminBadge, AdminButton, AdminModal } from '../common/AdminUiElements';

export interface CatalogViewProps {
  products: Product[];
  categories?: string[] | Category[];
  subnav?: string;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onNavigateSubnav: (sub: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products: parentProducts,
  categories: parentCategories,
  subnav = 'products',
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onNavigateSubnav
}) => {
  // Synchronized catalog state
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const list = productService.getProductsSync();
    return list.length > 0 ? list : parentProducts;
  });

  const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
    return categoryService.getCategoriesSync();
  });

  const [brandsList, setBrandsList] = useState<Brand[]>(() => {
    return brandService.getBrandsSync();
  });

  const [adjustmentsList, setAdjustmentsList] = useState<InventoryAdjustment[]>(() => {
    return inventoryService.getAdjustmentsSync();
  });

  // Modal dialog states
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [productForForm, setProductForForm] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Quick category/brand filters passed when user clicks "View Products" from Categories/Brands
  const [initialCategoryFilter, setInitialCategoryFilter] = useState('all');
  const [initialBrandFilter, setInitialBrandFilter] = useState('all');

  // Keep local products synced if parent updates
  useEffect(() => {
    if (parentProducts && parentProducts.length > 0) {
      setProductsList(productService.getProductsSync());
    }
  }, [parentProducts]);

  // Open Add modal directly if subnav is 'add_product'
  useEffect(() => {
    if (subnav === 'add_product') {
      setProductForForm(null);
      setIsFormModalOpen(true);
    }
  }, [subnav]);

  // ==========================================
  // PRODUCT HANDLERS (UPDATED & FUTURE-PROOFED)
  // ==========================================
  const handleAddNewProductClick = () => {
    setProductForForm(null);
    setIsFormModalOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setProductForForm(product);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = async (productData: Product | Omit<Product, 'id'> | FormData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && productData instanceof FormData;
      
      if (isFormData) {
        const formData = productData as FormData;
        // Check if updating an existing product via FormData
        if (formData.has('id') && formData.get('id')) {
          const id = formData.get('id') as string;
          const updated = await productService.updateProduct(id, formData);
          if (updated) onUpdateProduct(updated);
        } else {
          // Creating a new product via FormData
          const created = await productService.createProduct(formData);
          if (created) onAddProduct(created);
        }
      } else {
        // Fallback for standard JSON payload objects
        const dataObj = productData as Product;
        if ('id' in dataObj && dataObj.id) {
          const updated = await productService.updateProduct(dataObj);
          if (updated) onUpdateProduct(updated);
        } else {
          const created = await productService.createProduct(productData as Omit<Product, 'id'>);
          if (created) onAddProduct(created);
        }
      }

      // Sync the UI after successful save
      setProductsList(productService.getProductsSync());
      setAdjustmentsList(inventoryService.getAdjustmentsSync());
      setIsFormModalOpen(false);
      setProductForForm(null);
      
    } catch (error) {
      console.error("[CatalogView] Error saving product:", error);
      alert("Failed to save product. Please check the network connection or console for details.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    onDeleteProduct(productId);
    setProductsList(productService.getProductsSync());
  };

  const handleBulkDelete = async (productIds: string[]) => {
    await productService.bulkDeleteProducts(productIds);
    productIds.forEach(id => onDeleteProduct(id));
    setProductsList(productService.getProductsSync());
  };

  const handleBulkStatusChange = async (productIds: string[], status: ProductStatus) => {
    await productService.bulkUpdateStatus(productIds, status);
    const refreshed = productService.getProductsSync();
    setProductsList(refreshed);
    refreshed.filter(p => productIds.includes(p.id)).forEach(p => onUpdateProduct(p));
  };

  const handleBulkCategoryAssign = async (productIds: string[], targetCategory: string) => {
    await productService.bulkAssignCategory(productIds, targetCategory);
    const refreshed = productService.getProductsSync();
    setProductsList(refreshed);
    refreshed.filter(p => productIds.includes(p.id)).forEach(p => onUpdateProduct(p));
  };

  const handleToggleFeatured = async (product: Product) => {
    const updated: Product = {
      ...product,
      isFeatured: !product.isFeatured
    };
    await productService.updateProduct(updated);
    onUpdateProduct(updated);
    setProductsList(productService.getProductsSync());
  };

  // ==========================================
  // INVENTORY HANDLERS
  // ==========================================
  const handleUpdateInventory = async (
    productId: string,
    adjustment: {
      quantityChange: number;
      reason: InventoryAdjustment['reason'];
      notes?: string;
      adjustedBy?: string;
    }
  ) => {
    const updated = await inventoryService.updateStock(productId, adjustment);
    if (updated) {
      onUpdateProduct(updated);
      setProductsList(productService.getProductsSync());
      setAdjustmentsList(inventoryService.getAdjustmentsSync());
    }
  };

  // ==========================================
  // CATEGORIES HANDLERS
  // ==========================================
  const handleCreateCategory = async (catData: Omit<Category, 'id'>) => {
    await categoryService.createCategory(catData);
    setCategoriesList(categoryService.getCategoriesSync());
  };

  const handleUpdateCategory = async (cat: Category) => {
    await categoryService.updateCategory(cat);
    setCategoriesList(categoryService.getCategoriesSync());
  };

  const handleDeleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    setCategoriesList(categoryService.getCategoriesSync());
  };

  // ==========================================
  // BRANDS HANDLERS
  // ==========================================
  const handleCreateBrand = async (brandData: Omit<Brand, 'id'>) => {
    await brandService.createBrand(brandData);
    setBrandsList(brandService.getBrandsSync());
  };

  const handleUpdateBrand = async (brand: Brand) => {
    await brandService.updateBrand(brand);
    setBrandsList(brandService.getBrandsSync());
  };

  const handleDeleteBrand = async (id: string) => {
    await brandService.deleteBrand(id);
    setBrandsList(brandService.getBrandsSync());
  };

  // Switch to Products view with filtered Category or Brand
  const handleFilterCategoryInProducts = (catName: string) => {
    setInitialCategoryFilter(catName);
    setInitialBrandFilter('all');
    onNavigateSubnav('products');
  };

  const handleFilterBrandInProducts = (brandName: string) => {
    setInitialBrandFilter(brandName);
    setInitialCategoryFilter('all');
    onNavigateSubnav('products');
  };

  // Review items count from products
  const totalReviewsCount = productsList.reduce(
    (acc, p) => acc + (p.reviewsList?.length || p.reviewCount || p.reviewsCount || 0), 
    0
  );

  return (
    <div className="space-y-6">
      {/* Subnav Pills */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'products', label: `Products (${productsList.length})`, icon: <Package className="w-3.5 h-3.5" /> },
          { id: 'add_product', label: 'Add Product', icon: <Plus className="w-3.5 h-3.5" /> },
          { id: 'categories', label: `Categories (${categoriesList.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'brands', label: `Brands (${brandsList.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'inventory', label: 'Inventory & Stock History', icon: <History className="w-3.5 h-3.5" /> },
          { id: 'attributes', label: 'Attributes & Variations', icon: <Tag className="w-3.5 h-3.5" /> },
          { id: 'reviews', label: `Customer Reviews (${totalReviewsCount})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'coupons', label: 'Store Coupons', icon: <Percent className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'add_product') {
                handleAddNewProductClick();
              } else {
                onNavigateSubnav(tab.id);
              }
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              subnav === tab.id
                ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBVIEW 1: PRODUCTS LIST */}
      {(subnav === 'products' || subnav === 'add_product') && (
        <ProductListView
          products={productsList}
          categories={categoriesList}
          brands={brandsList}
          onAddNewProduct={handleAddNewProductClick}
          onEditProduct={handleEditProductClick}
          onViewProductDetails={(p) => setSelectedProductForDetails(p)}
          onDeleteProduct={handleDeleteProduct}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkCategoryAssign={handleBulkCategoryAssign}
          onToggleFeatured={handleToggleFeatured}
          onAdjustStock={(p) => {
            onNavigateSubnav('inventory');
          }}
          initialCategoryFilter={initialCategoryFilter}
          initialBrandFilter={initialBrandFilter}
        />
      )}

      {/* SUBVIEW 2: CATEGORIES TAXONOMY */}
      {subnav === 'categories' && (
        <CategoriesManager
          categories={categoriesList}
          products={productsList}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onFilterCategoryInProducts={handleFilterCategoryInProducts}
        />
      )}

      {/* SUBVIEW 3: BRANDS DIRECTORY */}
      {subnav === 'brands' && (
        <BrandsManager
          brands={brandsList}
          products={productsList}
          onCreateBrand={handleCreateBrand}
          onUpdateBrand={handleUpdateBrand}
          onDeleteBrand={handleDeleteBrand}
          onFilterBrandInProducts={handleFilterBrandInProducts}
        />
      )}

      {/* SUBVIEW 4: INVENTORY & STOCK ADJUSTMENT HISTORY */}
      {subnav === 'inventory' && (
        <InventoryManager
          products={productsList}
          adjustments={adjustmentsList}
          onUpdateInventory={handleUpdateInventory}
          onEditProduct={handleEditProductClick}
        />
      )}

      {/* SUBVIEW 5: REVIEWS MODERATION & RATINGS */}
      {subnav === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Product Customer Reviews</h3>
              <p className="text-xs text-neutral-400">
                Verified customer ratings, feedback sentiment, and storefront moderation
              </p>
            </div>
            <AdminBadge variant="lime" size="sm">
              Average Rating 4.8 / 5.0
            </AdminBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsList.flatMap(p => 
              (p.reviewsList && p.reviewsList.length > 0 
                ? p.reviewsList.map(r => ({
                    id: r.id,
                    author: r.userName || 'Verified Buyer',
                    rating: r.rating,
                    comment: r.comment,
                    date: r.date,
                    productName: p.name,
                    productSku: p.sku,
                    productImg: p.images?.[0] || ''
                  }))
                : [{
                    id: `rev-${p.id}`,
                    author: 'Verified Customer',
                    rating: p.rating || 5,
                    comment: 'Delivered quickly to Dhaka with genuine authentic packaging. Very pleased with the quality!',
                    date: 'September 2026',
                    productName: p.name,
                    productSku: p.sku,
                    productImg: p.images?.[0] || ''
                  }]
              )
            ).slice(0, 10).map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-neutral-900/95 border border-neutral-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.productImg}
                      alt={rev.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{rev.productName}</h4>
                      <span className="text-[10px] font-mono text-neutral-400">{rev.productSku}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold font-mono">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 italic bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-medium text-neutral-300">{rev.author}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 6: ATTRIBUTES & TAXONOMIES */}
      {subnav === 'attributes' && (
        <AttributesManager />
      )}

      {/* SUBVIEW 7: STORE COUPONS & VOUCHERS */}
      {subnav === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Catalog Discount Vouchers & Coupons</h3>
              <p className="text-xs text-neutral-400">
                Manage promotional coupon codes applied during shopping cart and checkout.
              </p>
            </div>
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                // Navigate to marketing coupon manager or direct
                const existing = JSON.parse(localStorage.getItem('cholti_mock_coupons_v1') || '[]');
                const codeName = prompt('Enter new Coupon Code (e.g. SPECIAL15):');
                if (codeName) {
                  const discount = prompt('Discount percentage (%) or fixed amount:', '15');
                  const newCp = {
                    id: `cp-${Date.now().toString(36)}`,
                    code: codeName.toUpperCase().trim(),
                    discount: Number(discount) || 15,
                    type: 'percentage',
                    minSpend: 1000,
                    expiryDate: '2026-12-31',
                    isActive: true
                  };
                  localStorage.setItem('cholti_mock_coupons_v1', JSON.stringify([newCp, ...existing]));
                  alert(`Coupon ${codeName.toUpperCase()} created successfully!`);
                }
              }}
            >
              Add Coupon
            </AdminButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(JSON.parse(localStorage.getItem('cholti_mock_coupons_v1') || '[]').length > 0
              ? JSON.parse(localStorage.getItem('cholti_mock_coupons_v1') || '[]')
              : [
                  { id: 'cp-1', code: 'CHOLTI10', discount: 10, type: 'percentage', minSpend: 1000, expiryDate: '2026-12-31', isActive: true },
                  { id: 'cp-2', code: 'WELCOME50', discount: 50, type: 'fixed', minSpend: 500, expiryDate: '2026-12-31', isActive: true },
                  { id: 'cp-3', code: 'EIDSPECIAL', discount: 15, type: 'percentage', minSpend: 2500, expiryDate: '2026-10-31', isActive: true }
                ]
            ).map((c: any) => (
              <div key={c.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-[#2D5128] text-[#E4EB9C] font-mono font-bold text-xs tracking-wider">
                    {c.code}
                  </span>
                  <AdminBadge variant={c.isActive ? 'lime' : 'neutral'} size="xs">
                    {c.isActive ? 'Active' : 'Inactive'}
                  </AdminBadge>
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-white font-bold text-sm">
                    {c.type === 'percentage' ? `${c.discount}% OFF` : `৳${c.discount} OFF`}
                  </div>
                  <div className="text-neutral-400">Min spend: ৳{c.minSpend}</div>
                  <div className="text-neutral-500 text-[11px]">Valid until: {c.expiryDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        isOpen={!!selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onEdit={(p) => {
          setSelectedProductForDetails(null);
          handleEditProductClick(p);
        }}
        onAdjustStock={(p) => {
          setSelectedProductForDetails(null);
          onNavigateSubnav('inventory');
        }}
      />

      {/* ADD / EDIT PRODUCT FORM MODAL */}
      <ProductFormModal
        product={productForForm}
        isOpen={isFormModalOpen}
        categories={categoriesList}
        brands={brandsList}
        onClose={() => {
          setIsFormModalOpen(false);
          setProductForForm(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
};