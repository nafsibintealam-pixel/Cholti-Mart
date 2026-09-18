import React, { useState } from 'react';
import { Tag, ArrowRight, Check, Copy } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useCustomizer } from '../../../context/CustomizerContext';

export const OffersBannerSection: React.FC = () => {
  const { navigateTo } = useShop();
  const { config } = useCustomizer();
  const promo = config.promoBanner;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const coupons = [
    {
      code: promo.couponCode,
      label: promo.couponDiscount,
      description: 'Applicable across all cart items during active campaign',
    },
    {
      code: promo.secondaryCoupon,
      label: promo.secondaryCouponDiscount,
      description: 'Instant discount voucher on first order over ৳1,500',
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#142C14] via-[#2D5128] to-[#142C14] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-[#8DA750]/30">
          
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#E4EB9C]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-[#537B2F]/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Promo Details */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4EB9C]/20 border border-[#8DA750]/50 text-[#E4EB9C] text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" />
                <span>{promo.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {promo.titleMain}{' '}
                <span className="text-[#E4EB9C]">{promo.titleAccent}</span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-200 max-w-xl leading-relaxed">
                {promo.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigateTo('shop', 'Special Offers')}
                  className="px-6 py-3 bg-[#E4EB9C] hover:bg-white text-[#142C14] text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{promo.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="px-3.5 py-2.5 rounded-2xl bg-black/40 border border-[#8DA750]/40 text-xs text-[#E4EB9C] font-medium">
                  Free delivery on orders ৳2,500+ across Bangladesh
                </div>
              </div>
            </div>

            {/* Coupons Card */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {coupons.map((coupon, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] text-[#E4EB9C] font-medium block uppercase tracking-wider">
                      {coupon.label}
                    </span>
                    <span className="text-lg font-mono font-black tracking-widest text-white block">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-neutral-300 mt-0.5 block">
                      {coupon.description}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#142C14] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    aria-label={`Copy coupon code ${coupon.code}`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E4EB9C]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
