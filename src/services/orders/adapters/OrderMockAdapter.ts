import { Order, OrderStatus, OrderAdminNote } from '../../../types';
import { CreateOrderDTO, OrderStatusUpdateOptions } from '../OrderService';
import { IOrderAdapter } from './IOrderAdapter';

const ORDERS_KEY = 'cholti_admin_orders_v1';

const INITIAL_ORDERS_SEED: Order[] = [
  {
    id: 'CM-84920',
    date: '17 Sep 2026',
    createdAt: '2026-09-17T10:30:00Z',
    updatedAt: '2026-09-17T11:00:00Z',
    customerName: 'Tanvir Ahmed',
    phone: '01712345678',
    email: 'tanvir@example.com',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 34, Road 11A, Dhanmondi, Dhaka-1209',
    notes: 'Please call before delivery',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'unpaid',
    items: [
      {
        productId: 'cm-106',
        productName: 'Adjustable Aluminum Laptop Stand',
        price: 1450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
        variant: 'Space Gray'
      }
    ],
    subtotal: 1450,
    shippingFee: 60,
    deliveryCharge: 60,
    discount: 0,
    total: 1510,
    status: 'Confirmed',
    deliveryStatus: 'processing',
    courierTrackingCode: 'SF-889410',
    courierPartner: 'Steadfast Courier',
    adminNotes: [
      {
        id: 'note-1',
        text: 'Customer verified phone address over phone confirmation call.',
        author: 'Admin User',
        createdAt: '17 Sep 2026, 11:00 AM',
        isCustomerVisible: false
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '17 Sep 2026, 10:30 AM',
        title: 'Order Placed',
        description: 'Placed via web storefront (COD)',
        type: 'created'
      },
      {
        id: 'tl-2',
        timestamp: '17 Sep 2026, 11:00 AM',
        title: 'Order Confirmed',
        description: 'Customer contact verified by staff',
        type: 'status_change'
      }
    ]
  },
  {
    id: 'CM-84919',
    date: '16 Sep 2026',
    createdAt: '2026-09-16T14:15:00Z',
    updatedAt: '2026-09-16T15:00:00Z',
    customerName: 'Ayesha Siddiqua',
    phone: '01987654321',
    email: 'ayesha@example.com',
    district: 'Chittagong',
    area: 'GEC Circle',
    address: 'Flat 4B, Hill View R/A, Nasirabad, Chittagong',
    notes: 'Fragile jewelry items inside',
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    items: [
      {
        productId: 'cm-103',
        productName: 'Bohemian Layered Pendant Necklace',
        price: 850,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
        variant: 'Antique Gold'
      }
    ],
    subtotal: 1700,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 170,
    coupon: 'CHOLTI10',
    total: 1660,
    status: 'Processing',
    deliveryStatus: 'processing',
    courierTrackingCode: 'PT-993812',
    courierPartner: 'Pathao Courier'
  },
  {
    id: 'CM-84918',
    date: '15 Sep 2026',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-15T18:00:00Z',
    customerName: 'Rafiqul Islam',
    phone: '01811223344',
    email: 'rafiq@example.com',
    district: 'Sylhet',
    area: 'Zindabazar',
    address: 'East Zindabazar, Road 3, Sylhet',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'unpaid',
    items: [
      {
        productId: 'cm-101',
        productName: 'Embroidered Cotton Kurti Set',
        price: 2450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
        variant: 'Olive Green / M'
      }
    ],
    subtotal: 2450,
    shippingFee: 130,
    deliveryCharge: 130,
    discount: 0,
    total: 2580,
    status: 'Shipped',
    deliveryStatus: 'in_transit',
    courierTrackingCode: 'SF-771201',
    courierPartner: 'Steadfast Courier'
  },
  {
    id: 'CM-10294',
    date: '02 Sep 2026',
    createdAt: '2026-09-02T16:00:00Z',
    updatedAt: '2026-09-05T12:00:00Z',
    customerName: 'Farhana Kabir',
    phone: '01898765432',
    email: 'farhana@example.com',
    district: 'Chittagong',
    area: 'Panchlaish',
    address: 'GEC Circle, Nasirabad Housing, Chittagong',
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
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
    deliveryCharge: 130,
    discount: 0,
    total: 2280,
    status: 'Delivered',
    deliveryStatus: 'delivered',
    courierTrackingCode: 'PT-3329104',
    courierPartner: 'Pathao Courier'
  }
];

export class OrderMockAdapter implements IOrderAdapter {
  private cache: Order[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ORDERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.cache = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to load orders from storage, using seed', e);
      }
    }
    this.cache = [...INITIAL_ORDERS_SEED];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to save orders to storage', e);
      }
    }
  }

  public getOrdersSync(): Order[] {
    return [...this.cache];
  }

  public async getOrders(): Promise<Order[]> {
    return [...this.cache];
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const found = this.cache.find(o => o.id === id);
    return found ? { ...found } : null;
  }

  public async trackOrder(orderId: string, phoneOrEmail?: string): Promise<Order | null> {
    const query = orderId.trim().toLowerCase();
    const phoneQ = phoneOrEmail ? phoneOrEmail.trim().toLowerCase() : null;

    const found = this.cache.find(o => {
      const matchId = o.id.toLowerCase() === query || 
        (o.courierTrackingCode && o.courierTrackingCode.toLowerCase() === query) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === query);
      
      if (!matchId) return false;
      if (phoneQ) {
        return o.phone.toLowerCase().includes(phoneQ) || (o.email && o.email.toLowerCase().includes(phoneQ));
      }
      return true;
    });

    return found ? { ...found } : null;
  }

  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const newId = `CM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newOrder: Order = {
      ...dto,
      email: dto.email || '',
      id: newId,
      date: dateFormatted,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'Pending',
      deliveryStatus: 'pending',
      paymentStatus: dto.paymentStatus || (dto.paymentMethod === 'Cash on Delivery' ? 'unpaid' : 'paid'),
      adminNotes: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: `${dateFormatted}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          title: 'Order Placed',
          description: `Placed via web storefront (${dto.paymentMethod})`,
          type: 'created'
        }
      ]
    };

    this.cache.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public createOrderSync(order: Order): Order {
    this.cache.unshift(order);
    this.persist();
    return order;
  }

  public async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    options?: OrderStatusUpdateOptions
  ): Promise<Order> {
    const index = this.cache.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found`);

    const current = this.cache[index];
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const timelineEvents = current.timeline ? [...current.timeline] : [];
    timelineEvents.push({
      id: `tl-${Date.now()}`,
      timestamp: `${dateFormatted}, ${timeFormatted}`,
      title: `Status Changed to ${status}`,
      description: options?.adminNote || `Updated by ${options?.authorName || 'Staff'}`,
      type: 'status_change',
      user: options?.authorName
    });

    const adminNotes = current.adminNotes ? [...current.adminNotes] : [];
    if (options?.adminNote) {
      adminNotes.push({
        id: `note-${Date.now()}`,
        text: options.adminNote,
        author: options.authorName || 'Admin User',
        createdAt: `${dateFormatted}, ${timeFormatted}`,
        isCustomerVisible: false
      });
    }

    const updated: Order = {
      ...current,
      status,
      updatedAt: now.toISOString(),
      ...(options?.trackingNumber ? { 
        trackingNumber: options.trackingNumber, 
        courierTrackingCode: options.trackingNumber 
      } : {}),
      ...(options?.courierPartner ? { 
        courierPartner: options.courierPartner, 
        courier: options.courierPartner 
      } : {}),
      ...(options?.deliveryStatus ? { deliveryStatus: options.deliveryStatus } : {}),
      ...(options?.paymentStatus ? { paymentStatus: options.paymentStatus } : {}),
      adminNotes,
      timeline: timelineEvents
    };

    this.cache[index] = updated;
    this.persist();
    return updated;
  }

  public async addAdminNote(orderId: string, noteText: string, author: string, isCustomerVisible: boolean = false): Promise<Order> {
    const index = this.cache.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found`);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNote: OrderAdminNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      author,
      createdAt: `${dateFormatted}, ${timeFormatted}`,
      isCustomerVisible
    };

    const updated: Order = {
      ...this.cache[index],
      adminNotes: [...(this.cache[index].adminNotes || []), newNote],
      updatedAt: now.toISOString()
    };

    this.cache[index] = updated;
    this.persist();
    return updated;
  }

  public async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<boolean> {
    let changed = false;
    this.cache = this.cache.map(o => {
      if (orderIds.includes(o.id)) {
        changed = true;
        return { ...o, status, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    if (changed) this.persist();
    return changed;
  }

  public async bulkAssignCourier(orderIds: string[], courierPartner: string): Promise<boolean> {
    let changed = false;
    this.cache = this.cache.map(o => {
      if (orderIds.includes(o.id)) {
        changed = true;
        return { 
          ...o, 
          courierPartner, 
          courier: courierPartner, 
          deliveryStatus: 'processing' as const,
          updatedAt: new Date().toISOString() 
        };
      }
      return o;
    });
    if (changed) this.persist();
    return changed;
  }

  public async bulkDelete(orderIds: string[]): Promise<boolean> {
    const prevLen = this.cache.length;
    this.cache = this.cache.filter(o => !orderIds.includes(o.id));
    if (this.cache.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }
}
