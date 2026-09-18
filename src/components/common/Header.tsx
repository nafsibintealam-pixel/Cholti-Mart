import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  Truck, 
  ChevronDown, 
  ArrowRight, 
  SlidersHorizontal,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/categories';
import { CholtiMartLogo } from './CholtiMartLogo';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    cartSubtotal, 
    wishlist, 
    navigateTo, 
    currentView, 
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    products,
    viewProduct,
    language,
    setLanguage,
    t,
    formatCurrency
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="w-full z-40 relative bg-white">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#142C14] text-neutral-200 text-xs py-2 px-4 border-b border-[#2D5128]/60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Trust & Delivery */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#E4EB9C]">
              <Truck className="w-3.5 h-3.5 text-[#8DA750]" />
              <span>{t('cod_notice', 'Cash on Delivery (COD) Available Across Bangladesh')}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8DA750]" />
              <span>{t('secure_shopping', '100% Secure Shopping')}</span>
            </span>
          </div>

          {/* Right: Support & Language */}
          <div className="flex items-center space-x-4">
            <a 
              href="tel:+8801700000000" 
              className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition-colors text-neutral-300"
            >
              <Phone className="w-3 h-3 text-[#8DA750]" />
              <span>+880 1700-000000</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 border-l border-[#2D5128] pl-3">
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${language === 'en' ? 'bg-[#2D5128] text-[#E4EB9C] font-bold shadow-xs' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-[#537B2F]">/</span>
              <button 
                onClick={() => setLanguage('bn')} 
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${language === 'bn' ? 'bg-[#2D5128] text-[#E4EB9C] font-bold shadow-xs' : 'text-neutral-400 hover:text-white'}`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header */}
      <div className={`sticky top-0 z-40 bg-white transition-shadow duration-200 border-b border-neutral-200 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Official Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <CholtiMartLogo variant="header" />
            </div>

            {/* Prominent Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={t('search_placeholder', 'Search kurti, jewelry, gadgets, laptop stands, electronics...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full pl-11 pr-24 py-2.5 bg-neutral-100/90 hover:bg-neutral-100 focus:bg-white text-sm text-neutral-900 placeholder-neutral-500 rounded-full border border-transparent focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                  
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    {t('search_btn', 'Search')}
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>{t('suggested_products', 'Suggested Products')}</span>
                    <span>{searchSuggestions.length} found</span>
                  </div>
                  {searchSuggestions.length > 0 ? (
                    <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                      {searchSuggestions.map(product => (
                        <button
                          key={product.id}
                          onClick={() => {
                            viewProduct(product.id);
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-left p-3 hover:bg-neutral-50 flex items-center gap-3 transition-colors group"
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-neutral-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-emerald-600">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-neutral-900">৳{product.price.toLocaleString()}</span>
                            {product.oldPrice && (
                              <span className="text-xs text-neutral-400 line-through block">৳{product.oldPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </button>
                      ))}
                      <div className="p-2.5 bg-neutral-50 text-center border-t border-neutral-100">
                        <button
                          onClick={() => {
                            navigateTo('shop');
                            setIsSearchFocused(false);
                          }}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                        >
                          View all matching results in Shop <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-neutral-600 font-medium">No direct matches for "{searchQuery}"</p>
                      <p className="text-xs text-neutral-400 mt-1">Try keywords like 'kurti', 'stand', 'speaker', or 'jewelry'</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Actions (Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Account */}
              <button
                onClick={() => navigateTo('account')}
                className={`flex items-center gap-2 p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors ${currentView === 'account' ? 'text-emerald-700 bg-emerald-50' : ''}`}
                title="My Account"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <span className="text-neutral-400 block text-[10px]">Account</span>
                  <span className="font-semibold text-neutral-800">My Orders</span>
                </div>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigateTo('wishlist')}
                className={`relative p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors ${currentView === 'wishlist' ? 'text-emerald-700 bg-emerald-50' : ''}`}
                title="Wishlist"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Heart className="w-4 h-4" />
                </div>
                {wishlist.length > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-sm group"
                title="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-neutral-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-[10px] text-neutral-300 block font-normal">{t('nav_cart', 'Cart')}</span>
                  <span className="text-xs font-bold text-white">{formatCurrency(cartSubtotal)}</span>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Primary Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center justify-between border-t border-neutral-100 py-2.5">
            <div className="flex items-center space-x-7 text-sm font-medium">
              
              {/* Home */}
              <button
                onClick={() => navigateTo('home')}
                className={`transition-colors hover:text-emerald-600 ${currentView === 'home' ? 'text-emerald-700 font-bold' : 'text-neutral-700'}`}
              >
                {t('nav_home', 'Home')}
              </button>

              {/* Shop */}
              <button
                onClick={() => navigateTo('shop')}
                className={`transition-colors hover:text-emerald-600 ${currentView === 'shop' ? 'text-emerald-700 font-bold' : 'text-neutral-700'}`}
              >
                {t('nav_shop', 'Shop All')}
              </button>

              {/* Categories Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoryHovered(true)}
                onMouseLeave={() => setIsCategoryHovered(false)}
              >
                <button
                  onClick={() => navigateTo('shop')}
                  className="flex items-center gap-1 text-neutral-700 hover:text-emerald-600 transition-colors py-1"
                >
                  <span>{t('nav_categories', 'Categories')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryHovered ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoryHovered && (
                  <div className="absolute top-full -left-12 w-[640px] bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 grid grid-cols-2 gap-4 z-50 animate-in fade-in duration-150">
                    {CATEGORIES_DATA.slice(0, 8).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigateTo('shop', cat.name);
                          setIsCategoryHovered(false);
                        }}
                        className="text-left p-2.5 rounded-xl hover:bg-neutral-50 transition-colors flex items-start gap-3 group"
                      >
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-11 h-11 object-cover rounded-lg flex-shrink-0 bg-neutral-100 group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-neutral-900 text-sm group-hover:text-emerald-600 truncate">
                            {language === 'bn' ? cat.banglaName : cat.name}
                          </p>
                          <p className="text-xs text-neutral-500 line-clamp-1">
                            {cat.subcategories.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-500">{t('curated_categories', 'Curated for lifestyle, fashion, home & tech')}</span>
                      <button 
                        onClick={() => { navigateTo('shop'); setIsCategoryHovered(false); }}
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        {t('browse_all_categories', 'Browse all categories')} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* New Arrivals */}
              <button
                onClick={() => navigateTo('shop', 'New Arrivals')}
                className="text-neutral-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <span>{t('nav_new_arrivals', 'New Arrivals')}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">New</span>
              </button>

              {/* Offers */}
              <button
                onClick={() => navigateTo('shop', 'Special Offers')}
                className="text-neutral-700 hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('nav_offers', 'Special Offers')}</span>
              </button>

              {/* Track Order */}
              <button
                onClick={() => navigateTo('tracking')}
                className={`transition-colors hover:text-emerald-600 ${currentView === 'tracking' ? 'text-emerald-700 font-bold' : 'text-neutral-700'}`}
              >
                {t('nav_track', 'Track Order')}
              </button>

              {/* About */}
              <button
                onClick={() => navigateTo('about')}
                className={`transition-colors hover:text-emerald-600 ${currentView === 'about' ? 'text-emerald-700 font-bold' : 'text-neutral-700'}`}
              >
                {t('nav_about', 'About Us')}
              </button>

              {/* Contact */}
              <button
                onClick={() => navigateTo('contact')}
                className={`transition-colors hover:text-emerald-600 ${currentView === 'contact' ? 'text-emerald-700 font-bold' : 'text-neutral-700'}`}
              >
                {t('nav_contact', 'Contact')}
              </button>
            </div>

            {/* Quick Promo Indicator */}
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('dhaka_delivery_notice', 'Delivery: Inside Dhaka ৳70 | Outside ৳130')}</span>
            </div>
          </nav>
        </div>
      </div>

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <CholtiMartLogo variant="header" showTagline={false} />
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Language Switcher */}
                <div className="flex items-center space-x-0.5 bg-[#F3F6EC] border border-[#8DA750]/30 rounded-lg p-0.5 text-xs">
                  <button 
                    onClick={() => setLanguage('en')} 
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${language === 'en' ? 'bg-[#142C14] text-[#E4EB9C] font-bold' : 'text-neutral-600'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLanguage('bn')} 
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${language === 'bn' ? 'bg-[#142C14] text-[#E4EB9C] font-bold' : 'text-neutral-600'}`}
                  >
                    বাংলা
                  </button>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-neutral-100">
              <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 rounded-xl border-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </form>
            </div>

            {/* Drawer Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <button
                onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
              >
                <span>{t('nav_home', 'Home')}</span>
              </button>
              <button
                onClick={() => { navigateTo('shop'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
              >
                <span>{t('nav_shop', 'Shop All Products')}</span>
              </button>
              <button
                onClick={() => { navigateTo('shop', 'New Arrivals'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
              >
                <span>{t('nav_new_arrivals', 'New Arrivals')}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
              </button>
              <button
                onClick={() => { navigateTo('shop', 'Special Offers'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
              >
                <span>{t('nav_offers', 'Special Offers')}</span>
                <span className="text-amber-500 font-bold text-xs">★ Sale</span>
              </button>

              <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 px-3">
                {t('nav_categories', 'Categories')}
              </div>
              {CATEGORIES_DATA.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { navigateTo('shop', cat.name); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-neutral-700 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>{language === 'bn' ? cat.banglaName : cat.name}</span>
                  <span className="text-xs text-neutral-400">{cat.itemCount}</span>
                </button>
              ))}

              <div className="pt-3 border-t border-neutral-100 space-y-1">
                <button
                  onClick={() => { navigateTo('tracking'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  {t('nav_track', 'Track Order')}
                </button>
                <button
                  onClick={() => { navigateTo('account'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  {t('nav_account', 'My Account & Orders')}
                </button>
                <button
                  onClick={() => { navigateTo('wishlist'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>{t('nav_wishlist', 'Saved Wishlist')}</span>
                  {wishlist.length > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-600">
              <p className="font-semibold text-neutral-900 mb-1">Customer Helpline:</p>
              <a href="tel:+8801700000000" className="text-emerald-700 font-bold block mb-1">
                +880 1700-000000
              </a>
              <p className="text-neutral-500">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
