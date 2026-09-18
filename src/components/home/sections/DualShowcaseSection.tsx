import React from 'react';
import { Sparkles, Flame, ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { ProductCard } from '../../product/ProductCard';

export const DualShowcaseSection: React.FC = () => {
  const { products, navigateTo } = useShop();

  const newArrivals = products.filter(p => p.isNewArrival || p.badge === 'New').slice(0, 4);
  const trendingItems = products.filter(p => p.isTrending || p.rating >= 4.8).slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Row 1: New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  Fresh Arrivals This Week
                </h2>
                <p className="text-xs text-neutral-500">Recently added to Cholti Mart inventory</p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('shop', 'New Arrivals')}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Row 2: Trending / Top Rated */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  Trending Right Now
                </h2>
                <p className="text-xs text-neutral-500">Most ordered across Dhaka and nationwide districts</p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('shop', 'Trending')}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {trendingItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
