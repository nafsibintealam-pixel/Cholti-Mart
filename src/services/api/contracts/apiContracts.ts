/**
 * BACKEND REST API CONTRACTS & INTERFACES
 * =======================================
 * Defines strictly typed request and response contracts for the future production backend.
 * Compatible with MySQL/MariaDB schema and WordPress/WooCommerce REST specifications.
 */

import { 
  Product, 
  Category, 
  Brand, 
  Order, 
  OrderStatus, 
  DeliveryStatus, 
  PaymentStatus, 
  Customer, 
  Coupon, 
  DeliveryZone, 
  CourierServiceConfig,
  InventoryItem, 
  InventoryAdjustment, 
  AdminUser, 
  AdminRole, 
  AdminPermission, 
  AdminActivityLogRecord, 
  StoreConfig, 
  FAQItem, 
  Page, 
  ProductReview,
  MediaItem,
  HomepageSectionConfig,
  SeoConfig,
  AnalyticsOverview
} from '../../../types';

// ==========================================
// 1. AUTH CONTRACTS
// ==========================================

export interface ApiLoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiLoginResponse {
  token: string;
  refreshToken?: string;
  user: AdminUser;
  expiresIn: number;
}

export interface ApiLogoutRequest {
  refreshToken?: string;
}

export interface ApiLogoutResponse {
  success: boolean;
  message: string;
}

export interface ApiRefreshTokenRequest {
  refreshToken: string;
}

export interface ApiRefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface ApiChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ApiGetMeResponse {
  user: AdminUser;
  permissions: AdminPermission[];
  roles: AdminRole[];
}

// ==========================================
// 2. ADMIN USERS CONTRACTS
// ==========================================

export interface ApiListAdminUsersQuery {
  page?: number;
  perPage?: number;
  role?: string;
  search?: string;
}

export interface ApiListAdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiCreateAdminUserRequest {
  name: string;
  username: string;
  email: string;
  role: AdminRole;
  phone?: string;
  password?: string;
  status: 'active' | 'inactive';
}

export interface ApiCreateAdminUserResponse {
  user: AdminUser;
  message: string;
}

export interface ApiUpdateAdminUserRequest {
  name?: string;
  username?: string;
  email?: string;
  role?: AdminRole;
  phone?: string;
  status?: 'active' | 'inactive';
}

export interface ApiUpdateAdminUserResponse {
  user: AdminUser;
  message: string;
}

export interface ApiDeleteAdminUserResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 3. PRODUCTS CONTRACTS
// ==========================================

export interface ApiListProductsQuery {
  page?: number;
  perPage?: number;
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  status?: 'published' | 'draft' | 'out_of_stock' | 'archived';
  inStock?: boolean;
}

export interface ApiListProductsResponse {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiGetProductResponse {
  product: Product;
}

export interface ApiCreateProductRequest {
  name: string;
  slug?: string;
  category: string;
  categoryId?: string;
  subcategory?: string;
  brand?: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  sku: string;
  inStock: boolean;
  stockCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  tags?: string[];
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  isTrending?: boolean;
  status?: 'published' | 'draft' | 'out_of_stock' | 'archived';
}

export interface ApiCreateProductResponse {
  product: Product;
  message: string;
}

export interface ApiUpdateProductRequest extends Partial<ApiCreateProductRequest> {}

export interface ApiUpdateProductResponse {
  product: Product;
  message: string;
}

export interface ApiDeleteProductResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 4. CATEGORIES CONTRACTS
// ==========================================

export interface ApiListCategoriesResponse {
  categories: Category[];
  total: number;
}

export interface ApiCreateCategoryRequest {
  name: string;
  banglaName?: string;
  slug?: string;
  description?: string;
  iconName?: string;
  image?: string;
  parent?: string;
  subcategories?: string[];
}

export interface ApiCreateCategoryResponse {
  category: Category;
  message: string;
}

export interface ApiUpdateCategoryRequest extends Partial<ApiCreateCategoryRequest> {}

export interface ApiUpdateCategoryResponse {
  category: Category;
  message: string;
}

export interface ApiDeleteCategoryResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 5. BRANDS CONTRACTS
// ==========================================

export interface ApiListBrandsResponse {
  brands: Brand[];
  total: number;
}

export interface ApiCreateBrandRequest {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  origin?: string;
  website?: string;
  isFeatured?: boolean;
}

export interface ApiCreateBrandResponse {
  brand: Brand;
  message: string;
}

export interface ApiUpdateBrandRequest extends Partial<ApiCreateBrandRequest> {}

export interface ApiUpdateBrandResponse {
  brand: Brand;
  message: string;
}

export interface ApiDeleteBrandResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 6. INVENTORY CONTRACTS
// ==========================================

export interface ApiListInventoryQuery {
  page?: number;
  perPage?: number;
  search?: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  category?: string;
}

export interface ApiListInventoryResponse {
  items: InventoryItem[];
  total: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface ApiUpdateInventoryRequest {
  quantityChange: number;
  reason: 'restock' | 'sale' | 'damaged' | 'return' | 'audit_correction' | 'manual_adjustment';
  notes?: string;
  authorName?: string;
}

export interface ApiUpdateInventoryResponse {
  success: boolean;
  newStock: number;
  adjustmentRecord: InventoryAdjustment;
}

export interface ApiGetInventoryHistoryResponse {
  adjustments: InventoryAdjustment[];
  total: number;
}

// ==========================================
// 7. ORDERS CONTRACTS
// ==========================================

export interface ApiListOrdersQuery {
  page?: number;
  perPage?: number;
  status?: OrderStatus | 'all';
  search?: string;
  startDate?: string;
  endDate?: string;
  courier?: string;
}

export interface ApiListOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiGetOrderResponse {
  order: Order;
}

export interface ApiCreateOrderRequest {
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  address: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  notes?: string;
}

export interface ApiCreateOrderResponse {
  order: Order;
  orderNumber: string;
  message: string;
}

export interface ApiUpdateOrderRequest extends Partial<Order> {}

export interface ApiUpdateOrderResponse {
  order: Order;
  message: string;
}

export interface ApiUpdateOrderStatusRequest {
  status: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  paymentStatus?: PaymentStatus;
  note?: string;
  courierPartner?: string;
  trackingNumber?: string;
  authorName?: string;
}

export interface ApiUpdateOrderStatusResponse {
  order: Order;
  message: string;
}

// ==========================================
// 8. CUSTOMERS CONTRACTS
// ==========================================

export interface ApiListCustomersQuery {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface ApiListCustomersResponse {
  customers: Customer[];
  total: number;
}

export interface ApiGetCustomerResponse {
  customer: Customer;
  orders: Order[];
}

export interface ApiUpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  district?: string;
  address?: string;
}

export interface ApiUpdateCustomerResponse {
  customer: Customer;
  message: string;
}

// ==========================================
// 9. COUPONS CONTRACTS
// ==========================================

export interface ApiListCouponsResponse {
  coupons: Coupon[];
  total: number;
}

export interface ApiCreateCouponRequest {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minSpend?: number;
  maxSpend?: number;
  usageLimit?: number;
  expiryDate: string;
  isActive: boolean;
  description?: string;
}

export interface ApiCreateCouponResponse {
  coupon: Coupon;
  message: string;
}

export interface ApiUpdateCouponRequest extends Partial<ApiCreateCouponRequest> {}

export interface ApiUpdateCouponResponse {
  coupon: Coupon;
  message: string;
}

export interface ApiDeleteCouponResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 10. DELIVERY CONTRACTS
// ==========================================

export interface ApiListDeliveryZonesResponse {
  zones: DeliveryZone[];
}

export interface ApiCalculateDeliveryRequest {
  district: string;
  subtotal: number;
  weightKg?: number;
}

export interface ApiCalculateDeliveryResponse {
  deliveryFee: number;
  zoneName: string;
  estimatedDeliveryHours: string;
  isCodSupported: boolean;
}

export interface ApiListCouriersResponse {
  couriers: CourierServiceConfig[];
}

export interface ApiAssignCourierRequest {
  courierPartner: 'steadfast' | 'pathao' | 'redx';
  trackingCode?: string;
  specialInstructions?: string;
}

export interface ApiAssignCourierResponse {
  success: boolean;
  consignmentId: string;
  trackingCode: string;
  courierPartner: string;
  assignedAt: string;
}

// ==========================================
// 11. CONTENT CONTRACTS
// ==========================================

export interface ApiGetHomepageContentResponse {
  sections: HomepageSectionConfig[];
}

export interface ApiUpdateHomepageContentRequest {
  sections: HomepageSectionConfig[];
}

export interface ApiUpdateHomepageContentResponse {
  sections: HomepageSectionConfig[];
  message: string;
}

export interface ApiListFaqsResponse {
  faqs: FAQItem[];
}

export interface ApiCreateFaqRequest {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface ApiCreateFaqResponse {
  faq: FAQItem;
  message: string;
}

export interface ApiUpdateFaqRequest extends Partial<ApiCreateFaqRequest> {}

export interface ApiUpdateFaqResponse {
  faq: FAQItem;
  message: string;
}

export interface ApiDeleteFaqResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 12. PAGES CONTRACTS
// ==========================================

export interface ApiListPagesResponse {
  pages: Page[];
}

export interface ApiGetPageResponse {
  page: Page;
}

export interface ApiCreatePageRequest {
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
}

export interface ApiCreatePageResponse {
  page: Page;
  message: string;
}

export interface ApiUpdatePageRequest extends Partial<ApiCreatePageRequest> {}

export interface ApiUpdatePageResponse {
  page: Page;
  message: string;
}

export interface ApiDeletePageResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 13. MEDIA CONTRACTS
// ==========================================

export interface ApiListMediaQuery {
  page?: number;
  perPage?: number;
  type?: string;
  search?: string;
}

export interface ApiListMediaResponse {
  items: MediaItem[];
  total: number;
}

export interface ApiUploadMediaResponse {
  item: MediaItem;
  message: string;
}

export interface ApiDeleteMediaResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 14. SETTINGS CONTRACTS
// ==========================================

export interface ApiGetSettingsResponse {
  settings: StoreConfig;
}

export interface ApiUpdateSettingsRequest {
  settings: Partial<StoreConfig>;
}

export interface ApiUpdateSettingsResponse {
  settings: StoreConfig;
  message: string;
}

// ==========================================
// 15. SEO CONTRACTS
// ==========================================

export interface ApiGetSeoResponse {
  seo: SeoConfig;
}

export interface ApiUpdateSeoRequest {
  seo: Partial<SeoConfig>;
}

export interface ApiUpdateSeoResponse {
  seo: SeoConfig;
  message: string;
}

// ==========================================
// 16. ANALYTICS CONTRACTS
// ==========================================

export interface ApiGetAnalyticsOverviewResponse {
  metrics: AnalyticsOverview;
}

export interface ApiGetSalesAnalyticsResponse {
  dates: string[];
  revenue: number[];
  orders: number[];
  averageOrderValue: number[];
}

export interface ApiGetProductAnalyticsResponse {
  topSelling: Array<{
    id: string;
    name: string;
    unitsSold: number;
    revenue: number;
    image: string;
  }>;
}

// ==========================================
// 17. REVIEWS CONTRACTS
// ==========================================

export interface ApiListReviewsQuery {
  productId?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  perPage?: number;
}

export interface ApiListReviewsResponse {
  reviews: ProductReview[];
  total: number;
}

export interface ApiUpdateReviewRequest {
  status: 'pending' | 'approved' | 'rejected';
}

export interface ApiUpdateReviewResponse {
  review: ProductReview;
  message: string;
}

export interface ApiDeleteReviewResponse {
  success: boolean;
  deletedId: string;
}

// ==========================================
// 18. AUDIT CONTRACTS
// ==========================================

export interface ApiListAuditLogsQuery {
  page?: number;
  perPage?: number;
  category?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ApiListAuditLogsResponse {
  logs: AdminActivityLogRecord[];
  total: number;
}
