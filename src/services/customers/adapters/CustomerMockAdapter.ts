import { CustomerProfile, CustomerGroupItem } from '../../../types';
import { ICustomerAdapter } from './ICustomerAdapter';

const CUSTOMERS_KEY = 'cholti_admin_customers_v1';

const INITIAL_CUSTOMERS_SEED: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    phone: '01712345678',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 34, Road 11A, Dhanmondi, Dhaka-1209',
    isGuest: false,
    group: 'VIP',
    ordersCount: 8,
    totalSpent: 14650,
    lastOrderDate: '17 Sep 2026',
    joinedDate: '12 Jan 2026',
    notes: 'Preferred delivery in morning hours.',
    status: 'active'
  },
  {
    id: 'cust-2',
    name: 'Ayesha Siddiqua',
    email: 'ayesha@example.com',
    phone: '01987654321',
    district: 'Chittagong',
    area: 'GEC Circle',
    address: 'Flat 4B, Hill View R/A, Nasirabad, Chittagong',
    isGuest: false,
    group: 'Regular',
    ordersCount: 4,
    totalSpent: 8900,
    lastOrderDate: '16 Sep 2026',
    joinedDate: '04 Mar 2026',
    status: 'active'
  },
  {
    id: 'cust-3',
    name: 'Rafiqul Islam',
    email: 'rafiq@example.com',
    phone: '01811223344',
    district: 'Sylhet',
    area: 'Zindabazar',
    address: 'East Zindabazar, Road 3, Sylhet',
    isGuest: false,
    group: 'Regular',
    ordersCount: 3,
    totalSpent: 6200,
    lastOrderDate: '15 Sep 2026',
    joinedDate: '19 Apr 2026',
    status: 'active'
  },
  {
    id: 'cust-4',
    name: 'Farhana Kabir',
    email: 'farhana@example.com',
    phone: '01898765432',
    district: 'Chittagong',
    area: 'Panchlaish',
    address: 'GEC Circle, Nasirabad Housing, Chittagong',
    isGuest: true,
    group: 'New',
    ordersCount: 1,
    totalSpent: 2280,
    lastOrderDate: '02 Sep 2026',
    joinedDate: '02 Sep 2026',
    status: 'active'
  }
];

export class CustomerMockAdapter implements ICustomerAdapter {
  private cache: CustomerProfile[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CUSTOMERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.cache = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to load customers from storage', e);
      }
    }
    this.cache = [...INITIAL_CUSTOMERS_SEED];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(this.cache));
      } catch (e) {
        console.warn('Failed to save customers to storage', e);
      }
    }
  }

  public getCustomersSync(): CustomerProfile[] {
    return [...this.cache];
  }

  public async getCustomers(): Promise<CustomerProfile[]> {
    return [...this.cache];
  }

  public async getCustomerById(id: string): Promise<CustomerProfile | null> {
    const found = this.cache.find(c => c.id === id);
    return found ? { ...found } : null;
  }

  public async createCustomer(profile: Omit<CustomerProfile, 'id' | 'joinedDate'>): Promise<CustomerProfile> {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newCustomer: CustomerProfile = {
      ...profile,
      id: `cust-${Date.now()}`,
      joinedDate: dateFormatted,
    };
    this.cache.unshift(newCustomer);
    this.persist();
    return newCustomer;
  }

  public async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const index = this.cache.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found`);
    this.cache[index] = { ...this.cache[index], ...updates };
    this.persist();
    return this.cache[index];
  }

  public async toggleBlockStatus(id: string): Promise<CustomerProfile> {
    const index = this.cache.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found`);
    const current = this.cache[index];
    const newStatus = current.status === 'active' ? 'blocked' : 'active';
    this.cache[index] = { ...current, status: newStatus };
    this.persist();
    return this.cache[index];
  }

  public getCustomerGroupsSync(): CustomerGroupItem[] {
    return [
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
  }

  public async getCustomerGroups(): Promise<CustomerGroupItem[]> {
    return this.getCustomerGroupsSync();
  }
}
