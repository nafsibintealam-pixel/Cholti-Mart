import { Order, OrderStatus } from '../../../types';
import { CreateOrderDTO, OrderStatusUpdateOptions } from '../OrderService';
import { IOrderAdapter } from './IOrderAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class OrderApiAdapter implements IOrderAdapter {
  private fallbackCache: Order[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getOrdersSync(): Order[] {
    return [...this.fallbackCache];
  }

  public async getOrders(): Promise<Order[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Order[]>(ENDPOINTS.ORDERS.LIST);
      this.fallbackCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load orders: ${err.message || 'Service unavailable'}`);
      }
      return this.fallbackCache;
    }
  }

  public async getOrderById(id: string): Promise<Order | null> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Order>(ENDPOINTS.ORDERS.DETAIL(id));
      return res.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to retrieve order ${id}: ${err.message}`);
      }
      return null;
    }
  }

  public async trackOrder(orderId: string, phoneOrEmail?: string): Promise<Order | null> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<Order>(ENDPOINTS.ORDERS.TRACK(orderId), { phoneOrEmail });
      return res.data;
    } catch {
      return null;
    }
  }

  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    assertLiveApiReady();
    const res = await apiClient.post<Order>(ENDPOINTS.ORDERS.CREATE, dto);
    return res.data;
  }

  public createOrderSync(order: Order): Order {
    this.createOrder(order).catch(err => {
      console.error('[OrderApiAdapter] Asynchronous order sync error:', err);
    });
    return order;
  }

  public async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    options?: OrderStatusUpdateOptions
  ): Promise<Order> {
    assertLiveApiReady();
    const res = await apiClient.put<Order>(ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
      status,
      ...options
    });
    return res.data;
  }

  public async addAdminNote(orderId: string, noteText: string, author: string, isCustomerVisible: boolean = false): Promise<Order> {
    assertLiveApiReady();
    const res = await apiClient.post<Order>(ENDPOINTS.ORDERS.ADMIN_NOTES(orderId), {
      text: noteText,
      author,
      isCustomerVisible
    });
    return res.data;
  }

  public async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.post<{ success: boolean }>(ENDPOINTS.ORDERS.BULK_STATUS, {
      orderIds,
      status
    });
    return res.isSuccess;
  }

  public async bulkAssignCourier(orderIds: string[], courierPartner: string): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.post<{ success: boolean }>('/orders/bulk-assign-courier', {
      orderIds,
      courierPartner
    });
    return res.isSuccess;
  }

  public async bulkDelete(orderIds: string[]): Promise<boolean> {
    assertLiveApiReady();
    const res = await apiClient.post<{ success: boolean }>(ENDPOINTS.ORDERS.BULK_DELETE, { orderIds });
    return res.isSuccess;
  }
}
