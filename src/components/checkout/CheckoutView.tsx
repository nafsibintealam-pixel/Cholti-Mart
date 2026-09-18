import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Info,
  CreditCard,
  Wallet,
  Coins
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';

const BD_DISTRICTS = [
  'Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 'Cox\'s Bazar', 'Sylhet', 
  'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 
  'Bogra', 'Jessore', 'Feni', 'Tangail', 'Faridpur', 'Kushtia', 'Dinajpur'
];

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    discountAmount, 
    placeOrder, 
    navigateTo 
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    area: '',
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket' | 'Card'>('Cash on Delivery');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const deliveryCharge = cartSubtotal >= 2500 ? 0 : (formData.district === 'Dhaka' ? 70 : 130);
  const finalPayable = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryCharge : 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in your name, phone number, and street address.');
      return;
    }

    if (!agreeTerms) {
      alert('Please accept the store terms & conditions to proceed.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email || 'customer@example.com',
        district: formData.district,
        area: formData.area || 'City Area',
        address: formData.address,
        notes: formData.notes,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          variant: item.selectedColor || item.selectedSize
        })),
        subtotal: cartSubtotal,
        shippingFee: deliveryCharge,
        discount: discountAmount,
        total: finalPayable
      });

      setCreatedOrder(order);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Order Confirmation Success View
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Order Received
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-3 mb-2">
            Thank you, {createdOrder.customerName}!
          </h1>

          <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
            Your order has been recorded successfully. Our team will verify the details and dispatch via courier.
          </p>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-left max-w-lg mx-auto mb-8 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">Order ID:</span>
              <span className="font-bold text-neutral-900">{createdOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">Payment Mode:</span>
              <span className="font-semibold text-neutral-900">{createdOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">Delivery Address:</span>
              <span className="font-medium text-neutral-900 text-right">{createdOrder.address}, {createdOrder.district}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-neutral-900 font-bold">Total Payable:</span>
              <span className="font-extrabold text-emerald-700 text-base">৳{createdOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('tracking')}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-3">No items to checkout</h2>
        <p className="text-xs text-neutral-500 mb-6">Please add some items to your shopping cart first.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-xs text-neutral-400 mb-2 flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
          <span>/</span>
          <button onClick={() => navigateTo('cart')} className="hover:text-neutral-700">Cart</button>
          <span>/</span>
          <span className="text-neutral-800 font-medium">Checkout</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Fast & Secure Checkout
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Pay via Cash on Delivery or Mobile Wallets across Bangladesh.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Customer & Delivery Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer Information */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <span>1. Customer & Shipping Details</span>
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number (Mobile) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="tanvir@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      District / City *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      {BD_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Area / Thana *
                  </label>
                  <input
                    type="text"
                    name="area"
                    placeholder="e.g. Dhanmondi, Uttara, Banani, or Sub-district"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Delivery Address (House, Road, Block) *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="House 34, Road 11A, Dhanmondi, Dhaka"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Special Order Note / Courier Instruction (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Please deliver after 3 PM or call alternate number"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-neutral-900 mb-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
                <span>2. Select Payment Method</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Secure Checkout
                </span>
              </h2>

              <div className="mb-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-neutral-700 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Payment Assurance:</strong> Pay with Cash on Delivery when you receive and check the package, or choose online digital payments. All transactions are safe and encrypted.
                </p>
              </div>

              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery' 
                    ? 'border-emerald-600 bg-emerald-50/50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Pay in cash directly to courier agent when you receive and verify the parcel.
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bKash' 
                    ? 'border-pink-600 bg-pink-50/50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="mt-1 text-pink-600 focus:ring-pink-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <span>bKash Online Payment</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded font-bold">bKash</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Instant mobile wallet checkout via official bKash Merchant Gateway.
                    </p>
                  </div>
                </label>

                {/* Nagad */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Nagad' 
                    ? 'border-amber-600 bg-amber-50/50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <span>Nagad Mobile Banking</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Nagad</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Pay easily via Bangladesh Post Office Nagad digital wallet.
                    </p>
                  </div>
                </label>

                {/* Rocket / Card */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Card' 
                    ? 'border-neutral-900 bg-neutral-50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="mt-1 text-neutral-900 focus:ring-neutral-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        Debit / Credit Card (Visa, Mastercard) & Rocket
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Pay securely with your credit/debit card or Rocket mobile wallet.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Order Summary & Final Submit (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Your Order Summary ({cart.length} items)
              </h2>

              {/* Items List in Checkout */}
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0" 
                      />
                      <div className="truncate">
                        <p className="font-semibold text-neutral-900 truncate">{item.product.name}</p>
                        <p className="text-neutral-500">Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 shrink-0">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery ({formData.district === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : `৳${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Payable</span>
                  <span className="text-xl text-emerald-700">৳{finalPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I agree to the Cholti Mart <button type="button" onClick={() => navigateTo('terms')} className="text-emerald-700 underline">Terms & Conditions</button> and <button type="button" onClick={() => navigateTo('returns')} className="text-emerald-700 underline">Return Policy</button>.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-400 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order (৳{finalPayable.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero pre-payment risk with Cash on Delivery</span>
              </div>

            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
