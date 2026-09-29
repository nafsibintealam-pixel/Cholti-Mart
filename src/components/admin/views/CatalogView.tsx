import React, { useState, useEffect } from 'react';
import { Package, Layers, Building2, History, Star, Plus, MessageSquare, Percent } from 'lucide-react';
import { Product, Category, Brand, InventoryAdjustment, ProductStatus } from '../../../types';
import { productService, categoryService, brandService, inventoryService } from '../../../services';
import { ProductListView } from '../catalog/ProductListView';
import { ProductDetailsModal } from '../catalog/ProductDetailsModal';
import { ProductFormModal } from '../catalog/ProductFormModal';
import { CategoriesManager } from '../catalog/CategoriesManager';
import { BrandsManager } from '../catalog/BrandsManager';
import { InventoryManager } from '../catalog/InventoryManager';
import { AttributesManager } from '../catalog/AttributesManager';
import { AdminBadge, AdminButton } from '../common/AdminUiElements';

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
  const [productsList, setProductsList] = useState<Product[]>(() => productService.getProductsSync());
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => categoryService.getCategoriesSync());
  const [brandsList, setBrandsList] = useState<Brand[]>(() => brandService.getBrandsSync());
  const [adjustmentsList, setAdjustmentsList] = useState<InventoryAdjustment[]>(() => inventoryService.getAdjustmentsSync());

  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [productForForm, setProductForForm] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [initialCategoryFilter, setInitialCategoryFilter] = useState('all');
  const [initialBrandFilter, setInitialBrandFilter] = useState('all');

  useEffect(() => {
    if (parentProducts && parentProducts.length > 0) {
      setProductsList([...productService.getProductsSync()]);
    }
  }, [parentProducts]);

  useEffect(() => {
    if (subnav === 'add_product') {
      setProductForForm(null);
      setIsFormModalOpen(true);
    }
  }, [subnav]);

  // ==========================================
  // PERFECTED HANDLERS WITH SPREAD [...] FOR UI REACTIVITY
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
        if (formData.has('id') && formData.get('id')) {
          const id = formData.get('id') as string;
          const updated = await productService.updateProduct(id, formData);
          if (updated) onUpdateProduct(updated);
        } else {
          const created = await productService.createProduct(formData);
          if (created) onAddProduct(created);
        }
      } else {
        const dataObj = productData as Product;
        if ('id' in dataObj && dataObj.id) {
          const updated = await productService.updateProduct(dataObj);
          if (updated) onUpdateProduct(updated);
        } else {
          const created = await productService.createProduct(productData as Omit<Product, 'id'>);
          if (created) onAddProduct(created);
        }
      }

      // 💡 MAGIC FIX: Using [...] forces React to re-render immediately!
      setTimeout(() => {
          setProductsList([...productService.getProductsSync()]);
          setAdjustmentsList([...inventoryService.getAdjustmentsSync()]);
      }, 500); // Small delay allows backend to finalize
      
      setIsFormModalOpen(false);
      setProductForForm(null);
      
    } catch (error) {
      console.error("[CatalogView] Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    onDeleteProduct(productId);
    setProductsList([...productService.getProductsSync()]);
  };

  const handleBulkDelete = async (productIds: string[]) => {
    await productService.bulkDeleteProducts(productIds);
    productIds.forEach(id => onDeleteProduct(id));
    setProductsList([...productService.getProductsSync()]);
  };

  const handleBulkStatusChange = async (productIds: string[], status: ProductStatus) => {
    await productService.bulkUpdateStatus(productIds, status);
    setProductsList([...productService.getProductsSync()]);
  };

  const handleBulkCategoryAssign = async (productIds: string[], targetCategory: string) => {
    await productService.bulkAssignCategory(productIds, targetCategory);
    setProductsList([...productService.getProductsSync()]);
  };

  const handleToggleFeatured = async (product: Product) => {
    const updated = { ...product, isFeatured: !product.isFeatured };
    await productService.updateProduct(updated);
    setProductsList([...productService.getProductsSync()]);
  };

  const handleUpdateInventory = async (productId: string, adjustment: any) => {
    await inventoryService.updateStock(productId, adjustment);
    setProductsList([...productService.getProductsSync()]);
    setAdjustmentsList([...inventoryService.getAdjustmentsSync()]);
  };

  // 💡 MAGIC FIX: Categories UI update instantly
  const handleCreateCategory = async (catData: any) => {
    await categoryService.createCategory(catData);
    setCategoriesList([...categoryService.getCategoriesSync()]);
  };

  const handleUpdateCategory = async (cat: any) => {
    await categoryService.updateCategory(cat);
    setCategoriesList([...categoryService.getCategoriesSync()]);
  };

  const handleDeleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    setCategoriesList([...categoryService.getCategoriesSync()]);
  };

  // Brands Handlers
  const handleCreateBrand = async (brandData: any) => {
    await brandService.createBrand(brandData);
    setBrandsList([...brandService.getBrandsSync()]);
  };

  const handleUpdateBrand = async (brand: any) => {
    await brandService.updateBrand(brand);
    setBrandsList([...brandService.getBrandsSync()]);
  };

  const handleDeleteBrand = async (id: string) => {
    await brandService.deleteBrand(id);
    setBrandsList([...brandService.getBrandsSync()]);
  };

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

  const totalReviewsCount = productsList.reduce((acc, p) => acc + (p.reviewsList?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'products', label: `Products (${productsList.length})`, icon: <Package className="w-3.5 h-3.5" /> },
          { id: 'add_product', label: 'Add Product', icon: <Plus className="w-3.5 h-3.5" /> },
          { id: 'categories', label: `Categories (${categoriesList.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'brands', label: `Brands (${brandsList.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'inventory', label: 'Inventory', icon: <History className="w-3.5 h-3.5" /> },
          { id: 'attributes', label: 'Attributes', icon: <Tag className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.id === 'add_product' ? handleAddNewProductClick() : onNavigateSubnav(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              subnav === tab.id ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

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
          onAdjustStock={(p) => onNavigateSubnav('inventory')}
          initialCategoryFilter={initialCategoryFilter}
          initialBrandFilter={initialBrandFilter}
        />
      )}

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

      {subnav === 'inventory' && (
        <InventoryManager
          products={productsList}
          adjustments={adjustmentsList}
          onUpdateInventory={handleUpdateInventory}
          onEditProduct={handleEditProductClick}
        />
      )}

      {subnav === 'attributes' && <AttributesManager />}

      <ProductDetailsModal
        product={selectedProductForDetails}
        isOpen={!!selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onEdit={(p) => { setSelectedProductForDetails(null); handleEditProductClick(p); }}
        onAdjustStock={(p) => { setSelectedProductForDetails(null); onNavigateSubnav('inventory'); }}
      />

      <ProductFormModal
        product={productForForm}
        isOpen={isFormModalOpen}
        categories={categoriesList}
        brands={brandsList}
        onClose={() => { setIsFormModalOpen(false); setProductForForm(null); }}
        onSave={handleSaveProduct}
      />
    </div>
  );
};