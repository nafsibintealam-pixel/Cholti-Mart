import React from 'react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    viewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    formatCurrency,
    t
  } = useShop();

  const isSaved = isInWishlist(product.id);
  
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      
      {/* Image & Badges Container */}
      <div className="relative w-full pt-[100%] bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => viewProduct(product.id)}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSaved 
              ? 'bg-rose-50 text-rose-600 shadow-sm' 
              : 'bg-white/90 text-neutral-600 hover:text-neutral-900 hover:bg-white shadow-xs'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Floating Action (desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-xs hover:bg-white text-neutral-900 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[11px] text-neutral-600 font-medium uppercase tracking-wider mb-1 line-clamp-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 
          onClick={() => viewProduct(product.id)}
          className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer mb-1.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
          <span className="text-[11px] text-neutral-600 font-medium">({product.reviewCount})</span>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-neutral-900">
                {formatCurrency(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-neutral-100 hover:bg-emerald-600 text-neutral-800 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Add to Cart"
            aria-label={`Add ${product.name} to Cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('add_to_cart', 'Add')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
