import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Megaphone, 
  Smartphone, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { AdminCard, AdminBadge, AdminButton } from '../common/AdminUiElements';

export interface StoreDesignViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
  onViewStorefront: () => void;
}

export const StoreDesignView: React.FC<StoreDesignViewProps> = ({
  subnav = 'colors',
  onNavigateSubnav,
  onViewStorefront
}) => {
  const { config, updateThemeColors, updateHero, updateSiteSettings, resetToDefaults } = useCustomizer();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local form states
  const [primaryColor, setPrimaryColor] = useState(config.themeColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(config.themeColors.secondary);
  const [accentColor, setAccentColor] = useState(config.themeColors.accent);
  const [softAccentColor, setSoftAccentColor] = useState(config.themeColors.softAccent);
  const [lightAccentColor, setLightAccentColor] = useState(config.themeColors.lightAccent);
  const [backgroundColor, setBackgroundColor] = useState(config.themeColors.background);

  // Hero state
  const [headlineMain, setHeadlineMain] = useState(config.hero.headlineMain);
  const [subheadline, setSubheadline] = useState(config.hero.subheadline);
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState(config.hero.primaryCtaLabel);
  const [heroImage, setHeroImage] = useState(config.hero.mainImage);

  // Header state
  const [storeName, setStoreName] = useState(config.siteSettings.storeName);
  const [tagline, setTagline] = useState(config.siteSettings.tagline);

  const handleApplyColors = () => {
    updateThemeColors({
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      softAccent: softAccentColor,
      lightAccent: lightAccentColor,
      background: backgroundColor
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplyHero = () => {
    updateHero({
      headlineMain,
      subheadline,
      primaryCtaLabel,
      mainImage: heroImage
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplySettings = () => {
    updateSiteSettings({
      storeName,
      tagline
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'colors', label: 'Color Palette' },
            { id: 'hero_banners', label: 'Hero Banner' },
            { id: 'header', label: 'Header & Brand' },
            { id: 'mobile_view', label: 'Mobile Preview' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSubnav(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors font-medium ${
                subnav === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={onViewStorefront}
          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Storefront</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Storefront design styles updated and synchronized successfully!</span>
        </div>
      )}

      {subnav === 'hero_banners' ? (
        /* Hero Banner Editor */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Hero Banner Customizer" subtitle="Main storefront entrance section">
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Headline Text</label>
                <input
                  type="text"
                  value={headlineMain}
                  onChange={(e) => setHeadlineMain(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Call to Action Button Label</label>
                <input
                  type="text"
                  value={primaryCtaLabel}
                  onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Background Image URL</label>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
                />
              </div>

              <AdminButton variant="lime" size="sm" onClick={handleApplyHero}>
                Apply Hero Changes
              </AdminButton>
            </div>
          </AdminCard>

          {/* Hero Live Preview Card */}
          <AdminCard title="Live Banner Preview">
            <div 
              className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[220px] text-white shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(20,44,20,0.9), rgba(20,44,20,0.6)), url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <span className="text-[10px] text-[#E4EB9C] font-mono uppercase tracking-wider font-bold mb-1">
                Seasonal Spotlight
              </span>
              <h3 className="text-xl font-black tracking-tight">{headlineMain}</h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm">{subheadline}</p>
              <div className="mt-4">
                <span className="inline-block px-4 py-1.5 rounded-xl bg-[#E4EB9C] text-[#142C14] text-xs font-bold shadow">
                  {primaryCtaLabel} &rarr;
                </span>
              </div>
            </div>
          </AdminCard>
        </div>
      ) : subnav === 'header' ? (
        /* Header & Brand Editor */
        <AdminCard title="Brand Identity & Header Bar" subtitle="Store name, slogan, and trust logos">
          <div className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Store Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>

            <AdminButton variant="lime" size="sm" onClick={handleApplySettings}>
              Save Brand Settings
            </AdminButton>
          </div>
        </AdminCard>
      ) : subnav === 'mobile_view' ? (
        /* Mobile View Device Frame */
        <AdminCard title="Storefront Mobile Responsive Viewport" subtitle="Interactive mobile viewport preview">
          <div className="flex justify-center py-6">
            <div className="w-[360px] h-[580px] bg-[#0E1B0E] border-4 border-neutral-700 rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative">
              {/* Speaker notch */}
              <div className="w-28 h-4 bg-neutral-800 rounded-b-xl mx-auto flex items-center justify-center shrink-0">
                <div className="w-8 h-1 bg-neutral-600 rounded-full" />
              </div>

              {/* Viewport content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-white">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="font-black text-sm text-[#E4EB9C]">{config.siteSettings.storeName}</span>
                  <span className="text-[10px] text-neutral-400">Mobile Mockup</span>
                </div>
                <div 
                  className="rounded-xl p-4 text-white"
                  style={{ backgroundColor: config.themeColors.primary }}
                >
                  <h4 className="font-bold text-sm text-[#E4EB9C]">{config.hero.headlineMain}</h4>
                  <p className="text-[11px] text-neutral-300 mt-0.5">{config.hero.subheadline}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-bold block">Fast Delivery</span>
                    <span className="text-neutral-400">24-48h Dhaka</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-bold block">COD Guaranteed</span>
                    <span className="text-neutral-400">Cash on Delivery</span>
                  </div>
                </div>
              </div>

              {/* Bottom home bar */}
              <div className="h-4 flex items-center justify-center shrink-0">
                <div className="w-24 h-1 bg-neutral-600 rounded-full" />
              </div>
            </div>
          </div>
        </AdminCard>
      ) : (
        /* Color Palette Customizer */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard 
            title="Active Brand Color Palette" 
            subtitle="Theme colors dynamically applied across customer storefront & buttons"
            action={
              <button
                onClick={resetToDefaults}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            }
          >
            <div className="space-y-4 text-xs">
              
              {/* Color pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <label className="text-neutral-300 font-semibold block">Primary Forest Green</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <label className="text-neutral-300 font-semibold block">Secondary Green</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <label className="text-neutral-300 font-semibold block">Accent Olive / Sage</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <label className="text-neutral-300 font-semibold block">Light Lime Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={lightAccentColor}
                      onChange={(e) => setLightAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={lightAccentColor}
                      onChange={(e) => setLightAccentColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <AdminButton variant="lime" size="sm" onClick={handleApplyColors}>
                Save & Synchronize Colors
              </AdminButton>

            </div>
          </AdminCard>

          {/* Color Swatch Preview */}
          <AdminCard title="Palette Swatch Demonstration">
            <div className="space-y-4">
              <div className="h-24 rounded-2xl flex overflow-hidden shadow-md">
                <div className="flex-1 flex flex-col justify-end p-2 text-white text-[10px] font-mono" style={{ backgroundColor: primaryColor }}>
                  Primary
                </div>
                <div className="flex-1 flex flex-col justify-end p-2 text-white text-[10px] font-mono" style={{ backgroundColor: secondaryColor }}>
                  Secondary
                </div>
                <div className="flex-1 flex flex-col justify-end p-2 text-white text-[10px] font-mono" style={{ backgroundColor: accentColor }}>
                  Accent
                </div>
                <div className="flex-1 flex flex-col justify-end p-2 text-black text-[10px] font-mono font-bold" style={{ backgroundColor: lightAccentColor }}>
                  Light Lime
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-2 text-xs">
                <span className="text-neutral-400 block font-bold text-[10px] uppercase">Example Component Render</span>
                <div className="flex items-center gap-3">
                  <button 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-900 shadow"
                    style={{ backgroundColor: lightAccentColor }}
                  >
                    Add to Cart Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Checkout Button
                  </button>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

    </div>
  );
};
