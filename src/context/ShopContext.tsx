import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, AppView } from '../types';
import { TRANSLATIONS, formatPrice, toBengaliNumber } from '../data/translations';
import { productService, orderService, couponService, deliveryService } from '../services';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CouponState {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  currentView: AppView;
  selectedProductId: string | null;
  quickViewProduct: Product | null;
  searchQuery: string;
  selectedCategory: string;
  selectedSubcategory: string | null;
  priceRange: [number, number];
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  language: 'en' | 'bn';
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  appliedCoupon: CouponState | null;
  toast: ToastState | null;

  // Actions
  setCurrentView: (view: AppView) => void;
  navigateTo: (view: AppView, category?: string, subcategory?: string) => void;
  viewProduct: (productId: string) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedSubcategory: (subcat: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setLanguage: (lang: 'en' | 'bn') => void;
  t: (key: string, defaultText?: string) => string;
  formatCurrency: (amount: number) => string;

  
  addToCart: (product: Product, quantity?: number, color?: string, size?: string, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'courierTrackingCode' | 'courierPartner'>) => Order;
  trackOrderLookup: (orderId: string, phoneOrEmail?: string) => Order | undefined;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  estimatedDeliveryFee: number;
  discountAmount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => productService.getProductsSync());

  // Listen to authoritative catalog updates from the service layer
  useEffect(() => {
    return productService.subscribe(() => {
      setProducts(productService.getProductsSync());
    });
  }, []);
  
  // Cart state initialized from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cholti_cart');
      const seedProducts = productService.getProductsSync();
      return saved ? JSON.parse(saved) : [
        {
          product: seedProducts[5] || seedProducts[0], // Laptop stand
          quantity: 1,
          selectedColor: 'Space Gray'
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cholti_wishlist');
      return saved ? JSON.parse(saved) : ['cm-101', 'cm-103', 'cm-105'];
    } catch {
      return ['cm-101', 'cm-103'];
    }
  });

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['cm-106', 'cm-101', 'cm-111']);

  // Navigation & View state
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      if (hash === '#admin' || path.startsWith('/admin') || search.includes('admin=true') || search.includes('admin=login')) {
        return 'admin';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      if (hash === '#admin' || path.startsWith('/admin') || search.includes('admin=true') || search.includes('admin=login')) {
        setCurrentView('admin');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  const [selectedProductId, setSelectedProductId] = useState<string | null>('cm-106');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Shop Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('default');

  // UI Drawers & Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'bn'>(() => {
    try {
      const saved = localStorage.getItem('cholti_lang');
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: 'en' | 'bn') => {
    setLanguageState(lang);
    try {
      localStorage.setItem('cholti_lang', lang);
    } catch (e) {
      console.warn('localStorage error', e);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText || key;
  };

  const formatCurrency = (amount: number): string => {
    return formatPrice(amount, language);
  };


  // Orders from authoritative OrderService
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrdersSync());

  // Listen to authoritative orders updates
  useEffect(() => {
    return orderService.subscribe(() => {
      setOrders(orderService.getOrdersSync());
    });
  }, []);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>({
    code: 'CHOLTI10',
    discountType: 'percentage',
    value: 10
  });

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cholti_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cholti_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('cholti_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const navigateTo = (view: AppView, category?: string, subcategory?: string) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      try {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      } catch {
        window.location.hash = '';
      }
    }

    if (category !== undefined) {
      setSelectedCategory(category);
    } else if (view === 'shop') {
      setSelectedCategory('All');
    }

    if (subcategory !== undefined) {
      setSelectedSubcategory(subcategory);
    } else if (view === 'shop' && category === undefined) {
      setSelectedSubcategory(null);
    }

    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    setQuickViewProduct(null);
    setIsCartDrawerOpen(false);
    
    // Add to recently viewed without duplicate
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string, openDrawer = true) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    showToast(`Added "${product.name}" to cart!`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
    ));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const isSaved = wishlist.includes(productId);
    if (isSaved) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('Saved to wishlist!', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setWishlist(prev => prev.filter(id => id !== productId));
    }
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupons = couponService.getCouponsSync();
    const found = coupons.find(c => c.code.toUpperCase() === clean && c.status === 'active');
    if (found) {
      if (found.minSpend && cartSubtotal < found.minSpend) {
        showToast(`Minimum order total of ৳${found.minSpend} required for "${found.code}"`, 'error');
        return false;
      }
      const discountVal = found.discountValue ?? found.value ?? 0;
      setAppliedCoupon({
        code: found.code,
        discountType: found.discountType,
        value: discountVal
      });
      showToast(`Coupon "${found.code}" applied: ${found.discountType === 'percentage' ? `${discountVal}%` : `৳${discountVal}`} discount added!`, 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "CHOLTI10" or "EID200"', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Delivery rules for Bangladesh using DeliveryService
  const estimatedDeliveryFee = deliveryService.calculateDeliveryFee('Dhaka', cartSubtotal);
  
  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage' 
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : Math.min(cartSubtotal, appliedCoupon.value)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? estimatedDeliveryFee : 0));

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'courierTrackingCode' | 'courierPartner'>) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `CM-${randomNum}`;
    const trackingCode = `ST-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const nowISO = new Date().toISOString();
    const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTimestamp = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const isCOD = orderData.paymentMethod === 'Cash on Delivery';

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      date: nowStr,
      createdAt: nowISO,
      updatedAt: nowISO,
      status: 'Pending',
      paymentStatus: isCOD ? 'unpaid' : 'paid',
      deliveryStatus: 'pending',
      courierTrackingCode: trackingCode,
      trackingNumber: trackingCode,
      courierPartner: 'Steadfast Courier',
      courier: 'Steadfast Courier',
      deliveryCharge: orderData.shippingFee || estimatedDeliveryFee,
      itemCount: orderData.items.reduce((acc, it) => acc + it.quantity, 0),
      billingAddress: orderData.billingAddress || {
        fullName: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        street: orderData.address,
        area: orderData.area,
        district: orderData.district,
        postalCode: '1200',
        country: 'Bangladesh'
      },
      shippingAddress: orderData.shippingAddress || {
        fullName: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        street: orderData.address,
        area: orderData.area,
        district: orderData.district,
        postalCode: '1200',
        country: 'Bangladesh'
      },
      adminNotes: [],
      timeline: [
        {
          id: `tl-${Date.now()}-created`,
          timestamp: formattedTimestamp,
          title: 'Order Placed',
          description: `Order created via web store checkout (${orderData.paymentMethod}).`,
          type: 'created',
          user: 'Customer (Online Checkout)'
        }
      ]
    };

    // Authoritatively save via OrderService
    const saved = orderService.createOrderSync(newOrder);
    setOrders(orderService.getOrdersSync());
    clearCart();
    return saved;
  };

  const trackOrderLookup = (orderId: string, phoneOrEmail?: string) => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(o => {
      const idMatch = o.id.toUpperCase() === cleanId || (o.courierTrackingCode && o.courierTrackingCode.toUpperCase() === cleanId);
      if (!phoneOrEmail || !phoneOrEmail.trim()) return idMatch;
      const phoneClean = phoneOrEmail.trim().toLowerCase();
      return idMatch && (o.phone.includes(phoneClean) || o.email.toLowerCase().includes(phoneClean));
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        recentlyViewed,
        currentView,
        selectedProductId,
        quickViewProduct,
        searchQuery,
        selectedCategory,
        selectedSubcategory,
        priceRange,
        sortBy,
        isCartDrawerOpen,
        isMobileMenuOpen,
        language,
        orders,
        setOrders,
        appliedCoupon,
        toast,

        setCurrentView,
        navigateTo,
        viewProduct,
        setQuickViewProduct,
        setSearchQuery,
        setSelectedCategory,
        setSelectedSubcategory,
        setPriceRange,
        setSortBy,
        setIsCartDrawerOpen,
        setIsMobileMenuOpen,
        setLanguage,
        t,
        formatCurrency,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,

        applyCoupon,
        removeCoupon,
        placeOrder,
        trackOrderLookup,
        showToast,

        cartCount,
        cartSubtotal,
        cartTotal,
        estimatedDeliveryFee,
        discountAmount
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
