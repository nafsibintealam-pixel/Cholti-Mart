import { AdminNavSection } from '../../types';

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'order' | 'stock' | 'refund' | 'security' | 'courier';
  isRead: boolean;
  navSection: AdminNavSection;
  subnav?: string;
}

export interface INotificationService {
  getNotifications(): Promise<AdminNotificationItem[]>;
  getNotificationsSync(): AdminNotificationItem[];
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  addNotification(notif: Omit<AdminNotificationItem, 'id' | 'time' | 'isRead'>): Promise<AdminNotificationItem>;
  clearNotifications(): Promise<void>;
}

const STORAGE_KEY = 'cholti_admin_notifications_v1';

const INITIAL_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Online Order #CM-2609-1082',
    message: 'Nusrat Jahan placed an order for ৳1,910 via bKash payment.',
    time: '25 min ago',
    category: 'order',
    isRead: false,
    navSection: 'orders',
    subnav: 'all'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Kurti (CM-WF-001)',
    message: 'Only 4 units left in inventory. Re-order threshold reached.',
    time: '1 hour ago',
    category: 'stock',
    isRead: false,
    navSection: 'catalog',
    subnav: 'inventory'
  },
  {
    id: 'notif-3',
    title: 'New Refund Request #REF-2026-018',
    message: 'Customer Sharmin Sultana requested refund for size mismatch.',
    time: '3 hours ago',
    category: 'refund',
    isRead: false,
    navSection: 'payments',
    subnav: 'refunds'
  },
  {
    id: 'notif-4',
    title: 'Steadfast Courier Dispatched',
    message: 'Parcel STDF-90281 picked up from Dhanmondi warehouse.',
    time: '5 hours ago',
    category: 'courier',
    isRead: true,
    navSection: 'delivery',
    subnav: 'tracking'
  }
];

class NotificationServiceImpl implements INotificationService {
  private cache: AdminNotificationItem[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.cache = JSON.parse(stored);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse notifications from storage', e);
      }
    }
    this.cache = [...INITIAL_NOTIFICATIONS];
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to persist notifications', e);
      }
    }
  }

  public getNotificationsSync(): AdminNotificationItem[] {
    return [...this.cache];
  }

  public async getNotifications(): Promise<AdminNotificationItem[]> {
    return [...this.cache];
  }

  public async markAsRead(id: string): Promise<void> {
    this.cache = this.cache.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.persist();
  }

  public async markAllAsRead(): Promise<void> {
    this.cache = this.cache.map(n => ({ ...n, isRead: true }));
    this.persist();
  }

  public async addNotification(notif: Omit<AdminNotificationItem, 'id' | 'time' | 'isRead'>): Promise<AdminNotificationItem> {
    const item: AdminNotificationItem = {
      ...notif,
      id: `notif-${Date.now().toString(36)}`,
      time: 'Just now',
      isRead: false
    };
    this.cache = [item, ...this.cache];
    this.persist();
    return item;
  }

  public async clearNotifications(): Promise<void> {
    this.cache = [];
    this.persist();
  }
}

export const notificationService = new NotificationServiceImpl();
