import { CustomerProfile, CustomerGroupItem } from '../../../types';
import { ICustomerAdapter } from './ICustomerAdapter';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { assertLiveApiReady, API_CONFIG } from '../../api/config';

export class CustomerApiAdapter implements ICustomerAdapter {
  private fallbackCache: CustomerProfile[] = [];

  constructor() {
    assertLiveApiReady();
  }

  public getCustomersSync(): CustomerProfile[] {
    return [...this.fallbackCache];
  }

  public async getCustomers(): Promise<CustomerProfile[]> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<CustomerProfile[]>(ENDPOINTS.CUSTOMERS.LIST);
      this.fallbackCache = res.data;
      return res.data;
    } catch (err: any) {
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to load customers: ${err.message || 'Service unavailable'}`);
      }
      return this.fallbackCache;
    }
  }

  public async getCustomerById(id: string): Promise<CustomerProfile | null> {
    assertLiveApiReady();
    try {
      const res = await apiClient.get<CustomerProfile>(ENDPOINTS.CUSTOMERS.DETAIL(id));
      return res.data;
    } catch (err: any) {
      if (err.status === 404) return null;
      if (API_CONFIG.environment === 'production') {
        throw new Error(`Failed to retrieve customer ${id}: ${err.message}`);
      }
      return null;
    }
  }

  public async createCustomer(profile: Omit<CustomerProfile, 'id' | 'joinedDate'>): Promise<CustomerProfile> {
    assertLiveApiReady();
    const res = await apiClient.post<CustomerProfile>(ENDPOINTS.CUSTOMERS.CREATE, profile);
    return res.data;
  }

  public async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    assertLiveApiReady();
    const res = await apiClient.put<CustomerProfile>(ENDPOINTS.CUSTOMERS.UPDATE(id), updates);
    return res.data;
  }

  public async toggleBlockStatus(id: string): Promise<CustomerProfile> {
    assertLiveApiReady();
    const res = await apiClient.post<CustomerProfile>(`/customers/${id}/toggle-block`, {});
    return res.data;
  }

  public getCustomerGroupsSync(): CustomerGroupItem[] {
    return [];
  }

  public async getCustomerGroups(): Promise<CustomerGroupItem[]> {
    assertLiveApiReady();
    const res = await apiClient.get<CustomerGroupItem[]>(ENDPOINTS.CUSTOMERS.GROUPS);
    return res.data;
  }
}
