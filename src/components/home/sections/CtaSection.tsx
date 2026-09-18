import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export const CtaSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142C14] text-[#E4EB9C] border border-[#8DA750]/40 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8DA750]" />
              <span>100% Risk-Free Cash on Delivery</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Everyday Routine?
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
              Explore thousands of curated lifestyle products, jewelry pieces, and workspace tools with fast nationwide doorstep fulfillment.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#2D5128] hover:bg-[#142C14] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 border border-[#8DA750]/40 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#E4EB9C]" />
                <span>Start Shopping Now</span>
              </button>

              <button
                onClick={() => navigateTo('shop', 'Special Offers')}
                className="w-full sm:w-auto px-7 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-bold rounded-2xl border border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Discount Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
