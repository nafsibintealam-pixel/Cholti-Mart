import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const OrderTrackingView: React.FC = () => {
  const { orders, navigateTo } = useShop();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(orders[0] || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    
    const found = orders.find(o => 
      o.id.toLowerCase() === orderIdInput.trim().toLowerCase() ||
      o.phone.includes(phoneInput.trim())
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      // If not matching exact ID, provide simulated realistic tracker for demo
      if (orderIdInput.trim()) {
        setTrackedOrder({
          id: orderIdInput.toUpperCase().startsWith('CM-') ? orderIdInput.toUpperCase() : `CM-${orderIdInput}`,
          customerName: 'Valued Customer',
          status: 'Shipped',
          createdAt: 'Yesterday, 4:20 PM',
          district: 'Dhaka',
          area: 'Dhanmondi Hub',
          address: 'Delivery in progress via Steadfast Courier',
          paymentMethod: 'Cash on Delivery',
          total: 2450,
          items: [
            { productName: 'Multi-Item Cholti Mart Package', quantity: 1, price: 2450 }
          ]
        });
      } else {
        setTrackedOrder(null);
      }
    }
  };

  const steps = [
    { title: 'Order Confirmed', time: '18 Feb, 10:30 AM', completed: true, desc: 'Verified by Cholti Mart support' },
    { title: 'Package Dispatched', time: '18 Feb, 04:15 PM', completed: true, desc: 'Packed and handed to Courier Hub' },
    { title: 'In Transit', time: '19 Feb, 08:45 AM', completed: true, desc: 'Out for transit to destination hub' },
    { title: 'Out for Delivery', time: 'Pending Delivery Agent', completed: false, desc: 'Courier rider will call your phone' },
    { title: 'Delivered', time: 'Expected Today', completed: false, desc: 'Cash on Delivery collection' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium">Track Order</span>
      </nav>

      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Courier Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
          Track Your Cholti Mart Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Enter your Order ID (e.g. <strong>CM-84920</strong>) and contact phone number.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CM-84920"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Track Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tracked Order Result */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-xs text-neutral-500 block">Tracking Order</span>
              <span className="text-xl font-extrabold text-neutral-900">{trackedOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Destination</span>
              <span className="text-xs font-bold text-neutral-800">{trackedOrder.district} ({trackedOrder.area || 'City Area'})</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-neutral-900">Courier Shipment Progress</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 top-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-neutral-300'
                  }`}>
                    {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs sm:text-sm font-bold ${step.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step.title}
                      </p>
                      <span className="text-[11px] text-neutral-400">{step.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courier Contact Helper */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold block">Need courier support?</span>
              <span className="text-emerald-700">Contact our helpline with your Order ID for direct rider contact.</span>
            </div>
            <span className="font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              +880 1700-000000
            </span>
          </div>

        </div>
      )}

      {searched && !trackedOrder && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold text-neutral-900 text-base">Order Not Found</h3>
          <p className="text-xs text-neutral-500 mt-1">Please double-check your Order ID or phone number.</p>
        </div>
      )}

    </div>
  );
};
