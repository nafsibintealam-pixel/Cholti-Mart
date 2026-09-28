import { Order, OrderStatus } from '../../../types';
import { CreateOrderDTO, OrderStatusUpdateOptions } from '../OrderService';

export interface IOrderAdapter {
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
}
