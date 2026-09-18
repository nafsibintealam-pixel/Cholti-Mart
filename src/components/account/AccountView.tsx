import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Heart, 
  User, 
  LogOut, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AccountView: React.FC = () => {
  const { orders, navigateTo } = useShop();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-6 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <span className="text-neutral-800 font-medium">My Account</span>
      </nav>

      {/* Account Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            CM
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              Tanvir Ahmed
            </h1>
            <p className="text-xs text-neutral-500">
              tanvir.customer@example.com • 01712-345678
            </p>
            <span className="inline-block mt-1 text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Verified Cholti Mart Customer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('tracking')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Track Parcel
          </button>
          <button
            onClick={() => navigateTo('wishlist')}
            className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Wishlist
          </button>
        </div>
      </div>

      {/* Account Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 p-3 space-y-1 shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'addresses' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600">1</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'profile' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
          </button>

          <div className="pt-4 border-t border-neutral-100 mt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Need Order Assistance?</p>
                <p className="text-emerald-700 mt-0.5">Call our support helpline: +880 1700-000000 (9 AM - 10 PM).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold text-neutral-900">Recent Orders ({orders.length})</h2>
                <span className="text-xs text-neutral-500">Bangladesh Courier Updates</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-700">No orders placed yet</p>
                  <p className="text-xs text-neutral-400 mt-1 mb-4">Your order history will appear here once you make a purchase.</p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200/80 text-xs">
                        <div>
                          <span className="font-bold text-neutral-900 text-sm mr-2">{order.id}</span>
                          <span className="text-neutral-500">Placed on {order.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-extrabold text-neutral-900 text-sm">
                            ৳{order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items in order */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg bg-white border border-neutral-200" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 truncate">{item.productName}</p>
                              <p className="text-neutral-500">Qty: {item.quantity} • ৳{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery address & tracking */}
                      <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                        <span>Destination: {order.address}, {order.district}</span>
                        <button
                          onClick={() => navigateTo('tracking')}
                          className="font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          View Courier Tracking →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Saved Shipping Addresses
              </h2>

              <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/40 relative">
                <span className="absolute top-3 right-3 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Default Address
                </span>
                <p className="font-bold text-neutral-900 text-sm">Tanvir Ahmed</p>
                <p className="text-xs text-neutral-600 mt-1">House 34, Road 11A, Dhanmondi</p>
                <p className="text-xs text-neutral-600">Dhaka - 1209, Bangladesh</p>
                <p className="text-xs text-neutral-600 mt-1">Phone: +880 1712-345678</p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Personal Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-1">Full Name</span>
                  <span className="font-bold text-neutral-900 text-sm">Tanvir Ahmed</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Phone</span>
                  <span className="font-bold text-neutral-900 text-sm">+880 1712-345678</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Email</span>
                  <span className="font-bold text-neutral-900 text-sm">tanvir.customer@example.com</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Account Created</span>
                  <span className="font-bold text-neutral-900 text-sm">February 2026</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
