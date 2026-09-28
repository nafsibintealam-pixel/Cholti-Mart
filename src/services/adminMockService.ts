import { 
  CustomerProfile, 
  CustomerGroupItem, 
  DeliveryZone, 
  CourierServiceConfig, 
  PromotionCampaign, 
  FlashSaleItem, 
  AbandonedCartRecord, 
  PaymentTransactionRecord, 
  RefundItemRecord, 
  ContentPageRecord, 
  BlogPostRecord, 
  TestimonialRecord, 
  MediaItemRecord, 
  AdminUserRecord, 
  AdminActivityLogRecord, 
  LoginHistoryRecord, 
  SystemErrorLogRecord,
  AdminUser,
  AdminRole,
  StaffUserRecord,
  SecurityAuditLogRecord,
  Product,
  Category,
  Brand,
  InventoryItem,
  ProductAttribute,
  InventoryAdjustment,
  ProductStatus,
  Order,
  OrderStatus,
  OrderItem,
  PaymentStatus,
  DeliveryStatus,
  OrderAddress,
  OrderAdminNote,
  OrderTimelineEvent
} from '../types';
import { DEMO_PRODUCTS } from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';

// ==========================================
// MOCK DATA STORAGE KEYS (LOCAL PERSISTENCE)
// ==========================================
const STORAGE_KEYS = {
  PRODUCTS: 'cholti_mock_products_v1',
  CATEGORIES: 'cholti_admin_categories_v1',
  BRANDS: 'cholti_admin_brands_v1',
  INVENTORY_ADJUSTMENTS: 'cholti_admin_inventory_adjustments_v1',
  ORDERS: 'cholti_admin_orders_v1',
  CUSTOMERS: 'cholti_admin_customers_v1',
  DELIVERY_ZONES: 'cholti_admin_zones_v1',
  COURIERS: 'cholti_admin_couriers_v1',
  PROMOTIONS: 'cholti_admin_promos_v1',
  FLASH_SALES: 'cholti_admin_flash_sales_v1',
  ABANDONED_CARTS: 'cholti_admin_abandoned_carts_v1',
  TRANSACTIONS: 'cholti_admin_transactions_v1',
  REFUNDS: 'cholti_admin_refunds_v1',
  CONTENT_PAGES: 'cholti_admin_content_pages_v1',
  BLOG_POSTS: 'cholti_admin_blog_posts_v1',
  TESTIMONIALS: 'cholti_admin_testimonials_v1',
  MEDIA_LIBRARY: 'cholti_admin_media_library_v1',
  ADMIN_USERS: 'cholti_admin_users_list_v1',
  ACTIVITY_LOGS: 'cholti_admin_activity_logs_v1',
  LOGIN_HISTORY: 'cholti_admin_login_history_v1',
  ERROR_LOGS: 'cholti_admin_error_logs_v1'
};

// ==========================================
// INITIAL BRANDS & INVENTORY SEED DATA
// ==========================================
export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brand-aarong',
    name: 'Aarong Earth',
    slug: 'aarong-earth',
    logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    description: 'Heritage ethnic apparel and hand-embroidered artisanal Bangladeshi textiles.',
    origin: 'Dhaka, Bangladesh',
    productCount: 14,
    website: 'https://aarong.com',
    isFeatured: true
  },
  {
    id: 'brand-anjans',
    name: "Anjan's Craft",
    slug: 'anjans-craft',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80',
    description: 'Contemporary indigenous weaves, handloom silk, and cotton fusion collections.',
    origin: 'Dhaka, Bangladesh',
    productCount: 8,
    isFeatured: true
  },
  {
    id: 'brand-xiaomi',
    name: 'Xiaomi Ecosystem',
    slug: 'xiaomi-ecosystem',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
    description: 'Smart consumer gadgets, IoT appliances, smartwatches, and audio accessories.',
    origin: 'Beijing, China',
    productCount: 18,
    website: 'https://mi.com',
    isFeatured: true
  },
  {
    id: 'brand-baseus',
    name: 'Baseus Official',
    slug: 'baseus-official',
    logo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
    description: 'High-speed GaN chargers, durable braided cables, and ergonomic desk accessories.',
    origin: 'Shenzhen, China',
    productCount: 12,
    website: 'https://baseus.com',
    isFeatured: false
  },
  {
    id: 'brand-cholti',
    name: 'Cholti Essentials',
    slug: 'cholti-essentials',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
    description: 'Our certified direct-from-source essentials, kitchen gadgets, and daily accessories.',
    origin: 'Dhaka, Bangladesh',
    productCount: 22,
    isFeatured: true
  },
  {
    id: 'brand-focallure',
    name: 'Focallure Beauty',
    slug: 'focallure-beauty',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    description: 'Dermatologically tested everyday makeup, eye palettes, and hydration lip care.',
    origin: 'Guangzhou, China',
    productCount: 9,
    isFeatured: false
  }
];

export const INITIAL_INVENTORY_ADJUSTMENTS: InventoryAdjustment[] = [
  {
    id: 'adj-101',
    productId: 'cm-101',
    productName: "Women's Elegant Kurti",
    sku: 'CM-WF-001',
    previousStock: 14,
    quantityChange: 10,
    newStock: 24,
    reason: 'restock',
    notes: 'Received batch from artisan supplier in Mirpur',
    date: '2026-09-18 14:20',
    adjustedBy: 'Tanvir Hossain (Admin)'
  },
  {
    id: 'adj-102',
    productId: 'cm-103',
    productName: 'T900 Ultra Smartwatch',
    sku: 'CM-GD-003',
    previousStock: 40,
    quantityChange: -5,
    newStock: 35,
    reason: 'sale',
    notes: 'Bulk order fulfillment via Pathao Courier',
    date: '2026-09-17 11:05',
    adjustedBy: 'System Auto-Deduct'
  },
  {
    id: 'adj-103',
    productId: 'cm-104',
    productName: 'Wireless Bluetooth Earbuds Pro',
    sku: 'CM-EL-004',
    previousStock: 8,
    quantityChange: -1,
    newStock: 7,
    reason: 'damaged',
    notes: 'Defective left charging pin reported in QA audit',
    date: '2026-09-16 16:45',
    adjustedBy: 'Nafis Alam (QA)'
  },
  {
    id: 'adj-104',
    productId: 'cm-102',
    productName: "Premium Women's Crossbody Bag",
    sku: 'CM-WJ-002',
    previousStock: 12,
    quantityChange: 6,
    newStock: 18,
    reason: 'restock',
    notes: 'Warehouse reorder delivery confirmed',
    date: '2026-09-15 09:30',
    adjustedBy: 'Tanvir Hossain (Admin)'
  }
];

// ==========================================
// INITIAL ADMIN ORDERS SEED DATA
// ==========================================
export const INITIAL_ADMIN_ORDERS: Order[] = [
  {
    id: 'CM-84920',
    date: '17 Sep 2026',
    createdAt: '2026-09-17T14:32:00Z',
    updatedAt: '2026-09-18T10:15:00Z',
    customerName: 'Tanvir Ahmed',
    customerId: 'c-104',
    phone: '+8801712345678',
    email: 'tanvir.ahmed@gmail.com',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 34, Road 11A, Dhanmondi R/A, Dhaka-1209',
    billingAddress: {
      fullName: 'Tanvir Ahmed',
      phone: '+8801712345678',
      email: 'tanvir.ahmed@gmail.com',
      street: 'House 34, Road 11A, Dhanmondi R/A',
      district: 'Dhaka',
      postalCode: '1209',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Tanvir Ahmed',
      phone: '+8801712345678',
      email: 'tanvir.ahmed@gmail.com',
      street: 'House 34, Road 11A, Dhanmondi R/A',
      district: 'Dhaka',
      postalCode: '1209',
      country: 'Bangladesh'
    },
    notes: 'Please call before arriving. Deliver between 2 PM - 5 PM.',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'unpaid',
    status: 'Processing',
    deliveryStatus: 'processing',
    courierPartner: 'Steadfast Courier',
    courier: 'Steadfast Courier',
    courierTrackingCode: 'ST-9481203',
    trackingNumber: 'ST-9481203',
    items: [
      {
        productId: 'cm-106',
        productName: 'Adjustable Aluminum Laptop Stand',
        sku: 'CM-EL-006',
        price: 1450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
        variant: 'Space Gray',
        subtotal: 1450
      },
      {
        productId: 'cm-110',
        productName: 'Foldable Desktop Phone Holder',
        sku: 'CM-EL-010',
        price: 450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&auto=format&fit=crop&q=80',
        variant: 'Pure Black',
        subtotal: 450
      }
    ],
    itemCount: 2,
    subtotal: 1900,
    shippingFee: 70,
    deliveryCharge: 70,
    discount: 190,
    total: 1780,
    adminNotes: [
      {
        id: 'note-1',
        text: 'Customer requested verification call prior to dispatch.',
        author: 'Shakil Anwar (Order Mgr)',
        createdAt: '17 Sep 2026, 03:10 PM'
      },
      {
        id: 'note-2',
        text: 'Packed in reinforced bubble wrap for fragile anodized aluminum parts.',
        author: 'Warehouse Dispatch Team',
        createdAt: '18 Sep 2026, 10:15 AM'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '17 Sep 2026, 02:32 PM',
        title: 'Order Placed',
        description: 'Customer completed checkout via Cash on Delivery.',
        type: 'created',
        user: 'Customer (Online)'
      },
      {
        id: 'tl-2',
        timestamp: '17 Sep 2026, 03:05 PM',
        title: 'Order Confirmed',
        description: 'Phone verification completed with customer.',
        type: 'status_change',
        user: 'Shakil Anwar'
      },
      {
        id: 'tl-3',
        timestamp: '18 Sep 2026, 10:12 AM',
        title: 'Courier Assigned',
        description: 'Assigned to Steadfast Courier with tracking ST-9481203.',
        type: 'courier',
        user: 'Dispatch System'
      }
    ]
  },
  {
    id: 'CM-10294',
    date: '02 Sep 2026',
    createdAt: '2026-09-02T09:14:00Z',
    updatedAt: '2026-09-05T17:40:00Z',
    customerName: 'Farhana Kabir',
    customerId: 'c-103',
    phone: '+8801898765432',
    email: 'farhana.kabir@yahoo.com',
    district: 'Chittagong',
    area: 'Panchlaish',
    address: 'GEC Circle, Nasirabad Housing, Chittagong',
    billingAddress: {
      fullName: 'Farhana Kabir',
      phone: '+8801898765432',
      email: 'farhana.kabir@yahoo.com',
      street: 'GEC Circle, Nasirabad Housing',
      district: 'Chittagong',
      postalCode: '4000',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Farhana Kabir',
      phone: '+8801898765432',
      email: 'farhana.kabir@yahoo.com',
      street: 'GEC Circle, Nasirabad Housing',
      district: 'Chittagong',
      postalCode: '4000',
      country: 'Bangladesh'
    },
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    status: 'Delivered',
    deliveryStatus: 'delivered',
    courierPartner: 'Pathao Courier',
    courier: 'Pathao Courier',
    courierTrackingCode: 'PT-3329104',
    trackingNumber: 'PT-3329104',
    items: [
      {
        productId: 'cm-102',
        productName: "Premium Women's Crossbody Bag",
        sku: 'CM-WJ-002',
        price: 2150,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80',
        variant: 'Caramel Brown',
        subtotal: 2150
      }
    ],
    itemCount: 1,
    subtotal: 2150,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 0,
    total: 2280,
    adminNotes: [
      {
        id: 'note-3',
        text: 'bKash Merchant Trx ID 9B72LK98 confirmed by gateway.',
        author: 'Finance Bot',
        createdAt: '02 Sep 2026, 09:18 AM'
      },
      {
        id: 'note-4',
        text: 'Customer confirmed receipt with five-star review.',
        author: 'Support Team',
        createdAt: '05 Sep 2026, 05:45 PM'
      }
    ],
    timeline: [
      {
        id: 'tl-4',
        timestamp: '02 Sep 2026, 09:14 AM',
        title: 'Order Placed & Paid',
        description: 'bKash Payment verified ৳2,280.',
        type: 'payment',
        user: 'Gateway'
      },
      {
        id: 'tl-5',
        timestamp: '03 Sep 2026, 11:00 AM',
        title: 'Shipped via Pathao',
        description: 'Dispatched to Pathao Courier hub (PT-3329104).',
        type: 'courier',
        user: 'Logistics'
      },
      {
        id: 'tl-6',
        timestamp: '05 Sep 2026, 05:30 PM',
        title: 'Delivered',
        description: 'Parcel successfully signed and delivered in Chittagong.',
        type: 'status_change',
        user: 'Pathao API'
      }
    ]
  },
  {
    id: 'CM-95012',
    date: '19 Sep 2026',
    createdAt: '2026-09-19T08:20:00Z',
    updatedAt: '2026-09-19T08:20:00Z',
    customerName: 'Mahmudul Hasan',
    customerId: 'c-105',
    phone: '+8801911223344',
    email: 'mahmudul.h@gmail.com',
    district: 'Dhaka',
    area: 'Tejgaon',
    address: 'Flat 4B, Shantiniketan, Tejgaon, Dhaka-1208',
    billingAddress: {
      fullName: 'Mahmudul Hasan',
      phone: '+8801911223344',
      email: 'mahmudul.h@gmail.com',
      street: 'Flat 4B, Shantiniketan, Tejgaon',
      district: 'Dhaka',
      postalCode: '1208',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Mahmudul Hasan',
      phone: '+8801911223344',
      email: 'mahmudul.h@gmail.com',
      street: 'Flat 4B, Shantiniketan, Tejgaon',
      district: 'Dhaka',
      postalCode: '1208',
      country: 'Bangladesh'
    },
    notes: 'Urgent office address delivery. Leave at security desk if unavailable.',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'unpaid',
    status: 'Pending',
    deliveryStatus: 'pending',
    items: [
      {
        productId: 'cm-104',
        productName: 'Wireless Noise-Cancelling Earbuds Pro',
        sku: 'CM-EL-004',
        price: 2450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
        variant: 'Matte Black',
        subtotal: 2450
      }
    ],
    itemCount: 1,
    subtotal: 2450,
    shippingFee: 70,
    deliveryCharge: 70,
    discount: 0,
    total: 2520,
    adminNotes: [
      {
        id: 'note-5',
        text: 'Awaiting phone confirmation call before assigning logistics provider.',
        author: 'Nafsi Bin Tealam (Admin)',
        createdAt: '19 Sep 2026, 09:00 AM'
      }
    ],
    timeline: [
      {
        id: 'tl-7',
        timestamp: '19 Sep 2026, 08:20 AM',
        title: 'Order Received',
        description: 'New web order placed via Cash on Delivery.',
        type: 'created',
        user: 'Customer (Web)'
      }
    ]
  },
  {
    id: 'CM-95013',
    date: '18 Sep 2026',
    createdAt: '2026-09-18T16:15:00Z',
    updatedAt: '2026-09-19T09:30:00Z',
    customerName: 'Sadia Afrin',
    customerId: 'c-106',
    phone: '+8801723456789',
    email: 'sadia.afrin@outlook.com',
    district: 'Sylhet',
    area: 'Zindabazar',
    address: 'Holding 22, East Zindabazar, Sylhet Sadar',
    billingAddress: {
      fullName: 'Sadia Afrin',
      phone: '+8801723456789',
      email: 'sadia.afrin@outlook.com',
      street: 'Holding 22, East Zindabazar',
      district: 'Sylhet',
      postalCode: '3100',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Sadia Afrin',
      phone: '+8801723456789',
      email: 'sadia.afrin@outlook.com',
      street: 'Holding 22, East Zindabazar',
      district: 'Sylhet',
      postalCode: '3100',
      country: 'Bangladesh'
    },
    paymentMethod: 'Nagad',
    paymentStatus: 'paid',
    status: 'Confirmed',
    deliveryStatus: 'processing',
    courierPartner: 'Steadfast Courier',
    courier: 'Steadfast Courier',
    courierTrackingCode: 'ST-8829102',
    trackingNumber: 'ST-8829102',
    items: [
      {
        productId: 'cm-101',
        productName: 'Handloom Pure Silk Jamdani Saree',
        sku: 'CM-SA-001',
        price: 4800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
        variant: 'Royal Emerald & Gold',
        subtotal: 4800
      }
    ],
    itemCount: 1,
    subtotal: 4800,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 300,
    total: 4630,
    adminNotes: [
      {
        id: 'note-6',
        text: 'Festival gift box wrapping requested. Applied luxury packaging ribbon.',
        author: 'Habib Rahman',
        createdAt: '18 Sep 2026, 05:00 PM'
      }
    ],
    timeline: [
      {
        id: 'tl-8',
        timestamp: '18 Sep 2026, 04:15 PM',
        title: 'Order Placed',
        description: 'Payment verified via Nagad API ৳4,630.',
        type: 'payment',
        user: 'Nagad Gateway'
      },
      {
        id: 'tl-9',
        timestamp: '19 Sep 2026, 09:30 AM',
        title: 'Order Confirmed',
        description: 'Verified stock availability and assigned Steadfast Courier.',
        type: 'status_change',
        user: 'Habib Rahman'
      }
    ]
  },
  {
    id: 'CM-95014',
    date: '17 Sep 2026',
    createdAt: '2026-09-17T11:10:00Z',
    updatedAt: '2026-09-18T18:00:00Z',
    customerName: 'Rezaul Karim',
    customerId: 'c-107',
    phone: '+8801633445566',
    email: 'rezaul.k@gmail.com',
    district: 'Chittagong',
    area: 'Halishahar',
    address: 'Block C, Road 5, Halishahar H/A, Chittagong',
    billingAddress: {
      fullName: 'Rezaul Karim',
      phone: '+8801633445566',
      email: 'rezaul.k@gmail.com',
      street: 'Block C, Road 5, Halishahar H/A',
      district: 'Chittagong',
      postalCode: '4216',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Rezaul Karim',
      phone: '+8801633445566',
      email: 'rezaul.k@gmail.com',
      street: 'Block C, Road 5, Halishahar H/A',
      district: 'Chittagong',
      postalCode: '4216',
      country: 'Bangladesh'
    },
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    status: 'Shipped',
    deliveryStatus: 'in_transit',
    courierPartner: 'RedX',
    courier: 'RedX',
    courierTrackingCode: 'RX-7749102',
    trackingNumber: 'RX-7749102',
    items: [
      {
        productId: 'cm-108',
        productName: '65W GaN Multi-Port Fast Charger',
        sku: 'CM-EL-008',
        price: 1850,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
        variant: 'White Edition',
        subtotal: 3700
      }
    ],
    itemCount: 2,
    subtotal: 3700,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 200,
    total: 3630,
    adminNotes: [
      {
        id: 'note-7',
        text: 'Handed over to RedX courier pickup rider at 04:30 PM.',
        author: 'Dispatch Dept',
        createdAt: '18 Sep 2026, 04:35 PM'
      }
    ],
    timeline: [
      {
        id: 'tl-10',
        timestamp: '17 Sep 2026, 11:10 AM',
        title: 'Order Created & Paid',
        description: 'Paid via bKash Trx 9J283LA.',
        type: 'payment',
        user: 'Gateway'
      },
      {
        id: 'tl-11',
        timestamp: '18 Sep 2026, 04:30 PM',
        title: 'Dispatched (In Transit)',
        description: 'Parcel scanned at RedX Tejgaon Sorting Center.',
        type: 'courier',
        user: 'RedX Logistics'
      }
    ]
  },
  {
    id: 'CM-95015',
    date: '16 Sep 2026',
    createdAt: '2026-09-16T13:00:00Z',
    updatedAt: '2026-09-16T15:20:00Z',
    customerName: 'Nasir Uddin',
    customerId: 'c-108',
    phone: '+8801555667788',
    email: 'nasir.uddin@hotmail.com',
    district: 'Rajshahi',
    area: 'Boalia',
    address: 'Shaheb Bazar, Main Road, Boalia, Rajshahi',
    billingAddress: {
      fullName: 'Nasir Uddin',
      phone: '+8801555667788',
      email: 'nasir.uddin@hotmail.com',
      street: 'Shaheb Bazar, Main Road',
      district: 'Rajshahi',
      postalCode: '6000',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Nasir Uddin',
      phone: '+8801555667788',
      email: 'nasir.uddin@hotmail.com',
      street: 'Shaheb Bazar, Main Road',
      district: 'Rajshahi',
      postalCode: '6000',
      country: 'Bangladesh'
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'unpaid',
    status: 'Cancelled',
    deliveryStatus: 'failed',
    items: [
      {
        productId: 'cm-109',
        productName: 'Ergonomic Memory Foam Seat Cushion',
        sku: 'CM-HM-009',
        price: 1350,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&auto=format&fit=crop&q=80',
        variant: 'Charcoal Gray',
        subtotal: 1350
      }
    ],
    itemCount: 1,
    subtotal: 1350,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 0,
    total: 1480,
    adminNotes: [
      {
        id: 'note-8',
        text: 'Customer requested cancellation over phone; had accidentally created duplicate order.',
        author: 'Customer Support (Anika)',
        createdAt: '16 Sep 2026, 03:20 PM'
      }
    ],
    timeline: [
      {
        id: 'tl-12',
        timestamp: '16 Sep 2026, 01:00 PM',
        title: 'Order Placed',
        description: 'Placed on web store.',
        type: 'created',
        user: 'Customer'
      },
      {
        id: 'tl-13',
        timestamp: '16 Sep 2026, 03:20 PM',
        title: 'Order Cancelled',
        description: 'Cancelled upon verified customer phone request. Restored inventory.',
        type: 'status_change',
        user: 'Support Staff'
      }
    ]
  },
  {
    id: 'CM-95016',
    date: '14 Sep 2026',
    createdAt: '2026-09-14T10:45:00Z',
    updatedAt: '2026-09-17T14:10:00Z',
    customerName: 'Ishrat Jahan',
    customerId: 'c-109',
    phone: '+8801777889900',
    email: 'ishrat.jahan@gmail.com',
    district: 'Khulna',
    area: 'Sonadanga',
    address: 'House 18, Road 3, Sonadanga R/A Phase 2, Khulna',
    billingAddress: {
      fullName: 'Ishrat Jahan',
      phone: '+8801777889900',
      email: 'ishrat.jahan@gmail.com',
      street: 'House 18, Road 3, Sonadanga R/A Phase 2',
      district: 'Khulna',
      postalCode: '9100',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Ishrat Jahan',
      phone: '+8801777889900',
      email: 'ishrat.jahan@gmail.com',
      street: 'House 18, Road 3, Sonadanga R/A Phase 2',
      district: 'Khulna',
      postalCode: '9100',
      country: 'Bangladesh'
    },
    paymentMethod: 'bKash',
    paymentStatus: 'refunded',
    status: 'Returned',
    deliveryStatus: 'returned',
    courierPartner: 'Paperfly',
    courier: 'Paperfly',
    courierTrackingCode: 'PF-5510294',
    trackingNumber: 'PF-5510294',
    items: [
      {
        productId: 'cm-103',
        productName: 'Aarong Handloom Cotton Embroidered Kurti',
        sku: 'CM-WK-003',
        price: 1650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
        variant: 'Medium (M) - Peach',
        subtotal: 1650
      }
    ],
    itemCount: 1,
    subtotal: 1650,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 0,
    total: 1780,
    adminNotes: [
      {
        id: 'note-9',
        text: 'Returned item received in perfect condition at Dhaka warehouse. Quality checked and verified.',
        author: 'Warehouse Inspector (Salim)',
        createdAt: '17 Sep 2026, 02:00 PM'
      },
      {
        id: 'note-10',
        text: 'Full amount ৳1,780 refunded to customer bKash wallet.',
        author: 'Finance Bot',
        createdAt: '17 Sep 2026, 02:10 PM'
      }
    ],
    timeline: [
      {
        id: 'tl-14',
        timestamp: '14 Sep 2026, 10:45 AM',
        title: 'Order Placed',
        description: 'Customer paid via bKash.',
        type: 'created',
        user: 'Customer'
      },
      {
        id: 'tl-15',
        timestamp: '16 Sep 2026, 04:00 PM',
        title: 'Return Initiated',
        description: 'Customer requested return due to size mismatch.',
        type: 'status_change',
        user: 'Support Team'
      },
      {
        id: 'tl-16',
        timestamp: '17 Sep 2026, 02:10 PM',
        title: 'Return Accepted & Refunded',
        description: 'Item restocked to inventory. Refund issued to bKash.',
        type: 'payment',
        user: 'Finance Manager'
      }
    ]
  },
  {
    id: 'CM-95017',
    date: '13 Sep 2026',
    createdAt: '2026-09-13T15:20:00Z',
    updatedAt: '2026-09-14T11:00:00Z',
    customerName: 'Kazi Abdullah',
    customerId: 'c-110',
    phone: '+8801811992288',
    email: 'kazi.abdullah@gmail.com',
    district: 'Rangpur',
    area: 'Station Road',
    address: 'Holding 44, Station Road, Rangpur Sadar',
    billingAddress: {
      fullName: 'Kazi Abdullah',
      phone: '+8801811992288',
      email: 'kazi.abdullah@gmail.com',
      street: 'Holding 44, Station Road',
      district: 'Rangpur',
      postalCode: '5400',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Kazi Abdullah',
      phone: '+8801811992288',
      email: 'kazi.abdullah@gmail.com',
      street: 'Holding 44, Station Road',
      district: 'Rangpur',
      postalCode: '5400',
      country: 'Bangladesh'
    },
    paymentMethod: 'Card',
    paymentStatus: 'refunded',
    status: 'Refunded',
    deliveryStatus: 'failed',
    items: [
      {
        productId: 'cm-107',
        productName: 'Mechanical Wireless Bluetooth Keyboard',
        sku: 'CM-EL-007',
        price: 3200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
        variant: 'RGB / Red Switch',
        subtotal: 3200
      }
    ],
    itemCount: 1,
    subtotal: 3200,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 150,
    total: 3180,
    adminNotes: [
      {
        id: 'note-11',
        text: 'Item was temporarily out of stock from manufacturer import batch. Refund processed via SSLCommerz gateway.',
        author: 'Inventory Manager',
        createdAt: '14 Sep 2026, 11:00 AM'
      }
    ],
    timeline: [
      {
        id: 'tl-17',
        timestamp: '13 Sep 2026, 03:20 PM',
        title: 'Order Paid',
        description: 'VISA / Mastercard payment of ৳3,180 approved.',
        type: 'payment',
        user: 'SSLCommerz'
      },
      {
        id: 'tl-18',
        timestamp: '14 Sep 2026, 11:00 AM',
        title: 'Refund Approved',
        description: 'Gateway reversal reference SSL-REF-99201 settled.',
        type: 'status_change',
        user: 'Finance Admin'
      }
    ]
  },
  {
    id: 'CM-95018',
    date: '19 Sep 2026',
    createdAt: '2026-09-19T06:10:00Z',
    updatedAt: '2026-09-19T09:40:00Z',
    customerName: 'Tasnim Rahman',
    customerId: 'c-111',
    phone: '+8801933557799',
    email: 'tasnim.r@gmail.com',
    district: 'Barishal',
    area: 'Hospital Road',
    address: 'Hospital Road, South Alekanda, Barishal Sadar',
    billingAddress: {
      fullName: 'Tasnim Rahman',
      phone: '+8801933557799',
      email: 'tasnim.r@gmail.com',
      street: 'Hospital Road, South Alekanda',
      district: 'Barishal',
      postalCode: '8200',
      country: 'Bangladesh'
    },
    shippingAddress: {
      fullName: 'Tasnim Rahman',
      phone: '+8801933557799',
      email: 'tasnim.r@gmail.com',
      street: 'Hospital Road, South Alekanda',
      district: 'Barishal',
      postalCode: '8200',
      country: 'Bangladesh'
    },
    paymentMethod: 'Rocket',
    paymentStatus: 'paid',
    status: 'Confirmed',
    deliveryStatus: 'processing',
    courierPartner: 'Sundarban',
    courier: 'Sundarban',
    courierTrackingCode: 'SB-4401923',
    trackingNumber: 'SB-4401923',
    items: [
      {
        productId: 'cm-105',
        productName: 'Smart Fitness Tracker & Heart Rate Band',
        sku: 'CM-EL-005',
        price: 1750,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&auto=format&fit=crop&q=80',
        variant: 'Midnight Blue',
        subtotal: 1750
      }
    ],
    itemCount: 1,
    subtotal: 1750,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 50,
    total: 1830,
    adminNotes: [
      {
        id: 'note-12',
        text: 'DBBL Rocket payment transaction confirmed #ROC-981249.',
        author: 'Payment Bot',
        createdAt: '19 Sep 2026, 06:15 AM'
      }
    ],
    timeline: [
      {
        id: 'tl-19',
        timestamp: '19 Sep 2026, 06:10 AM',
        title: 'Order Placed',
        description: 'Rocket payment verified ৳1,830.',
        type: 'payment',
        user: 'Rocket Gateway'
      },
      {
        id: 'tl-20',
        timestamp: '19 Sep 2026, 09:40 AM',
        title: 'Confirmed & Assigned',
        description: 'Order confirmed for Barishal dispatch via Sundarban Courier.',
        type: 'status_change',
        user: 'Shakil Anwar'
      }
    ]
  }
];

// ==========================================
// INITIAL SEED DATA
// ==========================================
export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'c-101',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    phone: '+8801712345678',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 42, Road 9/A, Dhanmondi R/A',
    isGuest: false,
    group: 'VIP',
    ordersCount: 9,
    totalSpent: 18450,
    lastOrderDate: '18 Sep 2026',
    joinedDate: '12 Jan 2025',
    notes: 'Prefers afternoon deliveries. Frequent buyer of cotton kurtis.',
    status: 'active'
  },
  {
    id: 'c-102',
    name: 'Sadia Rahman',
    email: 'sadia.rahman@yahoo.com',
    phone: '+8801819876543',
    district: 'Dhaka',
    area: 'Mirpur',
    address: 'Block C, Section 11, Mirpur',
    isGuest: false,
    group: 'Regular',
    ordersCount: 4,
    totalSpent: 7300,
    lastOrderDate: '14 Sep 2026',
    joinedDate: '03 Mar 2025',
    status: 'active'
  },
  {
    id: 'c-103',
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@outlook.com',
    phone: '+8801911223344',
    district: 'Chittagong',
    area: 'GEC Circle',
    address: 'Flat 4B, Nasirabad Housing, Chittagong',
    isGuest: false,
    group: 'Regular',
    ordersCount: 3,
    totalSpent: 5900,
    lastOrderDate: '10 Sep 2026',
    joinedDate: '22 Apr 2025',
    status: 'active'
  },
  {
    id: 'c-104',
    name: 'Farhana Akter',
    email: 'farhana.akter@gmail.com',
    phone: '+8801615566778',
    district: 'Sylhet',
    area: 'Zindabazar',
    address: 'East Zindabazar Lane 2, Sylhet Sadar',
    isGuest: false,
    group: 'VIP',
    ordersCount: 7,
    totalSpent: 14200,
    lastOrderDate: '16 Sep 2026',
    joinedDate: '18 Nov 2024',
    notes: 'Wholesale inquiry pending for handcrafted jewelry.',
    status: 'active'
  },
  {
    id: 'c-105',
    name: 'Mahir Faisal',
    email: 'mahir.faisal@gmail.com',
    phone: '+8801512349876',
    district: 'Dhaka',
    area: 'Uttara',
    address: 'Sector 4, Road 7, House 19, Uttara',
    isGuest: true,
    group: 'New',
    ordersCount: 1,
    totalSpent: 2450,
    lastOrderDate: '19 Sep 2026',
    joinedDate: '19 Sep 2026',
    status: 'active'
  },
  {
    id: 'c-106',
    name: 'Rafiqul Islam',
    email: 'rafiqul.islam@hotmail.com',
    phone: '+8801719988776',
    district: 'Rajshahi',
    area: 'Shaheb Bazar',
    address: 'Holding 88, Station Road, Rajshahi',
    isGuest: false,
    group: 'Regular',
    ordersCount: 2,
    totalSpent: 3800,
    lastOrderDate: '05 Sep 2026',
    joinedDate: '15 May 2025',
    status: 'active'
  }
];

export const INITIAL_CUSTOMER_GROUPS: CustomerGroupItem[] = [
  {
    id: 'grp-vip',
    name: 'VIP Club',
    discountPercentage: 10,
    minOrdersRequired: 5,
    memberCount: 48,
    description: 'High-value loyal customers with 5+ successful orders. Automatically receive priority packaging & special discounts.'
  },
  {
    id: 'grp-wholesale',
    name: 'Wholesale & Resellers',
    discountPercentage: 18,
    minOrdersRequired: 10,
    memberCount: 14,
    description: 'Bulk boutique retailers and resellers purchasing minimum 10 items per batch.'
  },
  {
    id: 'grp-regular',
    name: 'Regular Shoppers',
    discountPercentage: 0,
    minOrdersRequired: 1,
    memberCount: 312,
    description: 'Standard shoppers with verified accounts and successful deliveries.'
  },
  {
    id: 'grp-new',
    name: 'New Customers',
    discountPercentage: 5,
    minOrdersRequired: 0,
    memberCount: 89,
    description: 'First-time shoppers eligible for the FIRST5 welcome promo code.'
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'dz-1',
    name: 'Inside Dhaka City',
    districtName: 'Dhaka Metropolitan (Dhanmondi, Gulshan, Banani, Mirpur, Uttara, Old Dhaka)',
    charge: 60,
    estimatedDelivery: '24 - 48 Hours',
    isCodAvailable: true,
    courierPartner: 'Steadfast / Pathao Express',
    isActive: true
  },
  {
    id: 'dz-2',
    name: 'Dhaka Suburbs & Savar',
    districtName: 'Gazipur, Savar, Keraniganj, Narayanganj, Tongi',
    charge: 100,
    estimatedDelivery: '48 - 72 Hours',
    isCodAvailable: true,
    courierPartner: 'Steadfast Courier',
    isActive: true
  },
  {
    id: 'dz-3',
    name: 'Outside Dhaka (Divisional Cities)',
    districtName: 'Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh',
    charge: 130,
    estimatedDelivery: '3 - 4 Days',
    isCodAvailable: true,
    courierPartner: 'RedX Logistics / Steadfast',
    isActive: true
  },
  {
    id: 'dz-4',
    name: 'Rural & Upazila Areas',
    districtName: 'All other upazilas & remote unions across Bangladesh',
    charge: 150,
    estimatedDelivery: '4 - 6 Days',
    isCodAvailable: true,
    courierPartner: 'Sundarban / Paperfly',
    isActive: true
  }
];

export const INITIAL_COURIERS: CourierServiceConfig[] = [
  {
    id: 'cr-1',
    name: 'Steadfast Courier',
    code: 'steadfast',
    apiKey: 'stdf_live_api_key_849204918239',
    secretKey: '••••••••••••••••••••••••',
    webhookUrl: 'https://choltimart.com/api/courier/steadfast/webhook',
    isEnabled: true,
    isSandboxed: true,
    statusText: 'Connected (Sandbox Simulation)',
    avgDeliveryHours: 36
  },
  {
    id: 'cr-2',
    name: 'Pathao Express Parcel',
    code: 'pathao',
    apiKey: 'pathao_merchant_token_92817261',
    secretKey: '••••••••••••••••••••••••',
    webhookUrl: 'https://choltimart.com/api/courier/pathao/webhook',
    isEnabled: true,
    isSandboxed: true,
    statusText: 'Connected (Ready for Live Dispatch)',
    avgDeliveryHours: 24
  },
  {
    id: 'cr-3',
    name: 'RedX Logistics',
    code: 'redx',
    apiKey: 'redx_auth_bearer_71625341',
    secretKey: '••••••••••••••••••••••••',
    webhookUrl: 'https://choltimart.com/api/courier/redx/webhook',
    isEnabled: true,
    isSandboxed: false,
    statusText: 'Active for Inter-District',
    avgDeliveryHours: 72
  },
  {
    id: 'cr-4',
    name: 'Paperfly Smart Delivery',
    code: 'paperfly',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://choltimart.com/api/courier/paperfly/webhook',
    isEnabled: false,
    isSandboxed: true,
    statusText: 'Standby / Configuration Required',
    avgDeliveryHours: 96
  }
];

export const INITIAL_PROMOTIONS: PromotionCampaign[] = [
  {
    id: 'promo-1',
    title: 'Spring Festival Fashion Fest',
    subtitle: 'Flat 15% discount on all artisan kurtis & handcrafted bags',
    discountType: 'percentage',
    discountValue: 15,
    badgeText: 'HOT DEAL',
    bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    isActive: true,
    applicableCategory: "Women's Fashion",
    clicksCount: 1420
  },
  {
    id: 'promo-2',
    title: 'Free Shipping Weekend Campaign',
    subtitle: 'Zero delivery fee inside Dhaka on orders above ৳1,500',
    discountType: 'fixed',
    discountValue: 60,
    badgeText: 'FREE SHIPPING',
    bannerImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    isActive: true,
    clicksCount: 890
  }
];

export const INITIAL_FLASH_SALES: FlashSaleItem[] = [
  {
    id: 'fs-1',
    productId: 'cm-101',
    productName: "Women's Elegant Kurti",
    regularPrice: 2450,
    flashPrice: 1650,
    discountPercent: 32,
    stockLimit: 30,
    soldCount: 22,
    startTime: '2026-09-19T00:00:00Z',
    endTime: '2026-09-21T23:59:59Z',
    status: 'active'
  },
  {
    id: 'fs-2',
    productId: 'cm-104',
    productName: 'Wireless Noise-Cancelling Earbuds Pro',
    regularPrice: 3800,
    flashPrice: 2490,
    discountPercent: 34,
    stockLimit: 25,
    soldCount: 19,
    startTime: '2026-09-19T00:00:00Z',
    endTime: '2026-09-22T23:59:59Z',
    status: 'active'
  },
  {
    id: 'fs-3',
    productId: 'cm-106',
    productName: 'Premium Wireless Charging Pad',
    regularPrice: 1950,
    flashPrice: 1250,
    discountPercent: 36,
    stockLimit: 40,
    soldCount: 31,
    startTime: '2026-09-19T00:00:00Z',
    endTime: '2026-09-23T23:59:59Z',
    status: 'active'
  }
];

export const INITIAL_ABANDONED_CARTS: AbandonedCartRecord[] = [
  {
    id: 'ac-1',
    customerName: 'Kazi Tanzeem',
    customerEmail: 'kazi.tanzeem@gmail.com',
    customerPhone: '+8801844998877',
    itemsCount: 2,
    cartTotal: 4150,
    lastActive: '2 hours ago',
    recoveryEmailSent: true,
    status: 'abandoned'
  },
  {
    id: 'ac-2',
    customerName: 'Shaila Parveen',
    customerEmail: 'shaila.parveen@gmail.com',
    customerPhone: '+8801733221100',
    itemsCount: 1,
    cartTotal: 1850,
    lastActive: '5 hours ago',
    recoveryEmailSent: false,
    status: 'abandoned'
  },
  {
    id: 'ac-3',
    customerName: 'Abir Hasan',
    customerEmail: 'abir.hasan@yahoo.com',
    customerPhone: '+8801922334455',
    itemsCount: 3,
    cartTotal: 6200,
    lastActive: '1 day ago',
    recoveryEmailSent: true,
    status: 'recovered'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransactionRecord[] = [
  {
    id: 'trx-001',
    trxId: '9K28XLP81',
    orderId: 'CM-2609-1082',
    customerName: 'Nusrat Jahan',
    method: 'bKash',
    amount: 1910,
    gatewayFee: 28.65,
    netAmount: 1881.35,
    date: '19 Sep 2026, 11:32 AM',
    status: 'Completed'
  },
  {
    id: 'trx-002',
    trxId: 'COD-2609-1081',
    orderId: 'CM-2609-1081',
    customerName: 'Mahir Faisal',
    method: 'Cash on Delivery',
    amount: 2510,
    gatewayFee: 0,
    netAmount: 2510,
    date: '19 Sep 2026, 10:14 AM',
    status: 'Pending'
  },
  {
    id: 'trx-003',
    trxId: 'NG928172A',
    orderId: 'CM-2609-1080',
    customerName: 'Sadia Rahman',
    method: 'Nagad',
    amount: 3260,
    gatewayFee: 39.12,
    netAmount: 3220.88,
    date: '18 Sep 2026, 04:55 PM',
    status: 'Completed'
  },
  {
    id: 'trx-004',
    trxId: 'SSL-TXN-881920',
    orderId: 'CM-2609-1079',
    customerName: 'Tanvir Ahmed',
    method: 'Card',
    amount: 5900,
    gatewayFee: 147.50,
    netAmount: 5752.50,
    date: '18 Sep 2026, 02:18 PM',
    status: 'Completed'
  },
  {
    id: 'trx-005',
    trxId: 'BK7182903',
    orderId: 'CM-2609-1078',
    customerName: 'Farhana Akter',
    method: 'bKash',
    amount: 4680,
    gatewayFee: 70.20,
    netAmount: 4609.80,
    date: '17 Sep 2026, 06:40 PM',
    status: 'Completed'
  }
];

export const INITIAL_REFUNDS: RefundItemRecord[] = [
  {
    id: 'ref-1',
    refundNumber: 'REF-2026-018',
    orderId: 'CM-2609-1075',
    customerName: 'Sharmin Sultana',
    amount: 1850,
    reason: 'Incorrect size ordered by mistake. Customer requested exchange or refund.',
    method: 'bKash',
    requestDate: '18 Sep 2026',
    status: 'Pending',
    notes: 'Awaiting product return via Steadfast parcel return slip #RET-9912'
  },
  {
    id: 'ref-2',
    refundNumber: 'REF-2026-017',
    orderId: 'CM-2609-1068',
    customerName: 'Kamrul Hasan',
    amount: 1250,
    reason: 'Package arrived with damaged outer box during transit.',
    method: 'Nagad',
    requestDate: '15 Sep 2026',
    status: 'Approved',
    notes: 'Approved by Store Manager. Dispatched Nagad payout.'
  }
];

export const INITIAL_CONTENT_PAGES: ContentPageRecord[] = [
  {
    id: 'pg-1',
    title: 'About Cholti Mart',
    slug: 'about',
    status: 'published',
    lastModified: '12 Sep 2026',
    author: 'Editorial Team',
    viewsCount: 3840
  },
  {
    id: 'pg-2',
    title: 'Return & Exchange Policy',
    slug: 'returns',
    status: 'published',
    lastModified: '15 Sep 2026',
    author: 'Legal & Operations',
    viewsCount: 2910
  },
  {
    id: 'pg-3',
    title: 'Nationwide Delivery & Shipping Policy',
    slug: 'shipping-policy',
    status: 'published',
    lastModified: '18 Sep 2026',
    author: 'Logistics Team',
    viewsCount: 4210
  },
  {
    id: 'pg-4',
    title: 'Privacy Policy & Data Protection',
    slug: 'privacy',
    status: 'published',
    lastModified: '08 Aug 2026',
    author: 'Compliance Lead',
    viewsCount: 1650
  },
  {
    id: 'pg-5',
    title: 'Terms of Service & Customer Agreement',
    slug: 'terms',
    status: 'published',
    lastModified: '08 Aug 2026',
    author: 'Compliance Lead',
    viewsCount: 1420
  }
];

export const INITIAL_BLOG_POSTS: BlogPostRecord[] = [
  {
    id: 'bp-1',
    title: 'Top 5 Traditional Bangladeshi Fabrics for Hot & Humid Summers',
    slug: 'top-5-traditional-fabrics-summer-bangladesh',
    category: 'Fashion & Lifestyle',
    author: 'Tasnim Haque',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    excerpt: 'From breathable handloom cottons to fine muslin weaves, discover how traditional artisans keep you cool in Dhaka weather.',
    date: '14 Sep 2026',
    status: 'published',
    readTime: '4 min read'
  },
  {
    id: 'bp-2',
    title: 'Essential Desk Gadgets for Remote Professionals in Dhaka',
    slug: 'essential-desk-gadgets-remote-workers',
    category: 'Gadgets & Tech',
    author: 'Rashedul Karim',
    coverImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Smart charging docks, ergonomic stands, and USB lighting that keep your home workstation organized and productive.',
    date: '08 Sep 2026',
    status: 'published',
    readTime: '6 min read'
  }
];

export const INITIAL_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 'tm-1',
    customerName: 'Samira Huq',
    customerCity: 'Uttara, Dhaka',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'Ordered the embroidered kurti on Wednesday afternoon and received it at my doorstep by Thursday evening. Stitching and fabric exceeded expectations!',
    productName: "Women's Elegant Kurti",
    isFeatured: true,
    date: '16 Sep 2026'
  },
  {
    id: 'tm-2',
    customerName: 'Adnan Chowdhury',
    customerCity: 'Nasirabad, Chittagong',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'The wireless charging pad is solid and charges fast without overheating. Authentic product and hassle-free Cash on Delivery.',
    productName: 'Premium Wireless Charging Pad',
    isFeatured: true,
    date: '12 Sep 2026'
  }
];

export const INITIAL_MEDIA_LIBRARY: MediaItemRecord[] = [
  {
    id: 'med-1',
    name: 'womens-kurti-hero.jpg',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    size: '284 KB',
    dimensions: '1600 x 1066',
    uploadedAt: '12 Sep 2026',
    fileType: 'image/jpeg'
  },
  {
    id: 'med-2',
    name: 'leather-crossbody-bag.jpg',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    size: '312 KB',
    dimensions: '1600 x 1200',
    uploadedAt: '10 Sep 2026',
    fileType: 'image/jpeg'
  },
  {
    id: 'med-3',
    name: 'earbuds-pro-sound.jpg',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    size: '198 KB',
    dimensions: '1200 x 800',
    uploadedAt: '08 Sep 2026',
    fileType: 'image/jpeg'
  },
  {
    id: 'med-4',
    name: 'wireless-charging-pad.jpg',
    url: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
    size: '245 KB',
    dimensions: '1400 x 933',
    uploadedAt: '05 Sep 2026',
    fileType: 'image/jpeg'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'superadmin',
    name: 'Nafsi Bin Tealam',
    email: 'nafsibintealam@gmail.com',
    role: 'SUPER_ADMIN',
    lastLogin: 'Today, 12:15 PM',
    status: 'active',
    phone: '+8801700000001',
    createdAt: '01 Jan 2025',
    permissions: [
      'manage_settings',
      'manage_theme',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_users',
      'manage_integrations',
      'manage_system',
      'manage_export',
      'view_dashboard'
    ]
  },
  {
    id: 'usr-2',
    username: 'storeadmin',
    name: 'Tariqul Alam',
    email: 'tariqul.admin@choltimart.com',
    role: 'ADMIN',
    lastLogin: 'Yesterday, 06:40 PM',
    status: 'active',
    phone: '+8801711223344',
    createdAt: '15 Jan 2025',
    permissions: [
      'manage_settings',
      'manage_theme',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_users',
      'manage_integrations',
      'manage_export',
      'view_dashboard'
    ]
  },
  {
    id: 'usr-3',
    username: 'operations_lead',
    name: 'Habib Rahman',
    email: 'habib.manager@choltimart.com',
    role: 'MANAGER',
    lastLogin: '18 Sep 2026, 09:20 AM',
    status: 'active',
    phone: '+8801822334455',
    createdAt: '01 Feb 2025',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_delivery',
      'manage_marketing',
      'manage_payments',
      'manage_analytics',
      'manage_content',
      'manage_export',
      'view_dashboard'
    ]
  },
  {
    id: 'usr-4',
    username: 'logistics_officer',
    name: 'Shakil Anwar',
    email: 'shakil.orders@choltimart.com',
    role: 'ORDER_MANAGER',
    lastLogin: '19 Sep 2026, 11:00 AM',
    status: 'active',
    phone: '+8801933445566',
    createdAt: '10 Feb 2025',
    permissions: [
      'manage_orders',
      'manage_delivery',
      'manage_customers',
      'view_dashboard'
    ]
  },
  {
    id: 'usr-5',
    username: 'content_editor',
    name: 'Moumita Sen',
    email: 'moumita.content@choltimart.com',
    role: 'CONTENT_MANAGER',
    lastLogin: '17 Sep 2026, 03:15 PM',
    status: 'active',
    phone: '+8801644556677',
    createdAt: '01 Mar 2025',
    permissions: [
      'manage_content',
      'manage_theme',
      'manage_marketing',
      'view_dashboard'
    ]
  },
  {
    id: 'usr-6',
    username: 'auditor_viewer',
    name: 'Ziaur Rahman',
    email: 'auditor@choltimart.com',
    role: 'VIEWER',
    lastLogin: '16 Sep 2026, 02:00 PM',
    status: 'active',
    phone: '+8801555667788',
    createdAt: '01 May 2025',
    permissions: [
      'view_dashboard'
    ]
  }
];

export const INITIAL_ACTIVITY_LOGS: AdminActivityLogRecord[] = [
  {
    id: 'act-1',
    timestamp: 'Today, 12:18 PM',
    user: 'Nafsi Bin Tealam',
    userRole: 'SUPER_ADMIN',
    action: 'Updated delivery charges for Outside Dhaka zone to ৳130',
    target: 'Delivery Zones / Pricing',
    ipAddress: '103.144.201.42 (Dhaka)',
    category: 'settings'
  },
  {
    id: 'act-2',
    timestamp: 'Today, 11:45 AM',
    user: 'Shakil Anwar',
    userRole: 'ORDER_MANAGER',
    action: 'Assigned Steadfast tracking code STDF-90281 to Order #CM-2609-1082',
    target: 'Order #CM-2609-1082',
    ipAddress: '103.144.201.45 (Dhaka)',
    category: 'order'
  },
  {
    id: 'act-3',
    timestamp: 'Today, 10:30 AM',
    user: 'Habib Rahman',
    userRole: 'MANAGER',
    action: 'Restocked 20 units of "Wireless Noise-Cancelling Earbuds Pro"',
    target: 'Product #cm-104',
    ipAddress: '103.144.201.50 (Dhaka)',
    category: 'product'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday, 05:22 PM',
    user: 'Moumita Sen',
    userRole: 'CONTENT_MANAGER',
    action: 'Published new blog article "Top 5 Traditional Fabrics for Summer"',
    target: 'Blog Post #bp-1',
    ipAddress: '103.144.201.52 (Dhaka)',
    category: 'content'
  },
  {
    id: 'act-5',
    timestamp: 'Yesterday, 02:15 PM',
    user: 'Nafsi Bin Tealam',
    userRole: 'SUPER_ADMIN',
    action: 'Generated complete WordPress + WooCommerce blueprint export',
    target: 'System Blueprint Hub',
    ipAddress: '103.144.201.42 (Dhaka)',
    category: 'security'
  }
];

export const INITIAL_LOGIN_HISTORY: LoginHistoryRecord[] = [
  {
    id: 'lh-1',
    timestamp: '19 Sep 2026, 12:15 PM',
    user: 'superadmin (Nafsi Bin Tealam)',
    ipAddress: '103.144.201.42 (Dhaka, BD)',
    device: 'Apple MacBook Pro (macOS 15.1)',
    browser: 'Chrome 130.0.0.0',
    status: 'Success'
  },
  {
    id: 'lh-2',
    timestamp: '19 Sep 2026, 11:00 AM',
    user: 'shakil.orders (Shakil Anwar)',
    ipAddress: '103.144.201.45 (Dhaka, BD)',
    device: 'Dell OptiPlex (Windows 11)',
    browser: 'Edge 129.0.0.0',
    status: 'Success'
  },
  {
    id: 'lh-3',
    timestamp: '18 Sep 2026, 09:30 PM',
    user: 'unknown_attempt',
    ipAddress: '185.220.101.5 (Frankfurt, DE)',
    device: 'Linux x86_64',
    browser: 'Python-Requests/2.31',
    status: 'Blocked'
  },
  {
    id: 'lh-4',
    timestamp: '18 Sep 2026, 06:40 PM',
    user: 'tariqul.admin',
    ipAddress: '103.205.71.18 (Chittagong, BD)',
    device: 'HP Pavilion (Windows 11)',
    browser: 'Firefox 131.0',
    status: 'Success'
  }
];

export const INITIAL_ERROR_LOGS: SystemErrorLogRecord[] = [
  {
    id: 'err-1',
    timestamp: '19 Sep 2026, 10:14 AM',
    level: 'INFO',
    service: 'Courier Dispatcher',
    message: 'Steadfast sandbox webhook delivered status confirmation successfully for STDF-90281.',
    resolved: true
  },
  {
    id: 'err-2',
    timestamp: '18 Sep 2026, 04:55 PM',
    level: 'WARNING',
    service: 'bKash IPN Handler',
    message: 'Payment verification retry initiated for TRX #BK7182903. Successful on 2nd attempt.',
    resolved: true
  },
  {
    id: 'err-3',
    timestamp: '17 Sep 2026, 01:20 PM',
    level: 'INFO',
    service: 'WordPress REST Sync',
    message: 'Bridge running in Local Mock Simulation Mode. Awaiting production WP credentials.',
    resolved: true
  }
];

// ==========================================
// STATEFUL LOCAL STORAGE SERVICE HELPERS
// ==========================================
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to write to localStorage key ${key}`, e);
  }
}

// Normalizer to ensure every product has full schema attributes (SKU, costPrice, salePrice, stockQuantity, status, brand, etc.)
const normalizeProduct = (p: any): Product => {
  const stock = typeof p.stockQuantity === 'number' 
    ? p.stockQuantity 
    : typeof p.stockCount === 'number' 
      ? p.stockCount 
      : typeof p.stock === 'number' 
        ? p.stock 
        : (p.inStock ? 20 : 0);

  const regularPrice = typeof p.regularPrice === 'number'
    ? p.regularPrice
    : typeof p.oldPrice === 'number' && p.oldPrice > (p.price || 0)
      ? p.oldPrice
      : (p.price || 1200);

  const salePrice = typeof p.salePrice === 'number'
    ? p.salePrice
    : (p.price && regularPrice > p.price ? p.price : undefined);

  const costPrice = typeof p.costPrice === 'number'
    ? p.costPrice
    : Math.round((p.price || 1000) * 0.62);

  const cleanId = (p.id || '').replace(/^cm-/, '');
  const catCode = (p.category || 'GEN').slice(0, 2).toUpperCase();
  const sku = p.sku || `CM-${catCode}-${cleanId.padStart(3, '0')}`;

  const defaultBrand = p.category?.toLowerCase().includes('women') 
    ? 'Aarong Earth'
    : p.category?.toLowerCase().includes('gadget') || p.category?.toLowerCase().includes('electronic')
      ? 'Xiaomi Ecosystem'
      : p.category?.toLowerCase().includes('beauty')
        ? 'Focallure Beauty'
        : 'Cholti Essentials';

  const defaultAttributes: ProductAttribute[] = Array.isArray(p.attributes) && p.attributes.length > 0
    ? p.attributes
    : [
        { id: 'attr-1', name: 'Standard Grade', options: ['Premium Bangladesh Source'], visible: true, variation: false }
      ];

  return {
    ...p,
    id: p.id || `cm-${Date.now().toString(36)}`,
    name: p.name || 'Untitled Product',
    slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`),
    category: p.category || 'General',
    subcategory: p.subcategory || 'Default',
    brand: p.brand || defaultBrand,
    brandId: p.brandId || `brand-${(p.brand || defaultBrand).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    price: Number(p.price) || 1200,
    regularPrice: Number(regularPrice),
    salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
    costPrice: Number(costPrice),
    oldPrice: Number(regularPrice),
    sku,
    stock,
    stockCount: stock,
    stockQuantity: stock,
    lowStockThreshold: typeof p.lowStockThreshold === 'number' ? p.lowStockThreshold : 10,
    status: p.status || 'published',
    isFeatured: !!p.isFeatured,
    isTrending: !!p.isTrending,
    inStock: stock > 0,
    images: Array.isArray(p.images) && p.images.length > 0 
      ? p.images 
      : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    shortDescription: p.shortDescription || (p.description ? p.description.slice(0, 120) : 'Premium authentic product available at Cholti Mart.'),
    description: p.description || 'Authentic quality verified product sourced with priority nationwide delivery in Bangladesh.',
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['authentic', 'bangladesh', 'best-seller'],
    attributes: defaultAttributes,
    specifications: p.specifications || { 'Authenticity': '100% Genuine Certified', 'Warranty': '7 Days Easy Return' },
    reviewsList: p.reviewsList || [],
    rating: typeof p.rating === 'number' ? p.rating : 4.8,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : (p.reviewsCount || 12),
    reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : (p.reviewCount || 12)
  };
};

export const AdminMockService = {
  // ==========================================
  // PRODUCTS CATALOG API
  // ==========================================
  getProducts: (): Product[] => {
    const rawList = loadFromStorage(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
    const normalized = rawList.map(normalizeProduct);
    return normalized;
  },

  saveProducts: (products: Product[]) => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  getProduct: (idOrSlug: string): Product | undefined => {
    const list = AdminMockService.getProducts();
    return list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  },

  createProduct: (productData: Omit<Product, 'id'>): Product => {
    const list = AdminMockService.getProducts();
    const newId = `cm-${Date.now().toString(36)}`;
    const newProduct = normalizeProduct({
      ...productData,
      id: newId,
      createdAt: new Date().toISOString()
    });
    const updated = [newProduct, ...list];
    AdminMockService.saveProducts(updated);

    // Record initial inventory entry
    AdminMockService.recordInventoryAdjustment({
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      previousStock: 0,
      quantityChange: newProduct.stockQuantity ?? newProduct.stockCount,
      newStock: newProduct.stockQuantity ?? newProduct.stockCount,
      reason: 'restock',
      notes: 'Initial inventory logged upon product creation',
      date: new Date().toLocaleString('en-GB'),
      adjustedBy: 'Tanvir Hossain (Admin)'
    });

    return newProduct;
  },

  updateProduct: (updated: Product): Product => {
    const list = AdminMockService.getProducts();
    const existing = list.find(p => p.id === updated.id);
    const normalized = normalizeProduct({
      ...updated,
      updatedAt: new Date().toISOString()
    });

    // If stock changed, log an inventory adjustment
    if (existing) {
      const prevStock = existing.stockQuantity ?? existing.stockCount;
      const newStock = normalized.stockQuantity ?? normalized.stockCount;
      if (prevStock !== newStock) {
        AdminMockService.recordInventoryAdjustment({
          productId: normalized.id,
          productName: normalized.name,
          sku: normalized.sku,
          previousStock: prevStock,
          quantityChange: newStock - prevStock,
          newStock: newStock,
          reason: newStock > prevStock ? 'restock' : 'manual_adjustment',
          notes: `Stock quantity updated during product edit (${prevStock} -> ${newStock})`,
          date: new Date().toLocaleString('en-GB'),
          adjustedBy: 'Tanvir Hossain (Admin)'
        });
      }
    }

    const updatedList = list.map(p => p.id === normalized.id ? normalized : p);
    AdminMockService.saveProducts(updatedList);
    return normalized;
  },

  deleteProduct: (id: string): boolean => {
    const list = AdminMockService.getProducts();
    const updated = list.filter(p => p.id !== id);
    AdminMockService.saveProducts(updated);
    return true;
  },

  bulkDeleteProducts: (ids: string[]): boolean => {
    const list = AdminMockService.getProducts();
    const idSet = new Set(ids);
    const updated = list.filter(p => !idSet.has(p.id));
    AdminMockService.saveProducts(updated);
    return true;
  },

  bulkUpdateProductStatus: (ids: string[], status: ProductStatus): boolean => {
    const list = AdminMockService.getProducts();
    const idSet = new Set(ids);
    const updated = list.map(p => idSet.has(p.id) ? { ...p, status } : p);
    AdminMockService.saveProducts(updated);
    return true;
  },

  bulkAssignCategory: (ids: string[], category: string): boolean => {
    const list = AdminMockService.getProducts();
    const idSet = new Set(ids);
    const updated = list.map(p => idSet.has(p.id) ? { ...p, category } : p);
    AdminMockService.saveProducts(updated);
    return true;
  },

  // ==========================================
  // INVENTORY & STOCK MANAGEMENT
  // ==========================================
  updateInventory: (
    productId: string, 
    adjustment: { 
      quantityChange: number; 
      reason: InventoryAdjustment['reason']; 
      notes?: string; 
      adjustedBy?: string 
    }
  ): Product | undefined => {
    const list = AdminMockService.getProducts();
    const product = list.find(p => p.id === productId);
    if (!product) return undefined;

    const currentStock = product.stockQuantity ?? product.stockCount;
    const newStock = Math.max(0, currentStock + adjustment.quantityChange);

    const updatedProduct: Product = {
      ...product,
      stock: newStock,
      stockCount: newStock,
      stockQuantity: newStock,
      inStock: newStock > 0
    };

    AdminMockService.updateProduct(updatedProduct);

    // Log adjustment history
    AdminMockService.recordInventoryAdjustment({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      previousStock: currentStock,
      quantityChange: adjustment.quantityChange,
      newStock: newStock,
      reason: adjustment.reason,
      notes: adjustment.notes || `Inventory stock adjusted by ${adjustment.quantityChange > 0 ? '+' : ''}${adjustment.quantityChange}`,
      date: new Date().toLocaleString('en-GB'),
      adjustedBy: adjustment.adjustedBy || 'Tanvir Hossain (Admin)'
    });

    return updatedProduct;
  },

  getInventoryAdjustments: (): InventoryAdjustment[] => {
    return loadFromStorage(STORAGE_KEYS.INVENTORY_ADJUSTMENTS, INITIAL_INVENTORY_ADJUSTMENTS);
  },

  saveInventoryAdjustments: (adjustments: InventoryAdjustment[]) => {
    saveToStorage(STORAGE_KEYS.INVENTORY_ADJUSTMENTS, adjustments);
  },

  recordInventoryAdjustment: (entry: Omit<InventoryAdjustment, 'id'>): InventoryAdjustment => {
    const list = AdminMockService.getInventoryAdjustments();
    const record: InventoryAdjustment = {
      ...entry,
      id: `adj-${Date.now().toString(36)}`
    };
    const updated = [record, ...list];
    AdminMockService.saveInventoryAdjustments(updated);
    return record;
  },

  // ==========================================
  // ORDERS MANAGEMENT API
  // ==========================================
  getOrders: (): Order[] => {
    const raw = loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ADMIN_ORDERS);
    return raw.map((ord: any) => ({
      ...ord,
      itemCount: ord.itemCount || ord.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || ord.items?.length || 0,
      deliveryCharge: typeof ord.deliveryCharge === 'number' ? ord.deliveryCharge : (ord.shippingFee || 70),
      shippingFee: typeof ord.shippingFee === 'number' ? ord.shippingFee : 70,
      paymentStatus: ord.paymentStatus || (ord.status === 'Delivered' ? 'paid' : (ord.status === 'Cancelled' ? 'unpaid' : (ord.status === 'Refunded' || ord.status === 'Returned' ? 'refunded' : (ord.paymentMethod === 'Cash on Delivery' ? 'unpaid' : 'paid')))),
      deliveryStatus: ord.deliveryStatus || (ord.status === 'Delivered' ? 'delivered' : (ord.status === 'Shipped' ? 'in_transit' : (ord.status === 'Processing' ? 'processing' : (ord.status === 'Cancelled' ? 'failed' : (ord.status === 'Returned' ? 'returned' : 'pending'))))),
      courierPartner: ord.courierPartner || ord.courier,
      courier: ord.courier || ord.courierPartner,
      courierTrackingCode: ord.courierTrackingCode || ord.trackingNumber,
      trackingNumber: ord.trackingNumber || ord.courierTrackingCode,
      adminNotes: Array.isArray(ord.adminNotes) ? ord.adminNotes : [],
      timeline: Array.isArray(ord.timeline) ? ord.timeline : [
        {
          id: `tl-init-${ord.id}`,
          timestamp: ord.date || 'Initial',
          title: 'Order Created',
          description: `Order placed via ${ord.paymentMethod || 'Cash on Delivery'}`,
          type: 'created',
          user: 'System'
        }
      ]
    }));
  },

  saveOrders: (orders: Order[]) => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  },

  getOrder: (id: string): Order | undefined => {
    const orders = AdminMockService.getOrders();
    const clean = id.toLowerCase().replace('#', '').trim();
    return orders.find(o => o.id.toLowerCase() === clean || o.id.toLowerCase() === `#${clean}` || o.id.toLowerCase() === id.toLowerCase());
  },

  updateOrder: (updatedOrder: Order): Order => {
    const orders = AdminMockService.getOrders();
    const withTimestamp: Order = {
      ...updatedOrder,
      updatedAt: new Date().toISOString()
    };
    const updatedList = orders.map(o => o.id === withTimestamp.id ? withTimestamp : o);
    AdminMockService.saveOrders(updatedList);
    return withTimestamp;
  },

  updateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string, 
    courierPartner?: string,
    deliveryStatus?: DeliveryStatus,
    note?: string,
    author: string = 'Admin User'
  ): Order | undefined => {
    const orders = AdminMockService.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (!target) return undefined;

    const previousStatus = target.status;
    const nowTimestamp = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const newTimelineEvents: OrderTimelineEvent[] = [];

    if (previousStatus !== status) {
      newTimelineEvents.push({
        id: `tl-${Date.now()}-status`,
        timestamp: nowTimestamp,
        title: `Status Changed to ${status}`,
        description: `Order status moved from ${previousStatus} to ${status}.`,
        type: 'status_change',
        user: author
      });
    }

    if (courierPartner && courierPartner !== target.courierPartner) {
      newTimelineEvents.push({
        id: `tl-${Date.now()}-courier`,
        timestamp: nowTimestamp,
        title: `Courier Assigned: ${courierPartner}`,
        description: trackingNumber ? `Tracking code: ${trackingNumber}` : 'Courier logistics assigned.',
        type: 'courier',
        user: author
      });
    } else if (trackingNumber && trackingNumber !== target.courierTrackingCode) {
      newTimelineEvents.push({
        id: `tl-${Date.now()}-tracking`,
        timestamp: nowTimestamp,
        title: `Tracking Code Updated`,
        description: `Tracking code set to ${trackingNumber}.`,
        type: 'courier',
        user: author
      });
    }

    const updatedNotes = [...(target.adminNotes || [])];
    if (note && note.trim()) {
      const newNote: OrderAdminNote = {
        id: `note-${Date.now()}`,
        text: note.trim(),
        author: author,
        createdAt: nowTimestamp
      };
      updatedNotes.unshift(newNote);
      newTimelineEvents.push({
        id: `tl-${Date.now()}-note`,
        timestamp: nowTimestamp,
        title: 'Admin Note Added',
        description: note.trim(),
        type: 'note',
        user: author
      });
    }

    // Determine derived delivery status
    const resolvedDeliveryStatus: DeliveryStatus = deliveryStatus || (
      status === 'Delivered' ? 'delivered' :
      status === 'Shipped' ? 'in_transit' :
      status === 'Processing' ? 'processing' :
      status === 'Cancelled' ? 'failed' :
      status === 'Returned' ? 'returned' :
      target.deliveryStatus || 'pending'
    );

    // Determine derived payment status
    const resolvedPaymentStatus: PaymentStatus = (
      status === 'Refunded' ? 'refunded' :
      status === 'Returned' ? 'refunded' :
      target.paymentStatus || 'unpaid'
    );

    const updatedOrder: Order = {
      ...target,
      status,
      deliveryStatus: resolvedDeliveryStatus,
      paymentStatus: resolvedPaymentStatus,
      courierPartner: courierPartner || target.courierPartner,
      courier: courierPartner || target.courier,
      courierTrackingCode: trackingNumber || target.courierTrackingCode,
      trackingNumber: trackingNumber || target.trackingNumber,
      updatedAt: new Date().toISOString(),
      adminNotes: updatedNotes,
      timeline: [...newTimelineEvents, ...(target.timeline || [])]
    };

    const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
    AdminMockService.saveOrders(updatedOrders);
    return updatedOrder;
  },

  addOrderAdminNote: (orderId: string, text: string, author: string = 'Admin Staff'): Order | undefined => {
    const orders = AdminMockService.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (!target) return undefined;

    const nowTimestamp = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const newNote: OrderAdminNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      author: author,
      createdAt: nowTimestamp
    };

    const newTimelineEvent: OrderTimelineEvent = {
      id: `tl-${Date.now()}-note`,
      timestamp: nowTimestamp,
      title: 'Internal Admin Note Added',
      description: text.trim(),
      type: 'note',
      user: author
    };

    const updatedOrder: Order = {
      ...target,
      updatedAt: new Date().toISOString(),
      adminNotes: [newNote, ...(target.adminNotes || [])],
      timeline: [newTimelineEvent, ...(target.timeline || [])]
    };

    const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
    AdminMockService.saveOrders(updatedOrders);
    return updatedOrder;
  },

  bulkUpdateOrderStatus: (orderIds: string[], status: OrderStatus, author: string = 'Admin User') => {
    const orders = AdminMockService.getOrders();
    const nowTimestamp = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const updated = orders.map(o => {
      if (!orderIds.includes(o.id)) return o;
      const timelineEvent: OrderTimelineEvent = {
        id: `tl-bulk-${Date.now()}-${o.id}`,
        timestamp: nowTimestamp,
        title: `Bulk Status Update: ${status}`,
        description: `Order status batch modified to ${status}.`,
        type: 'status_change',
        user: author
      };
      return {
        ...o,
        status,
        updatedAt: new Date().toISOString(),
        timeline: [timelineEvent, ...(o.timeline || [])]
      };
    });
    AdminMockService.saveOrders(updated);
  },

  bulkAssignCourier: (orderIds: string[], courier: string, author: string = 'Logistics Manager') => {
    const orders = AdminMockService.getOrders();
    const nowTimestamp = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const updated = orders.map(o => {
      if (!orderIds.includes(o.id)) return o;
      const timelineEvent: OrderTimelineEvent = {
        id: `tl-courier-${Date.now()}-${o.id}`,
        timestamp: nowTimestamp,
        title: `Assigned Courier: ${courier}`,
        description: `Batch courier partner assignment set to ${courier}.`,
        type: 'courier',
        user: author
      };
      return {
        ...o,
        courier: courier,
        courierPartner: courier,
        updatedAt: new Date().toISOString(),
        timeline: [timelineEvent, ...(o.timeline || [])]
      };
    });
    AdminMockService.saveOrders(updated);
  },

  bulkDeleteOrders: (orderIds: string[]) => {
    const orders = AdminMockService.getOrders();
    const filtered = orders.filter(o => !orderIds.includes(o.id));
    AdminMockService.saveOrders(filtered);
  },

  // ==========================================
  // WOOCOMMERCE ORDER REST API V3 MAPPERS
  // ==========================================
  toWooCommerceOrderPayload: (order: Order) => {
    const cleanIdNum = parseInt(order.id.replace(/\D/g, '') || '1001', 10);
    const wcStatusMap: Record<string, string> = {
      'pending': 'pending',
      'confirmed': 'processing',
      'processing': 'processing',
      'shipped': 'on-hold',
      'delivered': 'completed',
      'cancelled': 'cancelled',
      'returned': 'refunded',
      'refunded': 'refunded'
    };

    const resolvedStatus = wcStatusMap[order.status.toLowerCase()] || 'processing';
    const bAddress = typeof order.billingAddress === 'object' && order.billingAddress ? order.billingAddress : null;
    const sAddress = typeof order.shippingAddress === 'object' && order.shippingAddress ? order.shippingAddress : null;
    const nameParts = (order.customerName || 'Valued Customer').split(' ');
    const firstName = nameParts[0] || 'Valued';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    return {
      id: order.wooCommerceOrderId || cleanIdNum,
      parent_id: 0,
      status: resolvedStatus,
      currency: 'BDT',
      version: '8.4.0',
      prices_include_tax: true,
      date_created: order.createdAt || new Date().toISOString(),
      date_modified: order.updatedAt || new Date().toISOString(),
      discount_total: (order.discount || 0).toFixed(2),
      discount_tax: '0.00',
      shipping_total: (order.deliveryCharge || order.shippingFee || 0).toFixed(2),
      shipping_tax: '0.00',
      cart_tax: '0.00',
      total: order.total.toFixed(2),
      total_tax: '0.00',
      customer_id: parseInt((order.customerId || '0').replace(/\D/g, '') || '0', 10),
      order_key: `wc_order_${order.id.toLowerCase()}`,
      billing: {
        first_name: firstName,
        last_name: lastName,
        company: '',
        address_1: bAddress?.street || order.address,
        address_2: bAddress?.area || order.area || '',
        city: bAddress?.district || order.district || 'Dhaka',
        state: bAddress?.district || order.district || 'Dhaka',
        postcode: bAddress?.postalCode || '1200',
        country: 'BD',
        email: order.email || 'customer@choltimart.com',
        phone: order.phone || '+8801700000000'
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        company: '',
        address_1: sAddress?.street || order.address,
        address_2: sAddress?.area || order.area || '',
        city: sAddress?.district || order.district || 'Dhaka',
        state: sAddress?.district || order.district || 'Dhaka',
        postcode: sAddress?.postalCode || '1200',
        country: 'BD',
        phone: order.phone || '+8801700000000'
      },
      payment_method: (order.paymentMethod || 'cod').toLowerCase().replace(/\s+/g, '_'),
      payment_method_title: order.paymentMethod || 'Cash on Delivery',
      transaction_id: order.paymentStatus === 'paid' ? `TXN-${order.id}` : '',
      customer_note: order.notes || '',
      line_items: order.items.map((item, index) => {
        const itemCleanId = parseInt(item.productId.replace(/\D/g, '') || `${index + 101}`, 10);
        return {
          id: index + 1,
          name: item.productName,
          product_id: itemCleanId,
          variation_id: 0,
          quantity: item.quantity,
          tax_class: '',
          subtotal: (item.price * item.quantity).toFixed(2),
          subtotal_tax: '0.00',
          total: (item.price * item.quantity).toFixed(2),
          total_tax: '0.00',
          sku: item.sku || `SKU-${itemCleanId}`,
          price: item.price
        };
      }),
      shipping_lines: [
        {
          id: 1,
          method_title: order.courierPartner || order.courier || 'Standard Express Courier Delivery',
          method_id: (order.courierPartner || 'standard_delivery').toLowerCase().replace(/\s+/g, '_'),
          total: (order.deliveryCharge || order.shippingFee || 70).toFixed(2),
          total_tax: '0.00'
        }
      ],
      meta_data: [
        { key: '_cholti_order_id', value: order.id },
        { key: '_courier_partner', value: order.courierPartner || order.courier || '' },
        { key: '_courier_tracking_code', value: order.courierTrackingCode || order.trackingNumber || '' },
        { key: '_delivery_status', value: order.deliveryStatus || 'pending' },
        { key: '_payment_status', value: order.paymentStatus || 'unpaid' },
        { key: '_cholti_district', value: order.district || 'Dhaka' }
      ]
    };
  },

  fromWooCommerceOrder: (wcOrder: any): Order => {
    const billing = wcOrder.billing || {};
    const shipping = wcOrder.shipping || {};
    const customerName = `${billing.first_name || ''} ${billing.last_name || ''}`.trim() || 'Valued Customer';
    const getMeta = (k: string) => wcOrder.meta_data?.find((m: any) => m.key === k)?.value;

    const statusMap: Record<string, OrderStatus> = {
      'pending': 'Pending',
      'processing': 'Processing',
      'on-hold': 'Confirmed',
      'completed': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'failed': 'Cancelled'
    };

    const resolvedStatus: OrderStatus = statusMap[wcOrder.status?.toLowerCase()] || 'Processing';

    return {
      id: getMeta('_cholti_order_id') || `WC-${wcOrder.id}`,
      wooCommerceOrderId: wcOrder.id,
      date: wcOrder.date_created ? new Date(wcOrder.date_created).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
      createdAt: wcOrder.date_created || new Date().toISOString(),
      updatedAt: wcOrder.date_modified || new Date().toISOString(),
      customerName,
      phone: billing.phone || shipping.phone || '',
      email: billing.email || '',
      district: shipping.city || billing.city || 'Dhaka',
      area: shipping.address_2 || billing.address_2 || '',
      address: shipping.address_1 || billing.address_1 || '',
      billingAddress: {
        fullName: customerName,
        phone: billing.phone,
        email: billing.email,
        street: billing.address_1 || '',
        area: billing.address_2 || '',
        district: billing.city || 'Dhaka',
        postalCode: billing.postcode || '1200',
        country: billing.country || 'Bangladesh'
      },
      shippingAddress: {
        fullName: customerName,
        phone: shipping.phone || billing.phone,
        email: billing.email,
        street: shipping.address_1 || billing.address_1 || '',
        area: shipping.address_2 || billing.address_2 || '',
        district: shipping.city || billing.city || 'Dhaka',
        postalCode: shipping.postcode || '1200',
        country: shipping.country || 'Bangladesh'
      },
      paymentMethod: wcOrder.payment_method_title || 'Cash on Delivery',
      paymentStatus: (wcOrder.status === 'completed' ? 'paid' : (getMeta('_payment_status') || 'unpaid')) as PaymentStatus,
      status: resolvedStatus,
      deliveryStatus: (getMeta('_delivery_status') || (resolvedStatus === 'Delivered' ? 'delivered' : 'pending')) as DeliveryStatus,
      courierPartner: getMeta('_courier_partner') || '',
      courier: getMeta('_courier_partner') || '',
      courierTrackingCode: getMeta('_courier_tracking_code') || '',
      trackingNumber: getMeta('_courier_tracking_code') || '',
      items: (wcOrder.line_items || []).map((li: any) => ({
        productId: `cm-${li.product_id}`,
        productName: li.name,
        price: parseFloat(li.price || '0'),
        quantity: li.quantity || 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
        sku: li.sku || `SKU-${li.product_id}`,
        subtotal: parseFloat(li.total || '0')
      })),
      itemCount: (wcOrder.line_items || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0),
      subtotal: parseFloat(wcOrder.total || '0') - parseFloat(wcOrder.shipping_total || '0'),
      shippingFee: parseFloat(wcOrder.shipping_total || '70'),
      deliveryCharge: parseFloat(wcOrder.shipping_total || '70'),
      discount: parseFloat(wcOrder.discount_total || '0'),
      total: parseFloat(wcOrder.total || '0'),
      notes: wcOrder.customer_note || ''
    };
  },

  // ==========================================
  // CATEGORIES TAXONOMY API
  // ==========================================
  getCategories: (): Category[] => {
    return loadFromStorage(STORAGE_KEYS.CATEGORIES, CATEGORIES_DATA as unknown as Category[]);
  },

  saveCategories: (categories: Category[]) => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  },

  createCategory: (catData: Omit<Category, 'id'>): Category => {
    const list = AdminMockService.getCategories();
    const newId = (catData.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      ...catData,
      id: newId,
      slug: catData.slug || newId,
      itemCount: catData.itemCount ?? 0,
      subcategories: catData.subcategories || []
    };
    const updated = [newCat, ...list];
    AdminMockService.saveCategories(updated);
    return newCat;
  },

  updateCategory: (category: Category): Category => {
    const list = AdminMockService.getCategories();
    const updated = list.map(c => c.id === category.id ? category : c);
    AdminMockService.saveCategories(updated);
    return category;
  },

  deleteCategory: (id: string): boolean => {
    const list = AdminMockService.getCategories();
    const updated = list.filter(c => c.id !== id);
    AdminMockService.saveCategories(updated);
    return true;
  },

  // ==========================================
  // BRANDS API
  // ==========================================
  getBrands: (): Brand[] => {
    return loadFromStorage(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
  },

  saveBrands: (brands: Brand[]) => {
    saveToStorage(STORAGE_KEYS.BRANDS, brands);
  },

  createBrand: (brandData: Omit<Brand, 'id'>): Brand => {
    const list = AdminMockService.getBrands();
    const newId = `brand-${(brandData.name || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const newBrand: Brand = {
      ...brandData,
      id: newId,
      slug: brandData.slug || newId,
      productCount: brandData.productCount ?? 0
    };
    const updated = [newBrand, ...list];
    AdminMockService.saveBrands(updated);
    return newBrand;
  },

  updateBrand: (brand: Brand): Brand => {
    const list = AdminMockService.getBrands();
    const updated = list.map(b => b.id === brand.id ? brand : b);
    AdminMockService.saveBrands(updated);
    return brand;
  },

  deleteBrand: (id: string): boolean => {
    const list = AdminMockService.getBrands();
    const updated = list.filter(b => b.id !== id);
    AdminMockService.saveBrands(updated);
    return true;
  },

  // ==========================================
  // WOOCOMMERCE REST API COMPATIBILITY MAPPER
  // ==========================================
  toWooCommercePayload: (product: Product): Record<string, any> => {
    return {
      id: product.wooId,
      name: product.name,
      slug: product.slug,
      type: 'simple',
      status: product.status === 'published' ? 'publish' : product.status === 'draft' ? 'draft' : 'pending',
      featured: !!product.isFeatured,
      catalog_visibility: 'visible',
      description: product.description,
      short_description: product.shortDescription,
      sku: product.sku,
      price: product.salePrice ? String(product.salePrice) : String(product.price),
      regular_price: String(product.regularPrice || product.price),
      sale_price: product.salePrice ? String(product.salePrice) : '',
      manage_stock: true,
      stock_quantity: product.stockQuantity ?? product.stockCount,
      stock_status: (product.stockQuantity ?? product.stockCount) > 0 ? 'instock' : 'outofstock',
      low_stock_amount: product.lowStockThreshold || 10,
      categories: [
        { name: product.category, slug: product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ],
      tags: (product.tags || []).map(t => ({ name: t })),
      images: (product.images || []).map(src => ({ src })),
      attributes: (product.attributes || []).map((attr, idx) => ({
        id: idx + 1,
        name: attr.name,
        position: idx,
        visible: attr.visible,
        variation: !!attr.variation,
        options: attr.options
      })),
      meta_data: [
        { key: '_cost_price', value: String(product.costPrice || '') },
        { key: '_brand_name', value: product.brand || '' }
      ]
    };
  },

  // Customers
  getCustomers: (): CustomerProfile[] => loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  saveCustomers: (customers: CustomerProfile[]) => saveToStorage(STORAGE_KEYS.CUSTOMERS, customers),
  addCustomer: (customer: Omit<CustomerProfile, 'id' | 'ordersCount' | 'totalSpent' | 'lastOrderDate' | 'joinedDate'>) => {
    const list = AdminMockService.getCustomers();
    const newRecord: CustomerProfile = {
      ...customer,
      id: `c-${Date.now().toString(36)}`,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: 'Never',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newRecord, ...list];
    AdminMockService.saveCustomers(updated);
    return newRecord;
  },
  getCustomerGroups: (): CustomerGroupItem[] => INITIAL_CUSTOMER_GROUPS,

  // Delivery
  getDeliveryZones: (): DeliveryZone[] => loadFromStorage(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES),
  saveDeliveryZones: (zones: DeliveryZone[]) => saveToStorage(STORAGE_KEYS.DELIVERY_ZONES, zones),
  getCouriers: (): CourierServiceConfig[] => loadFromStorage(STORAGE_KEYS.COURIERS, INITIAL_COURIERS),
  saveCouriers: (couriers: CourierServiceConfig[]) => saveToStorage(STORAGE_KEYS.COURIERS, couriers),
  getCourierConfigs: (): CourierServiceConfig[] => loadFromStorage(STORAGE_KEYS.COURIERS, INITIAL_COURIERS),
  saveCourierConfigs: (couriers: CourierServiceConfig[]) => saveToStorage(STORAGE_KEYS.COURIERS, couriers),

  // Marketing
  getPromotions: (): PromotionCampaign[] => loadFromStorage(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS),
  savePromotions: (promos: PromotionCampaign[]) => saveToStorage(STORAGE_KEYS.PROMOTIONS, promos),
  getFlashSales: (): FlashSaleItem[] => loadFromStorage(STORAGE_KEYS.FLASH_SALES, INITIAL_FLASH_SALES),
  saveFlashSales: (sales: FlashSaleItem[]) => saveToStorage(STORAGE_KEYS.FLASH_SALES, sales),
  getAbandonedCarts: (): AbandonedCartRecord[] => loadFromStorage(STORAGE_KEYS.ABANDONED_CARTS, INITIAL_ABANDONED_CARTS),

  // Payments & Refunds
  getTransactions: (): PaymentTransactionRecord[] => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  saveTransactions: (txs: PaymentTransactionRecord[]) => saveToStorage(STORAGE_KEYS.TRANSACTIONS, txs),
  getRefunds: (): RefundItemRecord[] => loadFromStorage(STORAGE_KEYS.REFUNDS, INITIAL_REFUNDS),
  saveRefunds: (refunds: RefundItemRecord[]) => saveToStorage(STORAGE_KEYS.REFUNDS, refunds),
  updateRefundStatus: (id: string, newStatus: RefundItemRecord['status']) => {
    const list = AdminMockService.getRefunds();
    const updated = list.map(r => r.id === id ? { ...r, status: newStatus } : r);
    AdminMockService.saveRefunds(updated);
    return updated;
  },

  // Content
  getContentPages: (): ContentPageRecord[] => loadFromStorage(STORAGE_KEYS.CONTENT_PAGES, INITIAL_CONTENT_PAGES),
  getBlogPosts: (): BlogPostRecord[] => loadFromStorage(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS),
  saveBlogPosts: (posts: BlogPostRecord[]) => saveToStorage(STORAGE_KEYS.BLOG_POSTS, posts),
  getTestimonials: (): TestimonialRecord[] => loadFromStorage(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS),
  getMediaLibrary: (): MediaItemRecord[] => loadFromStorage(STORAGE_KEYS.MEDIA_LIBRARY, INITIAL_MEDIA_LIBRARY),

  // Admin Users & Security
  getAdminUsers: (): AdminUser[] => loadFromStorage(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS),
  saveAdminUsers: (users: AdminUser[]) => saveToStorage(STORAGE_KEYS.ADMIN_USERS, users),
  getActivityLogs: (): AdminActivityLogRecord[] => loadFromStorage(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS),
  addActivityLog: (log: Omit<AdminActivityLogRecord, 'id' | 'timestamp'>) => {
    const list = AdminMockService.getActivityLogs();
    const newEntry: AdminActivityLogRecord = {
      ...log,
      id: `act-${Date.now().toString(36)}`,
      timestamp: 'Just now'
    };
    const updated = [newEntry, ...list.slice(0, 49)];
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, updated);
    return newEntry;
  },
  getLoginHistory: (): LoginHistoryRecord[] => loadFromStorage(STORAGE_KEYS.LOGIN_HISTORY, INITIAL_LOGIN_HISTORY),
  getErrorLogs: (): SystemErrorLogRecord[] => loadFromStorage(STORAGE_KEYS.ERROR_LOGS, INITIAL_ERROR_LOGS),

  // Analytics Metrics
  getAnalyticsOverview: () => {
    return {
      dailyRevenue: 48250,
      weeklyRevenue: 318400,
      monthlyRevenue: 1428500,
      netProfitMargin: '34.8%',
      averageOrderValue: 2420,
      totalOrders: 642,
      conversionRate: '3.42%',
      repeatCustomerRate: '38.6%',
      regionalBreakdown: [
        { region: 'Dhaka Metropolitan', share: '62%', revenue: 885670 },
        { region: 'Chittagong City', share: '18%', revenue: 257130 },
        { region: 'Sylhet & North East', share: '9%', revenue: 128565 },
        { region: 'Rajshahi & West', share: '6%', revenue: 85710 },
        { region: 'Other Upazilas', share: '5%', revenue: 71425 }
      ]
    };
  },

  // Staff & RBAC
  getStaffList: (): StaffUserRecord[] => {
    return loadFromStorage('cholti_admin_staff_v1', [
      {
        id: 'staff-1',
        name: 'MD Tanvir Chowdhury',
        username: 'tanvir_admin',
        email: 'tanvir@choltimart.com',
        role: 'SUPER_ADMIN' as AdminRole,
        status: 'active',
        createdAt: '01 Jan 2026',
        lastLogin: '10 min ago',
        twoFactorEnabled: true
      },
      {
        id: 'staff-2',
        name: 'Shafayet Hossain',
        username: 'shafayet_mgr',
        email: 'shafayet@choltimart.com',
        role: 'MANAGER' as AdminRole,
        status: 'active',
        createdAt: '12 Jan 2026',
        lastLogin: '2 hours ago',
        twoFactorEnabled: true
      },
      {
        id: 'staff-3',
        name: 'Sadia Rahman',
        username: 'sadia_ops',
        email: 'sadia@choltimart.com',
        role: 'ORDER_MANAGER' as AdminRole,
        status: 'active',
        createdAt: '05 Feb 2026',
        lastLogin: 'Yesterday',
        twoFactorEnabled: false
      },
      {
        id: 'staff-4',
        name: 'Kazi Farhan',
        username: 'farhan_copy',
        email: 'farhan@choltimart.com',
        role: 'CONTENT_MANAGER' as AdminRole,
        status: 'active',
        createdAt: '20 Feb 2026',
        lastLogin: '3 days ago',
        twoFactorEnabled: false
      }
    ]);
  },
  saveStaffList: (staff: StaffUserRecord[]) => saveToStorage('cholti_admin_staff_v1', staff),
  addStaff: (newStaff: Omit<StaffUserRecord, 'id' | 'createdAt'>) => {
    const list = AdminMockService.getStaffList();
    const created: StaffUserRecord = {
      ...newStaff,
      id: `staff-${Date.now().toString(36)}`,
      createdAt: 'Today'
    };
    saveToStorage('cholti_admin_staff_v1', [created, ...list]);
    return created;
  },

  getAuditLogs: (): SecurityAuditLogRecord[] => {
    return loadFromStorage('cholti_admin_security_audits_v1', [
      {
        id: 'sec-log-1',
        timestamp: '19 Sep 2026, 04:12 PM',
        adminName: 'Tanvir Chowdhury',
        adminRole: 'SUPER_ADMIN',
        action: 'Modified bKash Merchant Gateway API Keys',
        ipAddress: '103.145.72.19 (Dhaka, BD)',
        status: 'SUCCESS',
        targetResource: 'PaymentGateway'
      },
      {
        id: 'sec-log-2',
        timestamp: '19 Sep 2026, 02:45 PM',
        adminName: 'Shafayet Hossain',
        adminRole: 'MANAGER',
        action: 'Exported customer sales report to CSV',
        ipAddress: '103.145.72.22 (Dhaka, BD)',
        status: 'SUCCESS',
        targetResource: 'OrdersCSV'
      },
      {
        id: 'sec-log-3',
        timestamp: '19 Sep 2026, 11:30 AM',
        adminName: 'Sadia Rahman',
        adminRole: 'ORDER_MANAGER',
        action: 'Dispatched 14 parcels via Steadfast Courier',
        ipAddress: '119.30.38.102 (Dhaka, BD)',
        status: 'SUCCESS',
        targetResource: 'CourierDispatch'
      },
      {
        id: 'sec-log-4',
        timestamp: '18 Sep 2026, 09:15 PM',
        adminName: 'system_security_bot',
        adminRole: 'SUPER_ADMIN',
        action: 'Prevented brute-force login attempt on admin portal',
        ipAddress: '185.220.101.5 (Tor Exit Node)',
        status: 'BLOCKED',
        targetResource: 'AdminLoginGate'
      }
    ]);
  },

  // Full Database Backup & Reset
  exportFullBackupJson: () => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '2.4.0',
      customers: AdminMockService.getCustomers(),
      customerGroups: AdminMockService.getCustomerGroups(),
      deliveryZones: AdminMockService.getDeliveryZones(),
      courierConfigs: AdminMockService.getCourierConfigs(),
      promotions: AdminMockService.getPromotions(),
      flashSales: AdminMockService.getFlashSales(),
      abandonedCarts: AdminMockService.getAbandonedCarts(),
      transactions: AdminMockService.getTransactions(),
      refunds: AdminMockService.getRefunds(),
      contentPages: AdminMockService.getContentPages(),
      blogPosts: AdminMockService.getBlogPosts(),
      testimonials: AdminMockService.getTestimonials(),
      mediaLibrary: AdminMockService.getMediaLibrary(),
      adminUsers: AdminMockService.getAdminUsers(),
      activityLogs: AdminMockService.getActivityLogs(),
      staffList: AdminMockService.getStaffList(),
      auditLogs: AdminMockService.getAuditLogs()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupJson: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;
      if (data.customers) AdminMockService.saveCustomers(data.customers);
      if (data.deliveryZones) AdminMockService.saveDeliveryZones(data.deliveryZones);
      if (data.courierConfigs) AdminMockService.saveCourierConfigs(data.courierConfigs);
      if (data.promotions) AdminMockService.savePromotions(data.promotions);
      if (data.flashSales) AdminMockService.saveFlashSales(data.flashSales);
      if (data.transactions) AdminMockService.saveTransactions(data.transactions);
      if (data.refunds) AdminMockService.saveRefunds(data.refunds);
      if (data.staffList) AdminMockService.saveStaffList(data.staffList);
      return true;
    } catch {
      return false;
    }
  },

  resetToDefaults: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('cholti_admin_staff_v1');
    localStorage.removeItem('cholti_admin_security_audits_v1');
    localStorage.removeItem('cholti_mock_products_v1');
    localStorage.removeItem('cholti_mock_coupons_v1');
    localStorage.removeItem('cholti_admin_categories_v1');
    localStorage.removeItem('cholti_admin_brands_v1');
    localStorage.removeItem('cholti_admin_inventory_adjustments_v1');
    localStorage.removeItem('cholti_admin_orders_v1');
    localStorage.removeItem('cholti_admin_customers_v1');
    localStorage.removeItem('cholti_admin_customer_groups_v1');
    localStorage.removeItem('cholti_admin_delivery_zones_v1');
    localStorage.removeItem('cholti_admin_couriers_v1');
    localStorage.removeItem('cholti_admin_site_design_v1');
    localStorage.removeItem('cholti_admin_hero_config_v1');
    localStorage.removeItem('cholti_admin_promo_banner_v1');
    localStorage.removeItem('cholti_admin_reviews_v1');
    localStorage.removeItem('cholti_admin_notifications_v1');
    localStorage.removeItem('cholti_admin_audit_logs_v1');
    localStorage.removeItem('cholti_admin_cms_pages_v1');
    localStorage.removeItem('cholti_admin_newsletters_v1');
    localStorage.removeItem('cholti_mart_master_config_v2');
  }
};

// ==========================================
// STANDALONE MOCK SERVICE FUNCTIONS
// ==========================================
export const getProducts = (): Product[] => AdminMockService.getProducts();
export const getProduct = (idOrSlug: string): Product | undefined => AdminMockService.getProduct(idOrSlug);
export const createProduct = (product: Omit<Product, 'id'>): Product => AdminMockService.createProduct(product);
export const updateProduct = (product: Product): Product => AdminMockService.updateProduct(product);
export const deleteProduct = (id: string): boolean => AdminMockService.deleteProduct(id);
export const updateInventory = (
  productId: string,
  adjustment: { 
    quantityChange: number; 
    reason: InventoryAdjustment['reason']; 
    notes?: string; 
    adjustedBy?: string 
  }
): Product | undefined => AdminMockService.updateInventory(productId, adjustment);
export const getCategories = (): Category[] => AdminMockService.getCategories();
export const getBrands = (): Brand[] => AdminMockService.getBrands();

// Orders Service Functions
export const getOrders = (): Order[] => AdminMockService.getOrders();
export const getOrder = (id: string): Order | undefined => AdminMockService.getOrder(id);
export const saveOrders = (orders: Order[]): void => AdminMockService.saveOrders(orders);
export const updateOrder = (order: Order): Order => AdminMockService.updateOrder(order);
export const updateOrderStatus = (
  orderId: string, 
  status: OrderStatus, 
  trackingNumber?: string, 
  courierPartner?: string,
  deliveryStatus?: DeliveryStatus,
  note?: string,
  author?: string
): Order | undefined => AdminMockService.updateOrderStatus(orderId, status, trackingNumber, courierPartner, deliveryStatus, note, author);
export const addOrderAdminNote = (orderId: string, text: string, author?: string): Order | undefined => 
  AdminMockService.addOrderAdminNote(orderId, text, author);
export const bulkUpdateOrderStatus = (orderIds: string[], status: OrderStatus, author?: string): void => 
  AdminMockService.bulkUpdateOrderStatus(orderIds, status, author);
export const bulkAssignCourier = (orderIds: string[], courier: string, author?: string): void => 
  AdminMockService.bulkAssignCourier(orderIds, courier, author);
export const bulkDeleteOrders = (orderIds: string[]): void => 
  AdminMockService.bulkDeleteOrders(orderIds);


