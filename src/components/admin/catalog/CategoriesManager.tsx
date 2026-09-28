import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Package, 
  ExternalLink, 
  Check, 
  Image as ImageIcon,
  FolderTree,
  Tag
} from 'lucide-react';
import { Category, Product } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminModal, 
  AdminConfirmDialog 
} from '../common/AdminUiElements';

export interface CategoriesManagerProps {
  categories: Category[];
  products: Product[];
  onCreateCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onFilterCategoryInProducts: (categoryName: string) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onFilterCategoryInProducts
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [subcategoriesInput, setSubcategoriesInput] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.banglaName && c.banglaName.includes(search)) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setBanglaName('');
    setSlug('');
    setImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80');
    setSubcategoriesInput('General, Essentials, Accessories');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setBanglaName(cat.banglaName || '');
    setSlug(cat.slug);
    setImage(cat.image || '');
    setSubcategoriesInput(cat.subcategories ? cat.subcategories.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subs = subcategoriesInput.split(',').map(s => s.trim()).filter(Boolean);
    const catSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: name.trim(),
        banglaName: banglaName.trim() || undefined,
        slug: catSlug,
        image,
        subcategories: subs
      });
    } else {
      onCreateCategory({
        name: name.trim(),
        banglaName: banglaName.trim() || undefined,
        slug: catSlug,
        image,
        itemCount: 0,
        subcategories: subs
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories by English or Bangla name..."
          />
        </div>
        <AdminButton
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add New Category
        </AdminButton>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const liveProductCount = products.filter(p => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              {/* Category Card Header with Image */}
              <div className="p-4 flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{cat.name}</h3>
                  </div>
                  {cat.banglaName && (
                    <p className="text-xs text-[#E4EB9C] font-medium mt-0.5">{cat.banglaName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 font-mono text-[11px] text-neutral-400">
                    <span>/{cat.slug}</span>
                    <span>•</span>
                    <span className="text-[#8DA750] font-bold">{liveProductCount} Active Products</span>
                  </div>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="px-4 py-2.5 bg-neutral-950/60 border-t border-b border-neutral-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Subcategories:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    cat.subcategories.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-neutral-500 italic">No subcategories defined</span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-neutral-900/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onFilterCategoryInProducts(cat.name)}
                  className="text-xs text-[#E4EB9C] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Package className="w-3.5 h-3.5" /> View Products
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Category Name (English) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="e.g. Traditional Handloom"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Bangla Display Name (Optional)
            </label>
            <input
              type="text"
              value={banglaName}
              onChange={(e) => setBanglaName(e.target.value)}
              placeholder="e.g. ঐতিহ্যবাহী হস্তশিল্প"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Category URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="traditional-handloom"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Subcategories (Comma separated)
            </label>
            <input
              type="text"
              value={subcategoriesInput}
              onChange={(e) => setSubcategoriesInput(e.target.value)}
              placeholder="Kurtis, Sarees, Dupattas, Fabrics"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <AdminButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            onDeleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to remove category "${categoryToDelete?.name}"? Existing products under this category will remain in the catalog.`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
