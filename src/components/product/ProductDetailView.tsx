import React, { useState } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft, 
  Check, 
  Share2, 
  Zap,
  Info
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    recentlyViewed, 
    navigateTo, 
    showToast 
  } = useShop();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variations?.[0]?.options[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.variations?.[1]?.options[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'returns' | 'reviews'>('desc');

  // Review submission demo state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product.reviewsList);

  const isSaved = isInWishlist(product.id);

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Related products from same category
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  // Recently viewed products
  const recentProducts = products.filter(p => recentlyViewed.includes(p.id) && p.id !== product.id).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, false);
    navigateTo('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      const newReview = {
        id: `r-${Date.now()}`,
        userName: reviewName.trim(),
        rating: reviewRating,
        date: 'Just now',
        comment: reviewComment.trim(),
        verifiedPurchase: false
      };
      setReviewsList(prev => [newReview, ...prev]);
      setReviewName('');
      setReviewComment('');
      showToast('Thank you! Your product review has been submitted.', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('shop', product.category)} className="hover:text-neutral-700">{product.category}</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        
        {/* Gallery Column (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-emerald-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Guaranteed BD Inspection Banner */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inspection Before Payment Guarantee</span>
            </div>
            <p>
              Open and check the parcel upon delivery. If the item does not match specifications, refuse the parcel with zero obligation.
            </p>
          </div>
        </div>

        {/* Product Info & Buy Action (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {product.category} • {product.subcategory}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 mb-3">
              {product.name}
            </h1>

            {/* Rating & Stock Availability */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-neutral-300'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-neutral-800 ml-1.5">{product.rating}</span>
                <span className="text-xs text-neutral-500 ml-1">({reviewsList.length} reviews)</span>
              </div>

              <span className="text-neutral-300">•</span>

              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>In Stock ({product.stockCount} in Dhaka Hub)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-neutral-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-base text-neutral-400 line-through">
                  ৳{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                Save ৳{(product.oldPrice! - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Variations Selectors (Colors & Sizes) */}
          {product.variations?.map((variant) => (
            <div key={variant.name} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-800">
                  Select {variant.name}:
                </span>
                <span className="text-neutral-500">
                  {variant.name.toLowerCase().includes('color') ? selectedColor : selectedSize}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((opt) => {
                  const isSelected = (variant.name.toLowerCase().includes('color') && selectedColor === opt) ||
                                     (variant.name.toLowerCase().includes('size') && selectedSize === opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (variant.name.toLowerCase().includes('color')) setSelectedColor(opt);
                        if (variant.name.toLowerCase().includes('size')) setSelectedSize(opt);
                      }}
                      className={`px-3.5 py-2 text-xs rounded-xl border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-600/20'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
                className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now (Instant Cash on Delivery Checkout)</span>
            </button>
          </div>

          {/* Quick Service Trust Points */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 text-center">
            <div className="p-2.5 bg-neutral-50 rounded-xl">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 block">Dhaka ৳70</span>
              <span className="text-[10px] text-neutral-500">24-48 hrs</span>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 block">Outside ৳130</span>
              <span className="text-[10px] text-neutral-500">3-5 days</span>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl">
              <RefreshCw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 block">7-Day Return</span>
              <span className="text-[10px] text-neutral-500">Easy exchange</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs / Accordions Section (Description, Specifications, Shipping, Returns, Reviews) */}
      <div className="mt-16 pt-8 border-t border-neutral-200">
        
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200 overflow-x-auto gap-2 sm:gap-6 pb-2">
          {[
            { id: 'desc', label: 'Full Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'returns', label: 'Returns & Refunds' },
            { id: 'reviews', label: `Customer Reviews (${reviewsList.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-2.5 ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {/* Description */}
          {activeTab === 'desc' && (
            <div className="prose prose-sm text-neutral-600 max-w-none space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>{product.description}</p>
              <p>
                Every product at <strong>Cholti Mart</strong> undergoes physical inspection prior to shipping. We verify color authenticity, mechanical/electronic functionality, and parcel protection packaging to ensure a delightful unboxing experience.
              </p>
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-xs sm:text-sm text-left">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-semibold text-neutral-700 w-1/3 border-b border-neutral-100">{key}</td>
                      <td className="py-3 px-4 text-neutral-600 border-b border-neutral-100">{val}</td>
                    </tr>
                  ))}
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 font-semibold text-neutral-700 border-b border-neutral-100">SKU Code</td>
                    <td className="py-3 px-4 text-neutral-600 border-b border-neutral-100">{product.sku}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-neutral-700">Stock Location</td>
                    <td className="py-3 px-4 text-neutral-600">Dhaka Distribution Hub, Bangladesh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              <h3 className="font-bold text-neutral-900 text-base">Delivery Guidelines for Bangladesh</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Inside Dhaka City:</strong> ৳70 flat delivery fee. Orders placed before 1:00 PM are typically delivered within 24 to 48 hours.</li>
                <li><strong>Outside Dhaka (All 63 Districts):</strong> ৳130 delivery fee. Dispatched via Steadfast or Pathao courier within 3 to 5 business days.</li>
                <li><strong>Promotional Free Delivery:</strong> Any order cart totaling ৳2,500 or higher qualifies for automatic free standard nationwide shipping.</li>
                <li><strong>Doorstep Verification:</strong> You are entitled to open and verify the parcel with the delivery agent prior to handing over the cash payment.</li>
              </ul>
            </div>
          )}

          {/* Returns Tab */}
          {activeTab === 'returns' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              <h3 className="font-bold text-neutral-900 text-base">Hassle-Free 7-Day Replacement Policy</h3>
              <p>
                At Cholti Mart, customer peace of mind is paramount. If you receive an item with manufacturing faults, transit damage, or size mismatch:
              </p>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Inform our customer support helpline (+880 1700-000000) or WhatsApp within 7 days of delivery.</li>
                <li>Share an unboxing photo/video showing the concern.</li>
                <li>We will schedule a reverse pickup via courier and deliver a fresh replacement or issue an instant bKash/Nagad refund.</li>
              </ol>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Existing Reviews (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-bold text-neutral-900 text-base">Customer Feedback</h3>
                <div className="space-y-3">
                  {reviewsList.map(r => (
                    <div key={r.id} className="p-4 bg-white rounded-2xl border border-neutral-200 text-xs sm:text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400">{r.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                      <p className="text-neutral-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Review Form (5 cols) */}
              <div className="lg:col-span-5 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Leave a Review</h4>
                <p className="text-xs text-neutral-500 mb-4">Share your genuine experience with other Bangladeshi shoppers.</p>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Rating</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-neutral-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nusrat Jahan"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What did you like about the product quality, fit, or delivery?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Related Products in {product.category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {recentProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
