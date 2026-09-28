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

export type ProductStatus = 'published' | 'draft' | 'archived' | 'out_of_stock';

export interface ProductAttribute {
  id: string;
  name: string;
  slug?: string;
  options: string[];
  visible: boolean;
  variation?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  origin?: string;
  productCount: number;
  website?: string;
  isFeatured?: boolean;
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId?: string;
  categories?: string[];
  subcategory: string;
  brand?: string;
  brandId?: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  costPrice?: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  images: string[];
  shortDescription: string;
  description: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  stock?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  status?: ProductStatus | 'publish' | 'draft' | 'pending' | 'private';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isSpecialOffer?: boolean;
  badge?: string;
  tags: string[];
  attributes?: ProductAttribute[];
  specifications: { [key: string]: string };
  variations?: ProductVariation[];
  reviewsList: ProductReview[];
  gallery?: string[];
  weight?: string;
  dimensions?: { length: string; width: string; height: string };
  shippingClass?: string;
  visibility?: 'visible' | 'catalog' | 'search' | 'hidden';
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  wooId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  banglaName?: string;
  slug: string;
  description?: string;
  iconName?: string;
  image: string;
  itemCount: number;
  subcategories: string[];
  parent?: string;
  wooId?: number;
}

export type CategoryItem = Category;

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  costPrice: number;
  retailPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category: string;
  brand?: string;
  lastAdjusted: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousStock: number;
  quantityChange: number;
  newStock: number;
  reason: 'restock' | 'sale' | 'damaged' | 'return' | 'audit_correction' | 'manual_adjustment';
  notes?: string;
  date: string;
  adjustedBy: string;
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
  sku?: string;
  variant?: string;
  subtotal?: number;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded'
  | 'Order Received' 
  | 'Order Confirmed' 
  | 'Out for Delivery';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded' | 'partially_refunded';

export type DeliveryStatus = 
  | 'pending'
  | 'processing'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'failed';

export interface OrderAddress {
  fullName?: string;
  phone?: string;
  email?: string;
  street: string;
  area?: string;
  district: string;
  postalCode?: string;
  country?: string;
}

export interface OrderAdminNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  isCustomerVisible?: boolean;
}

export interface OrderTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'status_change' | 'payment' | 'courier' | 'note' | 'system' | 'created';
  user?: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  customerName: string;
  customerId?: string;
  phone: string;
  email: string;
  district: string;
  area: string;
  address: string;
  billingAddress?: OrderAddress | string;
  shippingAddress?: OrderAddress | string;
  notes?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket' | 'Card' | string;
  paymentStatus?: PaymentStatus;
  items: OrderItem[];
  itemCount?: number;
  subtotal: number;
  shippingFee: number;
  deliveryCharge?: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  courierTrackingCode?: string;
  trackingNumber?: string;
  courierPartner?: string;
  courier?: string;
  adminNotes?: OrderAdminNote[];
  timeline?: OrderTimelineEvent[];
  wooCommerceOrderId?: number;
  coupon?: string | { code: string; discount: number };
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
  | 'ADMIN'
  | 'MANAGER'
  | 'ORDER_MANAGER'
  | 'CONTENT_MANAGER'
  | 'VIEWER'
  // Legacy aliases for backward compatibility
  | 'STORE_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'CUSTOMER_SUPPORT';

export type AdminPermission = 
  | 'manage_settings'      // WordPress / Site Settings, Brand, API Keys
  | 'manage_theme'         // Colors, Typography, CSS Variables
  | 'manage_products'      // WooCommerce Products, Prices, Stock
  | 'manage_categories'    // WooCommerce Product Categories
  | 'manage_orders'        // WooCommerce Orders, Shipping, Status
  | 'manage_customers'     // Customers, Profiles, Groups
  | 'manage_delivery'      // Delivery zones, charges, couriers
  | 'manage_marketing'     // Promotions, flash sales, coupons
  | 'manage_payments'      // Payment methods, transactions, refunds
  | 'manage_analytics'     // Sales, revenue, reports
  | 'manage_content'       // Pages, blog, media, testimonials
  | 'manage_users'         // Admin Users, RBAC Assignments
  | 'manage_integrations'  // WP, WC, Courier, SMS, Payment APIs
  | 'manage_system'        // System health, error logs, blueprints
  | 'manage_export'        // System Export, Blueprints, Migrations
  | 'view_dashboard';      // Read-only dashboard & viewer

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
  permissions: AdminPermission[];
  status?: 'active' | 'suspended' | 'pending';
  phone?: string;
  createdAt?: string;
}

export interface AdminSession {
  token: string;
  expiresAt: string;
  user: AdminUser;
}

export interface AdminActiveSession {
  id: string;
  adminUserId: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActive: string;
  isCurrentSession: boolean;
  userAgent?: string;
}

// ==========================================
// NAVIGATION STRUCTURE (14 Top-Level Sections)
// ==========================================
export type AdminNavSection =
  | 'dashboard'
  | 'catalog'
  | 'orders'
  | 'customers'
  | 'delivery'
  | 'store_design'
  | 'marketing'
  | 'payments'
  | 'analytics'
  | 'content'
  | 'security'
  | 'settings'
  | 'integrations'
  | 'system';

export type CatalogSubNav =
  | 'products'
  | 'add_product'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'attributes'
  | 'reviews'
  | 'coupons';

export type OrdersSubNav =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type CustomersSubNav =
  | 'all_customers'
  | 'profiles'
  | 'guest_customers'
  | 'customer_groups';

export type DeliverySubNav =
  | 'delivery_zones'
  | 'delivery_charges'
  | 'shipping_methods'
  | 'courier_settings'
  | 'tracking'
  | 'cod_settings';

export type StoreDesignSubNav =
  | 'brand_identity'
  | 'colors'
  | 'typography'
  | 'homepage'
  | 'hero_sections'
  | 'banners'
  | 'promos'
  | 'faq'
  | 'footer'
  | 'custom_pages';

export type MarketingSubNav =
  | 'promotions'
  | 'flash_sales'
  | 'coupons'
  | 'featured_products'
  | 'recommendations'
  | 'abandoned_cart';

export type PaymentsSubNav =
  | 'cod'
  | 'online_payments'
  | 'transactions'
  | 'refunds';

export type AnalyticsSubNav =
  | 'sales'
  | 'revenue'
  | 'orders'
  | 'products'
  | 'customers'
  | 'conversion';

export type ContentSubNav =
  | 'pages'
  | 'blog'
  | 'testimonials'
  | 'media_library';

export type SecuritySubNav =
  | 'account_settings'
  | 'admin_users'
  | 'roles_permissions'
  | 'sessions'
  | 'login_history'
  | 'activity_logs'
  | 'security_settings';

export type SettingsSubNav =
  | 'general'
  | 'store'
  | 'currency'
  | 'tax'
  | 'checkout'
  | 'email'
  | 'notifications'
  | 'seo'
  | 'social_media';

export type IntegrationsSubNav =
  | 'wordpress'
  | 'woocommerce'
  | 'payment_gateway'
  | 'courier'
  | 'email'
  | 'sms'
  | 'analytics'
  | 'api';

export type SystemSubNav =
  | 'blueprint'
  | 'api_status'
  | 'database_status'
  | 'system_health'
  | 'error_logs'
  | 'version';

// ==========================================
// MODULE DATA MODELS
// ==========================================

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  area: string;
  address: string;
  isGuest: boolean;
  group: 'Regular' | 'VIP' | 'Wholesale' | 'New' | 'Inactive';
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedDate: string;
  notes?: string;
  status: 'active' | 'blocked';
}

export interface CustomerGroupItem {
  id: string;
  name: string;
  discountPercentage: number;
  minOrdersRequired: number;
  memberCount: number;
  description: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  districtName: string;
  charge: number;
  estimatedDelivery: string;
  isCodAvailable: boolean;
  courierPartner: string;
  isActive: boolean;
}

export interface CourierServiceConfig {
  id: string;
  name: string;
  code: 'steadfast' | 'pathao' | 'redx' | 'paperfly' | 'sundarban';
  logoUrl?: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  isEnabled: boolean;
  isSandboxed: boolean;
  statusText: string;
  avgDeliveryHours: number;
}

export interface PromotionCampaign {
  id: string;
  title: string;
  subtitle: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  badgeText: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategory?: string;
  clicksCount: number;
}

export interface FlashSaleItem {
  id: string;
  productId: string;
  productName: string;
  regularPrice: number;
  flashPrice: number;
  discountPercent: number;
  stockLimit: number;
  soldCount: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'ended';
}

export interface AbandonedCartRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemsCount: number;
  cartTotal: number;
  lastActive: string;
  recoveryEmailSent: boolean;
  status: 'abandoned' | 'recovered' | 'expired';
}

export interface PaymentTransactionRecord {
  id: string;
  trxId: string;
  orderId: string;
  customerName: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'Cash on Delivery';
  amount: number;
  gatewayFee: number;
  netAmount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
}

export interface RefundItemRecord {
  id: string;
  refundNumber: string;
  orderId: string;
  customerName: string;
  amount: number;
  reason: string;
  method: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
  notes?: string;
}

export interface ContentPageRecord {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
  author: string;
  viewsCount?: number;
  views?: number;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  coverImage: string;
  featuredImage?: string;
  excerpt: string;
  date?: string;
  publishedDate?: string;
  status: 'published' | 'draft';
  readTime?: string;
  viewsCount?: number;
  views?: number;
  content?: string;
  tags?: string[];
}

export interface TestimonialRecord {
  id: string;
  customerName: string;
  customerCity?: string;
  customerLocation?: string;
  avatarUrl?: string;
  customerAvatar?: string;
  rating: number;
  quote?: string;
  comment?: string;
  productName?: string;
  productPurchased?: string;
  isFeatured: boolean;
  date?: string;
  createdAt?: string;
  verified?: boolean;
  isVerified?: boolean;
}

export interface MediaItemRecord {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
  uploadedAt: string;
  fileType: string;
}

export interface AdminActivityLogRecord {
  id: string;
  timestamp: string;
  user: string;
  userRole: AdminRole;
  action: string;
  target: string;
  ipAddress: string;
  category: 'product' | 'order' | 'settings' | 'security' | 'content';
}

export interface LoginHistoryRecord {
  id: string;
  timestamp: string;
  user: string;
  ipAddress: string;
  device: string;
  browser: string;
  status: 'Success' | 'Failed (Wrong Password)' | 'Blocked';
}

export interface SystemErrorLogRecord {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  service: string;
  message: string;
  resolved: boolean;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
}

export type StaffUserRecord = AdminUserRecord;

export type BlogPostItem = BlogPostRecord;

export interface SecurityAuditLogRecord {
  id: string;
  timestamp: string;
  adminName: string;
  staffName?: string;
  adminRole: string;
  role?: string;
  action: string;
  ipAddress: string;
  ip?: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetResource?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value?: number;
  discountValue?: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  usageCount?: number;
  status?: 'active' | 'expired' | 'disabled' | 'inactive';
  isActive?: boolean;
  description?: string;
}

export type CouponItem = Coupon;

export type Customer = CustomerProfile;
export type Page = ContentPageRecord;
export type MediaItem = MediaItemRecord;

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isOpen?: boolean;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
}

export interface HomepageSectionConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string[];
}

export interface AnalyticsOverview {
  totalRevenue: number;
  ordersCount: number;
  averageOrderValue: number;
  conversionRate: number;
  customersCount: number;
}


