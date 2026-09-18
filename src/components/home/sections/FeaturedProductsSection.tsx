import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { ProductCard } from '../../product/ProductCard';

export const FeaturedProductsSection: React.FC = () => {
  const { products, navigateTo } = useShop();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fashion' | 'gadgets' | 'home'>('all');

  // Filter products based on selected tab
  const filteredProducts = products.filter(p => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'fashion') return p.category.includes('Fashion') || p.category.includes('Jewelry');
    if (selectedFilter === 'gadgets') return p.category.includes('Gadget') || p.category.includes('Computer');
    if (selectedFilter === 'home') return p.category.includes('Home') || p.category.includes('Kitchen');
    return true;
  }).slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/50 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Popular items backed by 100% verified customer ratings and fast delivery.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Picks' },
              { id: 'fashion', label: 'Fashion & Jewelry' },
              { id: 'gadgets', label: 'Gadgets & Tech' },
              { id: 'home', label: 'Home & Living' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-900 text-xs sm:text-sm font-bold rounded-2xl border border-neutral-300 transition-all shadow-2xs hover:shadow-xs"
          >
            <span>Browse Full Product Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
