/**
 * CENTRALIZED API ENDPOINTS CATALOGUE
 * ===================================
 * Defines the exact REST API contract required for a future production backend
 * as well as the official WordPress & WooCommerce REST API pathways.
 */

export const ENDPOINTS = {
  // Authentication & Staff
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    SESSIONS: '/auth/sessions',
    TERMINATE_SESSION: (id: string) => `/auth/sessions/${id}`,
    TERMINATE_ALL_OTHER: '/auth/sessions/terminate-others',
    LOGIN_HISTORY: '/auth/login-history',
  },

  // Products & Inventory
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (idOrSlug: string) => `/products/${idOrSlug}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    STOCK: (id: string) => `/products/${id}/stock`,
    FEATURED: '/products/featured',
    TRENDING: '/products/trending',
    SPECIAL_OFFERS: '/products/special-offers',
  },

  // Categories & Brands
  TAXONOMY: {
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: (idOrSlug: string) => `/categories/${idOrSlug}`,
    BRANDS: '/brands',
    BRAND_DETAIL: (idOrSlug: string) => `/brands/${idOrSlug}`,
    TAGS: '/tags',
    ATTRIBUTES: '/attributes',
  },

  // Orders & Checkout
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    TRACK: (trackingCodeOrId: string) => `/orders/track/${trackingCodeOrId}`,
    ADMIN_NOTES: (id: string) => `/orders/${id}/notes`,
    BULK_STATUS: '/orders/bulk-status',
    BULK_DELETE: '/orders/bulk-delete',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    ORDERS: (id: string) => `/customers/${id}/orders`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    GROUPS: '/customers/groups',
  },

  // Coupons
  COUPONS: {
    LIST: '/marketing/coupons',
    DETAIL: (id: string) => `/marketing/coupons/${id}`,
    CREATE: '/marketing/coupons',
    DELETE: (id: string) => `/marketing/coupons/${id}`,
    VALIDATE: '/marketing/coupons/validate',
  },

  // Delivery
  DELIVERY: {
    ZONES: '/delivery/zones',
    ZONE_DETAIL: (id: string) => `/delivery/zones/${id}`,
    COURIERS: '/delivery/couriers',
    COURIER_DETAIL: (id: string) => `/delivery/couriers/${id}`,
    CALCULATE_FEE: '/delivery/calculate-fee',
  },

  // Inventory
  INVENTORY: {
    ADJUSTMENTS: '/inventory/adjustments',
    RECORD_ADJUSTMENT: '/inventory/adjustments',
    STOCK_UPDATE: (productId: string) => `/inventory/stock/${productId}`,
    LOW_STOCK: '/inventory/low-stock',
  },

  // Content & CMS
  CONTENT: {
    PAGES: '/content/pages',
    PAGE: (slug: string) => `/content/pages/${slug}`,
    BLOG_POSTS: '/content/blog',
    BLOG_POST: (slug: string) => `/content/blog/${slug}`,
    TESTIMONIALS: '/content/testimonials',
    FAQS: '/content/faqs',
    HERO: '/content/hero',
    PROMO_BANNER: '/content/promo-banner',
    TRUST_ITEMS: '/content/trust-items',
  },

  // Site Settings & Configuration
  SETTINGS: {
    SITE: '/settings/site',
    THEME: '/settings/theme',
    TYPOGRAPHY: '/settings/typography',
    SECTIONS_VISIBILITY: '/settings/sections-visibility',
    DELIVERY: '/settings/delivery',
    PAYMENT_GATEWAYS: '/settings/payment-gateways',
    COURIERS: '/settings/couriers',
  },

  // Media Library
  MEDIA: {
    LIST: '/media',
    UPLOAD: '/media/upload',
    DELETE: (id: string) => `/media/${id}`,
  },

  // Coupons & Marketing
  MARKETING: {
    COUPONS: '/marketing/coupons',
    VALIDATE_COUPON: '/marketing/coupons/validate',
    PROMOTIONS: '/marketing/promotions',
    FLASH_SALES: '/marketing/flash-sales',
    ABANDONED_CARTS: '/marketing/abandoned-carts',
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    REVENUE_CHART: '/analytics/revenue-chart',
    TOP_PRODUCTS: '/analytics/top-products',
    CONVERSION: '/analytics/conversion',
  },

  // Integrations Status
  INTEGRATIONS: {
    STATUS: '/integrations/status',
    TEST_CONNECTION: (type: string) => `/integrations/${type}/test`,
    CONFIGURE: (type: string) => `/integrations/${type}/configure`,
    DISCONNECT: (type: string) => `/integrations/${type}/disconnect`,
  },

  // Official WooCommerce v3 REST API specifications
  WOOCOMMERCE: {
    PRODUCTS: '/wp-json/wc/v3/products',
    PRODUCT_DETAIL: (id: number) => `/wp-json/wc/v3/products/${id}`,
    CATEGORIES: '/wp-json/wc/v3/products/categories',
    ORDERS: '/wp-json/wc/v3/orders',
    CUSTOMERS: '/wp-json/wc/v3/customers',
    COUPONS: '/wp-json/wc/v3/coupons',
    SYSTEM_STATUS: '/wp-json/wc/v3/system_status',
  }
};
