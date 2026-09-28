import { Order, OrderStatus, OrderAdminNote, OrderAddress, PaymentStatus, DeliveryStatus } from '../../types';
import { API_CONFIG } from '../api/config';
import { IOrderAdapter } from './adapters/IOrderAdapter';
import { OrderMockAdapter } from './adapters/OrderMockAdapter';
import { OrderApiAdapter } from './adapters/OrderApiAdapter';

export interface CreateOrderDTO {
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  deliveryCharge?: number;
  discount: number;
  coupon?: string | { code: string; discount: number };
  total: number;
  shippingAddress?: OrderAddress | string;
  billingAddress?: OrderAddress | string;
}

export interface OrderStatusUpdateOptions {
  authorName?: string;
  adminUser?: string;
  adminNote?: string;
  trackingNumber?: string;
  courierPartner?: string;
  deliveryStatus?: DeliveryStatus;
  paymentStatus?: PaymentStatus;
}

export interface IOrderService {
  getOrders(): Promise<Order[]>;
  getOrdersSync(): Order[];
  getOrderById(id: string): Promise<Order | null>;
  trackOrder(orderId: string, phoneOrEmail?: string): Promise<Order | null>;
  createOrder(dto: CreateOrderDTO): Promise<Order>;
  createOrderSync(order: Order): Order;
  updateOrderStatus(orderId: string, status: OrderStatus, options?: OrderStatusUpdateOptions): Promise<Order>;
  addAdminNote(orderId: string, noteText: string, author: string, isCustomerVisible?: boolean): Promise<Order>;
  bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<boolean>;
  bulkAssignCourier(orderIds: string[], courierPartner: string): Promise<boolean>;
  bulkDelete(orderIds: string[]): Promise<boolean>;
  toWooCommerceOrderPayload(order: Order): Record<string, any>;
  subscribe(callback: () => void): () => void;
  getAdapterType(): 'mock' | 'api';
}

class OrderServiceImpl implements IOrderService {
  private mockAdapter: OrderMockAdapter;
  private apiAdapter: OrderApiAdapter | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.mockAdapter = new OrderMockAdapter();
  }

  private getAdapter(): IOrderAdapter {
    if (API_CONFIG.isMockMode) {
      return this.mockAdapter;
    }
    if (!this.apiAdapter) {
      this.apiAdapter = new OrderApiAdapter();
    }
    return this.apiAdapter;
  }

  public getAdapterType(): 'mock' | 'api' {
    return API_CONFIG.isMockMode ? 'mock' : 'api';
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getOrdersSync(): Order[] {
    return this.getAdapter().getOrdersSync();
  }

  public async getOrders(): Promise<Order[]> {
    return this.getAdapter().getOrders();
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return this.getAdapter().getOrderById(id);
  }

  public async trackOrder(orderId: string, phoneOrEmail?: string): Promise<Order | null> {
    return this.getAdapter().trackOrder(orderId, phoneOrEmail);
  }

  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const res = await this.getAdapter().createOrder(dto);
    this.notify();
    return res;
  }

  public createOrderSync(order: Order): Order {
    const res = this.getAdapter().createOrderSync(order);
    this.notify();
    return res;
  }

  public async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    options?: OrderStatusUpdateOptions
  ): Promise<Order> {
    const res = await this.getAdapter().updateOrderStatus(orderId, status, options);
    this.notify();
    return res;
  }

  public async addAdminNote(orderId: string, noteText: string, author: string, isCustomerVisible: boolean = false): Promise<Order> {
    const res = await this.getAdapter().addAdminNote(orderId, noteText, author, isCustomerVisible);
    this.notify();
    return res;
  }

  public async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<boolean> {
    const res = await this.getAdapter().bulkUpdateStatus(orderIds, status);
    if (res) this.notify();
    return res;
  }

  public async bulkAssignCourier(orderIds: string[], courierPartner: string): Promise<boolean> {
    const res = await this.getAdapter().bulkAssignCourier(orderIds, courierPartner);
    if (res) this.notify();
    return res;
  }

  public async bulkDelete(orderIds: string[]): Promise<boolean> {
    const res = await this.getAdapter().bulkDelete(orderIds);
    if (res) this.notify();
    return res;
  }

  public toWooCommerceOrderPayload(order: Order): Record<string, any> {
    const nameParts = (order.customerName || 'Customer').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const resolveAddr = (addr?: OrderAddress | string) => {
      if (!addr) return { street: order.address, area: order.area || '', district: order.district || 'Dhaka', postalCode: '' };
      if (typeof addr === 'string') return { street: addr, area: order.area || '', district: order.district || 'Dhaka', postalCode: '' };
      return {
        street: addr.street || order.address,
        area: addr.area || order.area || '',
        district: addr.district || order.district || 'Dhaka',
        postalCode: addr.postalCode || ''
      };
    };

    const sAddr = resolveAddr(order.shippingAddress);
    const bAddr = resolveAddr(order.billingAddress || order.shippingAddress);

    return {
      id: order.wooCommerceOrderId ? Number(order.wooCommerceOrderId) : undefined,
      number: order.id,
      status: order.status === 'Delivered' ? 'completed' :
              order.status === 'Cancelled' ? 'cancelled' :
              order.status === 'Processing' ? 'processing' :
              order.status === 'Shipped' ? 'completed' : 'pending',
      currency: 'BDT',
      date_created: order.createdAt || new Date().toISOString(),
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
        address_1: bAddr.street,
        address_2: bAddr.area,
        city: bAddr.district,
        state: bAddr.district,
        postcode: bAddr.postalCode,
        country: 'BD',
        email: order.email || '',
        phone: order.phone || ''
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        company: '',
        address_1: sAddr.street,
        address_2: sAddr.area,
        city: sAddr.district,
        state: sAddr.district,
        postcode: sAddr.postalCode,
        country: 'BD',
        phone: order.phone || ''
      },
      payment_method: order.paymentMethod?.toLowerCase().includes('bkash') ? 'bkash' :
                      order.paymentMethod?.toLowerCase().includes('nagad') ? 'nagad' :
                      order.paymentMethod?.toLowerCase().includes('card') ? 'sslcommerz' : 'cod',
      payment_method_title: order.paymentMethod || 'Cash on Delivery',
      transaction_id: (order as any).transactionId || '',
      customer_note: order.notes || '',
      line_items: (order.items || []).map((item, idx) => ({
        id: idx + 1,
        name: item.productName || (item as any).name || 'Product',
        product_id: parseInt(((item.productId || (item as any).id || '101').toString()).replace(/\D/g, '') || '101', 10),
        variation_id: 0,
        quantity: item.quantity,
        tax_class: '',
        subtotal: (item.price * item.quantity).toFixed(2),
        subtotal_tax: '0.00',
        total: (item.price * item.quantity).toFixed(2),
        total_tax: '0.00',
        price: item.price
      })),
      meta_data: [
        { key: '_courier_partner', value: order.courierPartner || order.courier || 'Steadfast Courier' },
        { key: '_courier_tracking_code', value: order.courierTrackingCode || '' },
        { key: '_delivery_status', value: order.deliveryStatus || 'pending' },
        { key: '_source_platform', value: 'Cholti Mart Web PWA' }
      ]
    };
  }
}

export const orderService: IOrderService = new OrderServiceImpl();
