import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    viewProduct 
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isSaved = isInWishlist(quickViewProduct.id);

  const discountPercent = quickViewProduct.oldPrice 
    ? Math.round(((quickViewProduct.oldPrice - quickViewProduct.price) / quickViewProduct.oldPrice) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Images Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-200 relative mb-3">
              <img
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              <h2 className="text-xl font-bold text-neutral-900 mt-1 mb-2">
                {quickViewProduct.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold text-neutral-800 ml-1">{quickViewProduct.rating}</span>
                  <span className="text-xs text-neutral-500 ml-1">({quickViewProduct.reviewCount} reviews)</span>
                </div>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  In Stock ({quickViewProduct.stockCount} left)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-neutral-900">
                  ৳{quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.oldPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ৳{quickViewProduct.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {quickViewProduct.shortDescription}
              </p>

              {/* Variations */}
              {quickViewProduct.variations?.map((variant) => (
                <div key={variant.name} className="mb-3">
                  <span className="text-xs font-medium text-neutral-700 block mb-1">
                    Select {variant.name}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (variant.name.toLowerCase().includes('color')) setSelectedColor(opt);
                          if (variant.name.toLowerCase().includes('size')) setSelectedSize(opt);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          (selectedColor === opt || selectedSize === opt)
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity and Actions */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isSaved ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* View Full Product Link */}
              <button
                onClick={() => viewProduct(quickViewProduct.id)}
                className="w-full py-2 text-center text-xs font-semibold text-neutral-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1"
              >
                <span>View Full Specifications & Customer Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
