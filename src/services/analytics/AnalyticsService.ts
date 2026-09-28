import { orderService } from '../orders/OrderService';
import { productService } from '../products/ProductService';
import { customerService } from '../customers/CustomerService';
import { AbandonedCartRecord } from '../../types';

export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
  lowStockItemsCount: number;
  conversionRatePercent: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductItem {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface AnalyticsDashboardOverview {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  netProfitMargin: string;
  averageOrderValue: number;
  totalOrders: number;
  conversionRate: string;
  repeatCustomerRate: string;
  regionalBreakdown: { region: string; share: string; revenue: number }[];
}

export interface IAnalyticsService {
  getOverviewMetrics(): Promise<AnalyticsOverview>;
  getAnalyticsOverview(): AnalyticsDashboardOverview;
  getRevenueSeries(): Promise<RevenueDataPoint[]>;
  getTopSellingProducts(): Promise<TopProductItem[]>;
  getAbandonedCarts(): Promise<AbandonedCartRecord[]>;
}

const INITIAL_ABANDONED_CARTS: AbandonedCartRecord[] = [
  {
    id: 'abn-101',
    customerName: 'Kazi Farhan',
    customerEmail: 'kazi.farhan@gmail.com',
    customerPhone: '01755998877',
    itemsCount: 2,
    cartTotal: 3450,
    lastActive: '2 hours ago',
    recoveryEmailSent: true,
    status: 'abandoned'
  },
  {
    id: 'abn-102',
    customerName: 'Samira Islam',
    customerEmail: 'samira.i@yahoo.com',
    customerPhone: '01844221100',
    itemsCount: 1,
    cartTotal: 2150,
    lastActive: '5 hours ago',
    recoveryEmailSent: false,
    status: 'abandoned'
  }
];

class AnalyticsServiceImpl implements IAnalyticsService {
  public async getOverviewMetrics(): Promise<AnalyticsOverview> {
    const orders = await orderService.getOrders();
    const products = await productService.getProducts();
    const customers = await customerService.getCustomers();

    const deliveredOrConfirmed = orders.filter(o => o.status !== 'Cancelled');
    const totalRevenue = deliveredOrConfirmed.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
    const lowStockItemsCount = products.filter(p => p.stockCount <= 5).length;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: customers.length,
      pendingOrdersCount,
      deliveredOrdersCount,
      lowStockItemsCount,
      conversionRatePercent: 3.42
    };
  }

  public async getRevenueSeries(): Promise<RevenueDataPoint[]> {
    return [
      { date: '11 Sep', revenue: 14200, orders: 8 },
      { date: '12 Sep', revenue: 19800, orders: 12 },
      { date: '13 Sep', revenue: 24500, orders: 15 },
      { date: '14 Sep', revenue: 31200, orders: 19 },
      { date: '15 Sep', revenue: 28900, orders: 17 },
      { date: '16 Sep', revenue: 42100, orders: 24 },
      { date: '17 Sep', revenue: 38600, orders: 21 },
    ];
  }

  public async getTopSellingProducts(): Promise<TopProductItem[]> {
    const products = await productService.getProducts();
    return products.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      unitsSold: Math.floor(20 + Math.random() * 80),
      totalRevenue: p.price * Math.floor(20 + Math.random() * 80)
    }));
  }

  public async getAbandonedCarts(): Promise<AbandonedCartRecord[]> {
    return [...INITIAL_ABANDONED_CARTS];
  }

  public getAnalyticsOverview(): AnalyticsDashboardOverview {
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
  }
}

export const analyticsService: IAnalyticsService = new AnalyticsServiceImpl();
