import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  Tag, 
  Check, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTotal,
    discountAmount,
    estimatedDeliveryFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [shippingZone, setShippingZone] = useState<'dhaka' | 'outside'>('dhaka');

  const deliveryCost = cartSubtotal >= 2500 ? 0 : (shippingZone === 'dhaka' ? 70 : 130);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryCost : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Shopping Cart is Empty</h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
          You haven't added any products to your cart yet. Explore our multi-category collection of everyday fashion, jewelry, and smart gadgets.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shop</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-neutral-700">Shop</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium">Cart</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-8">
        Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items Table/List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Items */}
          <div className="divide-y divide-neutral-100">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Product details */}
                <div className="col-span-6 flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-neutral-100 shrink-0 border border-neutral-200"
                  />
                  <div>
                    <span className="text-[11px] font-medium text-emerald-700 uppercase">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                      {item.product.name}
                    </h3>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.selectedColor && <span className="mr-2">Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                    )}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                      className="text-xs text-neutral-400 hover:text-rose-600 font-medium inline-flex items-center gap-1 mt-2 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-span-2 text-left md:text-center text-sm font-semibold text-neutral-700">
                  <span className="md:hidden text-xs text-neutral-400 font-normal mr-2">Unit Price:</span>
                  ৳{item.product.price.toLocaleString()}
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center md:justify-center">
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-neutral-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="col-span-2 text-right text-sm font-bold text-neutral-900">
                  <span className="md:hidden text-xs text-neutral-400 font-normal mr-2">Subtotal:</span>
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                </div>

              </div>
            ))}
          </div>

          {/* Cart Bottom Actions */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>

            <span className="text-xs text-neutral-500">
              Orders over ৳2,500 enjoy promotional Free Nationwide Delivery
            </span>
          </div>

        </div>

        {/* Order Summary & Delivery Estimator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Box */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-neutral-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>

              {/* Coupon Row */}
              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-700 font-medium bg-emerald-50 p-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>-৳{discountAmount.toLocaleString()}</span>
                    <button 
                      onClick={removeCoupon} 
                      className="text-neutral-400 hover:text-rose-600"
                      title="Remove coupon"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Zone Selector */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Shipping Destination:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShippingZone('dhaka')}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      shippingZone === 'dhaka' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900' 
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Inside Dhaka (৳70)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingZone('outside')}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      shippingZone === 'outside' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900' 
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Outside Dhaka (৳130)
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-neutral-600 pt-1">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCost === 0 ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    <span className="font-semibold text-neutral-900">৳{deliveryCost}</span>
                  )}
                </span>
              </div>

              {/* Final Total */}
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-neutral-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-neutral-900">
                    ৳{finalTotal.toLocaleString()}
                  </span>
                  <span className="block text-[11px] text-neutral-500">Including VAT & charges</span>
                </div>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. CHOLTI10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-900 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Points */}
            <div className="pt-2 space-y-2 text-xs text-neutral-500 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery (COD) supported in 64 districts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7 Days Return Policy for verified defects</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
