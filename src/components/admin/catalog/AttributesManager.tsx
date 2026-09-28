import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Layers, 
  Tag, 
  Eye, 
  EyeOff, 
  Search,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ProductAttribute } from '../../../types';
import { AdminCard, AdminBadge, AdminButton, AdminConfirmDialog } from '../common/AdminUiElements';

export interface AttributesManagerProps {
  attributes?: ProductAttribute[];
  onSaveAttributes?: (attrs: ProductAttribute[]) => void;
}

const INITIAL_ATTRIBUTES: ProductAttribute[] = [
  {
    id: 'attr-color',
    name: 'Color',
    slug: 'pa_color',
    options: ['Emerald Green', 'Royal Lime', 'Midnight Black', 'Ivory Cream', 'Ruby Maroon'],
    visible: true,
    variation: true
  },
  {
    id: 'attr-size',
    name: 'Size',
    slug: 'pa_size',
    options: ['S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    visible: true,
    variation: true
  },
  {
    id: 'attr-weight',
    name: 'Weight / Pack Size',
    slug: 'pa_weight',
    options: ['250 gm', '500 gm', '1 kg', '2 kg', '5 kg Bag'],
    visible: true,
    variation: true
  },
  {
    id: 'attr-fabric',
    name: 'Fabric & Material',
    slug: 'pa_fabric',
    options: ['100% Organic Cotton', 'Tangail Handloom Silk', 'Jamdani Weave', 'Linen Blend', 'Khadi'],
    visible: true,
    variation: false
  },
  {
    id: 'attr-warranty',
    name: 'Warranty Guarantee',
    slug: 'pa_warranty',
    options: ['7 Days Replacement', '6 Months Official Brand Warranty', '1 Year Service Warranty', 'No Warranty'],
    visible: true,
    variation: false
  }
];

export const AttributesManager: React.FC<AttributesManagerProps> = ({
  attributes = INITIAL_ATTRIBUTES,
  onSaveAttributes
}) => {
  const [attrList, setAttrList] = useState<ProductAttribute[]>(() => {
    const saved = localStorage.getItem('cholti_admin_attributes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return attributes;
      }
    }
    return attributes;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<ProductAttribute | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    optionsInput: '',
    visible: true,
    variation: true
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveList = (newList: ProductAttribute[]) => {
    setAttrList(newList);
    localStorage.setItem('cholti_admin_attributes_v1', JSON.stringify(newList));
    if (onSaveAttributes) onSaveAttributes(newList);
  };

  const handleOpenAdd = () => {
    setEditingAttr(null);
    setFormData({
      name: '',
      slug: '',
      optionsInput: '',
      visible: true,
      variation: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (attr: ProductAttribute) => {
    setEditingAttr(attr);
    setFormData({
      name: attr.name,
      slug: attr.slug || '',
      optionsInput: attr.options.join(', '),
      visible: attr.visible,
      variation: !!attr.variation
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedOptions = formData.optionsInput
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    const slug = formData.slug.trim() || `pa_${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    if (editingAttr) {
      const updated = attrList.map(item => 
        item.id === editingAttr.id 
          ? {
              ...item,
              name: formData.name.trim(),
              slug,
              options: parsedOptions,
              visible: formData.visible,
              variation: formData.variation
            }
          : item
      );
      saveList(updated);
      showToast(`Attribute "${formData.name}" updated successfully!`);
    } else {
      const created: ProductAttribute = {
        id: `attr-${Date.now().toString(36)}`,
        name: formData.name.trim(),
        slug,
        options: parsedOptions,
        visible: formData.visible,
        variation: formData.variation
      };
      saveList([created, ...attrList]);
      showToast(`New attribute "${formData.name}" created!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const itemToDelete = attrList.find(a => a.id === deleteId);
    const filtered = attrList.filter(a => a.id !== deleteId);
    saveList(filtered);
    setDeleteId(null);
    showToast(`Attribute "${itemToDelete?.name || ''}" removed.`);
  };

  const filteredAttributes = attrList.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E4EB9C]" />
            <h3 className="text-base font-bold text-white">Product Attributes & Variation Taxonomies</h3>
          </div>
          <p className="text-xs text-neutral-400">
            Define global product terms (Colors, Sizes, Materials, Weights) compatible with WooCommerce variations.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add New Attribute
        </AdminButton>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attributes or terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#8DA750]"
          />
        </div>
        <span className="text-xs text-neutral-400 font-mono ml-auto">
          {filteredAttributes.length} taxonomies
        </span>
      </div>

      {/* Attributes Grid */}
      {filteredAttributes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <Sliders className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-sm font-semibold text-neutral-300">No attributes match your filter</p>
          <p className="text-xs text-neutral-500">Create a new attribute like Color, Size or Weight.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAttributes.map((attr) => (
            <div 
              key={attr.id}
              className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-[#8DA750]/40 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{attr.name}</h4>
                    {attr.variation ? (
                      <AdminBadge variant="lime" size="xs">Variations</AdminBadge>
                    ) : (
                      <AdminBadge variant="neutral" size="xs">Specs Only</AdminBadge>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 block">
                    Slug: {attr.slug || attr.name.toLowerCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(attr)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                    title="Edit Attribute"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(attr.id)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/40 text-neutral-300 hover:text-red-400"
                    title="Delete Attribute"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terms Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Configured Terms ({attr.options.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {attr.options.map((opt, oIdx) => (
                    <span 
                      key={oIdx}
                      className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-200 font-medium"
                    >
                      {opt}
                    </span>
                  ))}
                  {attr.options.length === 0 && (
                    <span className="text-xs text-neutral-500 italic">No terms entered yet</span>
                  )}
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  {attr.visible ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Visible on product pages</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Hidden from customer spec table</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Attribute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingAttr ? `Edit Attribute: ${editingAttr.name}` : 'Create New Product Attribute'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Attribute Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fabric Material, Sleeve Length, Battery Capacity"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Slug / Taxonomy Key (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. pa_fabric_material"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-[#8DA750]"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Leave blank to auto-generate a WooCommerce standard slug.
                </span>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Terms / Options (Comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Red, Blue, Green, Navy, Mustard Yellow"
                  value={formData.optionsInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, optionsInput: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#8DA750]"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Separate each selectable value with a comma.
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.variation}
                    onChange={(e) => setFormData(prev => ({ ...prev, variation: e.target.checked }))}
                    className="rounded bg-neutral-950 border-neutral-700 text-[#2D5128] focus:ring-[#8DA750]"
                  />
                  <span className="text-neutral-300">Enable for Variable Products (Used to create purchase variations)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                    className="rounded bg-neutral-950 border-neutral-700 text-[#2D5128] focus:ring-[#8DA750]"
                  />
                  <span className="text-neutral-300">Visible on Product Specifications Tab</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <AdminButton
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  variant="primary"
                  size="sm"
                  type="submit"
                >
                  {editingAttr ? 'Update Attribute' : 'Create Attribute'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteId}
        title="Delete Attribute Taxonomy"
        message="Are you sure you want to delete this attribute? Variable products currently mapped to these options will keep their custom values, but the global taxonomy will be removed."
        confirmText="Delete Attribute"
        isDanger
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />

    </div>
  );
};
