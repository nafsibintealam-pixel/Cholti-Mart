import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Package, 
  Globe, 
  Star, 
  MapPin 
} from 'lucide-react';
import { Brand, Product } from '../../../types';
import { 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminModal, 
  AdminConfirmDialog 
} from '../common/AdminUiElements';

export interface BrandsManagerProps {
  brands: Brand[];
  products: Product[];
  onCreateBrand: (brand: Omit<Brand, 'id'>) => void;
  onUpdateBrand: (brand: Brand) => void;
  onDeleteBrand: (id: string) => void;
  onFilterBrandInProducts: (brandName: string) => void;
}

export const BrandsManager: React.FC<BrandsManagerProps> = ({
  brands,
  products,
  onCreateBrand,
  onUpdateBrand,
  onDeleteBrand,
  onFilterBrandInProducts
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [origin, setOrigin] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.origin && b.origin.toLowerCase().includes(search.toLowerCase())) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setLogo('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80');
    setOrigin('Dhaka, Bangladesh');
    setWebsite('https://choltimart.com');
    setDescription('Leading lifestyle and authentic consumer brand in Bangladesh.');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setLogo(b.logo || '');
    setOrigin(b.origin || '');
    setWebsite(b.website || '');
    setDescription(b.description || '');
    setFeatured(!!b.featured);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const brandSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingBrand) {
      onUpdateBrand({
        ...editingBrand,
        name: name.trim(),
        slug: brandSlug,
        logo: logo.trim() || undefined,
        origin: origin.trim() || undefined,
        website: website.trim() || undefined,
        description: description.trim() || undefined,
        featured
      });
    } else {
      onCreateBrand({
        name: name.trim(),
        slug: brandSlug,
        logo: logo.trim() || undefined,
        origin: origin.trim() || undefined,
        website: website.trim() || undefined,
        description: description.trim() || undefined,
        productCount: 0,
        featured
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search brands by brand name or origin..."
          />
        </div>
        <AdminButton
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add New Brand
        </AdminButton>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((b) => {
          const liveProductCount = products.filter(p => p.brand === b.name).length;

          return (
            <div
              key={b.id}
              className="bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-1">
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.name}
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-neutral-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {b.name}
                        {b.featured && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </h3>
                      {b.origin && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-500" /> {b.origin}
                        </p>
                      )}
                    </div>
                  </div>

                  <AdminBadge variant="lime" size="xs">
                    {liveProductCount} SKUs
                  </AdminBadge>
                </div>

                {b.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-neutral-950/60 border-t border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onFilterBrandInProducts(b.name)}
                  className="text-xs text-[#E4EB9C] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Package className="w-3.5 h-3.5" /> Filter Products
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandToDelete(b)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Brand Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? 'Edit Brand' : 'Create New Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Brand Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingBrand) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="e.g. Aarong Earth"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Brand Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="aarong-earth"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Country / City of Origin
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Website Link
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Logo Thumbnail URL
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Brand Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of brand ethos and product lines..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-[#8DA750]"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2">
            <input
              type="checkbox"
              id="brand-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#8DA750] bg-neutral-900 border-neutral-700"
            />
            <label htmlFor="brand-featured" className="text-xs font-bold text-white cursor-pointer flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Feature this brand on homepage carousels
            </label>
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
              {editingBrand ? 'Update Brand' : 'Create Brand'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onConfirm={() => {
          if (brandToDelete) {
            onDeleteBrand(brandToDelete.id);
            setBrandToDelete(null);
          }
        }}
        title="Delete Brand"
        message={`Are you sure you want to delete brand "${brandToDelete?.name}"?`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
