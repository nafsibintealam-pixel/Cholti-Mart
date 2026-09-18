import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTotal,
    discountAmount,
    estimatedDeliveryFee,
    navigateTo,
    formatCurrency,
    t
  } = useShop();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-neutral-900">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (BD ৳2,500 threshold) */}
        <div className="bg-emerald-50/80 px-4 py-2.5 border-b border-emerald-100/60 text-xs">
          {cartSubtotal >= 2500 ? (
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Congratulations! You qualify for Free Delivery across Bangladesh!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-neutral-700 mb-1">
                <span>Add <strong>৳{(2500 - cartSubtotal).toLocaleString()}</strong> more for Free Delivery</span>
                <span className="font-bold text-emerald-700">{Math.round((cartSubtotal / 2500) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 2500) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">Your cart is empty</h3>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                Explore our curated everyday fashion, tech gadgets, jewelry and home essentials.
              </p>
              <button
                onClick={() => {
                  navigateTo('shop');
                  setIsCartDrawerOpen(false);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`}
                className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="p-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-neutral-900 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        className="p-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-neutral-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>{t('subtotal', 'Subtotal')}</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t('coupon_discount', 'Coupon Discount')}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>{t('delivery_fee', 'Delivery (Estimated)')}</span>
                <span>{estimatedDeliveryFee === 0 ? <strong className="text-emerald-700">Free</strong> : formatCurrency(estimatedDeliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>{t('total_amount', 'Total Amount')}</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  navigateTo('cart');
                  setIsCartDrawerOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-300 transition-colors text-center"
              >
                {t('view_cart', 'View Cart Page')}
              </button>
              <button
                onClick={() => {
                  navigateTo('checkout');
                  setIsCartDrawerOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{t('checkout', 'Checkout')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 text-center">
              Cash on Delivery (COD) supported nationwide
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
