import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, AppView } from '../types';
import { DEMO_PRODUCTS } from '../data/products';
import { TRANSLATIONS, formatPrice, toBengaliNumber } from '../data/translations';

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

const INITIAL_ORDERS: Order[] = [
  {
    id: 'CM-84920',
    date: '17 Sep 2026',
    customerName: 'Tanvir Ahmed',
    phone: '01712345678',
    email: 'tanvir@example.com',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 34, Road 11A, Dhanmondi, Dhaka-1209',
    notes: 'Please call before delivery',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        productId: 'cm-106',
        productName: 'Adjustable Aluminum Laptop Stand',
        price: 1450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
        variant: 'Space Gray'
      },
      {
        productId: 'cm-110',
        productName: 'Foldable Desktop Phone Holder',
        price: 450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&auto=format&fit=crop&q=80',
        variant: 'Pure Black'
      }
    ],
    subtotal: 1900,
    shippingFee: 70,
    discount: 190,
    total: 1780,
    status: 'Processing',
    courierTrackingCode: 'ST-9481203',
    courierPartner: 'Steadfast Courier'
  },
  {
    id: 'CM-10294',
    date: '02 Sep 2026',
    customerName: 'Farhana Kabir',
    phone: '01898765432',
    email: 'farhana@example.com',
    district: 'Chittagong',
    area: 'Panchlaish',
    address: 'GEC Circle, Nasirabad Housing, Chittagong',
    paymentMethod: 'bKash',
    items: [
      {
        productId: 'cm-102',
        productName: "Premium Women's Crossbody Bag",
        price: 2150,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80',
        variant: 'Caramel Brown'
      }
    ],
    subtotal: 2150,
    shippingFee: 130,
    discount: 0,
    total: 2280,
    status: 'Delivered',
    courierTrackingCode: 'PT-3329104',
    courierPartner: 'Pathao Courier'
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(DEMO_PRODUCTS);
  
  // Cart state initialized from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cholti_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: DEMO_PRODUCTS[5], // Laptop stand
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


  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cholti_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

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
    if (clean === 'CHOLTI10') {
      setAppliedCoupon({ code: 'CHOLTI10', discountType: 'percentage', value: 10 });
      showToast('Coupon "CHOLTI10" applied: 10% discount added!', 'success');
      return true;
    } else if (clean === 'FIRST100') {
      setAppliedCoupon({ code: 'FIRST100', discountType: 'fixed', value: 100 });
      showToast('Coupon "FIRST100" applied: ৳100 discount added!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "CHOLTI10" or "FIRST100"', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Delivery rules for Bangladesh:
  // Standard inside Dhaka ৳70, free if subtotal >= 2500
  const estimatedDeliveryFee = cartSubtotal >= 2500 || cartSubtotal === 0 ? 0 : 70;
  
  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage' 
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : Math.min(cartSubtotal, appliedCoupon.value)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? estimatedDeliveryFee : 0));

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'courierTrackingCode' | 'courierPartner'>) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `CM-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Order Received',
      courierTrackingCode: `ST-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierPartner: 'Steadfast Courier'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
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
