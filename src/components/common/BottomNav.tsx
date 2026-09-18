import React from 'react';
import { Home, ShoppingBag, Grid, Heart, User } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const BottomNav: React.FC = () => {
  const { currentView, navigateTo, cartCount, wishlist, setIsCartDrawerOpen, t } = useShop();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentView === 'home' ? 'text-emerald-600 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav_home', 'Home')}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentView === 'shop' ? 'text-emerald-600 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav_shop', 'Shop')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center py-1 px-3 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('nav_cart', 'Cart')}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigateTo('wishlist')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentView === 'wishlist' ? 'text-emerald-600 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('nav_wishlist', 'Wishlist')}</span>
        </button>

        {/* Account */}
        <button
          onClick={() => navigateTo('account')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            currentView === 'account' ? 'text-emerald-600 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('nav_account', 'Account')}</span>
        </button>
      </div>
    </div>
  );
};
