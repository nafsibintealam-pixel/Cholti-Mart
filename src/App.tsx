import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CustomizerProvider } from './context/CustomizerContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { AccountView } from './components/account/AccountView';
import { OrderTrackingView } from './components/account/OrderTrackingView';
import { WishlistView } from './components/wishlist/WishlistView';
import { LegalView } from './components/legal/LegalView';
import { WpGuideView } from './components/guide/WpGuideView';
import { CholtiAI } from './components/common/CholtiAI';
import { AdminPortal } from './components/admin/AdminPortal';

const MainContent: React.FC = () => {
  const { currentView } = useShop();

  // 1. DEDICATED SEPARATE ADMIN AREA (PROTECTED AUTHENTICATION & MANAGEMENT)
  if (currentView === 'admin') {
    return (
      <AdminAuthProvider>
        <AdminPortal />
        <Toast />
      </AdminAuthProvider>
    );
  }

  // 2. PUBLIC CUSTOMER-FACING STOREFRONT ONLY
  // Zero administration or customization tools visible to public shoppers
  const renderCustomerView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'account':
        return <AccountView />;
      case 'tracking':
        return <OrderTrackingView />;
      case 'wishlist':
        return <WishlistView />;
      case 'guide':
      case 'wp-blueprint':
        return <WpGuideView />;
      case 'about':
      case 'contact':
      case 'privacy':
      case 'terms':
      case 'returns':
      case 'shipping':
      case 'shipping-policy':
      case 'cookies':
      case 'faq':
        return <LegalView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50 text-neutral-900 font-sans antialiased selection:bg-[#E4EB9C] selection:text-[#142C14]">
      {/* Customer Header */}
      <Header />

      {/* Main Customer Page Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {renderCustomerView()}
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav />

      {/* Customer Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Customer Quick View Modal */}
      <QuickViewModal />

      {/* Customer AI Shopping Assistant */}
      <CholtiAI />

      {/* Global Feedback Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CustomizerProvider>
      <ShopProvider>
        <MainContent />
      </ShopProvider>
    </CustomizerProvider>
  );
}
