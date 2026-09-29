import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Package, Image as ImageIcon, FolderTree, Tag, Upload, X } from 'lucide-react';
import { Category, Product } from '../../../types';
import { AdminCard, AdminBadge, AdminButton, AdminSearchInput, AdminModal, AdminConfirmDialog } from '../common/AdminUiElements';

export interface CategoriesManagerProps {
  categories: Category[];
  products: Product[];
  onCreateCategory: (category: Omit<Category, 'id'> | FormData) => void;
  onUpdateCategory: (category: Category | FormData) => void;
  onDeleteCategory: (id: string) => void;
  onFilterCategoryInProducts: (categoryName: string) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories = [], // Default empty array to prevent map/filter crash
  products = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onFilterCategoryInProducts
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [subcategoriesInput, setSubcategoriesInput] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // 💡 MAGIC FIX: Safe filtering preventing 'toLowerCase' on undefined values
  const filteredCategories = categories.filter(c => {
    const catName = c?.name || '';
    const catBangla = c?.banglaName || '';
    const searchTerm = search?.toLowerCase() || '';
    
    return catName.toLowerCase().includes(searchTerm) || catBangla.includes(searchTerm);
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setBanglaName('');
    setImageFile(null);
    setImagePreview('');
    setSubcategoriesInput('General, Essentials, Accessories');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat?.name || '');
    setBanglaName(cat?.banglaName || '');
    setImageFile(null);
    setImagePreview(cat?.image || cat?.image_url || '');
    setSubcategoriesInput(cat?.subcategories ? cat.subcategories.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subs = subcategoriesInput.split(',').map(s => s.trim()).filter(Boolean);
    const autoSlug = (name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const formData = new FormData();
    formData.append('name', name.trim());
    if (banglaName.trim()) formData.append('banglaName', banglaName.trim());
    formData.append('slug', autoSlug || `cat-${Date.now()}`);
    formData.append('subcategories', JSON.stringify(subs));

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imagePreview && !imagePreview.startsWith('blob:')) {
      formData.append('image_url', imagePreview);
    }

    if (editingCategory) {
      formData.append('id', editingCategory.id);
      onUpdateCategory(formData as any);
    } else {
      onCreateCategory(formData as any);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <AdminSearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>
        <AdminButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add New Category
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat, index) => {
          // 💡 Safe fallback values
          const catId = cat?.id || `temp-id-${index}`;
          const catName = cat?.name || 'Unnamed Category';
          const liveProductCount = products.filter(p => p?.category === catName).length;
          const displayImage = cat?.image || cat?.image_url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80';

          return (
            <div key={catId} className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div className="p-4 flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                  <img src={displayImage} alt={catName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{catName}</h3>
                  {cat?.banglaName && <p className="text-xs text-[#E4EB9C] font-medium mt-0.5">{cat.banglaName}</p>}
                  <div className="flex items-center gap-2 mt-1.5 font-mono text-[11px] text-neutral-400">
                    <span className="text-[#8DA750] font-bold">{liveProductCount} Active Products</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-neutral-950/60 border-t border-b border-neutral-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">Subcategories:</span>
                <div className="flex flex-wrap gap-1">
                  {cat?.subcategories && cat.subcategories.length > 0 ? (
                    cat.subcategories.map((sub, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">{sub}</span>
                    ))
                  ) : <span className="text-[10px] text-neutral-500 italic">No subcategories</span>}
                </div>
              </div>

              <div className="p-3 bg-neutral-900/80 flex items-center justify-between">
                <button type="button" onClick={() => onFilterCategoryInProducts(catName)} className="text-xs text-[#E4EB9C] hover:underline flex items-center gap-1 font-semibold">
                  <Package className="w-3.5 h-3.5" /> View Products
                </button>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => handleOpenEdit(cat)} className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setCategoryToDelete(cat)} className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Create New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">Category Name (English) <span className="text-red-400">*</span></label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Traditional Handloom" className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">Bangla Display Name (Optional)</label>
            <input type="text" value={banglaName} onChange={(e) => setBanglaName(e.target.value)} placeholder="e.g. ঐতিহ্যবাহী হস্তশিল্প" className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">Category Cover Image</label>
            {imagePreview ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button type="button" onClick={() => { setImagePreview(''); setImageFile(null); }} className="absolute top-2 right-2 w-7 h-7 bg-red-600/80 hover:bg-red-600 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-neutral-800 hover:border-[#8DA750] bg-neutral-950/50 flex flex-col items-center justify-center transition-colors">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="w-6 h-6 text-neutral-500 mb-2" />
                <span className="text-xs text-neutral-400 font-medium">Click or Drag & Drop Image</span>
                <span className="text-[10px] text-neutral-500 mt-1">Supports JPG, PNG, WEBP</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">Subcategories (Comma separated)</label>
            <input type="text" value={subcategoriesInput} onChange={(e) => setSubcategoriesInput(e.target.value)} placeholder="Kurtis, Sarees, Dupattas, Fabrics" className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <AdminButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" variant="primary" size="sm">{editingCategory ? 'Update Category' : 'Create Category'}</AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} onConfirm={() => { if (categoryToDelete) { onDeleteCategory(categoryToDelete?.id || ''); setCategoryToDelete(null); } }} title="Delete Category" message={`Are you sure you want to remove "${categoryToDelete?.name || 'this category'}"?`} confirmText="Yes, Delete" variant="danger" />
    </div>
  );
};