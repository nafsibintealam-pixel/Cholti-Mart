import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, navigateTo, addToCart } = useShop();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach(product => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium">Wishlist</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2">
            <span>My Wishlist</span>
            <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {wishlistedProducts.length} items
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Items saved for future shopping. Wishlist is locally preserved.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All Items to Cart</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-neutral-200">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Your wishlist is empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Tap the heart icon on any product in our shop to save items for easy checkout later.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-neutral-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
