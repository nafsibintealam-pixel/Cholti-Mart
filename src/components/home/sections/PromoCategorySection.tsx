import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export const PromoCategorySection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Anti-Tarnish Jewelry & Fashion */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-8 text-white group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"
              alt="Women's Fashion and Jewelry"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Trending Adornments
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-2">
                18K Anti-Tarnish Jewelry & Kurti Sets
              </h3>
              <p className="text-xs text-neutral-300 max-w-sm mb-4">
                Water-resistant, hypoallergenic daily wear accessories made for effortless elegance.
              </p>
              <button
                onClick={() => navigateTo('shop', "Women's Fashion")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold rounded-xl transition-colors"
              >
                <span>Shop Jewelry & Apparel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Modern Smart Gadgets & Desk Setup */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-8 text-white group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
              alt="Smart Gadgets and Computer Accessories"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Work & Productivity
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-2">
                Laptop Stands & Smart Electronics
              </h3>
              <p className="text-xs text-neutral-300 max-w-sm mb-4">
                Ergonomic accessories to boost posture and streamline your workstation productivity.
              </p>
              <button
                onClick={() => navigateTo('shop', 'Computer Accessories')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold rounded-xl transition-colors"
              >
                <span>Shop Workspace Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
