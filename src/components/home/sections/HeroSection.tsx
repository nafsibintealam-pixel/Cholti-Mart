import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, Sparkles } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useCustomizer } from '../../../context/CustomizerContext';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useShop();
  const { config } = useCustomizer();
  const hero = config.hero;

  const quickCategories = [
    { name: "Women's Fashion", label: 'Fashion', icon: '👗' },
    { name: 'Gadgets', label: 'Smart Gadgets', icon: '⚡' },
    { name: 'Beauty & Personal Care', label: 'Beauty & Care', icon: '✨' },
    { name: "Women's Jewelry", label: 'Jewelry', icon: '💍' },
    { name: 'Home & Living', label: 'Home & Living', icon: '🌿' }
  ];

  return (
    <section 
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-b from-[#F3F6EC]/90 via-[#F7F8F3] to-[#F7F8F3] pt-6 sm:pt-10 lg:pt-14 pb-10 sm:pb-16 lg:pb-20 border-b border-[#E3E8DF]"
    >
      {/* Subtle organic background glow accents */}
      <div 
        className="pointer-events-none absolute top-0 right-1/4 -mt-16 w-96 h-96 rounded-full bg-[#E4EB9C]/30 blur-3xl" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#8DA750]/10 blur-3xl" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-column responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Brand Proposition, Action Buttons */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* Curated Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4EB9C]/50 border border-[#8DA750]/40 text-[#142C14] text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#537B2F]" />
              <span>{hero.badge}</span>
            </div>

            {/* Main Headline - Proportional sizing, controlled line breaks */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#142C14] tracking-tight leading-[1.15]">
              {hero.headlineMain}{' '}
              <span className="text-[#2D5128] underline decoration-[#8DA750]/50 decoration-4 underline-offset-4">
                {hero.headlineAccent}
              </span>
            </h1>

            {/* Subheadline - Clear, readable without overflow */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subheadline}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                id="hero-primary-cta"
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#142C14] hover:bg-[#2D5128] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>{hero.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#E4EB9C]" />
              </button>
              
              <button
                id="hero-secondary-cta"
                onClick={() => {
                  const el = document.getElementById('shop-by-category');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigateTo('shop');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F3F6EC] text-[#142C14] text-sm font-bold rounded-2xl border border-[#8DA750]/40 hover:border-[#537B2F] transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                {hero.secondaryCtaLabel}
              </button>
            </div>

            {/* Quick Category Jump Pills - Mobile & Desktop Friendly */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none justify-center lg:justify-start">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap mr-1 hidden sm:inline-block">
                  Trending:
                </span>
                {quickCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo('shop', cat.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E4EB9C]/40 border border-neutral-200 hover:border-[#8DA750] text-xs font-semibold text-neutral-800 transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Pillars Bar */}
            <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#8DA750]/20 text-left">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#E4EB9C]/40 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D5128]" />
                </div>
                <div>
                  <span className="font-bold text-[11px] sm:text-xs text-[#142C14] block leading-tight">
                    {hero.trustPill1.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 hidden sm:block">
                    {hero.trustPill1.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#E4EB9C]/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D5128]" />
                </div>
                <div>
                  <span className="font-bold text-[11px] sm:text-xs text-[#142C14] block leading-tight">
                    {hero.trustPill2.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 hidden sm:block">
                    {hero.trustPill2.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#E4EB9C]/40 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D5128]" />
                </div>
                <div>
                  <span className="font-bold text-[11px] sm:text-xs text-[#142C14] block leading-tight">
                    {hero.trustPill3.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 hidden sm:block">
                    {hero.trustPill3.subtitle}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Multi-Category Visual Showcase with Curated Floating Badges */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              
              {/* Primary Lifestyle Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#8DA750]/30 aspect-[4/3] sm:aspect-[4/3] bg-neutral-900 group">
                <img
                  src={hero.mainImage}
                  alt="Modern Bangladeshi lifestyle and fashion shopping"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Subtle vignette gradient and callout */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#142C14]/90 via-[#142C14]/30 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E4EB9C] text-[#142C14] text-[10px] font-extrabold uppercase tracking-wider">
                      {hero.lifestyleTag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#E4EB9C] font-semibold">
                      <Star className="w-3 h-3 fill-current" /> 4.9 Rating
                    </span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-bold leading-snug text-white">
                    {hero.lifestyleTitle}
                  </h2>
                  <p className="text-xs text-neutral-200 mt-1 line-clamp-2">
                    {hero.lifestyleSubtitle}
                  </p>
                  
                  <div className="pt-3">
                    <button
                      onClick={() => navigateTo('shop')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E4EB9C] hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Lifestyle Card 1: Smart Tech / Gadgets */}
              <div 
                onClick={() => navigateTo('shop', 'Gadgets')}
                className="absolute -bottom-4 -left-3 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-neutral-200/90 flex items-center gap-3 max-w-[240px] sm:max-w-xs cursor-pointer hover:border-[#537B2F] transition-all hover:scale-[1.02]"
              >
                <img
                  src={hero.floatingCardImage}
                  alt="Trending smart wireless gadgets"
                  className="w-11 h-11 rounded-xl object-cover shrink-0 bg-neutral-100"
                />
                <div className="text-left min-w-0">
                  <span className="text-[10px] text-[#537B2F] uppercase font-bold tracking-wider block">
                    {hero.floatingCardTag}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 block truncate">
                    {hero.floatingCardTitle}
                  </span>
                  <span className="text-xs font-extrabold text-[#2D5128]">
                    {hero.floatingCardPrice}
                  </span>
                </div>
              </div>

              {/* Floating Lifestyle Card 2: Doorstep Inspection Guarantee Badge */}
              <div className="hidden sm:flex absolute -top-3 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#8DA750]/40 items-center gap-2.5 text-xs font-bold text-[#142C14]">
                <div className="w-6 h-6 rounded-lg bg-[#E4EB9C]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D5128]" />
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold text-[#142C14]">Verified Parcel</span>
                  <span className="block text-[9px] text-neutral-500">Check before payment</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
