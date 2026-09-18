import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { CATEGORIES_DATA } from '../../../data/categories';

export const CategorySection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section id="shop-by-category" className="py-12 sm:py-16 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              From comfortable apparel to modern desk accessories and household tools.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 hover:text-emerald-700 transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateTo('shop', cat.name)}
              className="group text-left bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl p-3 border border-neutral-200/70 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center shadow-2xs hover:shadow-md"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-200 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 bg-neutral-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                  {cat.itemCount} items
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                {cat.banglaName}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
