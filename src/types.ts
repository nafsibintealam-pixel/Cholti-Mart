export interface ProductVariation {
  name: string;
  options: string[];
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isSpecialOffer?: boolean;
  badge?: string;
  tags: string[];
  specifications: { [key: string]: string };
  variations?: ProductVariation[];
  reviewsList: ProductReview[];
}

export interface CategoryItem {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export type OrderStatus = 
  | 'Order Received' 
  | 'Order Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered';

export interface Order {
  id: string;
  date: string;
  createdAt?: string;
  customerName: string;
  phone: string;
  email: string;
  district: string;
  area: string;
  address: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket' | 'Card';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  courierTrackingCode?: string;
  courierPartner?: string;
}

export type AppView = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'account' 
  | 'tracking' 
  | 'wishlist' 
  | 'about' 
  | 'contact' 
  | 'faq' 
  | 'privacy' 
  | 'terms' 
  | 'returns' 
  | 'shipping'
  | 'shipping-policy' 
  | 'cookies'
  | 'guide'
  | 'wp-blueprint'
  | 'admin';

export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'STORE_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'ORDER_MANAGER'
  | 'CONTENT_MANAGER'
  | 'CUSTOMER_SUPPORT';

export type AdminPermission = 
  | 'manage_settings'      // WordPress / Site Settings, Brand, API Keys
  | 'manage_theme'         // Colors, Typography, CSS Variables
  | 'manage_products'      // WooCommerce Products, Prices, Stock
  | 'manage_categories'    // WooCommerce Product Categories
  | 'manage_orders'        // WooCommerce Orders, Shipping, Status
  | 'manage_content'       // Elementor Sections, Hero, Banners, FAQs, Footer
  | 'manage_users'         // Admin Users, RBAC Assignments
  | 'manage_export';       // System Export, Blueprints, Migrations

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
  permissions: AdminPermission[];
}

export interface AdminSession {
  token: string;
  expiresAt: string;
  user: AdminUser;
}
